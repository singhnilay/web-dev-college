"use strict";

var jwt = require("jsonwebtoken");
var config = require("../config");

function expiryMs() {
  var match = /^(\d+)([smhd])$/.exec(String(config.JWT_EXPIRES_IN));
  if (!match) return 2 * 60 * 60 * 1000;
  var amount = Number(match[1]);
  var unit = match[2];
  if (unit === "s") return amount * 1000;
  if (unit === "m") return amount * 60 * 1000;
  if (unit === "h") return amount * 60 * 60 * 1000;
  return amount * 24 * 60 * 60 * 1000;
}

function cookieOptions() {
  return {
    httpOnly: true,
    secure: config.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: expiryMs()
  };
}

function signToken(userId) {
  return jwt.sign({ sub: String(userId) }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN
  });
}

function setAuthCookie(res, userId) {
  res.cookie(config.AUTH_COOKIE_NAME, signToken(userId), cookieOptions());
}

function clearAuthCookie(res) {
  res.clearCookie(config.AUTH_COOKIE_NAME, {
    httpOnly: true,
    secure: config.NODE_ENV === "production",
    sameSite: "lax",
    path: "/"
  });
}

function verifyToken(token) {
  return jwt.verify(token, config.JWT_SECRET);
}

module.exports = {
  cookieOptions: cookieOptions,
  signToken: signToken,
  setAuthCookie: setAuthCookie,
  clearAuthCookie: clearAuthCookie,
  verifyToken: verifyToken
};
