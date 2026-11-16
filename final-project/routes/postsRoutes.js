"use strict";

var express = require("express");
var postsController = require("../controllers/postsController");
var commentsController = require("../controllers/commentsController");
var requireValidId = require("../middleware/httpError").requireValidId;
var auth = require("../middleware/auth");

var router = express.Router();

router.get("/", auth.optionalAuth, postsController.listPosts);
router.post("/", auth.requireAuth, postsController.createPost);

router.get("/:id/comments", requireValidId, auth.optionalAuth, commentsController.listForPost);
router.post("/:id/comments", requireValidId, auth.requireAuth, commentsController.createForPost);
router.post("/:id/upvote", requireValidId, auth.requireAuth, postsController.upvotePost);
router.delete("/:id/upvote", requireValidId, auth.requireAuth, postsController.removeUpvote);

router.get("/:id", requireValidId, auth.optionalAuth, postsController.getPost);
router.put("/:id", requireValidId, auth.requireAuth, auth.requirePostOwner, postsController.updatePost);
router.delete("/:id", requireValidId, auth.requireAuth, auth.requirePostOwner, postsController.deletePost);

module.exports = router;
