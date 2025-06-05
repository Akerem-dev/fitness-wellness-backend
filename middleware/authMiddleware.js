// backend_ready/middleware/authMiddleware.js
require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

module.exports = async function (req, res, next) {
    try {
        // 1) Authorization header: “Bearer <token>” şeklinde gönderiliyor.
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token provided." });
        }

        const token = authHeader.split(" ")[1];
        // 2) Token’ı doğrula
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // 3) Kullanıcı id’sini çıkar
        const userId = decoded.id;
        // 4) MySQL’den kullanıcıyı sorgula
        const user = await User.findByEmail(decoded.email);
        if (!user) {
            return res.status(401).json({ message: "Token geçersiz." });
        }
        // 5) req.user altına minimal bilgi koy
        req.user = {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
        };
        next();
    } catch (err) {
        console.error("AuthMiddleware hata:", err);
        return res.status(401).json({ message: "Authentication failed." });
    }
};
