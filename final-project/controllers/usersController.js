"use strict";

var User = require("../models/userModel");
var asyncHandler = require("../middleware/httpError").asyncHandler;
var httpError = require("../middleware/httpError").httpError;
var refs = require("../middleware/refs");

function createUser(req, res, next) {
  var payload = req.body || {};
  var email = String(payload.email || "").trim();
  var username = String(payload.username || "").trim();
  var password = String(payload.password || "");
  var bio = payload.bio == null ? "" : String(payload.bio);
  var profileImage = payload.profileImage == null ? "" : String(payload.profileImage);

  if (password.length < 8) {
    next(httpError(400, "Password must be at least 8 characters long."));
    return;
  }

  User.hashPassword(password)
    .then(function (hash) {
      return User.create({
        email: email,
        username: username,
        password: hash,
        bio: bio,
        profileImage: profileImage
      });
    })
    .then(function (user) {
      res.status(201).json(user);
    })
    .catch(next);
}

var listUsers = asyncHandler(function (req, res) {
  return User.find().sort({ createdAt: -1 }).then(function (users) {
    res.status(200).json(users);
  });
});

var getUser = asyncHandler(function (req, res) {
  return User.findById(req.params.id).then(function (user) {
    if (!user) throw httpError(404, "User not found.");
    res.status(200).json(user);
  });
});

var updateUser = asyncHandler(function (req, res) {
  var payload = req.body || {};
  var updates = {};

  if (payload.username != null) {
    updates.username = String(payload.username).trim();
    updates.usernameLower = updates.username.toLowerCase();
  }
  if (payload.email != null) updates.email = String(payload.email).trim();
  if (payload.bio != null) updates.bio = String(payload.bio);
  if (payload.profileImage != null) updates.profileImage = String(payload.profileImage);

  var passwordPromise = Promise.resolve();
  if (payload.password != null) {
    var password = String(payload.password);
    if (password.length < 8) {
      throw httpError(400, "Password must be at least 8 characters long.");
    }
    passwordPromise = User.hashPassword(password).then(function (hash) {
      updates.password = hash;
    });
  }

  return passwordPromise
    .then(function () {
      return User.findByIdAndUpdate(req.params.id, updates, {
        new: true,
        runValidators: true
      });
    })
    .then(function (user) {
      if (!user) throw httpError(404, "User not found.");
      res.status(200).json(user);
    });
});

var deleteUser = asyncHandler(function (req, res) {
  return User.findById(req.params.id)
    .then(function (user) {
      if (!user) throw httpError(404, "User not found.");
      return refs.userDeleteGuards(user._id).then(function () {
        return User.findByIdAndDelete(user._id);
      });
    })
    .then(function () {
      res.status(200).json({ ok: true });
    });
});

module.exports = {
  listUsers: listUsers,
  getUser: getUser,
  createUser: createUser,
  updateUser: updateUser,
  deleteUser: deleteUser
};
