"use strict";

var userModel = require("../models/userModel");

function login(req, res, next) {
  var payload = req.body || {};
  var email = String(payload.email || "").trim().toLowerCase();
  var password = String(payload.password || "");
  var user = userModel.findByEmail(email);

  if (!user) {
    res.status(401).send("Email or password is incorrect.");
    return;
  }

  userModel.passwordsMatch(password, String(user.password || "")).then(function (ok) {
    if (!ok) {
      res.status(401).send("Email or password is incorrect.");
      return;
    }
    return userModel.upgradePasswordIfNeeded(email, password, user.password).then(function () {
      res.status(200).json({ ok: true });
    });
  }).catch(next);
}

module.exports = {
  login: login
};
