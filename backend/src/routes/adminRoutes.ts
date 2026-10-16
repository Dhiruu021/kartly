import { Router } from "express";
import { getDashboardMetrics, getCustomers } from "../controllers/adminController.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/metrics", requireAuth, requireAdmin, getDashboardMetrics);
router.get("/customers", requireAuth, requireAdmin, getCustomers);

export default router;
