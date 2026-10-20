(function () {
  "use strict";

  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  function initLandingHeader() {
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

  ready(initLandingHeader);
})();
