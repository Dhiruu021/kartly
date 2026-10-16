import express, { Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { ENV } from "./config/env.js";
import { authenticate } from "./middleware/auth.js";
import { errorHandler } from "./middleware/errorHandler.js";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

export const createApp = (): Express => {
  const app = express();

  // Security & Middleware
  app.use(
    cors({
      origin: [ENV.CLIENT_URL, "http://localhost:3000", "http://127.0.0.1:3000"],
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));
  app.use(cookieParser(ENV.COOKIE_SECRET));
  app.use(authenticate);

  // Rate limiter for authentication
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { success: false, message: "Too many authentication attempts, please try again later." },
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.status(200).json({
      status: "ok",
      timestamp: new Date().toISOString(),
      service: "Kartly API",
      environment: ENV.NODE_ENV,
    });
  });

  // Routes
  app.use("/api/auth", authLimiter, authRoutes);
  app.use("/api/products", productRoutes);
  app.use("/api/categories", categoryRoutes);
  app.use("/api/orders", orderRoutes);
  app.use("/api/coupons", couponRoutes);
  app.use("/api/wishlist", wishlistRoutes);
  app.use("/api/admin", adminRoutes);

  // Error Handling
  app.use(errorHandler);

  return app;
};
