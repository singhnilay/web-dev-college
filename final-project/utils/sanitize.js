"use strict";

function idOf(value) {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (value._id) return String(value._id);
  return String(value);
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

function publicPost(post, viewerId) {
  if (!post) return null;
  var authorId = idOf(post.author);
  var isOwner = viewerId && authorId === String(viewerId);
  var authorName = post.author && post.author.username ? post.author.username : "";
  var isAnonymous = Boolean(post.anonymous || post.isAnonymous);
  var author = isAnonymous && !isOwner
    ? { username: "Anonymous Student" }
    : { id: authorId, username: authorName };
  var community = post.community && post.community.name ? post.community.name : post.community;

  return {
    id: idOf(post),
    title: post.title,
    community: community,
    content: post.content,
    isAnonymous: isAnonymous,
    anonymous: isAnonymous,
    author: author,
    upvoteCount: Array.isArray(post.upvotes) ? post.upvotes.length : 0,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt
  };
}

function publicComment(comment) {
  if (!comment) return null;
  return {
    id: idOf(comment),
    post: idOf(comment.post),
    content: comment.content,
    author: comment.author && comment.author.username
      ? { id: idOf(comment.author), username: comment.author.username }
      : { id: idOf(comment.author) },
    createdAt: comment.createdAt
  };
}

module.exports = {
  idOf: idOf,
  publicUser: publicUser,
  publicPost: publicPost,
  publicComment: publicComment
};
