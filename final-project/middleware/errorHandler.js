"use strict";

function jsonParseError(err, req, res, next) {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    res.status(400).json({ error: "Invalid JSON" });
    return;
  }
  next(err);
}

function duplicateField(err) {
  if (!err || !err.keyValue) return "A record with that unique field already exists.";
  var field = Object.keys(err.keyValue)[0];
  if (field === "usernameLower") field = "username";
  return field + " is already in use.";
}

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    next(err);
    return;
  }

  if (err && err.message === "Not allowed by CORS") {
    res.status(403).json({ error: "Not allowed by CORS" });
    return;
  }

  if (err && err.name === "ValidationError") {
    var messages = Object.keys(err.errors || {}).map(function (key) {
      return err.errors[key].message;
    });
    res.status(400).json({ error: messages.join(" ") || "Validation failed." });
    return;
  }

  if (err && err.name === "CastError") {
    res.status(400).json({ error: "Invalid id." });
    return;
  }

  if (err && (err.code === 11000 || err.code === 11001)) {
    res.status(409).json({ error: duplicateField(err) });
    return;
  }

  if (err && err.status) {
    res.status(err.status).json({ error: err.message });
    return;
  }

  console.error(err);
  res.status(500).json({ error: "Server error" });
}

module.exports = {
  jsonParseError: jsonParseError,
  errorHandler: errorHandler
};
