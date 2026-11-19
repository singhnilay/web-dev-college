(function () {
  "use strict";

  var currentPost = null;

  function postId() {
    return new URLSearchParams(window.location.search).get("id");
  }

  function renderPost(post) {
    currentPost = post;
    document.title = post.title + " — UniHub";
    var root = document.querySelector("[data-live-post]");
    if (!root) return;
    var profileLink = TCR.authorHref(post);
    var author = TCR.authorLabel(post);
    var authorHtml = profileLink
      ? '<a href="' + TCR.escapeHtml(profileLink) + '">' + TCR.escapeHtml(author) + "</a>"
      : TCR.escapeHtml(author);
    var voteClass = post.upvoted ? "vote-btn is-active" : "vote-btn";
    var owner = post.isOwner
      ? '<div class="post-owner-actions">' +
          '<button class="btn-delete" type="button" data-edit-post>Edit</button>' +
          '<button class="btn-delete" type="button" data-delete-post>Delete</button>' +
        "</div>"
      : "";

    root.innerHTML =
      '<div class="post-meta">' +
        '<a href="' + TCR.escapeHtml(TCR.communityHref(post.community)) + '">' +
          TCR.escapeHtml(TCR.communityName(post.community)) +
        "</a>" +
        "<span>" + TCR.escapeHtml(TCR.timeAgo(post.createdAt)) + "</span>" +
      "</div>" +
      "<h2>" + TCR.escapeHtml(post.title) + "</h2>" +
      '<p class="post-body">' + TCR.escapeHtml(post.content) + "</p>" +
      '<div class="post-author">By ' + authorHtml + "</div>" +
      '<div class="post-actions">' +
        '<button class="' + voteClass + '" data-vote data-post-id="' + TCR.escapeHtml(post.id) + '" type="button">' +
          '<span class="material-symbols-outlined">keyboard_arrow_up</span>' +
          '<span data-count>' + Number(post.upvoteCount || 0) + "</span>" +
        "</button>" +
        '<span class="comment-count">' +
          '<span class="material-symbols-outlined">chat_bubble</span>' +
          '<span data-comment-total>' + Number(post.commentCount || 0) + "</span>" +
        "</span>" +
      "</div>" +
      owner +
      '<form class="create-form is-hidden" id="edit-post-form">' +
        '<div class="field"><label for="edit-title">Title</label>' +
        '<input class="editorial-input" id="edit-title" required /></div>' +
        '<div class="field"><label for="edit-content">Content</label>' +
        '<textarea class="editorial-textarea" id="edit-content" required></textarea></div>' +
        '<label class="check-row"><input type="checkbox" id="edit-anonymous" /> Post as Anonymous Student</label>' +
        '<button class="btn-primary" type="submit">Save</button>' +
      "</form>";

    var noticeTitle = document.querySelector("[data-page-notice-title]");
    var noticeBody = document.querySelector("[data-page-notice-body]");
    var room = TCR.communityName(post.community);
    var comments = Number(post.commentCount || 0);
    if (noticeTitle) noticeTitle.textContent = "About this post";
    if (noticeBody) {
      noticeBody.textContent =
        "Posted in " + room + " " + TCR.timeAgo(post.createdAt) +
        " by " + author + ". " +
        comments + (comments === 1 ? " comment. " : " comments. ") +
        "Replies stay one level deep.";
    }
  }

  function commentHtml(comment) {
    var ownerBtns = comment.isOwner
      ? '<button class="btn-delete" type="button" data-edit-comment="' + TCR.escapeHtml(comment.id) + '">Edit</button>' +
        '<button class="btn-delete" type="button" data-delete-comment="' + TCR.escapeHtml(comment.id) + '">Delete</button>'
      : "";
    return (
      '<article class="comment" data-comment-id="' + TCR.escapeHtml(comment.id) + '">' +
        '<div class="comment-head">' +
          "<span>" + TCR.escapeHtml((comment.author && comment.author.username) || "Student") +
          " · " + TCR.escapeHtml(TCR.timeAgo(comment.createdAt)) + "</span>" +
          ownerBtns +
        "</div>" +
        "<p>" + TCR.escapeHtml(comment.content) + "</p>" +
      "</article>"
    );
  }

  function renderComments(comments) {
    var list = document.getElementById("comment-list");
    var total = document.querySelector("[data-comment-total]");
    if (total) total.textContent = String(comments.length);
    if (!list) return;
    if (!comments.length) {
      list.innerHTML = '<p class="lede empty-state">No comments yet. Start the discussion.</p>';
      return;
    }
    list.innerHTML = comments.map(commentHtml).join("");
  }

  function loadComments(id) {
    return TCR.api("/api/posts/" + encodeURIComponent(id) + "/comments", { redirectOn401: false }).then(renderComments);
  }

  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  ready(function () {
    var id = postId();
    var root = document.querySelector("[data-live-post]");
    TCR.bindVotes(document);
    TCR.me().then(function (payload) {
      if (payload && payload.user) TCR.setAvatars(payload.user);
    });

    if (!id) {
      if (root) root.innerHTML = '<p class="lede">Post not found.</p>';
      return;
    }

    TCR.api("/api/posts/" + encodeURIComponent(id), { redirectOn401: false })
      .then(function (post) {
        renderPost(post);
        return loadComments(id);
      })
      .catch(function (err) {
        if (root) root.innerHTML = '<p class="lede">' + TCR.escapeHtml(err.message || "Post not found.") + "</p>";
      });

    var form = document.getElementById("comment-form");
    var body = document.getElementById("comment-body");
    var formError = document.getElementById("comment-error");
    if (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        if (formError) {
          formError.textContent = "";
          formError.classList.add("is-hidden");
        }
        TCR.api("/api/posts/" + encodeURIComponent(id) + "/comments", {
          method: "POST",
          body: { content: body.value }
        }).then(function () {
          body.value = "";
          return loadComments(id);
        }).catch(function (err) {
          if (err.status === 401) return;
          if (formError) {
            formError.textContent = err.message;
            formError.classList.remove("is-hidden");
          }
        });
      });
    }

    document.addEventListener("click", function (event) {
      if (event.target.closest("[data-edit-post]")) {
        var editForm = document.getElementById("edit-post-form");
        if (!editForm || !currentPost) return;
        document.getElementById("edit-title").value = currentPost.title;
        document.getElementById("edit-content").value = currentPost.content;
        document.getElementById("edit-anonymous").checked = Boolean(currentPost.isAnonymous);
        editForm.classList.toggle("is-hidden");
      }

      if (event.target.closest("[data-delete-post]") && currentPost) {
        if (!window.confirm("Delete this post?")) return;
        TCR.api("/api/posts/" + encodeURIComponent(currentPost.id), { method: "DELETE" }).then(function () {
          window.location.href = "feed.html";
        }).catch(function (err) {
          if (err.status !== 401) window.alert(err.message);
        });
      }

      var deleteBtn = event.target.closest("[data-delete-comment]");
      if (deleteBtn) {
        TCR.api("/api/comments/" + encodeURIComponent(deleteBtn.getAttribute("data-delete-comment")), {
          method: "DELETE"
        }).then(function () {
          return loadComments(id);
        }).catch(function (err) {
          if (err.status !== 401) window.alert(err.message);
        });
      }

      var editBtn = event.target.closest("[data-edit-comment]");
      if (editBtn) {
        var next = window.prompt("Edit your comment");
        if (next == null) return;
        TCR.api("/api/comments/" + encodeURIComponent(editBtn.getAttribute("data-edit-comment")), {
          method: "PUT",
          body: { content: next }
        }).then(function () {
          return loadComments(id);
        }).catch(function (err) {
          if (err.status !== 401) window.alert(err.message);
        });
      }
    });

    document.addEventListener("submit", function (event) {
      if (event.target.id !== "edit-post-form" || !currentPost) return;
      event.preventDefault();
      TCR.api("/api/posts/" + encodeURIComponent(currentPost.id), {
        method: "PUT",
        body: {
          title: document.getElementById("edit-title").value,
          content: document.getElementById("edit-content").value,
          anonymous: document.getElementById("edit-anonymous").checked
        }
      }).then(function (post) {
        renderPost(post);
      }).catch(function (err) {
        if (err.status !== 401) window.alert(err.message);
      });
    });
  });
})();
