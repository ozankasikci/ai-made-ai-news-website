// commentsRouter.js
const express = require('express');
const commentsController = require('../controllers/commentsController');
const router = express.Router();

router.post('/posts/:postId/comments', commentsController.addComment);
router.get('/posts/:postId/comments', commentsController.getCommentsByPost);
router.post('/posts/:postId/comments/:commentId/delete', commentsController.deleteComment);

module.exports = router;
