const express = require('express');
const postsController = require('../controllers/postsController');
const authController = require('../controllers/authController');
const router = express.Router();

router.get('/posts/:id', authController.setCommonSessionDataToLocals, postsController.getPostById);
router.get('/', authController.setCommonSessionDataToLocals, postsController.getHome);

module.exports = router;
