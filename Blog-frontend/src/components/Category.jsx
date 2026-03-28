import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { blogApi, categoryApi } from '../utils/api';

export default function Category() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [category, setCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch all categories for navigation
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryApi.getAllCategories();
        setCategories(response.data.data || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch blogs for specific category
  useEffect(() => {
    const fetchCategoryBlogs = async () => {
      try {
        setIsLoading(true);
        setError('');

        // If categoryId is 'all', fetch all blogs
        if (categoryId === 'all') {
          const response = await blogApi.getAllBlogs();
          setBlogs(response.data.data || []);
          setCategory({ category_name: 'All Blogs' });
        } else {
          // Fetch all blogs and filter by category
          const response = await blogApi.getAllBlogs();
          const allBlogs = response.data.data || [];
          const filteredBlogs = allBlogs.filter(blog =>
            blog.category && blog.category._id === categoryId
          );
          setBlogs(filteredBlogs);

          // Find category name
          const categoryResponse = await categoryApi.getCategoryById(categoryId);
          setCategory(categoryResponse.data.data);
        }
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError('Failed to load blogs for this category');
      } finally {
        setIsLoading(false);
      }
    };

    if (categoryId) {
      fetchCategoryBlogs();
    }
  }, [categoryId]);

  // Format date helper
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get image URL or placeholder
  const getImageUrl = (blog) => {
    if (blog.image?.url) {
      return blog.image.url;
    }
    return `https://via.placeholder.com/800x400/1a1a2e/ffffff?text=${encodeURIComponent(blog.title)}`;
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-black">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {category ? category.category_name : 'Category'}
          </h1>
          <p className="text-gray-400">
            {blogs.length} {blogs.length === 1 ? 'blog' : 'blogs'} in this category
          </p>
        </div>

        {/* Category Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate('/categories/all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                categoryId === 'all'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              All Blogs
            </button>
            {categories.map(cat => (
              <button
                key={cat._id}
                onClick={() => navigate(`/categories/${cat._id}`)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  categoryId === cat._id
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {cat.category_name}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        )}

        {/* Error Message */}
        {error && !isLoading && (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-500 transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Blog Grid */}
        {!isLoading && !error && (
          <>
            {blogs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 mb-4">No blogs found in this category.</p>
                <button
                  onClick={() => navigate('/write')}
                  className="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-500 transition-all duration-300"
                >
                  Write the First Blog
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.map((blog, index) => (
                  <div
                    key={blog._id || blog.id}
                    className="bg-gray-900/50 rounded-xl overflow-hidden border border-white/10 hover:border-purple-500/30 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/10"
                    style={{
                      transitionDelay: `${index * 100}ms`
                    }}
                  >
                    {/* Blog Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={getImageUrl(blog)}
                        alt={blog.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-purple-600/80 text-white text-xs px-3 py-1 rounded-full">
                          {blog.category?.category_name || 'Uncategorized'}
                        </span>
                      </div>
                    </div>

                    {/* Blog Content */}
                    <div className="p-6">
                      <div className="flex items-center gap-3 text-sm text-gray-400 mb-3">
                        <span>{blog.author?.username || 'Unknown Author'}</span>
                        <span>•</span>
                        <span>{formatDate(blog.createdAt)}</span>
                      </div>

                      <h3 className="text-xl font-bold text-white mb-3 hover:text-purple-400 transition-colors duration-300 line-clamp-2">
                        {blog.title}
                      </h3>

                      <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                        {blog.excerpt || blog.content?.substring(0, 150) + '...'}
                      </p>

                      {/* Read More Button */}
                      <button
                        className="w-full bg-black/50 text-white px-4 py-2 rounded-lg border border-white/20 hover:bg-purple-600 hover:border-purple-600 hover:text-white transition-all duration-300"
                        onClick={() => navigate(`/blog/${blog._id}`)}
                      >
                        Read More
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
