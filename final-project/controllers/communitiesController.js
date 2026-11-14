"use strict";

var Community = require("../models/communityModel");
var asyncHandler = require("../middleware/httpError").asyncHandler;
var httpError = require("../middleware/httpError").httpError;
var refs = require("../middleware/refs");

var MEMBER_POPULATE = { path: "members", select: "username email" };

var listCommunities = asyncHandler(function (req, res) {
  return Community.find().populate(MEMBER_POPULATE).sort({ createdAt: -1 }).then(function (communities) {
    res.status(200).json(communities);
  });
});

var getCommunity = asyncHandler(function (req, res) {
  return Community.findById(req.params.id).populate(MEMBER_POPULATE).then(function (community) {
    if (!community) throw httpError(404, "Community not found.");
    res.status(200).json(community);
  });
});

var createCommunity = asyncHandler(function (req, res) {
  var payload = req.body || {};
  var members = refs.parseIdList(payload.members, "members");
  return refs.requireUsers(members).then(function () {
    return Community.create({
      name: String(payload.name || "").trim(),
      description: payload.description == null ? "" : String(payload.description),
      icon: payload.icon == null ? "" : String(payload.icon),
      members: members
    });
  }).then(function (community) {
    return community.populate(MEMBER_POPULATE);
  }).then(function (community) {
    res.status(201).json(community);
  });
});

var updateCommunity = asyncHandler(function (req, res) {
  var payload = req.body || {};
  var updates = {};
  if (payload.name != null) updates.name = String(payload.name).trim();
  if (payload.description != null) updates.description = String(payload.description);
  if (payload.icon != null) updates.icon = String(payload.icon);

  var membersPromise = Promise.resolve();
  if (payload.members != null) {
    var members = refs.parseIdList(payload.members, "members");
    membersPromise = refs.requireUsers(members).then(function () {
      updates.members = members;
    });
  }

  return membersPromise
    .then(function () {
      return Community.findByIdAndUpdate(req.params.id, updates, {
        new: true,
        runValidators: true
      }).populate(MEMBER_POPULATE);
    })
    .then(function (community) {
      if (!community) throw httpError(404, "Community not found.");
      res.status(200).json(community);
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

module.exports = {
  listCommunities: listCommunities,
  getCommunity: getCommunity,
  createCommunity: createCommunity,
  updateCommunity: updateCommunity,
  deleteCommunity: deleteCommunity
};
