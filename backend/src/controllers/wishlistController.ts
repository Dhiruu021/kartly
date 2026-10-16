import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { Wishlist } from "../models/Wishlist.js";
import { Product } from "../models/Product.js";

export const getWishlist = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Authentication required" });
      return;
    }

    let wishlist = await Wishlist.findOne({ user: req.user.id }).populate("products");
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user.id, products: [] });
    }

    res.status(200).json({ success: true, products: wishlist.products });
  } catch (error) {
    next(error);
  }
};

export const addToWishlist = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Authentication required" });
      return;
    }

    const { productId } = req.body;
    if (!productId) {
      res.status(400).json({ success: false, message: "Product ID is required" });
      return;
    }

    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ success: false, message: "Product not found" });
      return;
    }

    let wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user.id,
        products: [new mongoose.Types.ObjectId(productId)],
      });
    } else {
      const exists = wishlist.products.some((p) => p.toString() === productId);
      if (!exists) {
        wishlist.products.push(new mongoose.Types.ObjectId(productId));
        await wishlist.save();
      }
    }

    const populated = await Wishlist.findById(wishlist._id).populate("products");
    res.status(200).json({ success: true, products: populated?.products || [] });
  } catch (error) {
    next(error);
  }
};

export const removeFromWishlist = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Authentication required" });
      return;
    }

    const { productId } = req.params;
    const wishlist = await Wishlist.findOne({ user: req.user.id });
    if (wishlist) {
      wishlist.products = wishlist.products.filter((p) => p.toString() !== productId);
      await wishlist.save();
    }

    const populated = await Wishlist.findOne({ user: req.user.id }).populate("products");
    res.status(200).json({ success: true, products: populated?.products || [] });
  } catch (error) {
    next(error);
  }
};
