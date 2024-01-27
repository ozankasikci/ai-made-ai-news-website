// commentsController.js
const db = require('../../db/db'); // Update the path as per your project structure

const commentsController = {
    addComment: (req, res) => {
        const { postId } = req.params;
        const { userId, text } = req.body; // Assume userId comes from session or body

        const sql = `INSERT INTO comments (post_id, user_id, text) VALUES (?, ?, ?)`;

        db.run(sql, [postId, userId, text], function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.status(201).json({ message: 'Comment added successfully', commentId: this.lastID });
        });
    },

    getCommentsByPost: (req, res) => {
        const { postId } = req.params;

        const sql = `SELECT * FROM comments WHERE post_id = ?`;

        db.all(sql, [postId], (err, comments) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ comments });
        });
    }
};

module.exports = commentsController;
