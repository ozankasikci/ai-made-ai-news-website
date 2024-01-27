const NewsletterModel = require('../models/newsletterModel');

class NewsletterController {
    static async subscribe(req, res) {
        const { email } = req.body;

        // Basic email validation
        if (!email || !email.includes('@')) {
            return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
        }

        try {
            await NewsletterModel.subscribe(email);
            res.json({ success: true, message: 'Thank you for subscribing to our newsletter!' });
        } catch (error) {
            // Handle unique constraint violation for duplicate emails
            if (error.message.includes('UNIQUE constraint failed')) {
                return res.status(409).json({ success: false, message: 'This email is already subscribed to our newsletter.' });
            }
            console.error(error);
            res.status(500).json({ success: false, message: 'An error occurred while processing your subscription.' });
        }
    }
}

module.exports = NewsletterController;
