const { db } = require('../../db/db'); // Update the path as per your project structure
const bcrypt = require('bcrypt');
const saltRounds = 10;

const authController = {
    
    login: async (req, res) => {
        const { username, password } = req.body;

        db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
            if (err) {
                res.status(500).json({ success: false, error: 'Internal server error' });
                return;
            }
            if (!user) {
                res.status(401).json({ success: false, error: 'Invalid credentials' });
                return;
            }
            bcrypt.compare(password, user.password, (err, result) => {
                if (err) {
                    res.status(500).json({ success: false, error: 'Internal server error' });
                    return;
                }
                if (result) {
                    req.session.userId = user.id;
                    req.session.username = username;
                    res.status(200).json({ success: true, message: 'Login successful' });
                } else {
                    res.status(401).json({ success: false, error: 'Invalid credentials' });
                }
            });
        });
    },
    
    createAccount: async (req, res) => {
        const { username, password } = req.body;

        bcrypt.hash(password, saltRounds, (err, hash) => {
            if (err) {
                res.status(500).json({ error: 'Error hashing password' });
                return;
            }

            const insertSql = 'INSERT INTO users (username, password) VALUES (?, ?)';
            db.run(insertSql, [username, hash], function(err) {
                if (err) {
                    if (err.code === 'SQLITE_CONSTRAINT') {
                        res.status(409).json({ success: false, error: 'Username already exists' });
                    } else {
                        res.status(500).json({ success: false, error: 'Error creating account' });
                    }
                    return;
                }
                
                req.session.userId = this.lastID;
                req.session.username = username;
                res.status(201).json({ success: true, message: `Account created with ID: ${this.lastID}` });
            });
        });
    },
    
    logout: async (req, res) => {
        req.session.destroy(err => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Error logging out' });
            }
            res.clearCookie('connect.sid');
            res.json({ success: true, message: 'Logout successful' });
        });
    },

    ensureAuth: (req, res, next) => {
        // List of paths to exclude
        const excludePaths = ['/login', '/', '/create-account'];

        // Skip middleware for excluded paths
        if (excludePaths.includes(req.path)) {
            return next();
        }
        
        if (req.session.userId) {
            next();
        } else {
            res.status(401).send("Not authenticated");
        }
    },

    setCommonSessionDataToLocals: (req, res, next) => {
        const commonData = {
            pageTitle: "AI News by AI!",
        }
        
        // Middleware logic for other paths
        if (req.session && req.session.userId) {
            res.locals.sessionData = {
                loggedIn: true,
                username: req.session.username
            };
        } else {
            res.locals.sessionData = { loggedIn: false };
        }
        
        res.locals = { ...res.locals, ...commonData };
        next();
    }
};

module.exports = authController;
