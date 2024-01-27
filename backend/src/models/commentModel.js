// models/CommentModel.js
const { db } = require('../../db/db'); // Adjust the path according to your project structure

class CommentModel {
    static findByPostId(postId) {
        return new Promise((resolve, reject) => {
            const sql = `
        SELECT comments.*, users.username, comments.deleted 
        FROM comments 
        JOIN users ON comments.user_id = users.id 
        WHERE comments.post_id = ?`;
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

    static deleteComment({ commentId, userId }) {
        return new Promise((resolve, reject) => {
            const sql = `UPDATE comments SET deleted = 1 WHERE id = ? AND user_id = ?`;
            db.run(sql, [commentId, userId], function(err) {
                if (err) reject(err);
                else resolve(this.changes); // this.changes indicates how many rows were affected
            });
        });
    }    
    
}

module.exports = CommentModel;
