"use strict";

var express = require("express");
var signupController = require("../controllers/signupController");

var router = express.Router();

router.post("/", signupController.signup);

module.exports = router;
