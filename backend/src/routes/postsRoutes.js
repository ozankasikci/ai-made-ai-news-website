const express = require('express');
const postsController = require('../controllers/postsController');
const authController = require('../controllers/authController');
const commentsController = require('../controllers/commentsController');
const router = express.Router();

router.get('/posts/:id', authController.setCommonSessionDataToLocals, postsController.getPostById);
router.get('/', authController.setCommonSessionDataToLocals, postsController.getHome);
router.post('/posts/:postId/comments', authController.ensureAuth, commentsController.addComment);

module.exports = router;
