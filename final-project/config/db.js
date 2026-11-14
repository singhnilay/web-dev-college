"use strict";

var mongoose = require("mongoose");
var config = require("./index");

function attachConnectionEvents() {
  if (mongoose.connection.listenerCount("connected") > 0) return;

  mongoose.connection.on("connected", function () {
    console.log("MongoDB Atlas connected.");
  });

  mongoose.connection.on("error", function (err) {
    console.error("MongoDB connection error:");
    console.error(err.message || err);
  });

  mongoose.connection.on("disconnected", function () {
    console.error("MongoDB disconnected.");
  });
}

function connectDb() {
  if (!config.MONGODB_URI) {
    return Promise.reject(new Error("MONGODB_URI is not set. Copy .env.example to .env and add your Atlas URI."));
  }

  attachConnectionEvents();
  return mongoose.connect(config.MONGODB_URI);
}

module.exports = connectDb;
