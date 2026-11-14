(function () {
  "use strict";

  function readError(response) {
    return response.text().then(function (text) {
      try {
        var data = JSON.parse(text);
        return data.error || text || "Could not sign in.";
      } catch (err) {
        return text || "Could not sign in.";
      }
    });
  }

  function initLogin() {
    var form = document.getElementById("login-form");
    if (!form) return;

    var email = document.getElementById("email");
    var password = document.getElementById("password");
    var error = document.getElementById("login-error");

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      error.textContent = "";
      error.classList.add("is-hidden");

      fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.value.trim(),
          password: password.value
        })
      }).then(function (response) {
        if (!response.ok) {
          return readError(response).then(function (message) {
            throw new Error(message);
          });
        }
        window.location.href = "community.html";
      }).catch(function (requestError) {
        error.textContent = requestError.message || "Could not connect to server.";
        error.classList.remove("is-hidden");
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initLogin);
  } else {
    initLogin();
  }
})();
