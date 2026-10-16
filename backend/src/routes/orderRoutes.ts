import { Router } from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  adminGetOrders,
  adminUpdateOrderStatus,
} from "../controllers/orderController.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = Router();

// Customer or guest checkout
router.post("/", createOrder);

// Authenticated customer order history
router.get("/my-orders", requireAuth, getMyOrders);

// Order lookup by ID or order number (guarded by authorization check inside controller)
router.get("/:id", getOrderById);

// Admin order routes
router.get("/admin/all", requireAuth, requireAdmin, adminGetOrders);
router.patch("/admin/:id/status", requireAuth, requireAdmin, adminUpdateOrderStatus);

export default router;
