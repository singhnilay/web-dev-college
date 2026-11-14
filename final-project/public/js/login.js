(function () {
  "use strict";

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

      fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.value.trim(),
          password: password.value
        })
      }).then(function (response) {
        if (!response.ok) {
          return response.text().then(function (message) {
            throw new Error(message || "Could not sign in.");
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
