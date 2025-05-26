import { LanguageServiceClient } from '@google-cloud/language';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Article from './models/Article.js';
import fs from 'fs/promises';
import path from 'path';

dotenv.config();
const languageClient = new LanguageServiceClient();

const logFilePath = path.join(process.cwd(), 'log.txt');

const logToFile = async (message) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  try {
    await fs.appendFile(logFilePath, logMessage);
  } catch (err) {
    console.error('❌ Failed to write to log.txt:', err.message);
  }
};

const connectToDB = async () => {
  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('✅ Connected to MongoDB');
      await logToFile('Connected to MongoDB');
    } catch (err) {
      console.error('❌ MongoDB connection error:', err.message);
      await logToFile(`MongoDB connection error: ${err.message}`);
      process.exit(1);
    }
  }
};

const categorizeArticles = async () => {
  console.log('🚀 Starting categorization...');
  await logToFile('Starting categorization...');

  await connectToDB();

  try {
    const articles = await Article.find({ category: { $exists: false } });
    console.log(`📚 Found ${articles.length} uncategorized articles`);
    await logToFile(`Found ${articles.length} uncategorized articles`);

    if (!articles.length) {
      await logToFile('No articles to categorize');
      return;
    }

    for (const article of articles) {
      const text = `${article.title}. ${article.description}`;
      const document = { content: text, type: 'PLAIN_TEXT' };

      try {
        const [result] = await languageClient.classifyText({ document });
        const categories = result.categories;

        if (categories.length > 0) {
          article.category = categories[0].name.split('/').pop();
          await article.save();
          console.log(`✅ Categorized: ${article.title} → ${article.category}`);
          await logToFile(`Categorized: ${article.title} → ${article.category}`);
        } else {
          console.log(`⚠️ No category found for: ${article.title}`);
          await logToFile(`No category found for: ${article.title}`);
        }
      } catch (err) {
        console.error(`❌ Error classifying: ${article.title}`, err.message);
        await logToFile(`Error classifying: ${article.title} - ${err.message}`);
      }
    }
  } catch (err) {
    console.error('❌ NLP process failed:', err.message);
    await logToFile(`NLP process failed: ${err.message}`);
  } finally {
    await mongoose.connection.close();
    await logToFile('Closed MongoDB connection');
    console.log('🔒 MongoDB connection closed.');
  }
};

// Call function directly (skip import.meta.url check for now)
categorizeArticles();
