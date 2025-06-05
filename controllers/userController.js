// controllers/userController.js
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

// Tüm kullanıcıları listele
exports.getAllUsers = (req, res) => {
  User.findAll((err, results) => {
    if (err) return res.status(500).json({ success: false, error: err });
    res.json(results);
  });
};

// Yeni üyelik (signup)
exports.signup = (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName || !email || !password) {
    return res
      .status(400)
      .json({ success: false, message: 'Lütfen tüm alanları doldurun.' });
  }

  User.findByEmail(email, (err, rows) => {
    if (err) return res.status(500).json({ success: false, error: err });
    if (rows.length) {
      return res
        .status(409)
        .json({ success: false, message: 'Bu e-posta zaten kayıtlı.' });
    }

    User.create({ firstName, lastName, email, password }, (err, result) => {
      if (err) return res.status(500).json({ success: false, error: err });
      res
        .status(201)
        .json({ success: true, message: 'Kullanıcı oluşturuldu.', id: result.insertId });
    });
  });
};

// Giriş (login)
exports.login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: 'E-posta ve şifre girin.' });
  }

  User.findByEmail(email, async (err, rows) => {
    if (err) return res.status(500).json({ success: false, error: err });
    if (!rows.length) {
      return res
        .status(401)
        .json({ success: false, message: 'E-posta bulunamadı.' });
    }

    const user = rows[0];
    try {
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res
          .status(401)
          .json({ success: false, message: 'Yanlış şifre.' });
      }
      // Başarılı giriş
      res.json({
        success: true,
        id: user.id,
        fullName: user.full_name
      });
    } catch (cmpErr) {
      console.error(cmpErr);
      res.status(500).json({ success: false, message: 'Giriş hatası.' });
    }
  });
};

// Aktif üyeler
exports.getActiveMembers = (req, res) => {
  User.findActive((err, rows) => {
    if (err) return res.status(500).json({ success: false, error: err });
    res.json(rows);
  });
};
