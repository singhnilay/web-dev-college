(function () {
  "use strict";

  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  function initMobileMenu() {
    var menuBtn = document.querySelector("[data-menu]");
    var sidebar = document.querySelector("[data-sidebar]");
    if (!menuBtn || !sidebar) return;

    function setOpen(open) {
      sidebar.classList.toggle("is-open", open);
      menuBtn.setAttribute("aria-expanded", String(open));
      menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }

    menuBtn.addEventListener("click", function () {
      setOpen(!sidebar.classList.contains("is-open"));
    });

    sidebar.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.matchMedia("(max-width: 767px)").matches) {
          setOpen(false);
        }
      });
    });

    window.addEventListener("resize", function () {
      if (window.matchMedia("(min-width: 768px)").matches) {
        setOpen(false);
      }
    });
  }

  function initSearch() {
    var input = document.querySelector(".search-box input");
    var posts = document.querySelectorAll(".post-card");
    if (!input || !posts.length) return;

    input.addEventListener("input", function () {
      var query = input.value.trim().toLowerCase();
      posts.forEach(function (card) {
        var haystack = card.textContent.toLowerCase();
        card.classList.toggle("is-hidden", query !== "" && haystack.indexOf(query) === -1);
      });
    });
  }

  function initSort() {
    var buttons = document.querySelectorAll("[data-sort]");
    var list = document.querySelector(".posts");
    if (!buttons.length || !list) return;

    var original = Array.prototype.slice.call(list.children);

    function voteCount(card) {
      var el = card.querySelector("[data-count]");
      return el ? Number(el.textContent) || 0 : 0;
    }

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        buttons.forEach(function (other) {
          other.classList.toggle("is-active", other === btn);
        });

        var cards = original.slice();
        var label = btn.textContent.toLowerCase();

        if (label.indexOf("top") !== -1) {
          cards.sort(function (a, b) {
            return voteCount(b) - voteCount(a);
          });
        } else if (label.indexOf("new") !== -1) {
          cards.reverse();
        }

        cards.forEach(function (card) {
          list.appendChild(card);
        });
      });
    });
  }

  function initVotes() {
    document.querySelectorAll("[data-vote]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var countEl = btn.querySelector("[data-count]");
        var count = countEl ? Number(countEl.textContent) || 0 : 0;
        var active = btn.classList.toggle("is-active");
        if (countEl) countEl.textContent = String(active ? count + 1 : count - 1);
      });
    });
  }

  function initSignup() {
    var form = document.getElementById("signup-form");
    if (!form) return;

    var password = document.getElementById("password");
    var passwordError = document.getElementById("password-error");

    function showPasswordError(show) {
      if (!passwordError) return;
      passwordError.classList.toggle("is-hidden", !show);
    }

    if (password) {
      password.addEventListener("input", function () {
        if (password.value.length >= 8) showPasswordError(false);
      });
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (password && password.value.length < 8) {
        showPasswordError(true);
        password.focus();
        return;
      }
      showPasswordError(false);
      window.location.href = "login.html";
    });
  }

  function initLanding() {
    var header = document.querySelector(".landing-header");
    var hero = document.querySelector(".hero");
    if (!header || !hero) return;

    function syncHeader() {
      var threshold = Math.max(hero.offsetHeight - header.offsetHeight, 0);
      header.classList.toggle("is-scrolled", window.scrollY > threshold);
    }

    syncHeader();
    window.addEventListener("scroll", syncHeader, { passive: true });
    window.addEventListener("resize", syncHeader);
  }

  ready(function () {
    initMobileMenu();
    initSearch();
    initSort();
    initVotes();
    initSignup();
    initLanding();
  });
})();
