// models/commentModel.js
const { db } = require('../../db/db'); // Adjust the path according to your project structure

const CommentModel = {
    findByPostId: (postId) => {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM comments WHERE post_id = ?`;
            db.all(sql, [postId], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(rows);
            });
        });
    },

    // You can add more comment-related database operations here
};

module.exports = CommentModel;
