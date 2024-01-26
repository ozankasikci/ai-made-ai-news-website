const { db, getPosts, getPostById } = require('../../db/db');

const postsController = {
    // Get all posts
    getAllPosts: (req, res) => {
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
    },

    // Create a new post
    createPost: (req, res) => {
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
    },

    // Get a specific post by ID
    getPostById: async (req, res) => {
        const postId = req.params.id;
        const postData = await getPostById(postId);
        if (postData) {
            postData.comments = [
                {"author": "John Doe", "text": "Great article!"},
                {"author": "Jane Smith", "text": "Very informative."}
            ];
        }
        res.render('postDetails', { post: postData });
    },

    // Get the home page
    getHome: async (req, res) => {
        const posts = await getPosts();

        const data = {
            pageTitle: 'AI News Hub',
            posts,
        };

        res.render('home', data);
    }
};

module.exports = postsController;
