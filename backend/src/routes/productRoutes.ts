import { Router } from "express";
import {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { z } from "zod";

const router = Router();

const productSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  category: z.string().min(1, "Category is required"),
  price: z.number().positive("Price must be greater than 0"),
  salePrice: z.number().positive().optional(),
  stock: z.number().int().min(0, "Stock cannot be negative"),
  tint: z.enum(["sage", "butter", "sand", "blush", "sky", "stone"]).optional(),
  image: z.string().min(1, "Product image is required"),
  scene: z.string().optional(),
  gallery: z.array(z.string()).optional(),
  badge: z.string().nullable().optional(),
  blurb: z.string().min(5, "Product blurb is required"),
  finishes: z.array(
    z.object({
      name: z.string(),
      color: z.string(),
      image: z.string().optional(),
    })
  ).optional(),
  details: z.array(z.string()).optional(),
  dimensions: z.string().optional(),
  care: z.string().optional(),
  isFeatured: z.boolean().optional(),
});

router.get("/", getProducts);
router.get("/:slug", getProductBySlug);

// Admin-only endpoints
router.post("/", requireAuth, requireAdmin, validate(productSchema), createProduct);
router.patch("/:id", requireAuth, requireAdmin, updateProduct);
router.delete("/:id", requireAuth, requireAdmin, deleteProduct);

export default router;
