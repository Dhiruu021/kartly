import { Router } from "express";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { z } from "zod";

const router = Router();

const categorySchema = z.object({
  name: z.string().min(2, "Category name is required"),
  tint: z.enum(["sage", "butter", "sand", "blush", "sky", "stone"]).optional(),
  image: z.string().min(1, "Category image is required"),
  description: z.string().optional(),
});

router.get("/", getCategories);
router.post("/", requireAuth, requireAdmin, validate(categorySchema), createCategory);
router.patch("/:id", requireAuth, requireAdmin, updateCategory);
router.delete("/:id", requireAuth, requireAdmin, deleteCategory);

export default router;
