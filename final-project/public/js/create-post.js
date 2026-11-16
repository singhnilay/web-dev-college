(function () {
  "use strict";

  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  function fillCommunities(select, communities) {
    if (!select || !communities) return;
    var current = select.value;
    var html = '<option value="">Choose a room</option>';
    communities.forEach(function (community) {
      var label = community.name + (community.joined ? "" : " (join first)");
      html += '<option value="' + TCR.escapeHtml(community.name) + '">' + TCR.escapeHtml(label) + "</option>";
    });
    select.innerHTML = html;
    if (current) select.value = current;
  }

  function initCreatePost() {
    var form = document.getElementById("create-form");
    if (!form) return;

    var title = document.getElementById("title");
    var community = document.getElementById("community");
    var content = document.getElementById("content");
    var anonymous = document.getElementById("anonymous");
    var formError = document.getElementById("form-error");
    var submitBtn = form.querySelector('button[type="submit"]');

    function showError(message) {
      if (!formError) return;
      formError.textContent = message || "";
      formError.classList.toggle("is-hidden", !message);
    }

    TCR.me().then(function (payload) {
      if (payload && payload.user) TCR.setAvatars(payload.user);
      if (!payload || !payload.user) {
        window.location.href = "login.html";
      }
    });

    TCR.api("/api/communities", { redirectOn401: false }).then(function (communities) {
      fillCommunities(community, communities);
    }).catch(function () {});

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      showError("");

      var titleValue = title.value.trim();
      var communityValue = community.value.trim();
      var contentValue = content.value.trim();

      if (!titleValue || !communityValue || !contentValue) {
        showError("Title, community, and content are required.");
        return;
      }

      if (submitBtn) submitBtn.disabled = true;

      TCR.api("/api/posts", {
        method: "POST",
        body: {
          title: titleValue,
          community: communityValue,
          content: contentValue,
          anonymous: Boolean(anonymous && anonymous.checked)
        }
      })
        .then(function () {
          window.location.href = "feed.html";
        })
        .catch(function (error) {
          if (error.status === 401) return;
          if (error.status === 403) {
            showError(error.message + " Open that community and join it first.");
          } else {
            showError(error.message || "Could not save the post. Make sure the local server is running.");
          }
          if (submitBtn) submitBtn.disabled = false;
        });
    });
  }

  ready(initCreatePost);
})();
