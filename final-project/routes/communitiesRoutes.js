"use strict";

var express = require("express");
var communitiesController = require("../controllers/communitiesController");
var requireValidId = require("../middleware/httpError").requireValidId;
var auth = require("../middleware/auth");

var router = express.Router();

router.get("/", communitiesController.listCommunities);
router.get("/:id", requireValidId, communitiesController.getCommunity);
router.post("/", auth.requireAuth, communitiesController.createCommunity);
router.put("/:id", requireValidId, auth.requireAuth, communitiesController.updateCommunity);
router.delete("/:id", requireValidId, auth.requireAuth, communitiesController.deleteCommunity);

module.exports = router;
