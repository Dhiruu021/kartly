import mongoose, { Document, Schema } from "mongoose";

export interface IFinish {
  name: string;
  color: string;
  image?: string;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  category: string; // slug of category or category ID
  price: number;
  salePrice?: number;
  stock: number;
  status: "active" | "draft" | "archived";
  tint: "sage" | "butter" | "sand" | "blush" | "sky" | "stone";
  image: string;
  scene?: string;
  gallery: string[];
  badge?: string;
  blurb: string;
  finishes: IFinish[];
  details: string[];
  dimensions?: string;
  care?: string;
  rating: number;
  reviewsCount: number;
  isFeatured: boolean;
  position: number;
  createdAt: Date;
  updatedAt: Date;
}

const FinishSchema = new Schema<IFinish>(
  {
    name: { type: String, required: true },
    color: { type: String, required: true },
    image: { type: String },
  },
  { _id: false }
);

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, index: true },
    category: { type: String, required: true, index: true },
    price: { type: Number, required: true, min: 0 },
    salePrice: { type: Number, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 10 },
    status: {
      type: String,
      enum: ["active", "draft", "archived"],
      default: "active",
      index: true,
    },
    tint: {
      type: String,
      enum: ["sage", "butter", "sand", "blush", "sky", "stone"],
      default: "sand",
    },
    image: { type: String, required: true },
    scene: { type: String },
    gallery: [{ type: String }],
    badge: { type: String, default: null },
    blurb: { type: String, required: true },
    finishes: [FinishSchema],
    details: [{ type: String }],
    dimensions: { type: String, default: "" },
    care: { type: String, default: "" },
    rating: { type: Number, default: 4.8, min: 0, max: 5 },
    reviewsCount: { type: Number, default: 0, min: 0 },
    isFeatured: { type: Boolean, default: false },
    position: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ProductSchema.index({ name: "text", blurb: "text", category: "text" });

export const Product = mongoose.model<IProduct>("Product", ProductSchema);
