import { Request, Response, NextFunction } from "express";
import { Order, IOrderItem } from "../models/Order.js";
import { Product } from "../models/Product.js";
import { Coupon } from "../models/Coupon.js";

function generateOrderNumber(): string {
  const timeSlice = String(Date.now()).slice(-5);
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `KRT-${timeSlice}${randomSuffix}`;
}

export const createOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { items, shippingAddress, customerName, customerPhone, guestEmail, paymentMethod, couponCode, notes } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ success: false, message: "Order must contain at least one item" });
      return;
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.street || !shippingAddress.city || !shippingAddress.postalCode) {
      res.status(400).json({ success: false, message: "Complete shipping address is required" });
      return;
    }

    // Authoritative Price & Stock verification on backend
    let subtotal = 0;
    const validatedItems: IOrderItem[] = [];

    for (const item of items) {
      const product = await Product.findById(item.productId || item.id);
      if (!product) {
        res.status(404).json({ success: false, message: `Product not found: ${item.name || item.productId}` });
        return;
      }

      if (product.stock < item.quantity) {
        res.status(400).json({
          success: false,
          message: `Insufficient stock for "${product.name}". Only ${product.stock} available.`,
        });
        return;
      }

      const authoritativePrice = product.salePrice && product.salePrice > 0 ? product.salePrice : product.price;
      subtotal += authoritativePrice * item.quantity;

      validatedItems.push({
        productId: product._id.toString(),
        name: product.name,
        slug: product.slug,
        price: authoritativePrice,
        finishName: item.finishName || item.finish || "Standard",
        finishColor: item.finishColor || item.color || "#d8c4a4",
        quantity: item.quantity,
        image: item.image || product.image,
      });
    }

    // Discount calculation
    let discount = 0;
    let validCoupon = null;

    if (couponCode && couponCode.trim() !== "") {
      const code = couponCode.trim().toUpperCase();
      const coupon = await Coupon.findOne({ code, isActive: true });
      if (coupon) {
        const now = new Date();
        const notExpired = !coupon.expiryDate || coupon.expiryDate > now;
        const meetsMin = subtotal >= coupon.minOrderValue;
        const withinLimit = coupon.timesUsed < (coupon.usageLimit || 10000);

        if (notExpired && meetsMin && withinLimit) {
          validCoupon = coupon;
          if (coupon.discountType === "percentage") {
            discount = (subtotal * coupon.discountValue) / 100;
            if (coupon.maxDiscount && discount > coupon.maxDiscount) {
              discount = coupon.maxDiscount;
            }
          } else {
            discount = coupon.discountValue;
          }
          discount = Math.min(discount, subtotal);
        }
      }
    }

    // Shipping fee rule: Free delivery worldwide on orders ₹1,999 or more, else ₹149
    const shippingFee = subtotal >= 1999 ? 0 : 149;
    const total = Math.max(0, subtotal - discount + shippingFee);

    // Atomically decrement stock for all ordered products
    for (const item of validatedItems) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity },
      });
    }

    // If coupon was applied, increment timesUsed
    if (validCoupon) {
      await Coupon.findByIdAndUpdate(validCoupon._id, { $inc: { timesUsed: 1 } });
    }

    const orderNumber = generateOrderNumber();

    const order = await Order.create({
      orderNumber,
      customer: req.user ? req.user.id : null,
      guestEmail: req.user ? req.user.email : guestEmail,
      customerName: customerName || shippingAddress.fullName,
      customerPhone,
      items: validatedItems,
      subtotal,
      discount,
      couponCode: validCoupon ? validCoupon.code : null,
      shippingFee,
      total,
      status: "paid",
      paymentStatus: "paid",
      paymentMethod: paymentMethod || "card",
      shippingAddress,
      notes,
    });

    res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Authentication required" });
      return;
    }

    const orders = await Order.find({ customer: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const order = (await Order.findById(id)) || (await Order.findOne({ orderNumber: id }));

    if (!order) {
      res.status(404).json({ success: false, message: "Order not found" });
      return;
    }

    // Access check: Only the customer who placed the order or an admin can access
    if (order.customer && (!req.user || (req.user.id !== order.customer.toString() && req.user.role !== "admin"))) {
      res.status(403).json({ success: false, message: "Unauthorized access to order details" });
      return;
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

export const adminGetOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status, search, page = 1, limit = 50 } = req.query;
    const query: any = {};

    if (status && status !== "all") {
      query.status = status;
    }

    if (search && String(search).trim() !== "") {
      const regex = new RegExp(String(search).trim(), "i");
      query.$or = [
        { orderNumber: regex },
        { customerName: regex },
        { guestEmail: regex },
      ];
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [orders, total] = await Promise.all([
      Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      Order.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      orders,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    next(error);
  }
};

export const adminUpdateOrderStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, trackingNumber, paymentStatus } = req.body;

    const updates: any = {};
    if (status) updates.status = status;
    if (trackingNumber !== undefined) updates.trackingNumber = trackingNumber;
    if (paymentStatus) updates.paymentStatus = paymentStatus;

    const order = await Order.findByIdAndUpdate(id, updates, { new: true });
    if (!order) {
      res.status(404).json({ success: false, message: "Order not found" });
      return;
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};
