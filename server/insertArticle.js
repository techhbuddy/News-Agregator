// insertArticles.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import scrapeGNewsArticles from './scrapper.js';
import Article from './models/Article.js';

dotenv.config();

const insertArticles = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB');

    const articles = await scrapeGNewsArticles();
    console.log(`📥 Scraped ${articles.length} articles`);

    await Article.insertMany(articles);
    console.log('🧾 Articles inserted into MongoDB');
  } catch (err) {
    console.error('❌ Error inserting articles:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

insertArticles();
