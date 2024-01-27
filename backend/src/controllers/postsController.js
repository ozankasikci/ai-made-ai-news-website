const PostModel = require('../models/PostModel');
const CommentModel = require('../models/CommentModel');

const postsController = {
    getPostById: async (req, res) => {
        const postId = req.params.id;

        try {
            const postData = await PostModel.findById(postId);
            if (!postData) {
                return res.status(404).send('Post not found');
            }

            const comments = await CommentModel.findByPostId(postId);
            postData.comments = comments;

            res.render('postDetails', { post: postData });
        } catch (error) {
            console.error(error);
            res.status(500).send('Error occurred');
        }
    },

    getHome: async (req, res) => {
        const pageSize = 10;
        const pageIndex = parseInt(req.query.page) || 0;

        try {
            const totalPosts = await PostModel.getPostCount();
            const totalPages = Math.ceil(totalPosts / pageSize);

            if (pageIndex < 0 || pageIndex >= totalPages) {
                return res.status(404).send('Page not found');
            }

            const startIdx = pageIndex * pageSize;
            const posts = await PostModel.getPostsByPagination(startIdx, pageSize);

            // Modify the URLs to show only the base URL
            const formattedPosts = posts.map((row) => {
                const urlParts = row.content.split('/');
                const base_url = urlParts[0] + '//' + urlParts[2];
                return { ...row, base_url };
            });

            const data = {
                posts: formattedPosts,
                pageIndex,
                pageSize,
                totalPages,
            };

            res.render('home', data);
        } catch (error) {
            console.error(error);
            res.status(500).send('Error occurred');
        }
    }
};

module.exports = postsController;
