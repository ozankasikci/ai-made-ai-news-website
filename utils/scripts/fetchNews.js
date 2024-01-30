const postController = require('../../backend/src/controllers/postsController');

const RSSParser = require('rss-parser');
const axios = require('axios');
const schedule = require('node-schedule');

const rssParser = new RSSParser();
const LOBSTERS_AI_RSS_URL = 'https://lobste.rs/t/ai.rss';

const fetchLobstersAiNews = async () => {
  try {
    const feed = await rssParser.parseURL(LOBSTERS_AI_RSS_URL);
    feed.items.forEach(item => {
      // Assuming addPost takes a title, content (which will be the link here), and summary
      postController.addPost(item.title, item.link, item.contentSnippet);
    });
  } catch (error) {
    console.error('Error fetching AI news from lobste.rs:', error);
  }
};

const fetchHackerNews = () => {
    const URL = 'https://hacker-news.firebaseio.com/v0/topstories.json';

    axios.get(URL)
        .then(response => {
            const topStoriesIds = response.data.slice(0, 200); // Limit to top 30 stories for simplicity
            const storyPromises = topStoriesIds.map(id => 
                axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`));

            return Promise.all(storyPromises);
        })
        .then(stories => {
            stories.forEach(story => {
                const { title, url } = story.data;
                const aiKeywords = ["AI", "Artificial Intelligence", "Machine Learning", "Neural Network", "Deep Learning", "NLP", "Natural Language Processing", "Computer Vision", "Data Science", "Robotics", "Autonomous Vehicles", "AI Ethics", "Reinforcement Learning", "GANs", "Generative Adversarial Networks", "TensorFlow", "PyTorch", "Keras", "OpenAI", "Chatbot", "Voice Assistant", "AI Art", "AI Music", "Predictive Analytics", "AI Healthcare"];

                const isAiRelated = aiKeywords.some(keyword => title.includes(keyword));

                if (isAiRelated) {
                    postController.addPost(title, url, ""); // Assuming addPost takes a title and a URL/content
                }
            });
        })
        .catch(error => console.error(error));

};

const fetchNews = () => {
    fetchHackerNews();
    fetchLobstersAiNews();
};

fetchNews();

// Schedule to run every hour
schedule.scheduleJob('0 * * * *', fetchNews);
