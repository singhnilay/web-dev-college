"use strict";

var express = require("express");
var commentsController = require("../controllers/commentsController");
var requireValidId = require("../middleware/httpError").requireValidId;

var router = express.Router();

router.get("/", commentsController.listComments);
router.get("/:id", requireValidId, commentsController.getComment);
router.post("/", commentsController.createComment);
router.put("/:id", requireValidId, commentsController.updateComment);
router.delete("/:id", requireValidId, commentsController.deleteComment);

module.exports = router;
