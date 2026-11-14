"use strict";

var path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

var ROOT_DIR = path.join(__dirname, "..");

module.exports = {
  PORT: Number(process.env.PORT) || 3000,
  MONGODB_URI: process.env.MONGODB_URI || "",
  ROOT_DIR: ROOT_DIR,
  PUBLIC_DIR: path.join(ROOT_DIR, "public"),
  BCRYPT_ROUNDS: 10
};
