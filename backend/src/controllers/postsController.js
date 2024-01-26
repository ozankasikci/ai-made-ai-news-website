const { db, getPostsByPagination, getPostById, getPostCount } = require('../../db/db');

const postsController = {
    // Get all posts
    getAllPosts: (req, res) => {
        db.all('SELECT * FROM posts', [], (err, rows) => {
            if (err) {
                res.status(400).json({"error": err.message});
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
        const {title, content} = req.body;
        const sql = 'INSERT INTO posts (title, content) VALUES (?,?)';

        db.run(sql, [title, content], function (err) {
            if (err) {
                res.status(400).json({"error": err.message});
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
        res.render('postDetails', {post: postData});
    },

    // Get the home page
// Get the home page
    getHome: async (req, res) => {
        const pageSize = 15;
        const pageIndex = parseInt(req.query.page) || 0;

        try {
            const totalPosts = await getPostCount();
            const totalPages = Math.ceil(totalPosts / pageSize);

            // Ensure that the pageIndex is within the valid range
            if (pageIndex < 0 || pageIndex >= totalPages) {
                return res.status(404).send('Page not found');
            }

            // Calculate the starting index for posts
            const startIdx = pageIndex * pageSize;

            // Fetch only the posts for the current page
            const posts = await getPostsByPagination(startIdx, pageSize);

            // Modify the URLs to show only the base URL
            const formattedPosts = posts.map((row) => {
                const urlParts = row.content.split('/');
                const base_url = urlParts[0] + '//' + urlParts[2];
                return { ...row, base_url };
            });

            // Ensure that only the correct number of posts is displayed on the page
            const slicedPosts = formattedPosts.slice(0, pageSize);

            const data = {
                pageTitle: 'AI News Hub',
                posts: slicedPosts,
                pageIndex,
                pageSize,
                totalPages
            };

            res.render('home', data);
        } catch (error) {
            console.error(error);
            res.status(500).send('Error occurred');
        }
    }
}

module.exports = postsController;
