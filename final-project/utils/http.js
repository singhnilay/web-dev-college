"use strict";

function sendError(res, status, message) {
  res.status(status).json({ error: message });
}

function isDuplicateKeyError(err) {
  return Boolean(err && err.code === 11000);
}

function duplicateField(err) {
  var key = Object.keys((err && err.keyPattern) || {})[0] || "";
  if (key === "usernameLower" || key === "username") return "username";
  if (key === "email") return "email";
  return key || "value";
}

module.exports = {
  sendError: sendError,
  isDuplicateKeyError: isDuplicateKeyError,
  duplicateField: duplicateField
};
