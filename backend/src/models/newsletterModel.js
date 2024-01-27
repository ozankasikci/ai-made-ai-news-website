// models/NewsletterModel.js
const { db } = require('../../db/db'); // Adjust this path to your actual database file

class NewsletterModel {
    static subscribe(email) {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO newsletter_subscribers (email) VALUES (?)`;
            db.run(sql, [email], function(err) {
                if (err) reject(err);
                else resolve({ id: this.lastID, email });
            });
        });
    }
}

module.exports = NewsletterModel;
