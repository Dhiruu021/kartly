export type Tint = "sage" | "butter" | "sand" | "blush" | "sky" | "stone";

export interface IFinish {
  name: string;
  color: string;
  image?: string;
}

export interface ICategory {
  id: string;
  _id?: string;
  name: string;
  slug: string;
  tint: Tint;
  image: string;
  description?: string;
  productCount?: number;
}

export interface IProduct {
  _id: string;
  id?: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  salePrice?: number;
  stock: number;
  status: "active" | "draft" | "archived";
  tint: Tint;
  image: string;
  scene?: string;
  gallery?: string[];
  badge?: string | null;
  blurb: string;
  finishes: IFinish[];
  details: string[];
  dimensions?: string;
  care?: string;
  rating: number;
  reviewsCount: number;
  isFeatured?: boolean;
  position?: number;
}

export interface ICartItem {
  productId: string;
  name: string;
  slug: string;
  price: number;
  finishName: string;
  finishColor: string;
  quantity: number;
  image: string;
  stock: number;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: "customer" | "admin";
  addresses?: Array<{
    fullName: string;
    phone?: string;
    street: string;
    apartment?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault?: boolean;
  }>;
}

export interface IOrder {
  _id: string;
  orderNumber: string;
  customer?: string;
  guestEmail?: string;
  customerName: string;
  customerPhone?: string;
  items: Array<{
    productId: string;
    name: string;
    slug: string;
    price: number;
    finishName?: string;
    finishColor?: string;
    quantity: number;
    image: string;
  }>;
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
  createdAt: string;
}

export interface ICoupon {
  _id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  usageLimit?: number;
  timesUsed: number;
  isActive: boolean;
}
