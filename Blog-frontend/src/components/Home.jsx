import { useState, useEffect } from 'react';
import BlogPosts from './BlogPosts';
import CTASection from './CTASection';
import Footer from './Footer';
import { useAuth } from '../context/AuthContext';
import { categoryApi } from '../utils/api';

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const { user, loading } = useAuth();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Fetch categories for filter buttons
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoadingCategories(true);
        const response = await categoryApi.getAllCategories();
        if (response.data.data) {
          setCategories(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  return (
    <div className="min-h-screen pt-20">
      <section className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6">
        {/* Welcome Tag - Fade in + Slide down */}
        <div
          className={`mb-4 transition-all duration-700 ease-out transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}
        >
          <span className="bg-purple-600/20 text-purple-400 px-4 py-1 rounded-full text-sm font-medium">
            Welcome to Nexus
          </span>
        </div>

        {/* Heading - Fade in + Slide up */}
        <h1
          className={`text-8xl md:text-5xl font-bold mb-4 transition-all duration-700 delay-100 ease-out transform drop-shadow-[0_0_15px_rgba(168,85,247,0.5)] bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          Stories That Matter
        </h1>

        {/* Subtext - Fade in */}
        <p
          className={`text-gray-400 max-w-2xl mb-8 transition-all duration-700 delay-200 ease-out ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          Explore insightful articles about technology, design, and the future of
          development. Join our community of curious minds.
        </p>

        {/* Search bar - Fade in + Scale */}
        <div
          className={`w-full max-w-md mb-6 transition-all duration-500 delay-300 ease-out transform ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          <input
            type="text"
            placeholder="Search articles..."
            className="w-full rounded-lg bg-black/50 text-gray-200 placeholder-gray-500 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 border border-white/10"
          />
        </div>

        {/* Category buttons - Staggered fade in */}
        <div className="flex flex-wrap gap-3 justify-center">
          {/* All Button */}
          <button
            onClick={() => handleCategorySelect('all')}
            className={`px-4 py-1.5 rounded-full border transition-all duration-300 hover:scale-105 active:scale-95 ${
              selectedCategory === 'all'
                ? 'bg-purple-600 text-white border-purple-600'
                : 'bg-black text-white border-white/20 hover:bg-gray-800 hover:text-white'
            }`}
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
              transition: 'all 0.4s ease-out',
              transitionDelay: '400ms',
            }}
          >
            All
          </button>

          {/* Dynamic Category Buttons - Show when categories are loaded with data */}
          {!isLoadingCategories && categories.length > 0 ? (
            categories.map((category, index) => (
              <button
                key={category._id}
                onClick={() => handleCategorySelect(category._id)}
                className={`px-4 py-1.5 rounded-full border transition-all duration-300 hover:scale-105 active:scale-95 ${
                  selectedCategory === category._id
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'bg-black text-white border-white/20 hover:bg-gray-800 hover:text-white'
                }`}
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
                  transition: 'all 0.4s ease-out',
                  transitionDelay: `${500 + index * 50}ms`,
                }}
              >
                {category.category_name}
              </button>
            ))
          ) : null}

          {/* Fallback buttons - Show when still loading OR no categories found */}
          {(isLoadingCategories || categories.length === 0) ? (
            <>
              <button
                className={`px-4 py-1.5 rounded-full border transition-all duration-300 hover:scale-105 active:scale-95 ${
                  selectedCategory === 'technology'
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'bg-black text-white border-white/20 hover:bg-gray-800 hover:text-white'
                }`}
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
                  transition: 'all 0.4s ease-out',
                  transitionDelay: '500ms',
                }}
                onClick={() => handleCategorySelect('technology')}
              >
                Technology
              </button>
              <button
                className={`px-4 py-1.5 rounded-full border transition-all duration-300 hover:scale-105 active:scale-95 ${
                  selectedCategory === 'programming'
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'bg-black text-white border-white/20 hover:bg-gray-800 hover:text-white'
                }`}
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
                  transition: 'all 0.4s ease-out',
                  transitionDelay: '600ms',
                }}
                onClick={() => handleCategorySelect('programming')}
              >
                Programming
              </button>
              <button
                className={`px-4 py-1.5 rounded-full border transition-all duration-300 hover:scale-105 active:scale-95 ${
                  selectedCategory === 'architecture'
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'bg-black text-white border-white/20 hover:bg-gray-800 hover:text-white'
                }`}
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
                  transition: 'all 0.4s ease-out',
                  transitionDelay: '700ms',
                }}
                onClick={() => handleCategorySelect('architecture')}
              >
                Architecture
              </button>
            </>
          ) : null}
        </div>
      </section>

      {/* Blog Posts Section - Only show when logged in */}
      {!loading && user && <BlogPosts selectedCategory={selectedCategory} />}

      {/* CTA Section */}
      <CTASection />

      {/* Footer */}
      <Footer />
    </div>
  );
}

