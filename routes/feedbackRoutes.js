// backend_ready/routes/feedbackRoutes.js
const express = require("express");
const router = express.Router();
const { getAll, create } = require("../controllers/feedbackController");

// GET all reviews
router.get("/", getAll);

// POST new review
router.post("/", create);

module.exports = router;
