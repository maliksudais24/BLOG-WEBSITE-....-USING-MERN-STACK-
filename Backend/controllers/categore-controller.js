import { Category } from "../models/categorymodel.js";
import { apierror } from "../utils/apierror.js";
import { apiresponse } from "../utils/apiresponse.js";
import { asynchandler } from "../utils/asynchandler.js";

export const categoryController = {
    createCategory: asynchandler(async (req, res) => {
        try {
            const { category_name } = req.body;
            
            if (!category_name) {
                throw new apierror(400, "Category name is required");
            }
            
            // Check if category already exists
            const existingCategory = await Category.findOne({ category_name });
            if (existingCategory) {
                throw new apierror(400, "Category already exists");
            }
            
            const category = await Category.create({ category_name });
            
            res.status(201).json(new apiresponse(200, category, "Category created successfully"));
        } catch (error) {
            throw new apierror(500, error.message || "Error creating category");
        }
    }),

    getAllCategories: asynchandler(async (req, res) => {
        try {
            const categories = await Category.find().sort({ category_name: 1 });
            
            res.status(200).json(new apiresponse(200, categories, "Categories fetched successfully"));
        } catch (error) {
            throw new apierror(500, error.message || "Error fetching categories");
        }
    }),

    getCategoryById: asynchandler(async (req, res) => {
        try {
            const { categoryId } = req.params;
            
            const category = await Category.findById(categoryId);
            
            if (!category) {
                throw new apierror(404, "Category not found");
            }
            
            res.status(200).json(new apiresponse(200, category, "Category fetched successfully"));
        } catch (error) {
            throw new apierror(500, error.message || "Error fetching category");
        }
    }),

    updateCategory: asynchandler(async (req, res) => {
        try {
            const { categoryId } = req.params;
            const { category_name } = req.body;
            
            const category = await Category.findById(categoryId);
            
            if (!category) {
                throw new apierror(404, "Category not found");
            }
            
            // Check if new category name already exists
            if (category_name) {
                const existingCategory = await Category.findOne({ 
                    category_name, 
                    _id: { $ne: categoryId } 
                });
                if (existingCategory) {
                    throw new apierror(400, "Category name already exists");
                }
                category.category_name = category_name;
            }
            
            await category.save();
            
            res.status(200).json(new apiresponse(200, category, "Category updated successfully"));
        } catch (error) {
            throw new apierror(500, error.message || "Error updating category");
        }
    }),

    deleteCategory: asynchandler(async (req, res) => {
        try {
            const { categoryId } = req.params;
            
            const category = await Category.findById(categoryId);
            
            if (!category) {
                throw new apierror(404, "Category not found");
            }
            
            await Category.findByIdAndDelete(categoryId);
            
            res.status(200).json(new apiresponse(200, {}, "Category deleted successfully"));
        } catch (error) {
            throw new apierror(500, error.message || "Error deleting category");
        }
    })
};
