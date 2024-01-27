const express = require('express');
const postsRoutes = require('./routes/postsRoutes');
const authRoutes = require('./routes/authRoutes');
const commentsRoutes = require('./routes/commentsRoutes'); 
const newsletterRoutes = require('./routes/newsletterRoutes');
const config = require('./config');
const path = require('path');
const app = express();
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);

app.use(session({
    store: new SQLiteStore({ db: 'session.sqlite' }), // Update the path as needed
    secret: 'your secret key', // Use a secure, unique secret key
    resave: false,
    saveUninitialized: false,
    cookie: { secure: 'auto' }
}));

// Middleware for parsing JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/../../frontend/static')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/../../frontend/src', 'views'));

// Initialize routes
app.use('/auth', authRoutes); // Prefix all auth routes with /auth
app.use(postsRoutes);
app.use('/', commentsRoutes);
app.use('/newsletter', newsletterRoutes);



// Start server
app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
});
