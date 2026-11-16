"use strict";

var mongoose = require("mongoose");
var Post = require("../models/postModel");
var Comment = require("../models/commentModel");
var asyncHandler = require("../middleware/httpError").asyncHandler;
var httpError = require("../middleware/httpError").httpError;
var isValidObjectId = require("../middleware/httpError").isValidObjectId;
var refs = require("../middleware/refs");
var sanitize = require("../utils/sanitize");
var validators = require("../utils/validators");

var POST_POPULATE = [
  { path: "author", select: "username createdAt" },
  { path: "community", select: "name icon description" }
];

function viewerId(req) {
  return req.user && req.user.id ? String(req.user.id) : "";
}

function asObjectId(id) {
  return new mongoose.Types.ObjectId(String(id));
}

function commentCountMap(postIds) {
  if (!postIds.length) return Promise.resolve({});
  return Comment.aggregate([
    { $match: { post: { $in: postIds } } },
    { $group: { _id: "$post", count: { $sum: 1 } } }
  ]).then(function (rows) {
    var map = {};
    rows.forEach(function (row) {
      map[String(row._id)] = row.count;
    });
    return map;
  });
}

function presentPosts(posts, req) {
  var viewer = viewerId(req);
  var ids = posts.map(function (post) {
    return post._id;
  });
  return commentCountMap(ids).then(function (counts) {
    return posts.map(function (post) {
      return sanitize.publicPost(post, viewer, {
        commentCount: counts[String(post._id)] || 0
      });
    });
  });
}

function presentPost(post, req) {
  var viewer = viewerId(req);
  return Comment.countDocuments({ post: post._id }).then(function (count) {
    return sanitize.publicPost(post, viewer, { commentCount: count });
  });
}

function queryPosts(filter, sortKey) {
  var key = String(sortKey || "new").toLowerCase();
  var popularity = key === "popular" || key === "top" || key === "trending";

  if (!popularity) {
    return Post.find(filter).sort({ createdAt: -1 }).populate(POST_POPULATE);
  }

  var pipeline = [
    { $match: filter },
    { $addFields: { upvoteCount: { $size: { $ifNull: ["$upvotes", []] } } } }
  ];

  if (key === "trending") {
    pipeline.push({
      $addFields: {
        trendScore: {
          $add: [
            "$upvoteCount",
            {
              $cond: [
                {
                  $gte: [
                    "$createdAt",
                    new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
                  ]
                },
                3,
                0
              ]
            }
          ]
        }
      }
    });
    pipeline.push({ $sort: { trendScore: -1, createdAt: -1 } });
  } else {
    pipeline.push({ $sort: { upvoteCount: -1, createdAt: -1 } });
  }

  return Post.aggregate(pipeline).then(function (docs) {
    return Post.populate(docs, POST_POPULATE);
  });
}

function buildPostFilter(req) {
  var filter = {};
  var jobs = [];

  if (req.query.community) {
    jobs.push(
      refs.requireCommunity(req.query.community).then(function (community) {
        filter.community = community._id;
      })
    );
  }

  if (req.query.author) {
    if (!isValidObjectId(String(req.query.author))) {
      return Promise.reject(httpError(400, "Invalid author id."));
    }
    filter.author = asObjectId(req.query.author);
    if (viewerId(req) !== String(req.query.author)) {
      filter.anonymous = { $ne: true };
    }
  }

  return Promise.all(jobs).then(function () {
    return filter;
  });
}

function listFromFilter(req, extraFilter) {
  return buildPostFilter(req).then(function (filter) {
    if (extraFilter) {
      Object.keys(extraFilter).forEach(function (key) {
        filter[key] = extraFilter[key];
      });
    }
    return queryPosts(filter, req.query.sort);
  }).then(function (posts) {
    return presentPosts(posts, req);
  });
}

var listPosts = asyncHandler(function (req, res) {
  return listFromFilter(req).then(function (posts) {
    res.status(200).json(posts);
  });
});

var getPost = asyncHandler(function (req, res) {
  return Post.findById(req.params.id).populate(POST_POPULATE).then(function (post) {
    if (!post) throw httpError(404, "Post not found.");
    return presentPost(post, req);
  }).then(function (payload) {
    res.status(200).json(payload);
  });
});

