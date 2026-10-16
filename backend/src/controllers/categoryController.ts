import { Request, Response, NextFunction } from "express";
import { Category } from "../models/Category.js";
import { Product } from "../models/Product.js";

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

export const getCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ order: 1, name: 1 });

    // Aggregate product counts per category
    const counts = await Product.aggregate([
      { $match: { status: "active" } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    const countMap: Record<string, number> = {};
    counts.forEach((c) => {
      countMap[c._id] = c.count;
    });

    const totalProducts = await Product.countDocuments({ status: "active" });

    const categoriesWithCount = categories.map((cat) => ({
      id: cat.slug,
      _id: cat._id,
      name: cat.name,
      slug: cat.slug,
      tint: cat.tint,
      image: cat.image,
      description: cat.description,
      productCount: countMap[cat.slug] || 0,
    }));

    res.status(200).json({
      success: true,
      categories: categoriesWithCount,
      totalProducts,
    });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, tint, image, description } = req.body;
    const slug = slugify(name);

    const existing = await Category.findOne({ $or: [{ name }, { slug }] });
    if (existing) {
      res.status(409).json({ success: false, message: "A category with this name already exists" });
      return;
    }

    const count = await Category.countDocuments();
    const category = await Category.create({
      name,
      slug,
      tint: tint || "sand",
      image,
      description,
      order: count + 1,
    });

    res.status(201).json({ success: true, category });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.name) {
      updates.slug = slugify(updates.name);
    }

    const category = await Category.findByIdAndUpdate(id, updates, { new: true });
    if (!category) {
      res.status(404).json({ success: false, message: "Category not found" });
      return;
    }

    res.status(200).json({ success: true, category });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);

    if (!category) {
      res.status(404).json({ success: false, message: "Category not found" });
      return;
    }

    const productCount = await Product.countDocuments({ category: category.slug });
    if (productCount > 0) {
      res.status(400).json({
        success: false,
        message: `Cannot delete category: ${productCount} product(s) are still assigned to it. Reassign products first.`,
      });
      return;
    }

    await Category.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    next(error);
  }
};
