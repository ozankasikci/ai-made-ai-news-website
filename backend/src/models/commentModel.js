// models/CommentModel.js
const { db } = require('../../db/db'); // Adjust the path according to your project structure

class CommentModel {
    static findByPostId(postId) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM comments WHERE post_id = ?`;
            db.all(sql, [postId], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    static addComment({ postId, userId, text }) {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO comments (post_id, user_id, text) VALUES (?, ?, ?)`;
            db.run(sql, [postId, userId, text], function(err) {
                if (err) reject(err);
                else resolve(this.lastID);
            });
        });
    }
}

module.exports = CommentModel;
