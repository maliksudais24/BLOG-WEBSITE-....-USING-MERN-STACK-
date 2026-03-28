import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { blogApi, commentApi, likeApi } from '../utils/api';

export default function BlogView() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { blogId } = useParams();

  const [blog, setBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isDeletingComment, setIsDeletingComment] = useState(null);

  // Fetch blog data and comments
  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch blog
        const blogResponse = await blogApi.getBlogById(blogId);
        const blogData = blogResponse.data.data;
        setBlog(blogData);
        setLikesCount(blogData.likesCount || 0);
        
        // Check if user has liked this blog
        if (user) {
          try {
            const likeCheckResponse = await likeApi.checkLiked(blogId);
            setIsLiked(likeCheckResponse.data.data || false);
          } catch (likeError) {
            console.error('Error checking like status:', likeError);
            setIsLiked(false);
          }
        }
        
        // Fetch comments
        try {
          const commentsResponse = await commentApi.getCommentsByBlog(blogId);
          setComments(commentsResponse.data.data || []);
        } catch (commentError) {
          console.error('Error fetching comments:', commentError);
          setComments([]);
        }

      } catch (err) {
        console.error('Error fetching blog:', err);
        setError('Failed to load blog');
      } finally {
        setIsLoading(false);
      }
    };

    if (blogId) {
      fetchBlogData();
    }
  }, [blogId, user]);

  // Handle like/unlike
  const handleLike = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setIsLiking(true);
      
      if (isLiked) {
        // Unlike
        await likeApi.unlikeBlog(blogId);
        setIsLiked(false);
        setLikesCount(prev => Math.max(0, prev - 1));
      } else {
        // Like
        await likeApi.likeBlog(blogId);
        setIsLiked(true);
        setLikesCount(prev => prev + 1);
      }
    } catch (err) {
      console.error('Error liking/unliking blog:', err);
      alert('Failed to update like status. Please try again.');
    } finally {
      setIsLiking(false);
    }
  };

  // Handle comment submission
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    if (!newComment.trim()) return;

    try {
      setIsSubmittingComment(true);
      
      const response = await commentApi.createComment({
        content: newComment.trim(),
        blog_id: blogId
      });

      if (response.data.success) {
        const newCommentData = response.data.data;
        // Populate the author info from user context
        const formattedComment = {
          ...newCommentData,
          author: {
            username: user.username,
            avatar: user.avatar
          }
        };
        
        setComments(prev => [formattedComment, ...prev]);
        setNewComment('');
      }
    } catch (err) {
      console.error('Error adding comment:', err);
      alert('Failed to add comment. Please try again.');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Handle comment deletion
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      setIsDeletingComment(commentId);
      
      const response = await commentApi.deleteComment(commentId);

      if (response.data.success) {
        setComments(prev => prev.filter(comment => comment._id !== commentId));
      }
    } catch (err) {
      console.error('Error deleting comment:', err);
      alert('Failed to delete comment. Please try again.');
    } finally {
      setIsDeletingComment(null);
    }
  };

  // Handle blog deletion
  const handleDeleteBlog = async () => {
    if (!window.confirm('Are you sure you want to delete this blog? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await blogApi.deleteBlog(blogId);

      if (response.data.success) {
        alert('Blog deleted successfully!');
        navigate('/my-blogs');
      }
    } catch (err) {
      console.error('Error deleting blog:', err);
      alert('Failed to delete blog. Please try again.');
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Blog Not Found</h1>
          <p className="text-gray-400 mb-8">{error || 'The blog you\'re looking for doesn\'t exist.'}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-500 transition-all duration-300"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // Check if current user is the author
  const isAuthor = user && blog.author && user._id === blog.author._id;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-black">
      <div className="max-w-4xl mx-auto">
        {/* Blog Header */}
        <div className="mb-8">
          {/* Category Badge */}
          <div className="mb-4 flex gap-2">
            <span className="bg-purple-600/80 text-white text-sm px-3 py-1 rounded-full">
              {blog.category?.category_name || 'Uncategorized'}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            {blog.title}
          </h1>

          {/* Author and Date */}
          <div className="flex items-center gap-4 text-gray-400 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {blog.author?.username?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <span>{blog.author?.username || 'Unknown Author'}</span>
            </div>
            <span>•</span>
            <span>{formatDate(blog.createdAt)}</span>
          </div>

          {/* Action Buttons (Like, Edit, Delete) */}
          <div className="flex items-center gap-4 flex-wrap">
            <button
              onClick={handleLike}
              disabled={isLiking}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                isLiked
                  ? 'bg-red-600 text-white hover:bg-red-500'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <svg
                className={`w-5 h-5 ${isLiking ? 'animate-pulse' : ''}`}
                fill={isLiked ? 'currentColor' : 'none'}
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span>{likesCount} {likesCount === 1 ? 'Like' : 'Likes'}</span>
            </button>

            {/* Edit Button - Only visible to author */}
            {isAuthor && (
              <button
                onClick={() => navigate(`/edit/${blog._id}`)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-500 transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Blog
              </button>
            )}

            {/* Delete Button - Only visible to author */}
            {isAuthor && (
              <button
                onClick={handleDeleteBlog}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-500 transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete Blog
              </button>
            )}
          </div>
        </div>

        {/* Blog Image */}
        {blog.image?.url && (
          <div className="mb-8">
            <img
              src={blog.image.url}
              alt={blog.title}
              className="w-full h-64 md:h-96 object-cover rounded-xl"
            />
          </div>
        )}

        {/* Blog Content */}
        <div className="prose prose-lg prose-invert max-w-none mb-12">
          <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
            {blog.content}
          </div>
        </div>

        {/* Comments Section */}
        <div className="border-t border-white/10 pt-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            Comments ({comments.length})
          </h2>

          {/* Add Comment Form */}
          {user ? (
            <form onSubmit={handleCommentSubmit} className="mb-8">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-medium">
                    {user.username?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 resize-none"
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      type="submit"
                      disabled={isSubmittingComment || !newComment.trim()}
                      className="px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmittingComment ? 'Posting...' : 'Post Comment'}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <div className="mb-8 p-4 bg-gray-900/50 rounded-lg text-center">
              <p className="text-gray-400 mb-4">Please log in to comment on this blog.</p>
              <button
                onClick={() => navigate('/login')}
                className="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-500 transition-all duration-300"
              >
                Log In
              </button>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-6">
            {comments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No comments yet. Be the first to comment!</p>
            ) : (
              comments.map((comment) => (
                <div key={comment._id} className="flex gap-4">
                  <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-medium">
                      {comment.author?.username?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-white font-medium">
                        {comment.author?.username || 'Anonymous'}
                      </span>
                      <span className="text-gray-500 text-sm">
                        {formatDate(comment.createdAt)}
                      </span>
                      {/* Delete button for comment author */}
                      {user && user._id === comment.user_id && (
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          disabled={isDeletingComment === comment._id}
                          className="text-gray-500 hover:text-red-400 transition-colors duration-300 ml-auto disabled:opacity-50"
                          title="Delete comment"
                        >
                          {isDeletingComment === comment._id ? (
                            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )}
                        </button>
                      )}
                    </div>
                    <p className="text-gray-300">{comment.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-12 text-center">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-800 text-white px-6 py-3 rounded-full border border-white/10 hover:bg-gray-700 hover:border-gray-600 transition-all duration-300"
          >
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
}

