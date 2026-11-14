"use strict";

var express = require("express");
var userController = require("../controllers/userController");
var auth = require("../middleware/auth");

var router = express.Router();

router.get("/:id", auth.optionalAuth, userController.getUser);
router.put("/:id", auth.requireAuth, auth.requireSelf, userController.updateUser);

module.exports = router;
