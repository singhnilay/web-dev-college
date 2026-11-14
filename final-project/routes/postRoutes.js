"use strict";

var express = require("express");
var postController = require("../controllers/postController");

var router = express.Router();

router.post("/", postController.createPost);

module.exports = router;
