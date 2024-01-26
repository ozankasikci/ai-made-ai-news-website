const express = require('express');
const postsController = require('../controllers/postsController');
const router = express.Router();

router.get('/posts', postsController.getAllPosts);
router.post('/posts', postsController.createPost);
router.get('/posts/:id', postsController.getPostById);
router.get('/', postsController.getHome);

module.exports = router;
