import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema({
    category_name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    }
}, { timestamps: true });

export const Category = mongoose.model("category", categorySchema);
