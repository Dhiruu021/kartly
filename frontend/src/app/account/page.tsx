"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { IOrder } from "@/lib/types";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import {
  User,
  Package,
  Heart,
  MapPin,
  LogOut,
  Clock,
  Truck,
  CheckCircle2,
  Trash2,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Plus,
} from "lucide-react";

export default function AccountPage() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();
  const { wishlist, toggleWishlist } = useWishlist();
  const { addItem } = useCart();

  const [activeTab, setActiveTab] = useState<"orders" | "wishlist" | "addresses">("orders");
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Address form modal
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newStreet, setNewStreet] = useState("");
  const [newCity, setNewCity] = useState("");
  const [newState, setNewState] = useState("");
  const [newPostal, setNewPostal] = useState("");
  const [newCountry, setNewCountry] = useState("India");
  const [newPhone, setNewPhone] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#wishlist") {
      setActiveTab("wishlist");
    }
  }, []);

  useEffect(() => {
    if (user) {
      const fetchOrders = async () => {
        setLoadingOrders(true);
        try {
          const res = await api.getMyOrders();
          setOrders(res.orders || []);
        } catch (e) {
          console.error("Failed to load customer orders", e);
        } finally {
          setLoadingOrders(false);
        }
      };
      fetchOrders();
    }
  }, [user]);

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet || !newCity || !newPostal) return;
    try {
      const updatedAddresses = [
        ...(user?.addresses || []),
        {
          fullName: user?.name || "Customer",
          phone: newPhone,
          street: newStreet,
          city: newCity,
          state: newState,
          postalCode: newPostal,
          country: newCountry || "India",
          isDefault: (user?.addresses?.length || 0) === 0,
        },
      ];
      await api.updateProfile({ addresses: updatedAddresses });
      setShowAddressForm(false);
      setNewStreet("");
      setNewCity("");
      setNewState("");
      setNewPostal("");
      setNewCountry("India");
      setNewPhone("");
      window.location.reload();
    } catch (err) {
      console.error("Failed to save address", err);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-canvas flex flex-col">
        <AnnouncementBar />
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="size-8 rounded-full border-2 border-ink border-t-transparent animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-canvas flex flex-col">
        <AnnouncementBar />
        <Header />
        <main className="flex-1 max-w-md mx-auto px-4 py-20 text-center">
          <div className="tile rounded-[28px] p-8 sm:p-10 bg-card border border-line space-y-5">
            <div className="size-16 rounded-3xl bg-sand/40 text-ink mx-auto flex items-center justify-center">
              <User className="size-8 text-ink-soft" />
            </div>
            <h2 className="text-2xl font-display font-bold text-ink">Sign In Required</h2>
            <p className="text-xs text-ink-soft leading-relaxed">
              Please sign in to view your orders, saved addresses, and persistent wishlist.
            </p>
            <div className="space-y-2 pt-2">
              <Link
                href="/login"
                className="w-full py-3.5 rounded-full bg-ink text-canvas hover:bg-ink/90 font-mono text-xs uppercase tracking-wider font-semibold transition-all inline-block text-center shadow-sm"
              >
                Sign In to Account
              </Link>
              <Link
                href="/register"
                className="w-full py-3 rounded-full bg-canvas border border-line text-ink hover:border-ink/40 font-mono text-xs uppercase tracking-wider transition-colors inline-block text-center"
              >
                Create New Account
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return <span className="px-2.5 py-0.5 rounded-full bg-ok-soft text-ok font-mono text-xs">Delivered</span>;
      case "shipped":
        return <span className="px-2.5 py-0.5 rounded-full bg-sky text-ink font-mono text-xs">In Transit</span>;
      case "packing":
        return <span className="px-2.5 py-0.5 rounded-full bg-butter text-ink font-mono text-xs">Packing</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full bg-sand text-ink font-mono text-xs">Confirmed</span>;
    }
  };

  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
        {/* Profile Banner */}
        <div className="tile rounded-[28px] p-6 sm:p-8 bg-card border border-line flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="size-16 rounded-2xl bg-sand/60 flex items-center justify-center text-ink font-display text-2xl font-bold">
              {user.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-display font-bold text-ink">{user.name}</h1>
                {user.role === "admin" && (
                  <span className="px-2 py-0.5 rounded-full bg-accent-soft text-accent text-[10px] font-mono font-medium">
                    Admin
                  </span>
                )}
              </div>
              <p className="text-xs font-mono text-ink-soft">{user.email}</p>
            </div>
          </div>

          <button
            onClick={() => {
              logout();
              router.push("/");
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-line hover:border-danger/40 text-ink-soft hover:text-danger text-xs font-mono transition-colors"
          >
            <LogOut className="size-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 border-b border-line/70 mb-8 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-mono transition-all ${
              activeTab === "orders"
                ? "bg-ink text-canvas font-medium shadow-sm"
                : "text-ink-soft hover:text-ink hover:bg-card"
            }`}
          >
            <Package className="size-4" />
            <span>Order History ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("wishlist")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-mono transition-all ${
              activeTab === "wishlist"
                ? "bg-ink text-canvas font-medium shadow-sm"
                : "text-ink-soft hover:text-ink hover:bg-card"
            }`}
          >
            <Heart className="size-4" />
            <span>Saved Pieces ({wishlist.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("addresses")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-mono transition-all ${
              activeTab === "addresses"
                ? "bg-ink text-canvas font-medium shadow-sm"
                : "text-ink-soft hover:text-ink hover:bg-card"
            }`}
          >
            <MapPin className="size-4" />
            <span>Shipping Addresses ({user.addresses?.length || 0})</span>
          </button>
        </div>

        {/* TAB 1: Order History */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            {loadingOrders ? (
              <div className="p-12 text-center text-ink-soft">Loading orders...</div>
            ) : orders.length === 0 ? (
              <div className="tile rounded-[28px] p-12 text-center bg-card border border-line">
                <Package className="size-10 text-ink-faint mx-auto mb-3" />
                <h3 className="text-base font-display font-medium text-ink">No orders yet</h3>
                <p className="text-xs text-ink-soft max-w-xs mx-auto mb-5">
                  When you acquire pieces from Kartly, their packaging status and tracking will appear here.
                </p>
                <Link
                  href="/shop"
                  className="px-5 py-2.5 rounded-full bg-ink text-canvas text-xs font-mono uppercase tracking-wider inline-flex items-center gap-2"
                >
                  Explore Objects <ArrowRight className="size-3" />
                </Link>
              </div>
            ) : (
              orders.map((ord) => (
                <div
                  key={ord._id}
                  className="tile rounded-[28px] p-6 sm:p-8 bg-card border border-line space-y-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-line/60 text-xs font-mono">
                    <div className="flex items-center gap-3">
                      <div>
                        <span className="text-ink-faint block">Order</span>
                        <span className="text-ink font-semibold">{ord.orderNumber}</span>
                      </div>
                      <div>
                        <span className="text-ink-faint block">Date</span>
                        <span className="text-ink">{new Date(ord.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {getStatusBadge(ord.status)}
                      <span className="font-semibold text-ink text-sm tabular">{formatPrice(ord.total)}</span>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="space-y-3">
                    {ord.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="size-14 rounded-xl overflow-hidden bg-sand/30 shrink-0">
                            <img src={item.image} alt={item.name} className="size-full object-cover" />
                          </div>
                          <div className="text-xs">
                            <Link href={`/products/${item.slug}`} className="font-medium text-ink hover:text-accent">
                              {item.name}
                            </Link>
                            <p className="text-ink-soft text-[11px] font-mono">
                              {item.finishName} × {item.quantity}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs font-mono text-ink tabular">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Destination & Tracking */}
                  <div className="pt-3 border-t border-line/50 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-ink-soft">
                    <span>Delivered to: {ord.shippingAddress.street}, {ord.shippingAddress.city}</span>
                    {ord.trackingNumber && (
                      <span className="text-accent font-medium">Tracking: {ord.trackingNumber}</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: Saved Wishlist */}
        {activeTab === "wishlist" && (
          <div>
            {wishlist.length === 0 ? (
              <div className="tile rounded-[28px] p-12 text-center bg-card border border-line">
                <Heart className="size-10 text-ink-faint mx-auto mb-3" />
                <h3 className="text-base font-display font-medium text-ink">No saved pieces</h3>
                <p className="text-xs text-ink-soft max-w-xs mx-auto mb-5">
                  Click the heart icon on any product to save pieces you admire for later.
                </p>
                <Link
                  href="/shop"
                  className="px-5 py-2.5 rounded-full bg-ink text-canvas text-xs font-mono uppercase tracking-wider inline-flex items-center gap-2"
                >
                  Browse Catalog <ArrowRight className="size-3" />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlist.map((prod) => (
                  <div
                    key={prod._id || prod.id}
                    className="tile rounded-[28px] p-4 bg-card border border-line flex flex-col justify-between"
                  >
                    <div>
                      <div className="aspect-[4/5] rounded-[22px] overflow-hidden bg-sand/30 p-4 relative mb-3">
                        <button
                          onClick={() => toggleWishlist(prod)}
                          className="absolute top-3 right-3 size-8 rounded-full bg-card text-danger shadow-sm flex items-center justify-center"
                        >
                          <Trash2 className="size-4" />
                        </button>
                        <img src={prod.image} alt={prod.name} className="size-full object-contain mix-blend-multiply" />
                      </div>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-ink-faint block mb-1">
                        {prod.category}
                      </span>
                      <Link href={`/products/${prod.slug}`} className="text-base font-display font-semibold text-ink hover:text-accent">
                        {prod.name}
                      </Link>
                    </div>

                    <div className="mt-4 pt-3 border-t border-line/60 flex items-center justify-between">
                      <span className="text-sm font-medium text-ink tabular">{formatPrice(prod.price)}</span>
                      <button
                        onClick={() => addItem(prod, 1)}
                        className="px-3 py-1.5 rounded-full bg-ink text-canvas hover:bg-ink/90 text-xs font-mono flex items-center gap-1.5"
                      >
                        <ShoppingBag className="size-3" /> Move to Bag
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Saved Addresses */}
        {activeTab === "addresses" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-display font-semibold text-ink">Saved Shipping Destinations</h3>
              <button
                onClick={() => setShowAddressForm(!showAddressForm)}
                className="px-4 py-2 rounded-full bg-ink text-canvas text-xs font-mono uppercase tracking-wider flex items-center gap-1.5"
              >
                <Plus className="size-3.5" /> Add Address
              </button>
            </div>

            {showAddressForm && (
              <form onSubmit={handleSaveAddress} className="tile rounded-[28px] p-6 bg-card border border-line space-y-4 max-w-lg">
                <h4 className="text-sm font-display font-semibold text-ink">New Shipping Address</h4>
                <div className="space-y-3 text-xs font-mono">
                  <input
                    type="text"
                    required
                    placeholder="Street Address"
                    value={newStreet}
                    onChange={(e) => setNewStreet(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-canvas border border-line text-ink outline-none"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="City"
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-canvas border border-line text-ink outline-none"
                    />
                    <input
                      type="text"
                      placeholder="State (e.g. OR)"
                      value={newState}
                      onChange={(e) => setNewState(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-canvas border border-line text-ink outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Postal / PIN Code"
                      value={newPostal}
                      onChange={(e) => setNewPostal(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-canvas border border-line text-ink outline-none"
                    />
                    <select
                      value={newCountry}
                      onChange={(e) => setNewCountry(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-canvas border border-line text-ink outline-none"
                    >
                      <option value="India">India (IN)</option>
                      <option value="United States">United States (US)</option>
                      <option value="United Kingdom">United Kingdom (UK)</option>
                      <option value="United Arab Emirates">United Arab Emirates (UAE)</option>
                      <option value="Canada">Canada (CA)</option>
                      <option value="Australia">Australia (AU)</option>
                      <option value="Germany">Germany (DE)</option>
                      <option value="France">France (FR)</option>
                      <option value="Singapore">Singapore (SG)</option>
                      <option value="Japan">Japan (JP)</option>
                      <option value="Netherlands">Netherlands (NL)</option>
                      <option value="Worldwide">Other / Worldwide</option>
                    </select>
                  </div>
                  <div>
                    <input
                      type="tel"
                      placeholder="Phone (+91 / International)"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-canvas border border-line text-ink outline-none"
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button type="submit" className="px-4 py-2 rounded-xl bg-ink text-canvas text-xs">
                      Save Address
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddressForm(false)}
                      className="px-4 py-2 rounded-xl bg-canvas border border-line text-ink-soft text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {user.addresses && user.addresses.length > 0 ? (
                user.addresses.map((addr, idx) => (
                  <div key={idx} className="tile rounded-[24px] p-5 bg-card border border-line space-y-2 text-xs font-mono">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-ink">{addr.fullName}</span>
                      {addr.isDefault && (
                        <span className="px-2 py-0.5 rounded-full bg-sand text-ink text-[10px]">Default</span>
                      )}
                    </div>
                    <p className="text-ink-soft">{addr.street} {addr.apartment}</p>
                    <p className="text-ink-soft">{addr.city}, {addr.state} {addr.postalCode}</p>
                    <p className="text-ink-soft">{addr.country}</p>
                    {addr.phone && <p className="text-ink-faint">Phone: {addr.phone}</p>}
                  </div>
                ))
              ) : (
                <div className="tile rounded-[24px] p-6 bg-card border border-line text-center sm:col-span-2">
                  <p className="text-xs text-ink-soft">No addresses saved yet.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
