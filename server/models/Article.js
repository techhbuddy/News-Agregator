// server/models/Article.js
import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  url: { type: String, default: '' },
  category: { type: String, default: 'General' },
  sentiment: { type: String },
  embedding: { type: [Number] },
  createdAt: { type: Date, default: Date.now },
});

const Article = mongoose.model('Article', articleSchema);

export default Article;
