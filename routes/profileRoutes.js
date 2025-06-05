// backend_ready/routes/profileRoutes.js
const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// Örnek: GET /api/profile/me → Kayıtlı kullanıcının detaylarını döner
router.get("/me", authMiddleware, (req, res) => {
    res.json({
        id: req.user.id,
        fullName: req.user.fullName,
        email: req.user.email,
    });
});

// Buraya “profil güncelleme”, “şifre sıfırlama” vb. ekleyebilirsiniz.

module.exports = router;
