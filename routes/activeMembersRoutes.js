// backend_ready/routes/activeMembersRoutes.js
const express = require("express");
const router = express.Router();
const ActiveMembersController = require("../controllers/activeMembersController");

// GET /api/active-members
router.get("/", ActiveMembersController.list);

module.exports = router;
