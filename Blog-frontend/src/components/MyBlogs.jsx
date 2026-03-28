import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { blogApi } from '../utils/api';

export default function MyBlogs() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  // Fetch user's blogs
  useEffect(() => {
    const fetchUserBlogs = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        const response = await blogApi.getUserBlogs(user.id || user._id);
        if (response.data.success) {
          setBlogs(response.data.data || []);
        }
      } catch (err) {
        console.error('Error fetching user blogs:', err);
        setError('Failed to load your blogs');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchUserBlogs();
    }
  }, [user]);

  // Handle blog deletion
  const handleDeleteBlog = async (blogId) => {
    if (!window.confirm('Are you sure you want to delete this blog? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleteLoading(blogId);
      const response = await blogApi.deleteBlog(blogId);

      if (response.data.success) {
        // Remove blog from local state
        setBlogs(prev => prev.filter(blog => blog._id !== blogId));
      }
    } catch (err) {
      console.error('Error deleting blog:', err);
      alert('Failed to delete blog. Please try again.');
    } finally {
      setDeleteLoading(null);
    }
  };

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
    return `https://via.placeholder.com/400x200/1a1a2e/ffffff?text=${encodeURIComponent(blog.title)}`;
  };

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // Don't render if not logged in (will redirect)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-black">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            My Blogs
          </h1>
          <p className="text-gray-400">
            Manage and view all your published blogs
          </p>
        </div>

        {/* Write New Blog Button */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/write')}
            className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-3 rounded-lg font-medium shadow-md hover:opacity-90 transition-all duration-300 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Write New Blog
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        )}

        {/* Error Message */}
        {error && !isLoading && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-center">
            {error}
          </div>
        )}

        {/* Blog Grid */}
        {!isLoading && !error && (
          <>
            {blogs.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No blogs yet</h3>
                <p className="text-gray-400 mb-6">Start writing your first blog post!</p>
                <button
                  onClick={() => navigate('/write')}
                  className="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-500 transition-all duration-300"
                >
                  Write Your First Blog
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.map((blog, index) => (
                  <div
                    key={blog._id}
                    className="bg-gray-900/50 rounded-xl overflow-hidden border border-white/10 hover:border-purple-500/30 transition-all duration-300"
                    style={{
                      transitionDelay: `${index * 100}ms`
                    }}
                  >
                    {/* Blog Image */}
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={getImageUrl(blog)}
                        alt={blog.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="bg-purple-600/80 text-white text-xs px-2 py-1 rounded-full">
                          {blog.category?.category_name || 'Uncategorized'}
                        </span>
                      </div>
                    </div>

                    {/* Blog Content */}
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-white mb-2 hover:text-purple-400 transition-colors duration-300 line-clamp-2">
                        {blog.title}
                      </h3>

                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                        {blog.excerpt || blog.content?.substring(0, 100) + '...'}
                      </p>

                      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <span>{formatDate(blog.createdAt)}</span>
                        <span>{blog.likesCount || 0} likes</span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/blog/${blog._id}`)}
                          className="flex-1 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-all duration-300"
                        >
                          View
                        </button>
                        <button
                          onClick={() => navigate(`/edit/${blog._id}`)}
                          className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-500 transition-all duration-300"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteBlog(blog._id)}
                          disabled={deleteLoading === blog._id}
                          className="bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {deleteLoading === blog._id ? (
                            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                          ) : (
                            'Delete'
                          )}
                        </button>
                      </div>
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
