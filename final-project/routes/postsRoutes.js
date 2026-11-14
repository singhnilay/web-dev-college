"use strict";

var express = require("express");
var postsController = require("../controllers/postsController");
var requireValidId = require("../middleware/httpError").requireValidId;
var auth = require("../middleware/auth");

var router = express.Router();

router.get("/", auth.optionalAuth, postsController.listPosts);
router.get("/:id", requireValidId, auth.optionalAuth, postsController.getPost);
router.post("/", auth.requireAuth, postsController.createPost);
router.put("/:id", requireValidId, auth.requireAuth, auth.requirePostOwner, postsController.updatePost);
router.delete("/:id", requireValidId, auth.requireAuth, auth.requirePostOwner, postsController.deletePost);

module.exports = router;
