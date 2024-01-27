// commentsRouter.js
const express = require('express');
const commentsController = require('../controllers/commentsController');
const router = express.Router();

// Route to add a comment to a post
router.post('/posts/:postId/comments', commentsController.addComment);

// Route to get comments for a post
router.get('/posts/:postId/comments', commentsController.getCommentsByPost);

module.exports = router;
