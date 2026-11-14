"use strict";

function httpError(status, message) {
  var err = new Error(message);
  err.status = status;
  return err;
}

function asyncHandler(fn) {
  return function (req, res, next) {
    Promise.resolve()
      .then(function () {
        return fn(req, res, next);
      })
      .catch(next);
  };
}

function isValidObjectId(id) {
  return typeof id === "string" && /^[a-fA-F0-9]{24}$/.test(id);
}

function requireValidId(req, res, next) {
  if (!isValidObjectId(req.params.id)) {
    next(httpError(400, "Invalid id."));
    return;
  }
  next();
}

module.exports = {
  httpError: httpError,
  asyncHandler: asyncHandler,
  isValidObjectId: isValidObjectId,
  requireValidId: requireValidId
};
