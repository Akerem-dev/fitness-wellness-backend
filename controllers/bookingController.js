// backend_ready/controllers/bookingController.js
const Booking = require("../models/bookingModel");

/**
 * POST /api/bookings
 * body: { trainerId, trainerName, date, time }
 * Authorization: Bearer <token>
 */
exports.createBooking = async (req, res) => {
    try {
        const userId = String(req.user.id); // authMiddleware’dan gelen MySQL user ID
        const { trainerId, trainerName, date, time } = req.body;

        if (!trainerId || !trainerName || !date || !time) {
            return res.status(400).json({ success: false, message: "Eksik alanlar." });
        }

        // Aynı eğitmen – tarih – saat kontrolü
        const existing = await Booking.findOne({ trainerId, date, time });
        if (existing) {
            return res
                .status(409)
                .json({ success: false, message: "Bu slot zaten dolu." });
        }

        const newBooking = new Booking({
            user: userId,
            trainerId: String(trainerId),
            trainerName: String(trainerName),
            date,
            time,
            status: "pending",
        });
        await newBooking.save();

        return res.status(201).json({ success: true, booking: newBooking });
    } catch (err) {
        console.error("❌ [bookingController.createBooking] Hata:", err);
        return res
            .status(500)
            .json({ success: false, message: "Rezervasyon oluşturulamadı." });
    }
};

/**
 * GET /api/bookings/me
 * Authorization: Bearer <token>
 * Girişli kullanıcının rezervasyonlarını döner
 */
exports.getMyBookings = async (req, res) => {
    try {
        const userId = String(req.user.id);
        const myBookings = await Booking.find({ user: userId }).sort({ date: 1, time: 1 });
        return res.json({ success: true, bookings: myBookings });
    } catch (err) {
        console.error("❌ [bookingController.getMyBookings] Hata:", err);
        return res
            .status(500)
            .json({ success: false, message: "Rezervasyonlar alınamadı." });
    }
};
