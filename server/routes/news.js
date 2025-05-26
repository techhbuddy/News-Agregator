// auth/news.js
import express from 'express';
import axios from 'axios';
import 'dotenv/config'; // Load environment variables

const router = express.Router();

const GNEWS_API_KEY = process.env.GNEWS_API_KEY;

router.get('/', async (req, res) => {
  try {
    if (!GNEWS_API_KEY) {
      throw new Error('GNews API key is missing');
    }
    const response = await axios.get(`https://gnews.io/api/v4/top-headlines?lang=en&country=us&token=${GNEWS_API_KEY}`);
    console.log('GNews API response:', response.data.articles); // Debug
    res.json(response.data.articles);
  } catch (error) {
    console.error('GNews API Error:', error.message);
    res.status(500).json({ message: 'Failed to fetch news', error: error.message });
  }
});

export default router;