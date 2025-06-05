// backend_ready/routes/packageRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { purchase } = require("../controllers/packageController");

// POST /api/packages/purchase
router.post("/purchase", authMiddleware, purchase);

module.exports = router;
