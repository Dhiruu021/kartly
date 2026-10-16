import { Request, Response, NextFunction } from "express";
import { Product, IProduct } from "../models/Product.js";

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

export const getProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      c,
      category,
      minPrice,
      maxPrice,
      inStock,
      search,
      q,
      sort = "featured",
      page = 1,
      limit = 50,
      status,
    } = req.query;

    const query: any = {};

    // Only active products for regular visitors
    if (status && req.user?.role === "admin") {
      query.status = status;
    } else {
      query.status = "active";
    }

    // Category filter
    const activeCategory = (c || category) as string;
    if (activeCategory && activeCategory !== "all") {
      query.category = activeCategory.toLowerCase();
    }

    // Price filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Stock filter
    if (inStock === "true") {
      query.stock = { $gt: 0 };
    }

    // Search query
    const searchQuery = (q || search) as string;
    if (searchQuery && searchQuery.trim() !== "") {
      const regex = new RegExp(searchQuery.trim(), "i");
      query.$or = [{ name: regex }, { blurb: regex }, { category: regex }];
    }

    // Sorting
    let sortOptions: any = { position: 1, createdAt: -1 };
    switch (sort) {
      case "newest":
        sortOptions = { createdAt: -1 };
        break;
      case "price-asc":
        sortOptions = { price: 1 };
        break;
      case "price-desc":
        sortOptions = { price: -1 };
        break;
      case "rating":
        sortOptions = { rating: -1 };
        break;
      case "name-asc":
        sortOptions = { name: 1 };
        break;
      case "name-desc":
        sortOptions = { name: -1 };
        break;
      case "featured":
      default:
        sortOptions = { isFeatured: -1, position: 1, createdAt: -1 };
        break;
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(query).sort(sortOptions).skip(skip).limit(limitNum),
      Product.countDocuments(query),
    ]);

    // Also get min and max price bounds for the catalog to power the price slider UI
    const priceBounds = await Product.aggregate([
      { $match: { status: "active" } },
      { $group: { _id: null, min: { $min: "$price" }, max: { $max: "$price" } } },
    ]);

    res.status(200).json({
      success: true,
      products,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      priceRange: priceBounds[0] ? { min: priceBounds[0].min, max: priceBounds[0].max } : { min: 0, max: 1000 },
    });
  } catch (error) {
    next(error);
  }
};

export const getProductBySlug = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { slug } = req.params;
    const product = await Product.findOne({ slug });

    if (!product) {
      res.status(404).json({ success: false, message: "Product not found" });
      return;
    }

    // Get related products from the same category
    const related = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      status: "active",
    }).limit(4);

    res.status(200).json({
      success: true,
      product,
      related,
    });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, category, price, salePrice, stock, tint, image, scene, gallery, badge, blurb, finishes, details, dimensions, care, isFeatured } = req.body;

    let baseSlug = slugify(name);
    let slug = baseSlug;
    let counter = 2;
    while (await Product.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const product = await Product.create({
      name,
      slug,
      category: category.toLowerCase(),
      price: Number(price),
      salePrice: salePrice ? Number(salePrice) : undefined,
      stock: Number(stock ?? 10),
      tint: tint || "sand",
      image,
      scene: scene || null,
      gallery: gallery || (scene ? [image, scene] : [image]),
      badge: badge || null,
      blurb,
      finishes: finishes || [{ name: "Standard", color: "#d8c4a4" }],
      details: details || [],
      dimensions: dimensions || "",
      care: care || "",
      isFeatured: Boolean(isFeatured),
      status: "active",
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.name && !updates.slug) {
      // Keep existing slug or update if explicitly desired
    }

    const product = await Product.findByIdAndUpdate(id, updates, { new: true });
    if (!product) {
      res.status(404).json({ success: false, message: "Product not found" });
      return;
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      res.status(404).json({ success: false, message: "Product not found" });
      return;
    }

    res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    next(error);
  }
};
