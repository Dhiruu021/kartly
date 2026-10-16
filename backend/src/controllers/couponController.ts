import { Request, Response, NextFunction } from "express";
import { Coupon } from "../models/Coupon.js";

export const validateCoupon = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { code, subtotal } = req.body;

    if (!code || typeof code !== "string") {
      res.status(400).json({ success: false, message: "Coupon code is required" });
      return;
    }

    const orderSubtotal = Number(subtotal) || 0;
    const coupon = await Coupon.findOne({ code: code.trim().toUpperCase(), isActive: true });

    if (!coupon) {
      res.status(404).json({ success: false, message: "Invalid promotional code" });
      return;
    }

    const now = new Date();
    if (coupon.expiryDate && coupon.expiryDate < now) {
      res.status(400).json({ success: false, message: "This coupon code has expired" });
      return;
    }

    if (coupon.usageLimit && coupon.timesUsed >= coupon.usageLimit) {
      res.status(400).json({ success: false, message: "This coupon code has reached its maximum usage limit" });
      return;
    }

    if (coupon.minOrderValue && orderSubtotal < coupon.minOrderValue) {
      res.status(400).json({
        success: false,
        message: `Order subtotal must be at least $${coupon.minOrderValue} to use this coupon`,
      });
      return;
    }

    let discountAmount = 0;
    if (coupon.discountType === "percentage") {
      discountAmount = (orderSubtotal * coupon.discountValue) / 100;
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else {
      discountAmount = coupon.discountValue;
    }

    discountAmount = Math.min(discountAmount, orderSubtotal);

    res.status(200).json({
      success: true,
      valid: true,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discountAmount,
      message: `Coupon "${coupon.code}" applied successfully!`,
    });
  } catch (error) {
    next(error);
  }
};

export const getCoupons = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, coupons });
  } catch (error) {
    next(error);
  }
};

export const createCoupon = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { code, discountType, discountValue, minOrderValue, maxDiscount, expiryDate, usageLimit } = req.body;

    const existing = await Coupon.findOne({ code: code.toUpperCase() });
    if (existing) {
      res.status(409).json({ success: false, message: "A coupon with this code already exists" });
      return;
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase().trim(),
      discountType,
      discountValue: Number(discountValue),
      minOrderValue: Number(minOrderValue || 0),
      maxDiscount: maxDiscount ? Number(maxDiscount) : undefined,
      expiryDate: expiryDate ? new Date(expiryDate) : undefined,
      usageLimit: usageLimit ? Number(usageLimit) : 1000,
      isActive: true,
    });

    res.status(201).json({ success: true, coupon });
  } catch (error) {
    next(error);
  }
};

export const deleteCoupon = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    await Coupon.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Coupon deleted successfully" });
  } catch (error) {
    next(error);
  }
};
