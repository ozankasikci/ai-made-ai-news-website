// index.js
const express = require('express');
const { db, initDb, getPosts, seedPosts} = require('../db/db');
const app = express();
const port = 3000;
const path = require('path');

// Middleware for parsing JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/../../frontend/src/views');

// Initialize database
initDb();
//seedPosts();

// Define routes
// Route to get all posts
app.get('/posts', (req, res) => {
    db.all('SELECT * FROM posts', [], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        });
    });
});

// Route to add a new post
app.post('/posts', (req, res) => {
    const { title, content } = req.body;
    const sql = 'INSERT INTO posts (title, content) VALUES (?,?)';
    
    db.run(sql, [title, content], function(err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": this.lastID
        });
    });
});

//app.use(express.static(path.join(__dirname, '../../frontend/src')));

app.get('/', async (req, res) => {
    const posts = await getPosts();
    
    const data = {
        pageTitle: 'AI News Hub',
        posts,
        // Add other dynamic data as needed
    };
    
    res.render('home', data);
    //res.sendFile(path.join(__dirname, '../../frontend/src', 'index.html'));
});


// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
