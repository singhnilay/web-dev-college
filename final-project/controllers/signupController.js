"use strict";

var User = require("../models/userModel");

var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
var USERNAME_PATTERN = /^[a-zA-Z0-9_]{3,20}$/;

function signup(req, res, next) {
  var payload = req.body || {};
  var email = String(payload.email || "").trim();
  var username = String(payload.username || "").trim();
  var password = String(payload.password || "");

  if (!EMAIL_PATTERN.test(email) || !USERNAME_PATTERN.test(username) || password.length < 8) {
    res.status(400).json({ error: "Enter a valid email, username, and password." });
    return;
  }

  User.findOne({ email: email.toLowerCase() })
    .then(function (existing) {
      if (existing) {
        res.status(409).json({ error: "An account with this email already exists." });
        return null;
      }
      return User.hashPassword(password).then(function (hash) {
        return User.create({
          email: email,
          username: username,
          password: hash
        });
      }).then(function () {
        res.status(201).json({ ok: true });
      });
    })
    .catch(next);
}

module.exports = {
  signup: signup
};
