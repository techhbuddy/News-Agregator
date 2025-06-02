// scraper.js
import axios from 'axios';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import nlp from 'compromise'
import Article from './models/Article.js';

dotenv.config();

const GNEWS_API_KEY = process.env.GNEWS_API_KEY;

// Define category keywords
const categoryKeywords = {
  business: ['business', 'finance', 'economy', 'market', 'stock', 'investment', 'company', 'trade', 'profit', 'loss'],
  politics: ['politics', 'government', 'election', 'president', 'policy', 'law', 'congress', 'parliament', 'legislation'],
  technology: ['technology', 'tech', 'software', 'hardware', 'internet', 'digital', 'computer', 'AI', 'artificial', 'intelligence'],
  sports: ['sports', 'game', 'match', 'team', 'player', 'championship', 'tournament', 'score', 'win', 'lose'],
  entertainment: ['entertainment', 'movie', 'music', 'celebrity', 'actor', 'show', 'film', 'concert', 'theater'],
  science: ['science', 'research', 'study', 'discovery', 'experiment', 'theory', 'space', 'universe', 'astronomy'],
  health: ['health', 'medical', 'doctor', 'hospital', 'disease', 'treatment', 'vaccine', 'medicine', 'patient']
};

// Function to categorize an article
const categorizeArticle = (article) => {
  // Combine multiple fields for better categorization
  const text = `${article.title}. ${article.description}. ${article.source?.name || ''}. ${article.content || ''}`;
  const doc = nlp(text);
  
  let maxScore = 0;
  let bestCategory = 'general';
  let categoryScores = {};

  // Check each category's keywords
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    categoryScores[category] = 0;
    
    // Check for exact matches
    for (const keyword of keywords) {
      if (doc.has(keyword)) {
        categoryScores[category]++;
      }
    }
    
    // Check for partial matches
    for (const keyword of keywords) {
      const matches = text.toLowerCase().match(new RegExp(keyword, 'gi'));
      if (matches) {
        categoryScores[category] += matches.length * 0.5; // Partial matches count less
      }
    }
  }

  // Find the category with the highest score
  for (const [category, score] of Object.entries(categoryScores)) {
    if (score > maxScore) {
      maxScore = score;
      bestCategory = category;
    }
  }

  // Only categorize if we have a clear winner
  if (maxScore > 0 && maxScore > Object.values(categoryScores).reduce((a, b) => Math.max(a, b), 0) * 0.7) {
    return bestCategory;
  }
  
  return 'general';
};

const scrapeGNewsArticles = async () => {
  if (!GNEWS_API_KEY) {
    throw new Error('GNews API key is missing');
  }

  try {
    const response = await axios.get(
      `https://gnews.io/api/v4/top-headlines?lang=en&country=us&token=${GNEWS_API_KEY}`
    );

    // Process and categorize articles
    const articlesToSave = response.data.articles.map((article) => {
      // Get our category (ignoring GNews API's category)
      const category = categorizeArticle(article);
      
      // Return article with our category
      return {
        title: article.title,
        description: article.description,
        url: article.url,
        image: article.image,
        source: article.source?.name,
        publishedAt: article.publishedAt,
        category: category, // Use our categorized category
        content: article.content // Store content for better categorization
      };
    });

    // Save articles to MongoDB
    await Article.insertMany(articlesToSave);

    // Return simplified articles with only needed fields
    const savedArticles = await Article.find({})
      .select('title description url image source publishedAt category')
      .sort({ publishedAt: -1 })
      .limit(200);
    
    return savedArticles;

  } catch (error) {
    console.error('Error fetching GNews articles:', error.message);
    throw error;
  }
};

export default scrapeGNewsArticles;
