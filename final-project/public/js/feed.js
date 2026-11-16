(function () {
  "use strict";

  var currentSort = "trending";

  function loadFeed() {
    var list = document.querySelector("[data-live-posts]");
    if (!list) return;
    var query = currentSort ? "?sort=" + encodeURIComponent(currentSort) : "";
    TCR.api("/api/posts" + query, { redirectOn401: false }).then(function (posts) {
      TCR.renderPosts(list, posts, "The feed is quiet. Publish the first post.");
    }).catch(function (err) {
      list.innerHTML = '<p class="lede empty-state">' + TCR.escapeHtml(err.message || "Could not load posts.") + "</p>";
    });
  }

  function initSort() {
    var buttons = document.querySelectorAll("[data-sort]");
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        buttons.forEach(function (other) {
          other.classList.toggle("is-active", other === btn);
        });
        currentSort = btn.getAttribute("data-sort") || "new";
        loadFeed();
      });
    });
  }

  function initSearch() {
    var input = document.querySelector(".search-box input");
    var list = document.querySelector("[data-live-posts]");
    if (!input || !list) return;
    input.addEventListener("input", function () {
      var query = input.value.trim().toLowerCase();
      list.querySelectorAll(".post-card").forEach(function (card) {
        card.classList.toggle("is-hidden", query !== "" && card.textContent.toLowerCase().indexOf(query) === -1);
      });
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
    TCR.api("/api/communities", { redirectOn401: false }).then(function (communities) {
      TCR.fillCommunityNav(communities);
    }).catch(function () {});
    initSort();
    initSearch();
    loadFeed();
  });
})();
