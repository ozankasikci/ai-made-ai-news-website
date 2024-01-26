const express = require('express');
const postsRoutes = require('./routes/postsRoutes');
const authRoutes = require('./routes/authRoutes');
const config = require('./config');
const path = require('path');
const app = express();

// Middleware for parsing JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/../../frontend/static')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/../../frontend/src', 'views'));

// Initialize routes
app.use('/auth', authRoutes); // Prefix all auth routes with /auth
app.use(postsRoutes);

// Start server
app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
});
