// backend_ready/controllers/feedbackController.js
const { getAllReviews, createReview } = require("../models/feedbackModel");

exports.getAll = async (req, res) => {
    try {
        const rows = await getAllReviews();
        return res.json(rows);
    } catch (err) {
        console.error("❌ [feedbackController.getAll] Hata:", err);
        return res.status(500).json({
            success: false,
            message: "Could not load reviews.",
        });
    }
};

exports.create = async (req, res) => {
    try {
        const { username, rating, comment } = req.body;
        if (!username || !rating || !comment) {
            return res.status(400).json({
                success: false,
                message: "Missing fields: username, rating, comment are required.",
            });
        }
        const newReview = await createReview({ username, rating, comment });
        return res.status(201).json(newReview);
    } catch (err) {
        console.error("❌ [feedbackController.create] Hata:", err);
        return res.status(500).json({
            success: false,
            message: "Could not create review.",
        });
    }
};
