// scraper.js
import axios from 'axios';
import 'dotenv/config'; // For loading GNEWS_API_KEY from .env

const GNEWS_API_KEY = process.env.GNEWS_API_KEY;

const scrapeGNewsArticles = async () => {
  if (!GNEWS_API_KEY) {
    throw new Error('GNews API key is missing');
  }

  try {
    const response = await axios.get(
      `https://gnews.io/api/v4/top-headlines?lang=en&country=us&token=${GNEWS_API_KEY}`
    );

    const articles = response.data.articles.map((article) => ({
      title: article.title,
      description: article.description,
      url: article.url,
      image: article.image,
      source: article.source?.name,
      publishedAt: article.publishedAt,
      category: article.category || 'general',
    }));

    return articles;
  } catch (error) {
    console.error('Error fetching GNews articles:', error.message);
    throw error;
  }
};

export default scrapeGNewsArticles;