var createPost = asyncHandler(function (req, res) {
  var payload = req.body || {};
  var title = validators.validateTitle(payload.title);
  var content = validators.validatePostContent(payload.content);
  if (title.error) throw httpError(400, title.error);
  if (content.error) throw httpError(400, content.error);

  return refs.requireCommunity(payload.community).then(function (community) {
    refs.requireCommunityMember(community, req.user.id);
    return Post.create({
      title: title.value,
      content: content.value,
      author: req.user.id,
      community: community._id,
      anonymous: Boolean(payload.anonymous || payload.isAnonymous),
      upvotes: []
    });
  }).then(function (post) {
    return post.populate(POST_POPULATE);
  }).then(function (post) {
    return presentPost(post, req);
  }).then(function (payload) {
    res.status(201).json(payload);
  });
});

var updatePost = asyncHandler(function (req, res) {
  var payload = req.body || {};
  var post = req.post;
  var jobs = [];

  if (payload.title != null) {
    var title = validators.validateTitle(payload.title);
    if (title.error) throw httpError(400, title.error);
    post.title = title.value;
  }
  if (payload.content != null) {
    var content = validators.validatePostContent(payload.content);
    if (content.error) throw httpError(400, content.error);
    post.content = content.value;
  }
  if (payload.anonymous != null || payload.isAnonymous != null) {
    post.anonymous = Boolean(payload.anonymous || payload.isAnonymous);
  }

  if (payload.community != null) {
    jobs.push(
      refs.requireCommunity(payload.community).then(function (community) {
        refs.requireCommunityMember(community, req.user.id);
        post.community = community._id;
      })
    );
  }

  return Promise.all(jobs)
    .then(function () {
      return post.save();
    })
    .then(function (saved) {
      return saved.populate(POST_POPULATE);
    })
    .then(function (saved) {
      return presentPost(saved, req);
    })
    .then(function (payloadOut) {
      res.status(200).json(payloadOut);
    });
});

var deletePost = asyncHandler(function (req, res) {
  return refs.deleteCommentsForPost(req.post._id)
    .then(function () {
      return Post.findByIdAndDelete(req.post._id);
    })
    .then(function () {
      res.status(200).json({ ok: true });
    });
});

function loadPostOr404(id) {
  if (!isValidObjectId(String(id))) {
    return Promise.reject(httpError(400, "Invalid id."));
  }
  return Post.findById(id).then(function (post) {
    if (!post) throw httpError(404, "Post not found.");
    return post;
  });
}

var upvotePost = asyncHandler(function (req, res) {
  var userId = asObjectId(req.user.id);
  return loadPostOr404(req.params.id).then(function (post) {
    return Post.findOneAndUpdate(
      { _id: post._id, upvotes: { $ne: userId } },
      { $addToSet: { upvotes: userId } },
      { new: true }
    ).then(function (updated) {
      var doc = updated || post;
      res.status(200).json({
        ok: true,
        upvoteCount: Array.isArray(doc.upvotes) ? doc.upvotes.length : 0,
        upvoted: true
      });
    });
  });
});

var removeUpvote = asyncHandler(function (req, res) {
  var userId = asObjectId(req.user.id);
  return loadPostOr404(req.params.id).then(function (post) {
    return Post.findByIdAndUpdate(
      post._id,
      { $pull: { upvotes: userId } },
      { new: true }
    );
  }).then(function (doc) {
    res.status(200).json({
      ok: true,
      upvoteCount: doc && Array.isArray(doc.upvotes) ? doc.upvotes.length : 0,
      upvoted: false
    });
  });
});

var listCommunityPosts = asyncHandler(function (req, res) {
  var Community = require("../models/communityModel");
  return Community.findById(req.params.id).then(function (community) {
    if (!community) throw httpError(404, "Community not found.");
    return listFromFilter(req, { community: community._id });
  }).then(function (posts) {
    res.status(200).json(posts);
  });
});

module.exports = {
  listPosts: listPosts,
  getPost: getPost,
  createPost: createPost,
  updatePost: updatePost,
  deletePost: deletePost,
  upvotePost: upvotePost,
  removeUpvote: removeUpvote,
  listCommunityPosts: listCommunityPosts,
  presentPost: presentPost
};
