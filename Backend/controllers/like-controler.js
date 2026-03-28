import { Like } from "../models/likemodel.js";
import mongoose from "mongoose";
import { apierror } from "../utils/apierror.js";
import { apiresponse } from "../utils/apiresponse.js";
import { asynchandler } from "../utils/asynchandler.js";

export const likeController = {
    // Like a blog
    likeBlog: asynchandler(async (req, res) => {
        try {
            const { blog_id } = req.body;
            
            if (!blog_id) {
                throw new apierror(400, "Blog ID is required");
            }
            
            if (!mongoose.Types.ObjectId.isValid(blog_id)) {
                throw new apierror(400, "Invalid blog ID");
            }
            
            // Check if user already liked this blog
            const existingLike = await Like.findOne({
                blog_id: blog_id,
                user_id: req.user._id
            });
            
            if (existingLike) {
                throw new apierror(400, "You have already liked this blog");
            }
            
            const like = await Like.create({
                blog_id,
                user_id: req.user._id
            });
            
            res.status(201).json(new apiresponse(200, like, "Blog liked successfully"));
        } catch (error) {
            throw new apierror(error.statusCode || 500, error.message || "Error liking blog");
        }
    }),

    // Unlike a blog
    unlikeBlog: asynchandler(async (req, res) => {
        try {
            const { blogId } = req.params;
            
            if (!mongoose.Types.ObjectId.isValid(blogId)) {
                throw new apierror(400, "Invalid blog ID");
            }
            
            const like = await Like.findOneAndDelete({
                blog_id: blogId,
                user_id: req.user._id
            });
            
            if (!like) {
                throw new apierror(404, "Like not found or you haven't liked this blog");
            }
            
            res.status(200).json(new apiresponse(200, {}, "Blog unliked successfully"));
        } catch (error) {
            throw new apierror(error.statusCode || 500, error.message || "Error unliking blog");
        }
    }),

    // Get likes for a blog
    getLikes: asynchandler(async (req, res) => {
        try {
            const { blogId } = req.params;
            
            if (!mongoose.Types.ObjectId.isValid(blogId)) {
                throw new apierror(400, "Invalid blog ID");
            }
            
            const likes = await Like.find({ blog_id: blogId })
                .populate("user_id", "username email avatar");
            
            res.status(200).json(new apiresponse(200, likes, "Likes fetched successfully"));
        } catch (error) {
            throw new apierror(500, error.message || "Error fetching likes");
        }
    }),

    // Check if user has liked a blog
    checkLiked: asynchandler(async (req, res) => {
        try {
            const { blogId } = req.params;
            
            if (!mongoose.Types.ObjectId.isValid(blogId)) {
                throw new apierror(400, "Invalid blog ID");
            }
            
            const like = await Like.findOne({
                blog_id: blogId,
                user_id: req.user._id
            });
            
            res.status(200).json(new apiresponse(200, { liked: !!like }, "Check status successful"));
        } catch (error) {
            throw new apierror(500, error.message || "Error checking like status");
        }
    })
};

