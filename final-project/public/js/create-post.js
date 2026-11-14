(function () {
  "use strict";

  var COMMUNITIES = [
    "Campus Life",
    "Academics",
    "Events",
    "Memes",
    "Opportunities",
    "Questions"
  ];

  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
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

      if (COMMUNITIES.indexOf(communityValue) === -1) {
        showError("Choose a valid community.");
        return;
      }

      if (submitBtn) submitBtn.disabled = true;

      fetch("/api/posts", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: titleValue,
          community: communityValue,
          content: contentValue,
          anonymous: Boolean(anonymous && anonymous.checked)
        })
      })
        .then(function (response) {
          if (response.status === 401) {
            window.location.href = "login.html";
            return;
          }
          if (!response.ok) {
            return response.text().then(function (text) {
              try {
                var data = JSON.parse(text);
                throw new Error(data.error || "Could not publish this post.");
              } catch (err) {
                if (err instanceof Error && err.message) throw err;
                throw new Error("Could not publish this post.");
              }
            });
          }
          window.location.href = "feed.html";
        })
        .catch(function (error) {
          showError(error.message || "Could not save the post. Make sure the local server is running.");
          if (submitBtn) submitBtn.disabled = false;
        });
    });
  }

  ready(initCreatePost);
})();
