"use strict";

var Comment = require("../models/commentModel");
var Post = require("../models/postModel");
var asyncHandler = require("../middleware/httpError").asyncHandler;
var httpError = require("../middleware/httpError").httpError;
var refs = require("../middleware/refs");
var sanitize = require("../utils/sanitize");
var validators = require("../utils/validators");

var COMMENT_POPULATE = [
  { path: "author", select: "username createdAt" },
  { path: "post", select: "title" }
];

function viewerId(req) {
  return req.user && req.user.id ? String(req.user.id) : "";
}

function present(comment, req) {
  return sanitize.publicComment(comment, viewerId(req));
}

function commentsForPost(postId, req) {
  return Comment.find({ post: postId })
    .sort({ createdAt: 1 })
    .populate(COMMENT_POPULATE)
    .then(function (comments) {
      return comments.map(function (comment) {
        return present(comment, req);
      });
    });
}

var listComments = asyncHandler(function (req, res) {
  if (req.query.post) {
    return refs.requireExisting(Post, req.query.post, "Post").then(function (post) {
      return commentsForPost(post._id, req);
    }).then(function (comments) {
      res.status(200).json(comments);
    });
  }

  return Comment.find()
    .sort({ createdAt: -1 })
    .populate(COMMENT_POPULATE)
    .then(function (comments) {
      res.status(200).json(comments.map(function (comment) {
        return present(comment, req);
      }));
    });
});

var listForPost = asyncHandler(function (req, res) {
  return Post.findById(req.params.id).then(function (post) {
    if (!post) throw httpError(404, "Post not found.");
    return commentsForPost(post._id, req);
  }).then(function (comments) {
    res.status(200).json(comments);
  });
});

var getComment = asyncHandler(function (req, res) {
  return Comment.findById(req.params.id).populate(COMMENT_POPULATE).then(function (comment) {
    if (!comment) throw httpError(404, "Comment not found.");
    res.status(200).json(present(comment, req));
  });
});

function createOnPost(postId, req) {
  var content = validators.validateCommentContent((req.body || {}).content);
  if (content.error) throw httpError(400, content.error);
  if (!postId) throw httpError(400, "Post is required.");

  return Post.findById(postId).then(function (post) {
    if (!post) throw httpError(404, "Post not found.");
    return Comment.create({
      content: content.value,
      author: req.user.id,
      post: post._id
    });
  }).then(function (comment) {
    return comment.populate(COMMENT_POPULATE);
  });
}

var createComment = asyncHandler(function (req, res) {
  var postId = (req.body || {}).post;
  return createOnPost(postId, req).then(function (comment) {
    res.status(201).json(present(comment, req));
  });
});

var createForPost = asyncHandler(function (req, res) {
  return createOnPost(req.params.id, req).then(function (comment) {
    res.status(201).json(present(comment, req));
  });
});

var updateComment = asyncHandler(function (req, res) {
  var content = validators.validateCommentContent((req.body || {}).content);
  if (content.error) throw httpError(400, content.error);

  req.comment.content = content.value;
  return req.comment.save()
    .then(function (comment) {
      return comment.populate(COMMENT_POPULATE);
    })
    .then(function (comment) {
      res.status(200).json(present(comment, req));
    });
});

var deleteComment = asyncHandler(function (req, res) {
  return req.comment.deleteOne().then(function () {
    res.status(200).json({ ok: true });
  });
});

module.exports = {
  listComments: listComments,
  listForPost: listForPost,
  getComment: getComment,
  createComment: createComment,
  createForPost: createForPost,
  updateComment: updateComment,
  deleteComment: deleteComment
};
