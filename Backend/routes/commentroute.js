import { Router } from "express";
import { verifyjwt } from "../middleware/auth.js";
import { commentController } from "../controllers/comment-controller.js";

const router = Router();

router.route("/:blogId").get(verifyjwt, commentController.getCommentsByBlog);
router.route("/create").post(verifyjwt, commentController.createComment);
router.route("/:commentId").put(verifyjwt, commentController.updateComment);
router.route("/:commentId").delete(verifyjwt, commentController.deleteComment);

export default router;
