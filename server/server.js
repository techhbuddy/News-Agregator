// server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config.js';
import authRoutes from './routes/auth.js';
import newsRoutes from './routes/news.js'; // Import news router

dotenv.config();

const app = express();

app.use(cors({ origin: 'http://localhost:5173' })); // Specify origin for security
app.use(express.json());

await connectDB();

app.get('/', (req, res) => {
  res.send('API is running');
});

app.use('/api/auth', authRoutes);
app.use('/news', newsRoutes); // Mount news router at /news

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));