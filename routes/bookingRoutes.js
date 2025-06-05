// backend_ready/routes/bookingRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { createBooking, getMyBookings } = require("../controllers/bookingController");

// POST /api/bookings → Yeni rezervasyon ekle
router.post("/", authMiddleware, createBooking);

// GET /api/bookings/me → Giriş yapan kullanıcının rezervasyonları
router.get("/me", authMiddleware, getMyBookings);

module.exports = router;
