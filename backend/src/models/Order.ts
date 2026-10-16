import mongoose, { Document, Schema } from "mongoose";

export interface IOrderItem {
  productId: string;
  name: string;
  slug: string;
  price: number;
  finishName?: string;
  finishColor?: string;
  quantity: number;
  image: string;
}

export interface IOrder extends Document {
  orderNumber: string;
  customer?: mongoose.Types.ObjectId;
  guestEmail?: string;
  customerName: string;
  customerPhone?: string;
  items: IOrderItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  shippingFee: number;
  total: number;
  status: "paid" | "packing" | "shipped" | "delivered" | "cancelled" | "refunded";
  paymentStatus: "unpaid" | "paid" | "failed" | "refunded";
  paymentMethod: "card" | "upi" | "cod" | "netbanking";
  shippingAddress: {
    fullName: string;
    phone?: string;
    street: string;
    apartment?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  trackingNumber?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    productId: { type: String, required: true },
    name: { type: String, required: true },
    slug: { type: String, required: true },
    price: { type: Number, required: true },
    finishName: { type: String },
    finishColor: { type: String },
    quantity: { type: Number, required: true, min: 1 },
    image: { type: String, required: true },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    customer: { type: Schema.Types.ObjectId, ref: "User", default: null, index: true },
    guestEmail: { type: String, lowercase: true, trim: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String },
    items: [OrderItemSchema],
    subtotal: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    couponCode: { type: String, default: null },
    shippingFee: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["paid", "packing", "shipped", "delivered", "cancelled", "refunded"],
      default: "paid",
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "failed", "refunded"],
      default: "paid",
    },
    paymentMethod: {
      type: String,
      enum: ["card", "upi", "cod", "netbanking"],
      default: "card",
    },
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String },
      street: { type: String, required: true },
      apartment: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true, default: "India" },
    },
    trackingNumber: { type: String, default: null },
    notes: { type: String },
  },
  { timestamps: true }
);

export const Order = mongoose.model<IOrder>("Order", OrderSchema);
