"use strict";

function jsonParseError(err, req, res, next) {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    res.status(400).send("Invalid JSON");
    return;
  }
  next(err);
}

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    next(err);
    return;
  }

  if (err && err.message === "Not allowed by CORS") {
    res.status(403).send("Not allowed by CORS");
    return;
  }

  console.error(err);
  res.status(500).send("Server error");
}

module.exports = {
  jsonParseError: jsonParseError,
  errorHandler: errorHandler
};
