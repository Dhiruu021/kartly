import { ICategory, IProduct, IUser, IOrder, ICoupon } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const getHeaders = (token?: string): HeadersInit => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const activeToken = token || (typeof window !== "undefined" ? localStorage.getItem("kartly_token") : null);
  if (activeToken) {
    headers["Authorization"] = `Bearer ${activeToken}`;
  }
  return headers;
};

// Error wrapper
async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({ success: false, message: "Network error occurred" }));
  if (!res.ok) {
    throw new Error(data.message || `Request failed with status ${res.status}`);
  }
  return data;
}

export const api = {
  // Categories
  async getCategories(): Promise<{ categories: ICategory[]; totalProducts: number }> {
    const res = await fetch(`${API_BASE}/categories`, { next: { revalidate: 60 } });
    return handleResponse(res);
  },

  async createCategory(payload: Partial<ICategory>): Promise<{ category: ICategory }> {
    const res = await fetch(`${API_BASE}/categories`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  async updateCategory(id: string, payload: Partial<ICategory>): Promise<{ category: ICategory }> {
    const res = await fetch(`${API_BASE}/categories/${id}`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  async deleteCategory(id: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/categories/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Products
  async getProducts(params: {
    c?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
    search?: string;
    sort?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    products: IProduct[];
    total: number;
    page: number;
    totalPages: number;
    priceRange: { min: number; max: number };
  }> {
    const query = new URLSearchParams();
    if (params.c) query.set("c", params.c);
    if (params.category) query.set("category", params.category);
    if (params.minPrice !== undefined) query.set("minPrice", String(params.minPrice));
    if (params.maxPrice !== undefined) query.set("maxPrice", String(params.maxPrice));
    if (params.inStock) query.set("inStock", "true");
    if (params.search) query.set("search", params.search);
    if (params.sort) query.set("sort", params.sort);
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));

    const res = await fetch(`${API_BASE}/products?${query.toString()}`, { cache: "no-store" });
    return handleResponse(res);
  },

  async getProductBySlug(slug: string): Promise<{ product: IProduct; related: IProduct[] }> {
    const res = await fetch(`${API_BASE}/products/${slug}`, { cache: "no-store" });
    return handleResponse(res);
  },

  async createProduct(payload: Partial<IProduct>): Promise<{ product: IProduct }> {
    const res = await fetch(`${API_BASE}/products`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  async updateProduct(id: string, payload: Partial<IProduct>): Promise<{ product: IProduct }> {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  async deleteProduct(id: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Auth
  async register(name: string, email: string, password: string): Promise<{ token: string; user: IUser }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ name, email, password }),
    });
    return handleResponse(res);
  },

  async login(email: string, password: string): Promise<{ token: string; user: IUser }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(res);
  },

  async logout(): Promise<void> {
    await fetch(`${API_BASE}/auth/logout`, { method: "POST" }).catch(() => {});
  },

  async getMe(): Promise<{ user: IUser }> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async updateProfile(payload: { name?: string; addresses?: any[] }): Promise<{ user: IUser }> {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  // Orders
  async createOrder(payload: any): Promise<{ order: IOrder }> {
    const res = await fetch(`${API_BASE}/orders`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  async getMyOrders(): Promise<{ orders: IOrder[] }> {
    const res = await fetch(`${API_BASE}/orders/my-orders`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async getOrderById(id: string): Promise<{ order: IOrder }> {
    const res = await fetch(`${API_BASE}/orders/${id}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Admin Orders
  async adminGetOrders(params: { status?: string; search?: string; page?: number }): Promise<{
    orders: IOrder[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const query = new URLSearchParams();
    if (params.status) query.set("status", params.status);
    if (params.search) query.set("search", params.search);
    if (params.page) query.set("page", String(params.page));

    const res = await fetch(`${API_BASE}/orders/admin/all?${query.toString()}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async adminUpdateOrderStatus(id: string, payload: { status?: string; trackingNumber?: string }): Promise<{ order: IOrder }> {
    const res = await fetch(`${API_BASE}/orders/admin/${id}/status`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  // Coupons
  async validateCoupon(code: string, subtotal: number): Promise<{
    valid: boolean;
    code: string;
    discountType: "percentage" | "fixed";
    discountValue: number;
    discountAmount: number;
    message: string;
  }> {
    const res = await fetch(`${API_BASE}/coupons/validate`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ code, subtotal }),
    });
    return handleResponse(res);
  },

  async getCoupons(): Promise<{ coupons: ICoupon[] }> {
    const res = await fetch(`${API_BASE}/coupons`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async createCoupon(payload: Partial<ICoupon>): Promise<{ coupon: ICoupon }> {
    const res = await fetch(`${API_BASE}/coupons`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  async deleteCoupon(id: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/coupons/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Wishlist
  async getWishlist(): Promise<{ products: IProduct[] }> {
    const res = await fetch(`${API_BASE}/wishlist`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async addToWishlist(productId: string): Promise<{ products: IProduct[] }> {
    const res = await fetch(`${API_BASE}/wishlist/items`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ productId }),
    });
    return handleResponse(res);
  },

  async removeFromWishlist(productId: string): Promise<{ products: IProduct[] }> {
    const res = await fetch(`${API_BASE}/wishlist/items/${productId}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Admin Dashboard & Customers
  async getDashboardMetrics(): Promise<{
    metrics: {
      totalRevenue: number;
      totalOrders: number;
      totalProducts: number;
      totalCustomers: number;
      lowStockCount: number;
      orderStatusBreakdown: Record<string, number>;
    };
    lowStockProducts: IProduct[];
    recentOrders: IOrder[];
  }> {
    const res = await fetch(`${API_BASE}/admin/metrics`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async getCustomers(): Promise<{ customers: any[] }> {
    const res = await fetch(`${API_BASE}/admin/customers`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
};
