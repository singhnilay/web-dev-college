(function () {
  "use strict";

  var STORAGE_KEY = "theme";

  function isDark() {
    return document.documentElement.classList.contains("dark");
  }

  function apply(dark) {
    document.documentElement.classList.toggle("dark", dark);
    try {
      localStorage.setItem(STORAGE_KEY, dark ? "dark" : "light");
    } catch (err) {
      /* ignore */
    }
    document.querySelectorAll("[data-theme-toggle]").forEach(function (btn) {
      btn.setAttribute("aria-pressed", dark ? "true" : "false");
      btn.textContent = dark ? "Light mode" : "Dark mode";
    });
  }

  try {
    apply(localStorage.getItem(STORAGE_KEY) === "dark");
  } catch (err) {
    apply(false);
  }

  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  ready(function () {
    apply(isDark());
    document.querySelectorAll("[data-theme-toggle]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        apply(!isDark());
      });
    });
  });
})();
