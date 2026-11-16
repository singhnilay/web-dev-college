"use strict";

var userModel = require("../models/userModel");
var authCookie = require("../utils/authCookie");
var http = require("../utils/http");
var sanitize = require("../utils/sanitize");
var validators = require("../utils/validators");

function register(req, res, next) {
  var payload = req.body || {};
  var email = validators.validateEmail(payload.email);
  var username = validators.validateUsername(payload.username);
  var password = validators.validatePassword(payload.password);

  if (email.error || username.error || password.error) {
    http.sendError(res, 400, email.error || username.error || password.error);
    return;
  }

  Promise.all([
    userModel.findByEmail(email.value),
    userModel.findByUsernameLower(username.value)
  ]).then(function (found) {
    if (found[0]) {
      http.sendError(res, 409, "An account with this email already exists.");
      return null;
    }
    if (found[1]) {
      http.sendError(res, 409, "That username is already taken.");
      return null;
    }
    return userModel.hashPassword(password.value).then(function (hash) {
      return userModel.createUser({
        email: email.value,
        username: username.value,
        usernameLower: username.value.toLowerCase(),
        password: hash,
        bio: "",
        profileImage: ""
      });
    });
  }).then(function (user) {
    if (!user) return;
    var token = authCookie.setAuthCookie(res, user._id);
    res.status(201).json({
      ok: true,
      token: token,
      user: sanitize.publicUser(user, { includeEmail: true })
    });
  }).catch(function (err) {
    if (http.isDuplicateKeyError(err)) {
      var field = http.duplicateField(err);
      if (field === "email") {
        http.sendError(res, 409, "An account with this email already exists.");
        return;
      }
      http.sendError(res, 409, "That username is already taken.");
      return;
    }
    next(err);
  });
}

function login(req, res, next) {
  var payload = req.body || {};
  var email = validators.validateEmail(payload.email);
  var password = validators.validatePassword(payload.password);

  if (email.error || password.error) {
    http.sendError(res, 400, email.error || password.error);
    return;
  }

  userModel.findByEmail(email.value).then(function (user) {
    if (!user) {
      http.sendError(res, 401, "Email or password is incorrect.");
      return null;
    }
    return userModel.passwordsMatch(password.value, user.password).then(function (ok) {
      if (!ok) {
        http.sendError(res, 401, "Email or password is incorrect.");
        return null;
      }
      var token = authCookie.setAuthCookie(res, user._id);
      res.status(200).json({
        ok: true,
        token: token,
        user: sanitize.publicUser(user, { includeEmail: true })
      });
    });
  }).catch(next);
}

function me(req, res) {
  res.status(200).json({ ok: true, user: req.user });
}

function logout(req, res) {
  authCookie.clearAuthCookie(res);
  res.status(200).json({ ok: true });
}

module.exports = {
  register: register,
  login: login,
  me: me,
  logout: logout
};
