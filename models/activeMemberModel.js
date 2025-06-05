// backend_ready/models/activeMemberModel.js
const { initMySQL } = require("../config/db");

const ActiveMember = {
    // Tüm aktif üyeleri çek
    getAll: async () => {
        const connection = await initMySQL();
        const [rows] = await connection.query(
            `SELECT
         am.id,
         am.user_id AS userId,
         am.name,
         am.membershipType,
         DATE_FORMAT(am.startDate, '%Y-%m-%d') AS startDate,
         DATE_FORMAT(am.endDate, '%Y-%m-%d') AS endDate
       FROM active_members am
       JOIN users u
         ON u.id = am.user_id
       ORDER BY am.startDate DESC`
        );
        return rows;
    },

    // Yeni aktif üye ekle
    create: async ({ userId, name, membershipType, startDate, endDate }) => {
        const connection = await initMySQL();
        const [result] = await connection.query(
            `INSERT INTO active_members (user_id, name, membershipType, startDate, endDate)
       VALUES (?, ?, ?, ?, ?)`,
            [userId, name, membershipType, startDate, endDate]
        );
        return result.insertId;
    },
};

module.exports = ActiveMember;
