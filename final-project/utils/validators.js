"use strict";

var mongoose = require("mongoose");
var config = require("../config");

var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
var USERNAME_PATTERN = /^[a-zA-Z0-9_]{3,20}$/;

function asString(value) {
  return String(value == null ? "" : value);
}

function validateEmail(value) {
  var email = asString(value).trim().toLowerCase();
  if (!email) return { error: "Email is required." };
  if (!EMAIL_PATTERN.test(email) || email.length > 254) {
    return { error: "Enter a valid email address." };
  }
  return { value: email };
}

function validateUsername(value) {
  var username = asString(value).trim();
  if (!username) return { error: "Username is required." };
  if (!USERNAME_PATTERN.test(username)) {
    return { error: "Username must be 3–20 letters, numbers, or underscores." };
  }
  return { value: username };
}

function validatePassword(value) {
  var password = asString(value);
  if (!password) return { error: "Password is required." };
  if (password.length < 8) return { error: "Password must be at least 8 characters long." };
  if (password.length > 72) return { error: "Password must be at most 72 characters long." };
  return { value: password };
}

function validateBio(value) {
  var bio = asString(value).trim();
  if (bio.length > 280) return { error: "Bio must be at most 280 characters." };
  return { value: bio };
}

function validateAvatar(value) {
  var avatar = asString(value).trim();
  if (avatar.length > 500) return { error: "Avatar must be at most 500 characters." };
  return { value: avatar };
}

function validateCommunity(value) {
  var community = asString(value).trim();
  if (!community) return { error: "Community is required." };
  if (config.COMMUNITIES.indexOf(community) === -1) return { error: "Invalid community." };
  return { value: community };
}

function validateTitle(value) {
  var title = asString(value).trim();
  if (!title) return { error: "Title is required." };
  if (title.length > 200) return { error: "Title must be at most 200 characters." };
  return { value: title };
}

function validatePostContent(value) {
  var content = asString(value).trim();
  if (!content) return { error: "Content is required." };
  if (content.length > 5000) return { error: "Content must be at most 5000 characters." };
  return { value: content };
}

function validateCommentContent(value) {
  var content = asString(value).trim();
  if (!content) return { error: "Comment is required." };
  if (content.length > 2000) return { error: "Comment must be at most 2000 characters." };
  return { value: content };
}

function validateObjectId(value, label) {
  var id = asString(value).trim();
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return { error: (label || "Resource") + " not found." };
  }
  return { value: id };
}

module.exports = {
  EMAIL_PATTERN: EMAIL_PATTERN,
  USERNAME_PATTERN: USERNAME_PATTERN,
  validateEmail: validateEmail,
  validateUsername: validateUsername,
  validatePassword: validatePassword,
  validateBio: validateBio,
  validateAvatar: validateAvatar,
  validateCommunity: validateCommunity,
  validateTitle: validateTitle,
  validatePostContent: validatePostContent,
  validateCommentContent: validateCommentContent,
  validateObjectId: validateObjectId
};
