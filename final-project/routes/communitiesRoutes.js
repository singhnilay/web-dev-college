"use strict";

var express = require("express");
var communitiesController = require("../controllers/communitiesController");
var requireValidId = require("../middleware/httpError").requireValidId;

var router = express.Router();

router.get("/", communitiesController.listCommunities);
router.get("/:id", requireValidId, communitiesController.getCommunity);
router.post("/", communitiesController.createCommunity);
router.put("/:id", requireValidId, communitiesController.updateCommunity);
router.delete("/:id", requireValidId, communitiesController.deleteCommunity);

module.exports = router;
