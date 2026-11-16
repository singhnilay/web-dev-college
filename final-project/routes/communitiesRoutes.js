"use strict";

var express = require("express");
var communitiesController = require("../controllers/communitiesController");
var requireValidId = require("../middleware/httpError").requireValidId;
var auth = require("../middleware/auth");

var router = express.Router();

router.get("/", auth.optionalAuth, communitiesController.listCommunities);
router.post("/", auth.requireAuth, communitiesController.createCommunity);

router.get("/:id/posts", requireValidId, auth.optionalAuth, communitiesController.listCommunityPosts);
router.post("/:id/join", requireValidId, auth.requireAuth, communitiesController.joinCommunity);
router.delete("/:id/join", requireValidId, auth.requireAuth, communitiesController.leaveCommunity);

router.get("/:id", requireValidId, auth.optionalAuth, communitiesController.getCommunity);
router.put("/:id", requireValidId, auth.requireAuth, communitiesController.updateCommunity);
router.delete("/:id", requireValidId, auth.requireAuth, communitiesController.deleteCommunity);

module.exports = router;
