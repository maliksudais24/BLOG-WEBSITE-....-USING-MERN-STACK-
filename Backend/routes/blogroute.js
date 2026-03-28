import { Router } from "express";
import { upload } from "../middleware/multer.middle.js";
import { verifyjwt } from "../middleware/auth.js";
import * as blogController from "../controllers/Blog-controller.js";

const router = Router();

// Public routes
router.route("/all").get(blogController.getAllBlogs);
router.route("/:blogId").get(blogController.getBlogById);
router.route("/user/:userId").get(blogController.getUserBlogs);

// Protected routes
router.route("/create").post(verifyjwt, upload.single("image"), blogController.createBlog);
router.route("/:blogId").put(verifyjwt, upload.single("image"), blogController.updateBlog);
router.route("/:blogId").delete(verifyjwt, blogController.deleteBlog);

export default router;
