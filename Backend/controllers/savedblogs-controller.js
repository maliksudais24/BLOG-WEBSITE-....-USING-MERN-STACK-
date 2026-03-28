import { SavedBlog } from "../models/savedmodel.js";

export const saveBlog = async (req, res) => {
  const { blogId } = req.params;

  const saved = await SavedBlog.create({
    blog_id: blogId,
    user_id: req.user._id
  });

  res.status(201).json(saved);
};
