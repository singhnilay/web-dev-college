"use strict";

var config = require("../config");
var userModel = require("../models/userModel");
var postModel = require("../models/postModel");
var commentModel = require("../models/commentModel");
var authCookie = require("../utils/authCookie");
var http = require("../utils/http");
var sanitize = require("../utils/sanitize");
var validators = require("../utils/validators");

function readToken(req) {
  var cookies = req.cookies || {};
  return cookies[config.AUTH_COOKIE_NAME];
}

function requireAuth(req, res, next) {
  var token = readToken(req);
  if (!token) {
    http.sendError(res, 401, "Authentication required.");
    return;
  }

  var payload;
  try {
    payload = authCookie.verifyToken(token);
  } catch (err) {
    if (err && err.name === "TokenExpiredError") {
      http.sendError(res, 401, "Authentication expired. Please log in again.");
      return;
    }
    http.sendError(res, 401, "Invalid authentication.");
    return;
  }

  var userId = payload && payload.sub;
  var idCheck = validators.validateObjectId(userId, "User");
  if (idCheck.error) {
    http.sendError(res, 401, "Invalid authentication.");
    return;
  }

  userModel.findById(idCheck.value).then(function (user) {
    if (!user) {
      http.sendError(res, 401, "Invalid authentication.");
      return;
    }
    req.user = sanitize.publicUser(user, { includeEmail: true });
    next();
  }).catch(next);
}

function optionalAuth(req, res, next) {
  var token = readToken(req);
  if (!token) {
    next();
    return;
  }

  try {
    var payload = authCookie.verifyToken(token);
    var idCheck = validators.validateObjectId(payload && payload.sub, "User");
    if (idCheck.error) {
      next();
      return;
    }
    userModel.findById(idCheck.value).then(function (user) {
      if (user) req.user = sanitize.publicUser(user, { includeEmail: true });
      next();
    }).catch(next);
  } catch (err) {
    next();
  }
}

function requireSelf(req, res, next) {
  var idCheck = validators.validateObjectId(req.params.id, "User");
  if (idCheck.error) {
    http.sendError(res, 404, idCheck.error);
    return;
  }
  if (String(req.user.id) !== idCheck.value) {
    http.sendError(res, 403, "You can only modify your own profile.");
    return;
  }
  next();
}

function requirePostOwner(req, res, next) {
  var idCheck = validators.validateObjectId(req.params.id, "Post");
  if (idCheck.error) {
    http.sendError(res, 404, idCheck.error);
    return;
  }

  postModel.findById(idCheck.value).then(function (post) {
    if (!post) {
      http.sendError(res, 404, "Post not found.");
      return;
    }
    if (sanitize.idOf(post.author) !== String(req.user.id)) {
      http.sendError(res, 403, "You can only modify or delete your own posts.");
      return;
    }
    req.post = post;
    next();
  }).catch(next);
}

function requireCommentOwner(req, res, next) {
  var idCheck = validators.validateObjectId(req.params.id, "Comment");
  if (idCheck.error) {
    http.sendError(res, 404, idCheck.error);
    return;
  }

  commentModel.findById(idCheck.value).then(function (comment) {
    if (!comment) {
      http.sendError(res, 404, "Comment not found.");
      return;
    }
    if (sanitize.idOf(comment.author) !== String(req.user.id)) {
      http.sendError(res, 403, "You can only modify or delete your own comments.");
      return;
    }
    req.comment = comment;
    next();
  }).catch(next);
}

module.exports = {
  requireAuth: requireAuth,
  optionalAuth: optionalAuth,
  requireSelf: requireSelf,
  requirePostOwner: requirePostOwner,
  requireCommentOwner: requireCommentOwner
};
