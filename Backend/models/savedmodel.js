import mongoose, { Schema } from "mongoose";

const savedBlogSchema = new Schema({
    blog_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "blog",
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    }
}, { timestamps: true });

export const SavedBlog = mongoose.model("savedblog", savedBlogSchema);
