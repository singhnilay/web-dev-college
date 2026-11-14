"use strict";

var express = require("express");
var postsController = require("../controllers/postsController");
var requireValidId = require("../middleware/httpError").requireValidId;

var router = express.Router();

router.get("/", postsController.listPosts);
router.get("/:id", requireValidId, postsController.getPost);
router.post("/", postsController.createPost);
router.put("/:id", requireValidId, postsController.updatePost);
router.delete("/:id", requireValidId, postsController.deletePost);

module.exports = router;
