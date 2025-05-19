const express = require('express');
const axios = require('axios');
const router = express.Router();

const NEWS_API_KEY = process.env.NEWS_API_KEY;

router.get('/', async (req, res) => {
  try {
    // Optional: you can add category query param handling here later
    const response = await axios.get(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${NEWS_API_KEY}`);
    res.json(response.data.articles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch news' });
  }
});

module.exports = router;
