// backend/controllers/profileController.js
const Profile = require('../models/userProfileModel');

exports.getProfile = async (req, res, next) => {
    try {
        const userId = req.user.id; // authMiddleware’le gelmiş
        const profile = await Profile.getByUserId(userId);
        res.json(profile);
    } catch (err) {
        next(err);
    }
};

exports.updateProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { age, height, weight, goal } = req.body;
        if (!age || !height || !weight || !goal) {
            return res.status(400).json({ error: 'All fields are required.' });
        }
        await Profile.upsertProfile({ userId, age, height, weight, goal });
        const updated = await Profile.getByUserId(userId);
        res.json(updated);
    } catch (err) {
        next(err);
    }
};
