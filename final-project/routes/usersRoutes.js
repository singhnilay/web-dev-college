"use strict";

var express = require("express");
var usersController = require("../controllers/usersController");
var requireValidId = require("../middleware/httpError").requireValidId;

var router = express.Router();

router.get("/", usersController.listUsers);
router.get("/:id", requireValidId, usersController.getUser);
router.post("/", usersController.createUser);
router.patch("/:id", requireValidId, usersController.updateUser);
router.delete("/:id", requireValidId, usersController.deleteUser);

module.exports = router;
