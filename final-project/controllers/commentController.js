"use strict";

var sanitize = require("../utils/sanitize");
var validators = require("../utils/validators");
var http = require("../utils/http");

function updateComment(req, res, next) {
  var content = validators.validateCommentContent((req.body || {}).content);
  if (content.error) {
    http.sendError(res, 400, content.error);
    return;
  }

  req.comment.content = content.value;
  req.comment.save().then(function (comment) {
    return comment.populate("author", "username createdAt");
  }).then(function (comment) {
    res.status(200).json({ ok: true, comment: sanitize.publicComment(comment) });
  }).catch(next);
}

function deleteComment(req, res, next) {
  req.comment.deleteOne().then(function () {
    res.status(200).json({ ok: true });
  }).catch(next);
}

module.exports = {
  updateComment: updateComment,
  deleteComment: deleteComment
};
