
import { Blog } from "../models/blogmodel.js";
import mongoose from "mongoose";
import { apierror } from "../utils/apierror.js";
import { apiresponse } from "../utils/apiresponse.js";
import { asynchandler } from "../utils/asynchandler.js";

const getBlogAggregation = () => {
    return [
        {
            $lookup: {
                from: "users",
                localField: "user_id",
                foreignField: "_id",
                as: "author"
            }
        },
        { $unwind: "$author" },
        {
            $lookup: {
                from: "categories",
                localField: "category_id",
                foreignField: "_id",
                as: "category"
            }
        },
        { $unwind: "$category" },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "blog_id",
                as: "likes"
            }
        },
        {
            $lookup: {
                from: "comments",
                localField: "_id",
                foreignField: "blog_id",
                as: "comments"
            }
        },
        {
            $project: {
                title: 1,
                content: 1,
                image: 1,
                createdAt: 1,
                updatedAt: 1,
                author: { username: 1, email: 1, avatar: 1, _id: 1 },
                category: { category_name: 1, _id: 1 },
                likesCount: { $size: "$likes" },
                commentsCount: { $size: "$comments" }
            }
        }
    ];
};

export const createBlog = asynchandler(async (req, res) => {
    try {
        const { title, content, category_id } = req.body;

        if (!title || !content || !category_id) {
            throw new apierror(400, "Title, content, and category_id are required");
        }

        // Create full URL for the uploaded image
        let imageUrl = null;
        if (req.file) {
            // multer saves to ./public/temp, so we need to extract the temp/filename part
            // and create a full URL that can be accessed from the frontend
            const relativePath = req.file.path.replace(/\\/g, '/').replace('public/', '');
            imageUrl = `http://localhost:3000/${relativePath}`;
        }

        const blog = await Blog.create({
            title,
            content,
            category_id,
            user_id: req.user._id,
            image: imageUrl ? { url: imageUrl } : null
        });

        res.status(201).json(new apiresponse(200, blog, "Blog created successfully"));
    } catch (error) {
        throw new apierror(500, error.message || "Error creating blog");
    }
});

export const getAllBlogs = asynchandler(async (req, res) => {
    try {
        const blogs = await Blog.aggregate(getBlogAggregation());
        res.json(new apiresponse(200, blogs, "All blogs fetched successfully"));
    } catch (error) {
        throw new apierror(500, error.message || "Error fetching blogs");
    }
});

export const getBlogById = asynchandler(async (req, res) => {
    try {
        const { blogId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(blogId)) {
            throw new apierror(400, "Invalid blog ID");
        }

        const blogs = await Blog.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(blogId) } },
            ...getBlogAggregation()
        ]);

        if (blogs.length === 0) {
            throw new apierror(404, "Blog not found");
        }

        res.status(200).json(new apiresponse(200, blogs[0], "Blog fetched successfully"));
    } catch (error) {
        throw new apierror(error.statusCode || 500, error.message || "Error fetching blog");
    }
});

export const getUserBlogs = asynchandler(async (req, res) => {
    try {
        const { userId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new apierror(400, "Invalid user ID");
        }

        const blogs = await Blog.aggregate([
            { $match: { user_id: new mongoose.Types.ObjectId(userId) } },
            ...getBlogAggregation()
        ]);

        res.status(200).json(new apiresponse(200, blogs, "User blogs fetched successfully"));
    } catch (error) {
        throw new apierror(500, error.message || "Error fetching user blogs");
    }
});

export const updateBlog = asynchandler(async (req, res) => {
    try {
        const { blogId } = req.params;
        const { title, content, category_id } = req.body;

        if (!mongoose.Types.ObjectId.isValid(blogId)) {
            throw new apierror(400, "Invalid blog ID");
        }

        const blog = await Blog.findById(blogId);

        if (!blog) {
            throw new apierror(404, "Blog not found");
        }

        // Check if user owns the blog
        if (blog.user_id.toString() !== req.user._id.toString()) {
            throw new apierror(403, "You can only update your own blogs");
        }

        blog.title = title || blog.title;
        blog.content = content || blog.content;
        blog.category_id = category_id || blog.category_id;
        
        if (req.file) {
            // Create full URL for the uploaded image
            const relativePath = req.file.path.replace(/\\/g, '/').replace('public/', '');
            blog.image = { url: `http://localhost:3000/${relativePath}` };
        }

        await blog.save();

        res.status(200).json(new apiresponse(200, blog, "Blog updated successfully"));
    } catch (error) {
        throw new apierror(error.statusCode || 500, error.message || "Error updating blog");
    }
});

export const deleteBlog = asynchandler(async (req, res) => {
    try {
        const { blogId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(blogId)) {
            throw new apierror(400, "Invalid blog ID");
        }

        const blog = await Blog.findById(blogId);

        if (!blog) {
            throw new apierror(404, "Blog not found");
        }

        // Check if user owns the blog
        if (blog.user_id.toString() !== req.user._id.toString()) {
            throw new apierror(403, "You can only delete your own blogs");
        }

        await Blog.findByIdAndDelete(blogId);

        res.status(200).json(new apiresponse(200, {}, "Blog deleted successfully"));
    } catch (error) {
        throw new apierror(error.statusCode || 500, error.message || "Error deleting blog");
    }
});

