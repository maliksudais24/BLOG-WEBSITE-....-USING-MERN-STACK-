
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { blogApi } from '../utils/api';

const dummyBlogs = [
  {
    _id: 1,
    title: "The Future of AI in Web Development",
    excerpt: "Exploring how artificial intelligence is revolutionizing the way we build web applications...",
    image: { url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop" },
    author: { username: "John Doe" },
    createdAt: "2024-01-15T00:00:00.000Z",
    category: { category_name: "Technology" }
  },
  {
    _id: 2,
    title: "Modern React Patterns You Should Know",
    excerpt: "Deep dive into the latest React patterns and best practices for building scalable applications...",
    image: { url: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop" },
    author: { username: "Jane Smith" },
    createdAt: "2024-01-12T00:00:00.000Z",
    category: { category_name: "Programming" }
  },
  {
    _id: 3,
    title: "Microservices vs Monolithic Architecture",
    excerpt: "A comprehensive comparison of architectural approaches for modern software systems...",
    image: { url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop" },
    author: { username: "Mike Johnson" },
    createdAt: "2024-01-10T00:00:00.000Z",
    category: { category_name: "Architecture" }
  },
  {
    _id: 4,
    title: "Building Accessible Web Applications",
    excerpt: "Essential tips and techniques for creating web applications that everyone can use...",
    image: { url: "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&h=400&fit=crop" },
    author: { username: "Sarah Wilson" },
    createdAt: "2024-01-08T00:00:00.000Z",
    category: { category_name: "Design" }
  },
  {
    _id: 5,
    title: "Database Optimization Strategies",
    excerpt: "Learn how to optimize your database queries for better performance and scalability...",
    image: { url: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&h=400&fit=crop" },
    author: { username: "Tom Brown" },
    createdAt: "2024-01-05T00:00:00.000Z",
    category: { category_name: "Database" }
  },
  {
    _id: 6,
    title: "Introduction to Cloud Computing",
    excerpt: "Getting started with cloud platforms and understanding their benefits for modern apps...",
    image: { url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop" },
    author: { username: "Emily Davis" },
    createdAt: "2024-01-03T00:00:00.000Z",
    category: { category_name: "Cloud" }
  }
];

export default function BlogPosts() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [visibleBlogs, setVisibleBlogs] = useState(3);
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setIsLoading(true);
        const response = await blogApi.getAllBlogs();
        if (response.data.success) {
          setBlogs(response.data.data || []);
        }
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError('Failed to load blogs, showing sample content');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const loadMore = () => {
    setVisibleBlogs(prev => prev + 3);
  };

  const displayBlogs = blogs.length > 0 ? blogs : dummyBlogs;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getImageUrl = (blog) => {
    if (blog.image?.url) {
      return blog.image.url;
    }
    return `https://via.placeholder.com/800x400/1a1a2e/ffffff?text=${encodeURIComponent(blog.title)}`;
  };

  return (
    <section className="py-16 px-6 bg-black/30">
      <div className="max-w-7xl mx-auto">
        <div className={`mb-12 transition-all duration-700 ease-out transform ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Latest Blog Posts
          </h2>
          <p className="text-gray-400 max-w-2xl">
            Discover insightful articles about technology, design, and development.
          </p>
        </div>

        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        )}

        {error && !isLoading && (
          <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-400 text-center">
            {error}
          </div>
        )}

        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayBlogs.slice(0, visibleBlogs).map((blog, index) => (
              <div
                key={blog._id || blog.id}
                className={`bg-gray-900/50 rounded-xl overflow-hidden border border-white/10 hover:border-purple-500/30 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/10 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={getImageUrl(blog)}
                    alt={blog.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-purple-600/80 text-white text-xs px-3 py-1 rounded-full">
                      {blog.category?.category_name || blog.category || 'Uncategorized'}
                    </span>
                  </div>
                </div>

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

        {visibleBlogs < displayBlogs.length && !isLoading && (
          <div className="mt-12 text-center">
            <button
              onClick={() => navigate('/categories/all')}
              className="bg-black text-white px-8 py-3 rounded-full border border-white/20 hover:bg-purple-600 hover:border-purple-600 hover:text-white transition-all duration-300 hover:scale-105 active:scale-95"
            >
              Show More
            </button>
          </div>
        )}

        {!isLoading && displayBlogs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">No blog posts yet.</p>
            <button
              onClick={() => window.location.href = '/write'}
              className="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-500 transition-all duration-300"
            >
              Be the first to write a blog!
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

