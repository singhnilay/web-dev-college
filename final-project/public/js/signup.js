(function () {
  "use strict";

  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
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

  ready(initSignup);
})();
