"use strict";

var config = require("../config");
var postModel = require("../models/postModel");

function createPost(req, res) {
  var payload = req.body || {};
  var record = {
    id: Date.now().toString(),
    title: String(payload.title || "").trim(),
    community: String(payload.community || "").trim(),
    content: String(payload.content || "").trim(),
    anonymous: Boolean(payload.anonymous),
    createdAt: new Date().toISOString()
  };

  if (!record.title || !record.community || !record.content) {
    res.status(400).send("Title, community, and content are required.");
    return;
  }

  if (config.COMMUNITIES.indexOf(record.community) === -1) {
    res.status(400).send("Invalid community.");
    return;
  }

  postModel.createPost(record);
  res.status(201).json({ ok: true, post: record });
}

module.exports = {
  createPost: createPost
};
