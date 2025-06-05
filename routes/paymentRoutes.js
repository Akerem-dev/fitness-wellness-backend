// backend_ready/routes/paymentRoutes.js
const express = require("express");
const router = express.Router();

/**
 * POST /api/payments
 * body: { packageId }
 * Authorization: Bearer <token>
 *
 * Not: Gerçek bir ödeme altyapısı (Stripe, Braintree, vs.) entegre etmeniz gerekir.
 *     Bu örnek, sadece “başarılı” dönmek için mock olarak yazılmıştır.
 */
router.post("/", async (req, res) => {
    try {
        const userToken = req.headers.authorization?.split(" ")[1];
        if (!userToken) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Burada gerçek ödeme işlemine (Stripe vb.) istek atarsınız.
        // Biz direkt “başarılı” döneceğiz:
        return res.status(200).json({ success: true, message: "Payment successful" });
    } catch (err) {
        console.error("❌ [paymentRoutes] Hata:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
