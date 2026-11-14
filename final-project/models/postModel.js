"use strict";

var config = require("../config");
var jsonStore = require("./jsonStore");

function createPost(record) {
  return jsonStore.appendJsonRecord(config.POSTS_FILE, record);
}

module.exports = {
  createPost: createPost
};
