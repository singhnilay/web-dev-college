"use strict";

var path = require("path");

var ROOT_DIR = path.join(__dirname, "..");

module.exports = {
  PORT: Number(process.env.PORT) || 3000,
  ROOT_DIR: ROOT_DIR,
  PUBLIC_DIR: path.join(ROOT_DIR, "public"),
  DATA_DIR: path.join(ROOT_DIR, "data"),
  USERS_FILE: path.join(ROOT_DIR, "data", "users.json"),
  POSTS_FILE: path.join(ROOT_DIR, "data", "posts.json"),
  BCRYPT_ROUNDS: 10,
  COMMUNITIES: [
    "Campus Life",
    "Academics",
    "Events",
    "Memes",
    "Opportunities",
    "Questions"
  ]
};
