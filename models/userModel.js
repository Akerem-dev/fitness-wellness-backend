// backend_ready/models/userModel.js
const bcrypt = require("bcryptjs");

/**
 * Bu fonksiyon, kontrolcü (controller) içinden şu şekilde çağrılacak:
 *   const user = await User.findByEmail(email);
 *   if (!user) ...
 *
 * Bu nedenle `findByEmail` async/await döndürür.
 */
const User = {
  // 1) E-posta ile kullanıcı ara
  findByEmail: async (email) => {
    const connection = await require("../config/db").initMySQL();
    const [rows] = await connection.execute(
      "SELECT id, full_name AS fullName, email, password FROM users WHERE email = ?",
      [email]
    );
    // Eğer kullanıcı yoksa boş dizi dönecektir; bu nedenle rows[0] diyebiliriz
    return rows[0] || null;
  },

  // 2) Yeni kullanıcı oluşturma (hash işlemi de burada)
  create: async ({ firstName, lastName, email, password }) => {
    const connection = await require("../config/db").initMySQL();
    const full_name = `${firstName} ${lastName}`.trim();

    // Şifreyi hash’le
    const hashed = await bcrypt.hash(password, 10);

    const [result] = await connection.execute(
      "INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)",
      [full_name, email, hashed]
    );
    // result.insertId yeni eklenen kullanıcının ID’sidir
    return {
      id: result.insertId,
      fullName: full_name,
      email,
    };
  },

  // 3) Tüm kullanıcıları listeleme (örnek olarak kullanılıyor)
  findAll: async () => {
    const connection = await require("../config/db").initMySQL();
    const [rows] = await connection.query(
      "SELECT id, full_name AS fullName, email, created_at AS createdAt FROM users"
    );
    return rows;
  },

  // 4) Aktif üyeler: created_at + 30 gün > NOW()
  findActive: async () => {
    const connection = await require("../config/db").initMySQL();
    const [rows] = await connection.query(
      `
      SELECT 
        id,
        full_name AS fullName,
        DATE_FORMAT(created_at, '%Y-%m-%d') AS signupDate,
        DATE_FORMAT(DATE_ADD(created_at, INTERVAL 30 DAY), '%Y-%m-%d') AS expiryDate
      FROM users
      WHERE DATE_ADD(created_at, INTERVAL 30 DAY) >= NOW()
      `
    );
    return rows;
  },
};

module.exports = User;
