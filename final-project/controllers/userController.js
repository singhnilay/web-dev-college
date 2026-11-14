"use strict";

var userModel = require("../models/userModel");
var http = require("../utils/http");
var sanitize = require("../utils/sanitize");
var validators = require("../utils/validators");

function getUser(req, res, next) {
  var idCheck = validators.validateObjectId(req.params.id, "User");
  if (idCheck.error) {
    http.sendError(res, 404, idCheck.error);
    return;
  }

  userModel.findById(idCheck.value).then(function (user) {
    if (!user) {
      http.sendError(res, 404, "User not found.");
      return;
    }
    var includeEmail = req.user && req.user.id === String(user._id);
    res.status(200).json({ ok: true, user: sanitize.publicUser(user, { includeEmail: includeEmail }) });
  }).catch(next);
}

function updateUser(req, res, next) {
  var payload = req.body || {};
  var updates = {};

  if (Object.prototype.hasOwnProperty.call(payload, "bio")) {
    var bio = validators.validateBio(payload.bio);
    if (bio.error) {
      http.sendError(res, 400, bio.error);
      return;
    }
    updates.bio = bio.value;
  }

  if (Object.prototype.hasOwnProperty.call(payload, "avatar") || Object.prototype.hasOwnProperty.call(payload, "profileImage")) {
    var avatar = validators.validateAvatar(payload.avatar || payload.profileImage);
    if (avatar.error) {
      http.sendError(res, 400, avatar.error);
      return;
    }
    updates.profileImage = avatar.value;
  }

  if (Object.prototype.hasOwnProperty.call(payload, "username")) {
    var username = validators.validateUsername(payload.username);
    if (username.error) {
      http.sendError(res, 400, username.error);
      return;
    }
    updates.username = username.value;
    updates.usernameLower = username.value.toLowerCase();
  }

  if (Object.keys(updates).length === 0) {
    http.sendError(res, 400, "No valid profile fields to update.");
    return;
  }

  var finish = function () {
    return userModel.findById(req.user.id).then(function (user) {
      Object.keys(updates).forEach(function (key) {
        user[key] = updates[key];
      });
      return user.save();
    }).then(function (user) {
      res.status(200).json({ ok: true, user: sanitize.publicUser(user, { includeEmail: true }) });
    });
  };

  var usernameCheck = updates.usernameLower
    ? userModel.findByUsernameLower(updates.username)
    : Promise.resolve(null);

  usernameCheck.then(function (existing) {
    if (existing && String(existing._id) !== String(req.user.id)) {
      http.sendError(res, 409, "That username is already taken.");
      return null;
    }
    return finish();
  }).catch(function (err) {
    if (http.isDuplicateKeyError(err)) {
      http.sendError(res, 409, "That username is already taken.");
      return;
    }
    next(err);
  });
}

module.exports = {
  getUser: getUser,
  updateUser: updateUser
};
