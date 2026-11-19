(function () {
  "use strict";

  var currentCommunity = null;
  var currentSort = "trending";

  function params() {
    return new URLSearchParams(window.location.search);
  }

  function loadCommunity() {
    var query = params();
    var id = query.get("id");
    var name = query.get("name") || "Campus Life";
    if (id) {
      return TCR.api("/api/communities/" + encodeURIComponent(id), { redirectOn401: false });
    }
    return TCR.api("/api/communities?name=" + encodeURIComponent(name), { redirectOn401: false }).then(function (list) {
      if (!list || !list.length) throw new Error("Community not found.");
      return list[0];
    });
  }

  function renderCommunity(community) {
    currentCommunity = community;
    document.title = community.name + " — UniHub";
    var icon = document.querySelector("[data-community-icon]");
    var title = document.querySelector("[data-community-name]");
    var description = document.querySelector("[data-community-description]");
    var count = document.querySelector("[data-member-count]");
    var joinBtn = document.querySelector("[data-join]");
    if (icon) icon.textContent = community.icon || "🏛";
    if (title) title.textContent = community.name;
    if (description) description.textContent = community.description || "";
    if (count) {
      var n = Number(community.memberCount || 0);
      count.textContent = n + (n === 1 ? " member" : " members");
    }
    if (joinBtn) {
      joinBtn.hidden = false;
      joinBtn.textContent = community.joined ? "Leave" : "Join";
      joinBtn.classList.toggle("btn-ghost", community.joined);
      joinBtn.classList.toggle("btn-primary", !community.joined);
    }
    var noticeTitle = document.querySelector("[data-page-notice-title]");
    var noticeBody = document.querySelector("[data-page-notice-body]");
    var n = Number(community.memberCount || 0);
    if (noticeTitle) noticeTitle.textContent = "About " + community.name;
    if (noticeBody) {
      noticeBody.textContent =
        (community.description ? community.description + " " : "") +
        n + (n === 1 ? " member. " : " members. ") +
        "Posts in this room should stay on " + community.name + ".";
    }
  }

  function loadPosts() {
    if (!currentCommunity) return;
    var list = document.querySelector("[data-live-posts]");
    if (!list) return;
    var sort = currentSort ? "?sort=" + encodeURIComponent(currentSort) : "";
    TCR.api("/api/communities/" + encodeURIComponent(currentCommunity.id) + "/posts" + sort, {
      redirectOn401: false
    }).then(function (posts) {
      TCR.renderPosts(list, posts, "No posts in this room yet.");
    }).catch(function (err) {
      list.innerHTML = '<p class="lede empty-state">' + TCR.escapeHtml(err.message) + "</p>";
    });
  }

  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  ready(function () {
    TCR.bindVotes(document);
    TCR.me().then(function (payload) {
      if (payload && payload.user) TCR.setAvatars(payload.user);
    });

    document.querySelectorAll("[data-sort]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        document.querySelectorAll("[data-sort]").forEach(function (other) {
          other.classList.toggle("is-active", other === btn);
        });
        currentSort = btn.getAttribute("data-sort") || "new";
        loadPosts();
      });
    });

    var joinBtn = document.querySelector("[data-join]");
    if (joinBtn) {
      joinBtn.addEventListener("click", function () {
        if (!currentCommunity) return;
        var method = currentCommunity.joined ? "DELETE" : "POST";
        TCR.api("/api/communities/" + encodeURIComponent(currentCommunity.id) + "/join", {
          method: method
        }).then(function (community) {
          renderCommunity(community);
        }).catch(function (err) {
          if (err.status !== 401) window.alert(err.message || "Could not update membership.");
        });
      });
    }

    loadCommunity()
      .then(function (community) {
        renderCommunity(community);
        return TCR.api("/api/communities", { redirectOn401: false }).then(function (communities) {
          TCR.fillCommunityNav(communities, community.name);
        });
      })
      .then(loadPosts)
      .catch(function (err) {
        var list = document.querySelector("[data-live-posts]");
        if (list) {
          list.innerHTML = '<p class="lede empty-state">' + TCR.escapeHtml(err.message || "Could not load this community.") + "</p>";
        }
      });
  });
})();
