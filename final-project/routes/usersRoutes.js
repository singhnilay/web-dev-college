"use strict";

var express = require("express");
var usersController = require("../controllers/usersController");
var requireValidId = require("../middleware/httpError").requireValidId;
var auth = require("../middleware/auth");

var router = express.Router();

router.get("/", usersController.listUsers);
router.get("/:id", requireValidId, auth.optionalAuth, usersController.getUser);
router.post("/", usersController.createUser);
router.put("/:id", requireValidId, auth.requireAuth, auth.requireSelf, usersController.updateUser);
router.patch("/:id", requireValidId, auth.requireAuth, auth.requireSelf, usersController.updateUser);
router.delete("/:id", requireValidId, auth.requireAuth, auth.requireSelf, usersController.deleteUser);

module.exports = router;
