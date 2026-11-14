"use strict";

var Post = require("../models/postModel");
var User = require("../models/userModel");
var Community = require("../models/communityModel");
var asyncHandler = require("../middleware/httpError").asyncHandler;
var httpError = require("../middleware/httpError").httpError;
var isValidObjectId = require("../middleware/httpError").isValidObjectId;
var refs = require("../middleware/refs");

var POST_POPULATE = [
  { path: "author", select: "username email" },
  { path: "community", select: "name icon" },
  { path: "upvotes", select: "username" }
];

function resolveCommunity(value) {
  var asString = String(value || "").trim();
  if (!asString) return Promise.reject(httpError(400, "Community is required."));
  if (isValidObjectId(asString)) {
    return refs.requireExisting(Community, asString, "Community");
  }
  return Community.findOne({ name: asString }).then(function (community) {
    if (!community) throw httpError(400, "Community not found.");
    return community;
  });
}

var listPosts = asyncHandler(function (req, res) {
  return Post.find().populate(POST_POPULATE).sort({ createdAt: -1 }).then(function (posts) {
    res.status(200).json(posts);
  });
});

var getPost = asyncHandler(function (req, res) {
  return Post.findById(req.params.id).populate(POST_POPULATE).then(function (post) {
    if (!post) throw httpError(404, "Post not found.");
    res.status(200).json(post);
  });
});

var createPost = asyncHandler(function (req, res) {
  var payload = req.body || {};
  var upvotes = refs.parseIdList(payload.upvotes, "upvotes");
  var authorId = req.user && req.user.id ? req.user.id : payload.author;
  return Promise.all([
    refs.requireExisting(User, authorId, "Author"),
    resolveCommunity(payload.community),
    refs.requireUsers(upvotes)
  ]).then(function (results) {
    var author = results[0];
    var community = results[1];
    return Post.create({
      title: String(payload.title || "").trim(),
      content: String(payload.content || "").trim(),
      author: author._id,
      community: community._id,
      anonymous: Boolean(payload.anonymous || payload.isAnonymous),
      upvotes: upvotes
    });
  }).then(function (post) {
    return post.populate(POST_POPULATE);
  }).then(function (post) {
    res.status(201).json(post);
  });
});

var updatePost = asyncHandler(function (req, res) {
  var payload = req.body || {};
  var updates = {};
  var jobs = [];

  if (payload.title != null) updates.title = String(payload.title).trim();
  if (payload.content != null) updates.content = String(payload.content).trim();
  if (payload.anonymous != null || payload.isAnonymous != null) {
    updates.anonymous = Boolean(payload.anonymous || payload.isAnonymous);
  }

  if (payload.author != null) {
    jobs.push(
      refs.requireExisting(User, payload.author, "Author").then(function (author) {
        updates.author = author._id;
      })
    );
  }

  if (payload.community != null) {
    jobs.push(
      resolveCommunity(payload.community).then(function (community) {
        updates.community = community._id;
      })
    );
  }

  if (payload.upvotes != null) {
    var upvotes = refs.parseIdList(payload.upvotes, "upvotes");
    jobs.push(
      refs.requireUsers(upvotes).then(function () {
        updates.upvotes = upvotes;
      })
    );
  }

  return Promise.all(jobs)
    .then(function () {
      return Post.findByIdAndUpdate(req.params.id, updates, {
        new: true,
        runValidators: true
      }).populate(POST_POPULATE);
    })
    .then(function (post) {
      if (!post) throw httpError(404, "Post not found.");
      res.status(200).json(post);
    });
});

var deletePost = asyncHandler(function (req, res) {
  return Post.findById(req.params.id)
    .then(function (post) {
      if (!post) throw httpError(404, "Post not found.");
      return refs.postDeleteGuards(post._id).then(function () {
        return Post.findByIdAndDelete(post._id);
      });
    })
    .then(function () {
      res.status(200).json({ ok: true });
    });
});

module.exports = {
  listPosts: listPosts,
  getPost: getPost,
  createPost: createPost,
  updatePost: updatePost,
  deletePost: deletePost
};
