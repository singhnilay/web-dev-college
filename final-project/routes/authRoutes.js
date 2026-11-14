"use strict";

var express = require("express");
var authController = require("../controllers/authController");
var auth = require("../middleware/auth");

var router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", auth.requireAuth, authController.me);
router.post("/logout", authController.logout);

module.exports = router;
