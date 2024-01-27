// routes/newsletterRoutes.js
const express = require('express');
const NewsletterController = require('../controllers/NewsletterController');
const router = express.Router();

router.post('/subscribe', NewsletterController.subscribe);

module.exports = router;
