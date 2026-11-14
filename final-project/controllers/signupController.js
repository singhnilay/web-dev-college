"use strict";

var userModel = require("../models/userModel");

var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
var USERNAME_PATTERN = /^[a-zA-Z0-9_]{3,20}$/;

function signup(req, res, next) {
  var payload = req.body || {};
  var email = String(payload.email || "").trim();
  var username = String(payload.username || "").trim();
  var password = String(payload.password || "");

  if (!EMAIL_PATTERN.test(email) || !USERNAME_PATTERN.test(username) || password.length < 8) {
    res.status(400).send("Enter a valid email, username, and password.");
    return;
  }

  if (userModel.findByEmail(email)) {
    res.status(409).send("An account with this email already exists.");
    return;
  }

  userModel.hashPassword(password).then(function (hash) {
    userModel.createUser({
      email: email,
      username: username,
      password: hash
    });
    res.status(201).json({ ok: true });
  }).catch(next);
}

module.exports = {
  signup: signup
};
