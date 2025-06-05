// backend_ready/models/bookingModel.js
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    user: {
        type: String, // MySQL’den gelen userId’i string olarak
        required: true,
    },
    trainerId: {
        type: String, // MySQL’den gelen trainerId
        required: true,
    },
    trainerName: {
        type: String, // Trainer’ın adı (frontend’den gönderilecek)
        required: true,
    },
    date: {
        type: String, // "2025-06-10"
        required: true,
    },
    time: {
        type: String, // "18:00"
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "confirmed", "cancelled"],
        default: "pending",
    },
});

module.exports = mongoose.model("Booking", bookingSchema);
