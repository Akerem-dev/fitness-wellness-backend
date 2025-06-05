// backend/models/userProfileModel.js
const db = require('../config/db')  // knex instance

module.exports = {
    getByUserId: (userId) =>
        db('users')
            .select('id', 'full_name', 'email', 'age', 'height', 'weight', 'goal')
            .where({ id: userId })
            .first(),

    upsertProfile: ({ userId, age, height, weight, goal }) =>
        db('users')
            .where({ id: userId })
            .update({ age, height, weight, goal })
            .then(count => {
                if (count === 0) {
                    // Eğer kayıt yoksa insert
                    return db('users').insert({ id: userId, age, height, weight, goal });
                }
            })
};
