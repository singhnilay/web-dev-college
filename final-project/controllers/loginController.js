"use strict";

var User = require("../models/userModel");

function login(req, res, next) {
  var payload = req.body || {};
  var email = String(payload.email || "").trim().toLowerCase();
  var password = String(payload.password || "");

  User.findOne({ email: email })
    .select("+password")
    .then(function (user) {
      if (!user) {
        res.status(401).json({ error: "Email or password is incorrect." });
        return null;
      }
      return User.passwordsMatch(password, String(user.password || "")).then(function (ok) {
        if (!ok) {
          res.status(401).json({ error: "Email or password is incorrect." });
          return;
        }
        res.status(200).json({ ok: true });
      });
    })
    .catch(next);
}

module.exports = {
  login: login
};
