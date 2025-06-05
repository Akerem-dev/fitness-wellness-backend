// backend_ready/routes/userRoutes.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const authMiddleware = require("../middleware/authMiddleware");
require("dotenv").config();

const router = express.Router();

/**
 * POST /api/user/register
 * body: { firstName, lastName, email, password }
 */
router.post("/register", async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        // Basit validasyon
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ message: "Tüm alanları doldurun." });
        }

        // 1) Aynı email zaten varsa engelle
        const existing = await User.findByEmail(email);
        if (existing) {
            return res.status(409).json({ message: "Bu e-posta zaten kullanılıyor." });
        }

        // 2) Yeni kullanıcı oluştur
        const newUser = await User.create({ firstName, lastName, email, password });
        // 3) JWT oluştur (örneğin 1 gün geçmeli)
        const token = jwt.sign(
            { id: newUser.id, email: newUser.email },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        return res.status(201).json({
            fullName: newUser.fullName,
            email: newUser.email,
            token,
        });
    } catch (err) {
        console.error("❌ [userRoutes.register] Hata:", err);
        return res.status(500).json({ message: "Kayıt sırasında hata oluştu." });
    }
});

/**
 * POST /api/user/login
 * body: { email, password }
 */
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        // Validasyon
        if (!email || !password) {
            return res.status(400).json({ message: "Email ve şifre gereklidir." });
        }

        // 1) DB’den kullanıcıyı çek
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({ message: "Email veya şifre yanlış." });
        }

        // 2) Şifreyi karşılaştır
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ message: "Email veya şifre yanlış." });
        }

        // 3) JWT oluştur
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        return res.json({
            fullName: user.fullName,
            email: user.email,
            token,
        });
    } catch (err) {
        console.error("❌ [userRoutes.login] Hata:", err);
        return res.status(500).json({ message: "Giriş sırasında hata oluştu." });
    }
});

/**
 * GET /api/user/me
 * Authorization: Bearer <token>
 */
router.get("/me", authMiddleware, (req, res) => {
    // authMiddleware zaten req.user’a { id, email, fullName } koydu
    // Biz sadece client’a dönüyoruz
    res.json({
        id: req.user.id,
        fullName: req.user.fullName,
        email: req.user.email,
    });
});

module.exports = router;
