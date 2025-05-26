// pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import NewsCard from '../components_temp/NewsCard';

function Dashboard() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]); // To store unique categories
  const [selectedCategories, setSelectedCategories] = useState([]); // To store selected categories

  // Fetch articles and extract unique categories
  useEffect(() => {
    fetch('http://localhost:5000/news')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setArticles(data);
        // Extract unique categories from articles
        const uniqueCategories = [...new Set(data.map((article) => article.category).filter(Boolean))];
        setCategories(uniqueCategories);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Handle checkbox change
  const handleCategoryChange = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((cat) => cat !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  // Filter articles based on selected categories
  const filteredArticles = selectedCategories.length === 0
    ? articles
    : articles.filter((article) => selectedCategories.includes(article.category));

  if (loading) return <p className="text-center text-gray-500 mt-10 text-sm sm:text-base">Loading news...</p>;
  if (error) return <p className="text-center text-red-500 mt-10 text-sm sm:text-base">Error: {error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-gray-100">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6">
        {/* Sidebar with Checkboxes */}
        <div className="lg:w-1/4 bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Filter by Category</h3>
          {categories.length === 0 ? (
            <p className="text-gray-500 text-sm">No categories available.</p>
          ) : (
            <div className="space-y-2">
              {categories.map((category) => (
                <label key={category} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                  />
                  <span className="text-gray-700 text-sm capitalize">{category}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="lg:w-3/4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-teal-600 text-center mb-4 tracking-tight">
            PulsePress
          </h1>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 text-center mb-8">
            Top Headlines
          </h2>
          {filteredArticles.length === 0 ? (
            <p className="text-gray-500 text-center text-sm sm:text-base">
              No articles available for the selected categories.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredArticles.map((article, idx) => (
                <NewsCard key={idx} article={article} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;