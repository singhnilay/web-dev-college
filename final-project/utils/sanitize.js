"use strict";

function idOf(value) {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (value._id) return String(value._id);
  return String(value);
}

function viewerIdOf(viewer) {
  if (!viewer) return "";
  if (typeof viewer === "string") return viewer;
  return idOf(viewer);
}

function publicUser(user, options) {
  if (!user) return null;
  var includeEmail = options && options.includeEmail;
  var payload = {
    id: idOf(user),
    username: user.username,
    bio: user.bio || "",
    avatar: user.avatar || user.profileImage || "",
    profileImage: user.profileImage || user.avatar || "",
    createdAt: user.createdAt
  };
  if (includeEmail) payload.email = user.email;
  return payload;
}

function publicCommunity(community, viewerId) {
  if (!community) return null;
  var members = Array.isArray(community.members) ? community.members.map(idOf) : [];
  var viewer = viewerIdOf(viewerId);
  return {
    id: idOf(community),
    name: community.name,
    description: community.description || "",
    icon: community.icon || "",
    memberCount: members.length,
    joined: Boolean(viewer && members.indexOf(viewer) !== -1),
    createdAt: community.createdAt
  };
}

function publicPost(post, viewerId, extras) {
  if (!post) return null;
  var viewer = viewerIdOf(viewerId);
  var authorId = idOf(post.author);
  var isOwner = Boolean(viewer && authorId && authorId === viewer);
  var isAnonymous = Boolean(post.anonymous || post.isAnonymous);
  var upvoteIds = Array.isArray(post.upvotes) ? post.upvotes.map(idOf) : [];
  var community = post.community && post.community.name
    ? {
      id: idOf(post.community),
      name: post.community.name,
      icon: post.community.icon || ""
    }
    : post.community
      ? { id: idOf(post.community), name: String(post.community) }
      : null;

  var author;
  if (isAnonymous) {
    author = { username: "Anonymous Student" };
  } else if (post.author && post.author.username) {
    author = { id: authorId, username: post.author.username };
  } else {
    author = { id: authorId, username: "" };
  }

  var payload = {
    id: idOf(post),
    title: post.title,
    content: post.content,
    community: community,
    author: author,
    isAnonymous: isAnonymous,
    anonymous: isAnonymous,
    isOwner: isOwner,
    upvoteCount: upvoteIds.length,
    upvoted: Boolean(viewer && upvoteIds.indexOf(viewer) !== -1),
    commentCount: extras && extras.commentCount != null ? extras.commentCount : 0,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt
  };
  return payload;
}

function publicComment(comment, viewerId) {
  if (!comment) return null;
  var viewer = viewerIdOf(viewerId);
  var authorId = idOf(comment.author);
  return {
    id: idOf(comment),
    post: idOf(comment.post),
    content: comment.content,
    author: comment.author && comment.author.username
      ? { id: authorId, username: comment.author.username }
      : { id: authorId, username: "" },
    isOwner: Boolean(viewer && authorId === viewer),
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt
  };
}

module.exports = {
  idOf: idOf,
  viewerIdOf: viewerIdOf,
  publicUser: publicUser,
  publicCommunity: publicCommunity,
  publicPost: publicPost,
  publicComment: publicComment
};
