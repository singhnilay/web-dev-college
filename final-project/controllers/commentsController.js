"use strict";

var Comment = require("../models/commentModel");
var User = require("../models/userModel");
var Post = require("../models/postModel");
var asyncHandler = require("../middleware/httpError").asyncHandler;
var httpError = require("../middleware/httpError").httpError;
var refs = require("../middleware/refs");

var COMMENT_POPULATE = [
  { path: "author", select: "username email" },
  { path: "post", select: "title" }
];

var listComments = asyncHandler(function (req, res) {
  return Comment.find().populate(COMMENT_POPULATE).sort({ createdAt: -1 }).then(function (comments) {
    res.status(200).json(comments);
  });
});

var getComment = asyncHandler(function (req, res) {
  return Comment.findById(req.params.id).populate(COMMENT_POPULATE).then(function (comment) {
    if (!comment) throw httpError(404, "Comment not found.");
    res.status(200).json(comment);
  });
});

var createComment = asyncHandler(function (req, res) {
  var payload = req.body || {};
  var authorId = req.user && req.user.id ? req.user.id : payload.author;
  return Promise.all([
    refs.requireExisting(User, authorId, "Author"),
    refs.requireExisting(Post, payload.post, "Post")
  ]).then(function (results) {
    return Comment.create({
      content: String(payload.content || "").trim(),
      author: results[0]._id,
      post: results[1]._id
    });
  }).then(function (comment) {
    return comment.populate(COMMENT_POPULATE);
  }).then(function (comment) {
    res.status(201).json(comment);
  });
});

var updateComment = asyncHandler(function (req, res) {
  var payload = req.body || {};
  var updates = {};
  var jobs = [];

  if (payload.content != null) updates.content = String(payload.content).trim();

  if (payload.author != null) {
    jobs.push(
      refs.requireExisting(User, payload.author, "Author").then(function (author) {
        updates.author = author._id;
      })
    );
  }

  if (payload.post != null) {
    jobs.push(
      refs.requireExisting(Post, payload.post, "Post").then(function (post) {
        updates.post = post._id;
      })
    );
  }

  return Promise.all(jobs)
    .then(function () {
      return Comment.findByIdAndUpdate(req.params.id, updates, {
        new: true,
        runValidators: true
      }).populate(COMMENT_POPULATE);
    })
    .then(function (comment) {
      if (!comment) throw httpError(404, "Comment not found.");
      res.status(200).json(comment);
    });
});

var deleteComment = asyncHandler(function (req, res) {
  return Comment.findByIdAndDelete(req.params.id).then(function (comment) {
    if (!comment) throw httpError(404, "Comment not found.");
    res.status(200).json({ ok: true });
  });
});

module.exports = {
  listComments: listComments,
  getComment: getComment,
  createComment: createComment,
  updateComment: updateComment,
  deleteComment: deleteComment
};
