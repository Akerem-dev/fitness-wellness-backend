// backend_ready/models/feedbackModel.js
/**
 * Eğer direkt MySQL sorgusu yapmak isterseniz:
 * connection.query(...) veya connection.execute(...) şeklinde yapabilirsiniz.
 *
 * Ancak controller içinde zaten `req.app.locals.mysql` var. O yüzden burada
 * basitçe fonksiyonları export etmek yerine, controller içinde doğrudan sorgu atıyoruz.
 *
 * Bu dosya tamamen isteğe bağlıdır. Aşağıdaki örnek bir model gövdesidir,
 * fakat controller’da benzer SQL’i doğrudan yazmayı tercih edeceğiz.
 */

const getAllReviews = async () => {
  const connection = await require("../config/db").initMySQL();
  const [rows] = await connection.query(`
    SELECT
      id,
      username,
      rating,
      comment
    FROM reviews
    ORDER BY id DESC
  `);
  return rows;
};

const createReview = async ({ username, rating, comment }) => {
  const connection = await require("../config/db").initMySQL();
  const [result] = await connection.execute(
    "INSERT INTO reviews (username, rating, comment) VALUES (?, ?, ?)",
    [username, rating, comment]
  );
  // Eklenen kaydın id’sini dönebiliriz
  const [newRows] = await connection.query(
    "SELECT id, username, rating, comment FROM reviews WHERE id = ?",
    [result.insertId]
  );
  return newRows[0];
};

module.exports = { getAllReviews, createReview };
