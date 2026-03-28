
import axios from 'axios';

const API_URL = 'http://localhost:5000';

// Create axios instance with credentials
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create axios instance for multipart form data (file uploads)
const formApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

// Request interceptor to add auth token
const addAuthToken = (config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

api.interceptors.request.use(addAuthToken, (error) => Promise.reject(error));
formApi.interceptors.request.use(addAuthToken, (error) => Promise.reject(error));

// Response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

formApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

// ============ BLOG API ============
export const blogApi = {
  // Get all blogs
  getAllBlogs: () => api.get('/blog/all'),
  
  // Get blog by ID
  getBlogById: (blogId) => api.get(`/blog/${blogId}`),
  
  // Create blog with image upload
  createBlog: (formData) => formApi.post('/blog/create', formData),
  
  // Update blog with image upload
  updateBlog: (blogId, formData) => formApi.put(`/blog/${blogId}`, formData),
  
  // Delete blog
  deleteBlog: (blogId) => api.delete(`/blog/${blogId}`),
  
  // Get user's blogs
  getUserBlogs: (userId) => api.get(`/blog/user/${userId}`),
};

// ============ COMMENT API ============
export const commentApi = {
  // Get comments for a blog
  getCommentsByBlog: (blogId) => api.get(`/comment/${blogId}`),
  
  // Create a comment
  createComment: (data) => api.post('/comment/create', data),
  
  // Update a comment
  updateComment: (commentId, content) => api.put(`/comment/${commentId}`, { content }),
  
  // Delete a comment
  deleteComment: (commentId) => api.delete(`/comment/${commentId}`),
};

// ============ LIKE API ============
export const likeApi = {
  // Like a blog
  likeBlog: (blogId) => api.post('/like', { blog_id: blogId }),
  
  // Unlike a blog
  unlikeBlog: (blogId) => api.delete(`/like/${blogId}`),
  
  // Get likes for a blog
  getLikes: (blogId) => api.get(`/like/${blogId}`),
  
  // Check if user has liked a blog
  checkLiked: (blogId) => api.get(`/like/${blogId}/check`),
};

// ============ CATEGORY API ============
export const categoryApi = {
  // Get all categories
  getAllCategories: () => api.get('/category'),
  
  // Get category by ID
  getCategoryById: (categoryId) => api.get(`/category/${categoryId}`),
  
  // Create category (admin only)
  createCategory: (categoryName) => api.post('/category/create', { category_name: categoryName }),
  
  // Update category (admin only)
  updateCategory: (categoryId, categoryName) => api.put(`/category/${categoryId}`, { category_name: categoryName }),
  
  // Delete category (admin only)
  deleteCategory: (categoryId) => api.delete(`/category/${categoryId}`),
};

export default api;

