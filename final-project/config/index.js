"use strict";

var path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

var ROOT_DIR = path.join(__dirname, "..");

function requiredEnv(name) {
  var value = process.env[name];
  if (!value) {
    throw new Error("Missing required environment variable: " + name);
  }
  return value;
}

module.exports = {
  PORT: Number(process.env.PORT) || 3000,
  NODE_ENV: process.env.NODE_ENV || "development",
  MONGODB_URI: process.env.MONGODB_URI || "",
  ROOT_DIR: ROOT_DIR,
  PUBLIC_DIR: path.join(ROOT_DIR, "public"),
  BCRYPT_ROUNDS: Number(process.env.BCRYPT_ROUNDS) || 10,
  JWT_SECRET: requiredEnv("JWT_SECRET"),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "2h",
  AUTH_COOKIE_NAME: process.env.AUTH_COOKIE_NAME || "tcr_token",
  COMMUNITIES: [
    "Campus Life",
    "Academics",
    "Events",
    "Memes",
    "Opportunities",
    "Questions"
  ]
};
