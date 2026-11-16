(function () {
  "use strict";

  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  ready(function () {
    TCR.bindVotes(document);
    var requestedId = new URLSearchParams(window.location.search).get("id");

    TCR.me().then(function (payload) {
      var sessionUser = payload && payload.user ? payload.user : null;
      if (sessionUser) TCR.setAvatars(sessionUser);
      if (!requestedId && !sessionUser) {
        window.location.href = "login.html";
        return null;
      }
      if (requestedId && (!sessionUser || requestedId !== sessionUser.id)) {
        return TCR.api("/api/users/" + encodeURIComponent(requestedId), { redirectOn401: false }).then(function (user) {
          return { user: user, sessionUser: sessionUser };
        });
      }
      return { user: sessionUser, sessionUser: sessionUser };
    }).then(function (ctx) {
      if (!ctx || !ctx.user) return;
      var user = ctx.user.id ? ctx.user : ctx.user;
      var name = user.username || "";
      document.title = name + " — The Common Room";
      var heading = document.querySelector("[data-profile-name]");
      var bio = document.querySelector("[data-profile-bio]");
      var joined = document.querySelector("[data-profile-joined]");
      var avatar = document.querySelector("[data-profile-avatar]");
      var logout = document.querySelector("[data-logout-wrap]");
      if (heading) heading.textContent = name;
      if (bio) bio.textContent = user.bio || "No bio yet.";
      if (joined && user.createdAt) {
        joined.textContent = new Date(user.createdAt).toLocaleDateString(undefined, {
          month: "short",
          year: "numeric"
        });
      }
      if (avatar) avatar.textContent = TCR.initials(name);
      if (logout) logout.hidden = !(ctx.sessionUser && ctx.sessionUser.id === user.id);

      return TCR.api("/api/posts?author=" + encodeURIComponent(user.id) + "&sort=new", {
        redirectOn401: false
      }).then(function (posts) {
        var countEl = document.querySelector("[data-post-count]");
        if (countEl) countEl.textContent = String(posts.length);
        TCR.renderPosts(document.querySelector("[data-live-posts]"), posts, "No posts yet.");
      });
    }).catch(function (err) {
      var list = document.querySelector("[data-live-posts]");
      if (list) list.innerHTML = '<p class="lede">' + TCR.escapeHtml(err.message || "Could not load profile.") + "</p>";
    });
  });
})();
