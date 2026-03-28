import { Router } from "express";
import { verifyjwt } from "../middleware/auth.js";
import { categoryController } from "../controllers/categore-controller.js";

const router = Router();

router.route("/").get(categoryController.getAllCategories);
router.route("/:categoryId").get(categoryController.getCategoryById);
router.route("/create").post(verifyjwt, categoryController.createCategory);
router.route("/:categoryId").put(verifyjwt, categoryController.updateCategory);
router.route("/:categoryId").delete(verifyjwt, categoryController.deleteCategory);

export default router;
