import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { categoryApi, blogApi } from '../utils/api';

export default function Write() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category_id: '',
    customCategory: '',
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCustomCategory, setShowCustomCategory] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const response = await categoryApi.getAllCategories();
        setCategories(response.data.data || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchCategories();
    }
  }, [user]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Show custom category input when "Other" is selected
    if (name === 'category_id' && value === 'other') {
      setShowCustomCategory(true);
    } else if (name === 'category_id') {
      setShowCustomCategory(false);
      setFormData(prev => ({ ...prev, customCategory: '' }));
    }
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    if (!formData.content.trim()) {
      setError('Content is required');
      return;
    }
    if (!formData.category_id) {
      setError('Please select a category');
      return;
    }
    if (formData.category_id === 'other' && !formData.customCategory.trim()) {
      setError('Please enter a custom category name');
      return;
    }

    try {
      setIsSubmitting(true);

      let categoryId = formData.category_id;

      // If "Other" is selected, create the new category first
      if (formData.category_id === 'other') {
        try {
          const categoryResponse = await categoryApi.createCategory(formData.customCategory.trim());
          if (categoryResponse.data.success) {
            categoryId = categoryResponse.data.data._id;
            // Add the new category to the local state
            setCategories(prev => [...prev, categoryResponse.data.data]);
          } else {
            throw new Error('Failed to create category');
          }
        } catch (categoryError) {
          console.error('Error creating category:', categoryError);
          setError('Failed to create new category. Please try again.');
          return;
        }
      }

      // Create FormData for multipart upload
      const blogFormData = new FormData();
      blogFormData.append('title', formData.title.trim());
      blogFormData.append('content', formData.content.trim());
      blogFormData.append('category_id', categoryId);
      if (image) {
        blogFormData.append('image', image);
      }

      // Submit to API
      const response = await blogApi.createBlog(blogFormData);

      if (response.data.success) {
        setSuccess('Blog created successfully! Redirecting...');
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    } catch (err) {
      console.error('Error creating blog:', err);
      setError(err.response?.data?.message || 'Failed to create blog. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Write Your Blog
          </h1>
          <p className="text-gray-400">
            Share your thoughts, ideas, and stories with the community.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400">
            {success}
          </div>
        )}

        {/* Blog Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Input */}
          <div>
            <label htmlFor="title" className="block text-gray-300 mb-2 font-medium">
              Blog Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter a captivating title for your blog..."
              className="w-full px-4 py-3 bg-gray-900/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
            />
          </div>

          {/* Category Select */}
          <div>
            <label htmlFor="category_id" className="block text-gray-300 mb-2 font-medium">
              Category <span className="text-red-400">*</span>
            </label>
            <select
              id="category_id"
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
            >
              <option value="">Select a category</option>
              {isLoading ? (
                <option value="">Loading categories...</option>
              ) : categories.length === 0 ? (
                <option value="">No categories available</option>
              ) : (
                categories.map(category => (
                  <option key={category._id} value={category._id}>
                    {category.category_name}
                  </option>
                ))
              )}
              <option value="other">Other (Create New)</option>
            </select>
          </div>

          {/* Custom Category Input */}
          {showCustomCategory && (
            <div>
              <label htmlFor="customCategory" className="block text-gray-300 mb-2 font-medium">
                New Category Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="customCategory"
                name="customCategory"
                value={formData.customCategory}
                onChange={handleChange}
                placeholder="Enter your custom category name..."
                className="w-full px-4 py-3 bg-gray-900/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
              />
              <p className="text-gray-500 text-sm mt-1">
                This will create a new category that other users can also use.
              </p>
            </div>
          )}

          {/* Image Upload */}
          <div>
            <label className="block text-gray-300 mb-2 font-medium">
              Cover Image <span className="text-gray-500">(Optional)</span>
            </label>
            
            {!imagePreview ? (
              <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-purple-500/50 transition-all duration-300 cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <div className="mb-4">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-400 mb-2">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-gray-500 text-sm">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </label>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Blog cover preview"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 text-white rounded-full p-2 transition-all duration-300"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Content Textarea */}
          <div>
            <label htmlFor="content" className="block text-gray-300 mb-2 font-medium">
              Blog Content <span className="text-red-400">*</span>
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Write your blog content here..."
              rows={12}
              className="w-full px-4 py-3 bg-gray-900/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 resize-y"
            />
            <p className="text-gray-500 text-sm mt-2">
              {formData.content.length} characters
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex-1 px-6 py-3 bg-gray-800 text-white rounded-lg border border-white/10 hover:bg-gray-700 hover:border-gray-600 transition-all duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg font-medium shadow-md hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Publishing...
                </span>
              ) : (
                'Publish Blog'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

