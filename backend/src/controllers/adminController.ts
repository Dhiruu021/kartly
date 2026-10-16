import { Request, Response, NextFunction } from "express";
import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";
import { User } from "../models/User.js";
import { Category } from "../models/Category.js";

export const getDashboardMetrics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const [
      totalProducts,
      totalCustomers,
      totalOrders,
      lowStockProducts,
      statusCounts,
      revenueAggregation,
      recentOrders,
    ] = await Promise.all([
      Product.countDocuments({ status: "active" }),
      User.countDocuments({ role: "customer" }),
      Order.countDocuments(),
      Product.find({ stock: { $lte: 10 }, status: "active" }).select("name slug stock price image").limit(5),
      Order.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      Order.aggregate([
        { $match: { paymentStatus: "paid" } },
        { $group: { _id: null, totalRevenue: { $sum: "$total" } } },
      ]),
      Order.find().sort({ createdAt: -1 }).limit(6),
    ]);

    const orderStatusBreakdown: Record<string, number> = {
      paid: 0,
      packing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };

    statusCounts.forEach((s) => {
      if (s._id in orderStatusBreakdown) {
        orderStatusBreakdown[s._id] = s.count;
      }
    });

    const totalRevenue = revenueAggregation[0]?.totalRevenue || 0;

    res.status(200).json({
      success: true,
      metrics: {
        totalRevenue,
        totalOrders,
        totalProducts,
        totalCustomers,
        lowStockCount: lowStockProducts.length,
        orderStatusBreakdown,
      },
      lowStockProducts,
      recentOrders,
    });
  } catch (error) {
    next(error);
  }
};

export const getCustomers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const customers = await User.find({ role: "customer" })
      .select("-password")
      .sort({ createdAt: -1 });

    const customerIds = customers.map((c) => c._id);
    const orderStats = await Order.aggregate([
      { $match: { customer: { $in: customerIds } } },
      {
        $group: {
          _id: "$customer",
          orderCount: { $sum: 1 },
          totalSpent: { $sum: "$total" },
        },
      },
    ]);

    const statsMap: Record<string, { orderCount: number; totalSpent: number }> = {};
    orderStats.forEach((stat) => {
      statsMap[stat._id.toString()] = {
        orderCount: stat.orderCount,
        totalSpent: stat.totalSpent,
      };
    });

    const enrichedCustomers = customers.map((c) => ({
      ...c.toObject(),
      orderCount: statsMap[c._id.toString()]?.orderCount || 0,
      totalSpent: statsMap[c._id.toString()]?.totalSpent || 0,
    }));

    res.status(200).json({ success: true, customers: enrichedCustomers });
  } catch (error) {
    next(error);
  }
};
