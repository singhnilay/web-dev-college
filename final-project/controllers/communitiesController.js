"use strict";

var mongoose = require("mongoose");
var Community = require("../models/communityModel");
var asyncHandler = require("../middleware/httpError").asyncHandler;
var httpError = require("../middleware/httpError").httpError;
var refs = require("../middleware/refs");
var sanitize = require("../utils/sanitize");
var postsController = require("./postsController");

var MEMBER_SELECT = "username";

function viewerId(req) {
  return req.user && req.user.id ? String(req.user.id) : "";
}

function present(community, req) {
  return sanitize.publicCommunity(community, viewerId(req));
}

var listCommunities = asyncHandler(function (req, res) {
  var query = Community.find();
  if (req.query.name) {
    query = Community.find({
      name: {
        $regex: "^" + String(req.query.name).replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "$",
        $options: "i"
      }
    });
  }
  return query.sort({ name: 1 }).then(function (communities) {
    res.status(200).json(communities.map(function (community) {
      return present(community, req);
    }));
  });
});

var getCommunity = asyncHandler(function (req, res) {
  return Community.findById(req.params.id).then(function (community) {
    if (!community) throw httpError(404, "Community not found.");
    res.status(200).json(present(community, req));
  });
});

var createCommunity = asyncHandler(function (req, res) {
  var payload = req.body || {};
  var name = String(payload.name || "").trim();
  if (!name) throw httpError(400, "Community name is required.");

  return Community.create({
    name: name,
    description: payload.description == null ? "" : String(payload.description),
    icon: payload.icon == null ? "" : String(payload.icon),
    members: [req.user.id]
  }).then(function (community) {
    res.status(201).json(present(community, req));
  });
});

var updateCommunity = asyncHandler(function (req, res) {
  var payload = req.body || {};
  var updates = {};
  if (payload.name != null) updates.name = String(payload.name).trim();
  if (payload.description != null) updates.description = String(payload.description);
  if (payload.icon != null) updates.icon = String(payload.icon);

  return Community.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true
  }).then(function (community) {
    if (!community) throw httpError(404, "Community not found.");
    res.status(200).json(present(community, req));
  });
});

var deleteCommunity = asyncHandler(function (req, res) {
  return Community.findById(req.params.id)
    .then(function (community) {
      if (!community) throw httpError(404, "Community not found.");
      return refs.communityDeleteGuards(community._id).then(function () {
        return Community.findByIdAndDelete(community._id);
      });
    })
    .then(function () {
      res.status(200).json({ ok: true });
    });
});

var joinCommunity = asyncHandler(function (req, res) {
  var userId = new mongoose.Types.ObjectId(String(req.user.id));
  return Community.findById(req.params.id).then(function (community) {
    if (!community) throw httpError(404, "Community not found.");
    if (refs.isMember(community, req.user.id)) {
      throw httpError(409, "You are already a member of this community.");
    }
    return Community.findByIdAndUpdate(
      community._id,
      { $addToSet: { members: userId } },
      { new: true }
    );
  }).then(function (community) {
    res.status(200).json(present(community, req));
  });
});

var leaveCommunity = asyncHandler(function (req, res) {
  var userId = new mongoose.Types.ObjectId(String(req.user.id));
  return Community.findByIdAndUpdate(
    req.params.id,
    { $pull: { members: userId } },
    { new: true }
  ).then(function (community) {
    if (!community) throw httpError(404, "Community not found.");
    res.status(200).json(present(community, req));
  });
});

module.exports = {
  listCommunities: listCommunities,
  getCommunity: getCommunity,
  createCommunity: createCommunity,
  updateCommunity: updateCommunity,
  deleteCommunity: deleteCommunity,
  joinCommunity: joinCommunity,
  leaveCommunity: leaveCommunity,
  listCommunityPosts: postsController.listCommunityPosts,
  MEMBER_SELECT: MEMBER_SELECT
};
