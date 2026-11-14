"use strict";

var bcrypt = require("bcryptjs");
var config = require("../config");
var jsonStore = require("./jsonStore");

var BCRYPT_PREFIX = /^\$2[aby]\$\d{2}\$/;

function isHashed(value) {
  return typeof value === "string" && BCRYPT_PREFIX.test(value);
}

function readUsers() {
  return jsonStore.readJsonArray(config.USERS_FILE);
}

function findByEmail(email) {
  var needle = String(email || "").trim().toLowerCase();
  return readUsers().find(function (user) {
    return String(user.email || "").toLowerCase() === needle;
  });
}

function hashPassword(plain) {
  return bcrypt.hash(plain, config.BCRYPT_ROUNDS);
}

function passwordsMatch(plain, stored) {
  if (isHashed(stored)) {
    return bcrypt.compare(plain, stored);
  }
  return Promise.resolve(stored === plain);
}

function createUser(record) {
  return jsonStore.appendJsonRecord(config.USERS_FILE, record);
}

function hashLegacyPasswords() {
  var users = readUsers();
  var pending = [];
  var changed = false;

  users.forEach(function (user, index) {
    if (isHashed(user.password)) return;
    changed = true;
    pending.push(
      hashPassword(String(user.password || "")).then(function (hash) {
        users[index].password = hash;
      })
    );
  });

  if (!changed) return Promise.resolve(false);

  return Promise.all(pending).then(function () {
    jsonStore.writeJsonArray(config.USERS_FILE, users);
    return true;
  });
}

function upgradePasswordIfNeeded(email, plain, stored) {
  if (isHashed(stored)) return Promise.resolve();

  return hashPassword(plain).then(function (hash) {
    var users = readUsers();
    var needle = String(email || "").trim().toLowerCase();
    var updated = false;
    users.forEach(function (user) {
      if (String(user.email || "").toLowerCase() === needle && !isHashed(user.password)) {
        user.password = hash;
        updated = true;
      }
    });
    if (updated) jsonStore.writeJsonArray(config.USERS_FILE, users);
  });
}

module.exports = {
  readUsers: readUsers,
  findByEmail: findByEmail,
  hashPassword: hashPassword,
  passwordsMatch: passwordsMatch,
  createUser: createUser,
  hashLegacyPasswords: hashLegacyPasswords,
  upgradePasswordIfNeeded: upgradePasswordIfNeeded
};
