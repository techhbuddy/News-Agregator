// models/Article.js
import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
  title: String,
  description: String,
  url: String,
  category: String,
  source: String,
  publishedAt: Date,
});

export default mongoose.model('Article', articleSchema);
