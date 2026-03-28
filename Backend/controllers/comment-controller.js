import { Comment } from "../models/cmntmodel.js";
import { apierror } from "../utils/apierror.js";
import { apiresponse } from "../utils/apiresponse.js";
import { asynchandler } from "../utils/asynchandler.js";

export const commentController = {
    createComment: asynchandler(async (req, res) => {
        try {
            const { content, blog_id } = req.body;
            
            if (!content || !blog_id) {
                throw new apierror(400, "Content and blog_id are required");
            }
            
            const comment = await Comment.create({
                content,
                blog_id,
                user_id: req.user._id
            });
            
            res.status(201).json(new apiresponse(200, comment, "Comment created successfully"));
        } catch (error) {
            throw new apierror(500, error.message || "Error creating comment");
        }
    }),

    getCommentsByBlog: asynchandler(async (req, res) => {
        try {
            const { blogId } = req.params;
            
            const comments = await Comment.find({ blog_id: blogId })
                .populate("user_id", "username email avatar")
                .sort({ createdAt: -1 });
            
            res.status(200).json(new apiresponse(200, comments, "Comments fetched successfully"));
        } catch (error) {
            throw new apierror(500, error.message || "Error fetching comments");
        }
    }),

    deleteComment: asynchandler(async (req, res) => {
        try {
            const { commentId } = req.params;
            
            const comment = await Comment.findById(commentId);
            
            if (!comment) {
                throw new apierror(404, "Comment not found");
            }
            
            // Check if user owns the comment
            if (comment.user_id.toString() !== req.user._id.toString()) {
                throw new apierror(403, "You can only delete your own comments");
            }
            
            await Comment.findByIdAndDelete(commentId);
            
            res.status(200).json(new apiresponse(200, {}, "Comment deleted successfully"));
        } catch (error) {
            throw new apierror(500, error.message || "Error deleting comment");
        }
    }),

    updateComment: asynchandler(async (req, res) => {
        try {
            const { commentId } = req.params;
            const { content } = req.body;
            
            const comment = await Comment.findById(commentId);
            
            if (!comment) {
                throw new apierror(404, "Comment not found");
            }
            
            // Check if user owns the comment
            if (comment.user_id.toString() !== req.user._id.toString()) {
                throw new apierror(403, "You can only update your own comments");
            }
            
            comment.content = content || comment.content;
            await comment.save();
            
            res.status(200).json(new apiresponse(200, comment, "Comment updated successfully"));
        } catch (error) {
            throw new apierror(500, error.message || "Error updating comment");
        }
    })
};
