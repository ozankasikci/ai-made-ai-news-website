const axios = require('axios');
const cheerio = require('cheerio');

const url = 'https://example-news-site.com/ai-news';

const scrapeAiNews = async (url) => {
    try {
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);
        const articles = [];
        const keywords = ['AI', 'Artificial Intelligence', 'Machine Learning', 'Neural Network', 'Deep Learning'];

        $('article').each((i, elem) => {
            const title = $(elem).find('h2').text();
            const summary = $(elem).find('p').text();
            const link = $(elem).find('a').attr('href');

            // Check if the title or summary contains any of the keywords
            const containsKeywords = keywords.some(keyword => title.includes(keyword) || summary.includes(keyword));
      
            if (containsKeywords) {
                articles.push({
                    title,
                    summary,
                    link: link.startsWith('http') ? link : `https://example-news-site.com${link}`
                });
            }
        });

        return articles;
    } catch (error) {
        console.error(`Error occurred while fetching news: ${error.message}`);
        return [];
    }
};

scrapeAiNews(url).then((aiNewsItems) => {
    console.log(aiNewsItems);
});