"use strict";

var express = require("express");
var commentsController = require("../controllers/commentsController");
var requireValidId = require("../middleware/httpError").requireValidId;
var auth = require("../middleware/auth");

var router = express.Router();

router.get("/", commentsController.listComments);
router.get("/:id", requireValidId, commentsController.getComment);
router.post("/", auth.requireAuth, commentsController.createComment);
router.put("/:id", requireValidId, auth.requireAuth, auth.requireCommentOwner, commentsController.updateComment);
router.delete("/:id", requireValidId, auth.requireAuth, auth.requireCommentOwner, commentsController.deleteComment);

module.exports = router;
