import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema({
    content: {
        type: String,
        required: true
    },
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

export const Comment = mongoose.model("comment", commentSchema);
