import { Router } from "express";
import {
  validateCoupon,
  getCoupons,
  createCoupon,
  deleteCoupon,
} from "../controllers/couponController.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = Router();

// Public coupon validation during checkout
router.post("/validate", validateCoupon);

// Admin coupon management
router.get("/", requireAuth, requireAdmin, getCoupons);
router.post("/", requireAuth, requireAdmin, createCoupon);
router.delete("/:id", requireAuth, requireAdmin, deleteCoupon);

export default router;
