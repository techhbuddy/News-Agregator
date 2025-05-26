// Dashboard.jsx
import { useEffect, useState } from 'react';

function Dashboard() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/news')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.text();
      })
      .then((text) => {
        console.log('Raw response:', text); // Debug
        const data = JSON.parse(text);
        setArticles(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading news...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="dashboard">
      <h1 className="app-name">PulsePress</h1>
      <h2>Top Headlines</h2>
      {articles.length === 0 ? (
        <p>No news available.</p>
      ) : (
        articles.map((article, idx) => (
          <div key={idx} className="news-card">
            <h3>{article.title}</h3>
            <p>{article.description}</p>
            <a href={article.url} target="_blank" rel="noreferrer">
              Read more
            </a>
          </div>
        ))
      )}
    </div>
  );
}

export default Dashboard;