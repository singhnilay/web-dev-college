"use strict";

function getHealth(req, res) {
  res.status(200).json({
    ok: true,
    status: "running",
    service: "The Common Room"
  });
}

module.exports = {
  getHealth: getHealth
};
