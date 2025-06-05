// backend_ready/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { initMySQL } = require("./config/db"); // promise tabanlı initMySQL

const app = express();

// 1) Body-parser (JSON ve URL-encoded)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2) CORS
app.use(cors());

// 3) MongoDB Bağlantısı (booking için; eğer booking yapmıyorsanız bu kısmı çıkarabilirsiniz)
if (process.env.MONGO_URI) {
  mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ MongoDB bağlantısı başarılı"))
    .catch((err) => console.error("❌ MongoDB bağlantı hatası:", err));
}

// 4) MySQL Bağlantısı
async function connectMySQL() {
  try {
    const conn = await initMySQL();
    // Promise tabanlı bağlantıyı app.locals.mysql’e depo edelim
    app.locals.mysql = conn;
  } catch (err) {
    console.error("❌ MySQL bağlantı hatası:", err);
    process.exit(1);
  }
}

// 5) Route’ları başlat
async function startServer() {
  await connectMySQL();

  // 5.a) Route dosyalarını import et
  const userRoutes = require("./routes/userRoutes");
  const profileRoutes = require("./routes/profileRoutes");
  const activeMembersRoutes = require("./routes/activeMembersRoutes");
  const bookingRoutes = require("./routes/bookingRoutes");
  const feedbackRoutes = require("./routes/feedbackRoutes");
  const packageRoutes = require("./routes/packageRoutes");
  const paymentRoutes = require("./routes/paymentRoutes");

  // 5.b) Mount et
  app.use("/api/user", userRoutes);
  app.use("/api/profile", profileRoutes);
  app.use("/api/active-members", activeMembersRoutes);
  app.use("/api/bookings", bookingRoutes);
  app.use("/api/feedback", feedbackRoutes);
  app.use("/api/packages", packageRoutes);
  app.use("/api/payments", paymentRoutes);

  // 404 Handler
  app.use((req, res, next) => {
    res.status(404).json({ success: false, message: "Route bulunamadı." });
  });

  // Global Error Handler
  app.use((err, req, res, next) => {
    console.error("🌐 Global Hata Yakalayıcı:", err);
    res.status(err.status || 500).json({
      success: false,
      message: err.message || "Sunucu tarafında bir hata oluştu.",
    });
  });

  // Sunucuyu başlat
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  });
}

// 6) Başlat
startServer();
