import mongoose, { Schema } from "mongoose";

const blogSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    image: {
        url: {
            type: String,
            default: null
        }
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
        required: true
    }
}, { timestamps: true });

export const Blog = mongoose.model("blog", blogSchema);
