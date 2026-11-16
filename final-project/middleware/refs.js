"use strict";

var User = require("../models/userModel");
var Post = require("../models/postModel");
var Community = require("../models/communityModel");
var Comment = require("../models/commentModel");
var httpError = require("./httpError").httpError;
var isValidObjectId = require("./httpError").isValidObjectId;

function uniqueIds(ids) {
  var seen = {};
  var unique = [];
  ids.forEach(function (id) {
    var key = String(id);
    if (!seen[key]) {
      seen[key] = true;
      unique.push(id);
    }
  });
  return unique;
}

function parseIdList(value, field) {
  if (value == null) return [];
  if (!Array.isArray(value)) {
    throw httpError(400, field + " must be an array of ids.");
  }
  return uniqueIds(
    value.map(function (id) {
      var asString = String(id);
      if (!isValidObjectId(asString)) {
        throw httpError(400, "Invalid id in " + field + ".");
      }
      return asString;
    })
  );
}

function requireExisting(Model, id, label) {
  if (!isValidObjectId(String(id))) {
    return Promise.reject(httpError(400, "Invalid " + label + " id."));
  }
  return Model.findById(id).then(function (doc) {
    if (!doc) throw httpError(400, label + " not found.");
    return doc;
  });
}

function requireUsers(ids) {
  if (!ids.length) return Promise.resolve([]);
  return User.find({ _id: { $in: ids } }).then(function (users) {
    if (users.length !== ids.length) {
      throw httpError(400, "One or more user ids were not found.");
    }
    return users;
  });
}

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function findCommunityByRef(value) {
  var asString = String(value == null ? "" : value).trim();
  if (!asString) return Promise.resolve(null);
  if (isValidObjectId(asString)) {
    return Community.findById(asString);
  }
  return Community.findOne({
    name: { $regex: "^" + escapeRegex(asString) + "$", $options: "i" }
  });
}

function requireCommunity(value) {
  var asString = String(value == null ? "" : value).trim();
  if (!asString) return Promise.reject(httpError(400, "Community is required."));
  return findCommunityByRef(asString).then(function (community) {
    if (!community) throw httpError(400, "Community not found.");
    return community;
  });
}

function isMember(community, userId) {
  if (!community || !userId || !Array.isArray(community.members)) return false;
  var id = String(userId);
  return community.members.some(function (memberId) {
    return String(memberId) === id;
  });
}

function requireCommunityMember(community, userId) {
  if (!isMember(community, userId)) {
    throw httpError(403, "Join this community before posting.");
  }
}

function blockIfRelated(countPromise, message) {
  return countPromise.then(function (count) {
    if (count > 0) throw httpError(409, message);
  });
}

function userDeleteGuards(userId) {
  return Promise.all([
    blockIfRelated(Post.countDocuments({ author: userId }), "Cannot delete user while posts by this user exist."),
    blockIfRelated(Comment.countDocuments({ author: userId }), "Cannot delete user while comments by this user exist."),
    blockIfRelated(Post.countDocuments({ upvotes: userId }), "Cannot delete user while this user appears in post upvotes."),
    blockIfRelated(Community.countDocuments({ members: userId }), "Cannot delete user while this user is a community member.")
  ]);
}

function deleteCommentsForPost(postId) {
  return Comment.deleteMany({ post: postId });
}

function communityDeleteGuards(communityId) {
  return Promise.all([
    blockIfRelated(Post.countDocuments({ community: communityId }), "Cannot delete community while posts in this community exist."),
    Community.findById(communityId).then(function (community) {
      if (community && community.members && community.members.length) {
        throw httpError(409, "Cannot delete community while it still has members.");
      }
    })
  ]);
}

module.exports = {
  uniqueIds: uniqueIds,
  parseIdList: parseIdList,
  requireExisting: requireExisting,
  requireUsers: requireUsers,
  findCommunityByRef: findCommunityByRef,
  requireCommunity: requireCommunity,
  isMember: isMember,
  requireCommunityMember: requireCommunityMember,
  userDeleteGuards: userDeleteGuards,
  deleteCommentsForPost: deleteCommentsForPost,
  communityDeleteGuards: communityDeleteGuards,
  User: User,
  Post: Post,
  Community: Community,
  Comment: Comment
};
