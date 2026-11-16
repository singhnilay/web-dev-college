(function (global) {
  "use strict";

  var SIDEBAR_ICONS = {
    "Campus Life": "school",
    Academics: "menu_book",
    Events: "event",
    Memes: "mood",
    Opportunities: "work",
    Questions: "help"
  };

  function api(path, options) {
    var opts = options || {};
    var headers = { Accept: "application/json" };
    if (opts.body && !(opts.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }
    if (opts.headers) {
      Object.keys(opts.headers).forEach(function (key) {
        headers[key] = opts.headers[key];
      });
    }
    return fetch(path, {
      method: opts.method || "GET",
      credentials: "include",
      headers: headers,
      body: opts.body == null
        ? undefined
        : typeof opts.body === "string"
          ? opts.body
          : JSON.stringify(opts.body)
    }).then(function (response) {
      return response.text().then(function (text) {
        var data = {};
        if (text) {
          try {
            data = JSON.parse(text);
          } catch (err) {
            data = { error: text };
          }
        }
        if (response.status === 401 && opts.authRedirect !== false) {
          var login = /\/pages\//.test(location.pathname) ? "login.html" : "pages/login.html";
          if (opts.redirectOn401 !== false) {
            window.location.href = login;
          }
        }
        if (!response.ok) {
          var error = new Error(data.error || "Request failed.");
          error.status = response.status;
          error.data = data;
          throw error;
        }
        return data;
      });
    });
  }

  function me() {
    return api("/api/auth/me", { redirectOn401: false, authRedirect: false }).catch(function () {
      return null;
    });
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function initials(name) {
    var text = String(name || "").trim();
    if (!text) return "CR";
    var parts = text.replace(/[._-]+/g, " ").split(" ").filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  function timeAgo(value) {
    var date = value ? new Date(value) : null;
    if (!date || Number.isNaN(date.getTime())) return "";
    var delta = Math.max(0, Date.now() - date.getTime());
    var minutes = Math.floor(delta / 60000);
    if (minutes < 1) return "just now";
    if (minutes < 60) return minutes + "m ago";
    var hours = Math.floor(minutes / 60);
    if (hours < 24) return hours + "h ago";
    var days = Math.floor(hours / 24);
    if (days === 1) return "Yesterday";
    if (days < 14) return days + "d ago";
    return date.toLocaleDateString();
  }

  function communityName(community) {
    if (!community) return "";
    if (typeof community === "string") return community;
    return community.name || "";
  }

  function communityHref(community) {
    var id = community && community.id;
    var name = communityName(community);
    if (id) return "community.html?id=" + encodeURIComponent(id);
    if (name) return "community.html?name=" + encodeURIComponent(name);
    return "community.html";
  }

  function authorLabel(post) {
    if (!post || !post.author) return "";
    if (post.isAnonymous) return "Anonymous Student";
    return post.author.username || "Student";
  }

  function authorHref(post) {
    if (!post || post.isAnonymous || !post.author || !post.author.id) return "";
    return "profile.html?id=" + encodeURIComponent(post.author.id);
  }

  function postCardHtml(post) {
    var community = communityName(post.community);
    var author = authorLabel(post);
    var profileLink = authorHref(post);
    var authorHtml = profileLink
      ? '<a href="' + escapeHtml(profileLink) + '">' + escapeHtml(author) + "</a>"
      : escapeHtml(author);
    var postHref = "post.html?id=" + encodeURIComponent(post.id);
    var voteClass = post.upvoted ? " vote-btn is-active" : " vote-btn";
    return (
      '<article class="post-card">' +
        '<div class="post-meta">' +
          '<a href="' + escapeHtml(communityHref(post.community)) + '">' + escapeHtml(community) + "</a>" +
          "<span>" + escapeHtml(timeAgo(post.createdAt)) + "</span>" +
        "</div>" +
        "<h2><a href=\"" + escapeHtml(postHref) + "\">" + escapeHtml(post.title) + "</a></h2>" +
        '<p class="post-excerpt">' + escapeHtml(post.content) + "</p>" +
        '<div class="post-author">By ' + authorHtml + "</div>" +
        '<div class="post-actions">' +
          '<button class="' + voteClass.trim() + '" data-vote data-post-id="' + escapeHtml(post.id) + '" type="button">' +
            '<span class="material-symbols-outlined">keyboard_arrow_up</span>' +
            '<span data-count>' + Number(post.upvoteCount || 0) + "</span>" +
          "</button>" +
          '<a class="comment-count" href="' + escapeHtml(postHref) + '">' +
            '<span class="material-symbols-outlined">chat_bubble</span>' +
            Number(post.commentCount || 0) +
          "</a>" +
        "</div>" +
      "</article>"
    );
  }

  function renderPosts(container, posts, emptyMessage) {
    if (!container) return;
    if (!posts || !posts.length) {
      container.innerHTML = '<p class="lede empty-state">' + escapeHtml(emptyMessage || "No posts yet. Be the first to publish.") + "</p>";
      return;
    }
    container.innerHTML = posts.map(postCardHtml).join("");
  }

  function bindVotes(root) {
    var scope = root || document;
    if (scope.__tcrVotesBound) return;
    scope.__tcrVotesBound = true;
    scope.addEventListener("click", function (event) {
      var btn = event.target.closest("[data-vote]");
      if (!btn) return;
      var postId = btn.getAttribute("data-post-id");
      if (!postId) return;
      event.preventDefault();
      var active = btn.classList.contains("is-active");
      api("/api/posts/" + encodeURIComponent(postId) + "/upvote", {
        method: active ? "DELETE" : "POST"
      }).then(function (data) {
        btn.classList.toggle("is-active", Boolean(data.upvoted));
        var countEl = btn.querySelector("[data-count]");
        if (countEl) countEl.textContent = String(data.upvoteCount || 0);
      }).catch(function (err) {
        if (err.status !== 401) {
          window.alert(err.message || "Could not update upvote.");
        }
      });
    });
  }

  function setAvatars(user) {
    if (!user) return;
    document.querySelectorAll("a.avatar").forEach(function (el) {
      el.textContent = initials(user.username);
      el.setAttribute("aria-label", user.username);
    });
  }

  function fillCommunityNav(communities, activeName) {
    var navs = document.querySelectorAll(".sidebar .nav-stack");
    if (!navs.length || !communities || !communities.length) return;
    navs.forEach(function (nav) {
      var home = nav.querySelector('a[href="feed.html"]');
      var html = home ? home.outerHTML : "";
      communities.forEach(function (community) {
        var icon = SIDEBAR_ICONS[community.name] || "forum";
        var active = activeName && community.name === activeName ? " is-active" : "";
        if (active && home) home.classList.remove("is-active");
        html +=
          '<a class="nav-link' + active + '" href="' + escapeHtml(communityHref(community)) + '">' +
            '<span class="material-symbols-outlined">' + icon + "</span>" +
            escapeHtml(community.name) +
          "</a>";
      });
      nav.innerHTML = html;
    });
  }

  global.TCR = {
    api: api,
    me: me,
    escapeHtml: escapeHtml,
    initials: initials,
    timeAgo: timeAgo,
    communityName: communityName,
    communityHref: communityHref,
    authorLabel: authorLabel,
    authorHref: authorHref,
    postCardHtml: postCardHtml,
    renderPosts: renderPosts,
    bindVotes: bindVotes,
    setAvatars: setAvatars,
    fillCommunityNav: fillCommunityNav
  };
})(window);
