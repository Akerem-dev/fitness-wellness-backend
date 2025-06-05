// backend_ready/controllers/packageController.js
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.purchase = async (req, res) => {
  try {
    // authMiddleware zaten req.user’a id/email koydu
    const userId = req.user.id;
    const { packageId, membershipType } = req.body;

    if (!packageId || !membershipType) {
      return res.status(400).json({ success: false, message: "Eksik alanlar." });
    }

    // Bugünün tarihi ve +30 gün sonrasını hesapla
    const today = new Date();
    const startDate = today.toISOString().slice(0, 10); // YYYY-MM-DD
    const durationDays = 30;
    const endDateObj = new Date(today.getTime() + durationDays * 24 * 60 * 60 * 1000);
    const endDate = endDateObj.toISOString().slice(0, 10);

    const connection = req.app.locals.mysql;
    const [result] = await connection.execute(
      `INSERT INTO active_members (user_id, name, membershipType, startDate, endDate)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, req.user.fullName, membershipType, startDate, endDate]
    );

    return res.status(201).json({
      success: true,
      message: "Package purchased, you are now an active member.",
      activeMember: {
        id: result.insertId,
        userId,
        name: req.user.fullName,
        membershipType,
        startDate,
        endDate,
      },
    });
  } catch (err) {
    console.error("❌ [packageController.purchase] Hata:", err);
    return res.status(500).json({
      success: false,
      message: "Package purchase failed.",
    });
  }
};
