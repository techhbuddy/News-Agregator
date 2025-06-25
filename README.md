# Full-Stack News Aggregator Platform

Just launched: A smart, scalable platform that automatically scrapes real-time news, analyzes it using NLP, and organizes it for end users — all secured with JWT-based authentication.

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Google Cloud Natural Language API
- React.js
- JWT (JSON Web Token)
- Axios
- dotenv
- Compromise.js

## Key Features

### Automated News Scraping
- Real-time news is fetched using the GNews API.
- Articles are processed and stored efficiently.

### Smart NLP Categorization
- Google Cloud Natural Language API is used to extract semantic categories.
- Compromise.js acts as a fallback mechanism for keyword-based classification when the NLP API does not return relevant categories.

### Batch Processing
- Articles are processed in batches to reduce load on third-party APIs and to enhance performance.
- Efficient queue-based ingestion prevents API overuse and data loss.

### Backend Caching and Indexing
- Uses MongoDB indexing and in-memory caching to avoid duplicate articles.
- Ensures that the same article is not re-processed or stored again.

### Secure Authentication with JWT
- JWT-based authentication to secure all protected routes.
- Validates token with expiry checks.
- Supports unique user registration and login with encrypted credentials.

### Error Logging
- Logs are maintained in a `log.txt` file.
- Provides observability into scraping failures, authentication issues, and server errors.

## Challenges and Learnings

- Preventing duplicate articles required combining MongoDB indexing with in-memory `Set` logic.
- Designing fallback logic using Compromise.js ensured continued functionality when the NLP API failed or returned null categories.
- Implemented JWT-based authentication while ensuring proper token expiry handling and secure credential encryption.
- Optimized scraping performance through batch processing, balancing the need for freshness with API rate limits.

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/news-aggregator-platform.git
cd news-aggregator-platform
