const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const dbPath = path.resolve(__dirname, 'data/database.sqlite');
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

const initDb = () => {
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            summary TEXT NOT NULL,
            content TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS comments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            post_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            text TEXT NOT NULL,
            deleted BOOLEAN DEFAULT FALSE,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (post_id) REFERENCES posts(id),
            FOREIGN KEY (user_id) REFERENCES users(id)
        )`);

        // Newsletter Subscribers Table
        db.run(`CREATE TABLE IF NOT EXISTS newsletter_subscribers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL
        )`, (err) => {
            if (err) console.error(err.message);
            else console.log("Newsletter subscribers table created.");
        });
    });
};

// Function to seed posts
const seedPosts = () => {
    const posts = [
        { title: 'The Future of AI in Healthcare', content: 'Content of Post 1', summary: 'Exploring how AI is revolutionizing medical diagnostics and patient care' },
        { title: 'AI-Powered Chatbots Transform Customer Support', content: 'Content of Post 1', summary: 'Companies worldwide are adopting AI-powered chatbots to provide 24/7 customer support' },
    ];

    posts.forEach((post) => {
        const { title, content, summary } = post;
        const sql = 'INSERT INTO posts (title, content, summary) VALUES (?, ?, ?)';
        db.run(sql, [title, content, summary], (err) => {
            if (err) {
                return console.error(err.message);
            }
            console.log(`Inserted post: ${title}`);
        });
    });

    // Close the database connection after all posts are inserted
    db.close((err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Database connection closed.');
    });
};


// Export functions and the database connection
module.exports = {
    db,
    initDb,
    seedPosts,
};

