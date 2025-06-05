// rehash.js
const bcrypt = require('bcryptjs')
const mysql = require('mysql2')
require('dotenv').config()

// db.js ile aynı ayarları kullan
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
})

db.connect(err => {
    if (err) throw err
    console.log('✅ DB’ye bağlanıldı, rehash başlıyor…')
    db.query('SELECT id, password FROM users', async (err, rows) => {
        if (err) throw err
        for (const { id, password: plain } of rows) {
            // zaten bcrypt hash’lenmişse atla
            if (typeof plain === 'string' && plain.startsWith('$2')) continue
            const hash = await bcrypt.hash(plain, 10)
            await new Promise((res, rej) => {
                db.query('UPDATE users SET password = ? WHERE id = ?', [hash, id], e => e ? rej(e) : res())
            })
            console.log(`🔄 User ID ${id} güncellendi`)
        }
        console.log('🎉 Tüm şifreler güncellendi, çıkılıyor.')
        db.end()
    })
})
