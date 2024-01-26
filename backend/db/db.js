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

const getPosts = () => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM posts', [], (err, rows) => {
            if (err) {
                reject(err);
            }
            resolve(rows);
        });
    });
}

const getPostsByPagination = (startIdx, pageSize) => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM posts LIMIT ?, ?', [startIdx, pageSize], (err, rows) => {
            if (err) {
                reject(err);
            }
            resolve(rows);
        });
    });
}

function getPostById(id) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM posts WHERE id = ?';

        db.get(sql, [id], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}

const addPost = (title, content) => {
    const checkSql = 'SELECT * FROM posts WHERE title = ?';
    const insertSql = 'INSERT INTO posts (title, content, summary) VALUES (?, ?, "")';

    // First, check if the post already exists
    db.get(checkSql, [title], function(err, row) {
        if (err) {
            return console.error(err.message);
        }

        // If the post does not exist, insert it
        if (!row) {
            db.run(insertSql, [title, content], function(err) {
                if (err) {
                    return console.error(err.message);
                }
                console.log(`A new row has been added with rowid ${this.lastID}`);
            });
        } else {
            console.log(`Post with title '${title}' already exists`);
        }
    });
};

const getPostCount = () => {
    return new Promise((resolve, reject) => {
        db.get('SELECT COUNT(*) AS count FROM posts', [], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row.count);
            }
        });
    });
};

// Export functions and the database connection
module.exports = {
    db,
    initDb,
    seedPosts,
    getPosts,
    getPostById,
    addPost,
    getPostCount,
    getPostsByPagination,
};

