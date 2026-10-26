(function () {
  "use strict";

  var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var USERNAME_PATTERN = /^[a-zA-Z0-9_]{3,20}$/;

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

    var email = document.getElementById("email");
    var username = document.getElementById("username");
    var password = document.getElementById("password");
    var emailError = document.getElementById("email-error");
    var usernameError = document.getElementById("username-error");
    var passwordError = document.getElementById("password-error");

    function setError(input, errorEl, message) {
      if (!input || !errorEl) return;
      var show = Boolean(message);
      errorEl.textContent = message || "";
      errorEl.classList.toggle("is-hidden", !show);
      input.classList.toggle("input-error", show);
      input.setAttribute("aria-invalid", show ? "true" : "false");
    }

    function emailMessage() {
      var value = email.value.trim();
      if (!value) return "Email is required.";
      if (!EMAIL_PATTERN.test(value)) return "Enter a valid email address.";
      return "";
    }

    function usernameMessage() {
      var value = username.value.trim();
      if (!value) return "Username is required.";
      if (!USERNAME_PATTERN.test(value)) {
        return "Username must be 3–20 letters, numbers, or underscores.";
      }
      return "";
    }

    function passwordMessage() {
      var value = password.value;
      if (!value) return "Password is required.";
      if (value.length < 8) return "Password must be at least 8 characters long.";
      return "";
    }

    function validateField(input) {
      if (input === email) setError(email, emailError, emailMessage());
      else if (input === username) setError(username, usernameError, usernameMessage());
      else if (input === password) setError(password, passwordError, passwordMessage());
    }

    function validateAll() {
      var checks = [
        { input: email, errorEl: emailError, message: emailMessage() },
        { input: username, errorEl: usernameError, message: usernameMessage() },
        { input: password, errorEl: passwordError, message: passwordMessage() }
      ];
      var firstInvalid = null;
      checks.forEach(function (check) {
        setError(check.input, check.errorEl, check.message);
        if (check.message && !firstInvalid) firstInvalid = check.input;
      });
      return firstInvalid;
    }

    [email, username, password].forEach(function (input) {
      input.addEventListener("input", function () {
        if (input.getAttribute("aria-invalid") === "true") validateField(input);
      });
      input.addEventListener("blur", function () {
        validateField(input);
      });
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var firstInvalid = validateAll();
      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      fetch("http://localhost:3000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.value.trim(),
          username: username.value.trim(),
          password: password.value
        })
      }).then(function (response) {
        if (!response.ok) return;
        window.location.href = "login.html";
      });
    });
  }

  ready(initSignup);
})();
