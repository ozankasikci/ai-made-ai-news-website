// commentsController.js
const CommentModel = require('../models/CommentModel'); // Adjust the path according to your project structure

const commentsController = {
    addComment: async (req, res) => {
        const { postId } = req.params;
        const { userId, text } = req.body; // Assume userId comes from session or body

        try {
            const commentId = await CommentModel.addComment({ postId, userId, text });
            res.status(201).json({ message: 'Comment added successfully', commentId });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getCommentsByPost: async (req, res) => {
        const { postId } = req.params;

        try {
            const comments = await CommentModel.findByPostId(postId);
            res.json({ comments });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = commentsController;
