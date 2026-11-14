"use strict";

var mongoose = require("mongoose");

function getHealth(req, res) {
  var connected = mongoose.connection.readyState === 1;
  res.status(connected ? 200 : 503).json({
    ok: connected,
    status: connected ? "running" : "database_disconnected",
    service: "The Common Room",
    database: connected ? "connected" : "disconnected"
  });
}

module.exports = {
  getHealth: getHealth
};
