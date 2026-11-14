"use strict";

var express = require("express");
var loginController = require("../controllers/loginController");

var router = express.Router();

router.post("/", loginController.login);

module.exports = router;
