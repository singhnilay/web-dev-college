"use strict";

var express = require("express");
var authController = require("../controllers/authController");

var router = express.Router();

router.post("/", authController.register);

module.exports = router;
