// auth/news.js
import express from 'express';
import scrapeGNewsArticles from '../scrapper.js'; // Adjust path if needed

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const articles = await scrapeGNewsArticles();
    console.log('Fetched articles:', articles.length);
    res.json(articles);
  } catch (error) {
    console.error('GNews API Error:', error.message);
    res.status(500).json({ message: 'Failed to fetch news', error: error.message });
  }
});

export default router;
