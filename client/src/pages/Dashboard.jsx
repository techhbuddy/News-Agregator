import { useEffect, useState } from "react";

function Dashboard() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/news")
      .then(res => res.json())
      .then(data => {
        setArticles(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading news...</p>;

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
            <a href={article.url} target="_blank" rel="noreferrer">Read more</a>
          </div>
        ))
      )}
    </div>
  );
}

export default Dashboard;
