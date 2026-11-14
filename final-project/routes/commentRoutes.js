"use strict";

var express = require("express");
var commentController = require("../controllers/commentController");
var auth = require("../middleware/auth");

var router = express.Router();

router.put("/:id", auth.requireAuth, auth.requireCommentOwner, commentController.updateComment);
router.delete("/:id", auth.requireAuth, auth.requireCommentOwner, commentController.deleteComment);

module.exports = router;
