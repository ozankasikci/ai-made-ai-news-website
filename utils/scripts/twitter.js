require('dotenv').config();
const { TwitterApi } = require('twitter-api-v2');

const client = new TwitterApi({
    appKey: process.env.TWITTER_APP_KEY,
    appSecret: process.env.TWITTER_APP_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_SECRET,
    
}).readWrite;

// Function to post a tweet
const postTweet = async (message) => {
    try {
        const tweet = await client.v2.tweet(message);
        console.log('Tweet posted:', tweet.text);
    } catch (error) {
        console.error('Error posting tweet:', error);
    }
};

module.exports = {
    postTweet
};
