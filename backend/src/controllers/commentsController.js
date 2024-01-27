// commentsController.js
const CommentModel = require('../models/commentModel'); // Adjust the path according to your project structure

const commentsController = {
    addComment: async (req, res) => {
        const { postId } = req.params;
        const { text } = req.body; // Assume userId comes from session or body
        const userId = req.session.userId;

        try {
            const commentId = await CommentModel.addComment({ postId, userId, text });
            res.redirect(`/posts/${postId}`);
        } catch (error) {
            console.error(error); 
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
    },

    deleteComment: async (req, res) => {
        const { commentId } = req.params;
        const userId = req.session.userId; // Assuming userId is stored in session upon login

        try {
            const result = await CommentModel.deleteComment({ commentId, userId });
            if (result > 0) {
                res.redirect('back');
            } else {
                res.status(403).json({ message: "Unauthorized or comment not found" });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = commentsController;
