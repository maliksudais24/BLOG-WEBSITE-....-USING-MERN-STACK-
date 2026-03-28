import { Router } from "express";
import { verifyjwt } from "../middleware/auth.js";
import { likeController } from "../controllers/like-controler.js";

const router = Router();

// Like a blog (protected)
router.route("/").post(verifyjwt, likeController.likeBlog);

// Unlike a blog (protected)
router.route("/:blogId").delete(verifyjwt, likeController.unlikeBlog);

// Get likes for a blog (protected)
router.route("/:blogId").get(verifyjwt, likeController.getLikes);

// Check if user has liked a blog (protected)
router.route("/:blogId/check").get(verifyjwt, likeController.checkLiked);

export default router;

