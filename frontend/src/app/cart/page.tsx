"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Tag,
  ShieldCheck,
  Truck,
  RotateCcw,
} from "lucide-react";

export default function CartPage() {
  const router = useRouter();
  const {
    items,
    count,
    subtotal,
    shipping,
    discount,
    total,
    coupon,
    updateQuantity,
    removeItem,
    clearCart,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponCode, setCouponCode] = useState("");
  const [couponMsg, setCouponMsg] = useState<{ text: string; error: boolean } | null>(null);
  const [loadingCoupon, setLoadingCoupon] = useState(false);

  const freeShippingThreshold = 1999;
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setLoadingCoupon(true);
    setCouponMsg(null);
    const res = await applyCoupon(couponCode.trim());
    setLoadingCoupon(false);
    if (res.success) {
      setCouponMsg({ text: res.message, error: false });
      setCouponCode("");
    } else {
      setCouponMsg({ text: res.message, error: true });
    }
  };

  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-ink tracking-tight">
              Shopping Bag
            </h1>
            <p className="text-sm text-ink-soft mt-1">
              Review your calm home objects before proceeding to delivery
            </p>
          </div>
          <Link
            href="/shop"
            className="text-xs font-mono uppercase tracking-wider text-ink-soft hover:text-ink inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="size-3.5" /> Continue Shopping
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="tile rounded-[28px] p-12 text-center my-12 border border-line">
            <div className="size-16 rounded-3xl bg-sand/40 mx-auto flex items-center justify-center mb-4">
              <ShoppingBag className="size-8 text-ink-faint" />
            </div>
            <h3 className="text-lg font-display font-medium text-ink mb-1">
              Your shopping bag is empty
            </h3>
            <p className="text-xs text-ink-soft max-w-sm mx-auto mb-6">
              You haven't added any pieces to your bag yet. Explore our handcrafted furniture, lighting, and textiles.
            </p>
            <Link
              href="/shop"
              className="px-6 py-3 rounded-full bg-ink text-canvas hover:bg-ink/90 text-xs font-mono uppercase tracking-wider transition-colors inline-flex items-center gap-2"
            >
              Browse Objects <ArrowRight className="size-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Items Column */}
            <div className="lg:col-span-8 space-y-4">
              {/* Free delivery indicator */}
              <div className="tile rounded-[24px] p-4 sm:p-5 bg-card border border-line">
                <div className="flex justify-between items-center text-xs font-mono mb-2">
                  <span className="text-ink-soft">
                    {amountToFreeShipping > 0
                      ? `Add ${formatPrice(amountToFreeShipping)} more for complimentary shipping`
                      : "🎉 You qualify for free standard delivery"}
                  </span>
                  <span className="text-ink font-semibold">{Math.round(progressPercent)}%</span>
                </div>
                <div className="w-full h-2 bg-canvas rounded-full overflow-hidden">
                  <div
                    className="h-full bg-ok transition-all duration-500 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Items List */}
              <div className="tile rounded-[28px] bg-card border border-line divide-y divide-line/60 overflow-hidden">
                {items.map((item) => (
                  <div key={`${item.productId}-${item.finishName}`} className="p-5 sm:p-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
                    <div className="flex gap-4 items-center">
                      <div className="size-20 sm:size-24 rounded-2xl overflow-hidden bg-sand/30 shrink-0">
                        <img src={item.image} alt={item.name} className="size-full object-cover" />
                      </div>
                      <div className="space-y-1">
                        <Link href={`/products/${item.slug}`} className="text-base font-display font-semibold text-ink hover:text-accent transition-colors">
                          {item.name}
                        </Link>
                        <div className="flex items-center gap-1.5 text-xs text-ink-soft font-mono">
                          <span className="size-2.5 rounded-full border border-black/10" style={{ backgroundColor: item.finishColor }} />
                          <span>{item.finishName}</span>
                        </div>
                        <p className="text-xs font-mono text-ink-faint tabular">
                          {formatPrice(item.price)} each
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-line rounded-full bg-canvas p-1">
                        <button
                          onClick={() => updateQuantity(item.productId, item.finishName, item.quantity - 1)}
                          className="p-1.5 rounded-full hover:bg-card text-ink-soft hover:text-ink transition-colors"
                        >
                          <Minus className="size-3" />
                        </button>
                        <span className="px-3 text-xs font-mono font-medium text-ink tabular">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.finishName, item.quantity + 1)}
                          className="p-1.5 rounded-full hover:bg-card text-ink-soft hover:text-ink transition-colors"
                        >
                          <Plus className="size-3" />
                        </button>
                      </div>

                      {/* Total for item */}
                      <span className="text-base font-display font-medium text-ink tabular w-20 text-right">
                        {formatPrice(item.price * item.quantity)}
                      </span>

                      {/* Remove */}
                      <button
                        onClick={() => removeItem(item.productId, item.finishName)}
                        className="text-ink-faint hover:text-danger p-1 transition-colors"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Clear bag */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={clearCart}
                  className="text-xs font-mono text-ink-faint hover:text-danger underline transition-colors"
                >
                  Clear Entire Bag
                </button>
              </div>
            </div>

            {/* Summary Column */}
            <div className="lg:col-span-4 space-y-4">
              <div className="tile rounded-[28px] p-6 bg-card border border-line space-y-5">
                <h3 className="text-lg font-display font-semibold text-ink">Order Summary</h3>

                {/* Promo Code Form */}
                <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="size-3.5 text-ink-faint absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="Coupon code (e.g. KARTLY10)"
                        className="w-full pl-8 pr-3 py-2 text-xs font-mono uppercase bg-canvas border border-line rounded-xl text-ink placeholder:text-ink-faint outline-none focus:border-ink/50"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loadingCoupon}
                      className="px-3 py-2 rounded-xl bg-sand hover:bg-sand/80 text-ink text-xs font-mono font-medium transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {couponMsg && (
                    <p className={`text-[11px] font-mono ${couponMsg.error ? "text-danger" : "text-ok"}`}>
                      {couponMsg.text}
                    </p>
                  )}
                  {coupon && (
                    <div className="flex items-center justify-between text-[11px] font-mono text-ok bg-ok-soft/40 px-2 py-1 rounded-lg">
                      <span>Promo code {coupon.code} active</span>
                      <button onClick={removeCoupon} className="text-ink-faint hover:text-ink">
                        Remove
                      </button>
                    </div>
                  )}
                </form>

                {/* Calculation breakdown */}
                <div className="space-y-2.5 text-xs font-mono text-ink-soft pt-3 border-t border-line/60">
                  <div className="flex justify-between">
                    <span>Subtotal ({count} items)</span>
                    <span className="text-ink tabular">{formatPrice(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-ok">
                      <span>Discount ({coupon?.code})</span>
                      <span className="tabular">-{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Estimated Shipping</span>
                    <span className="text-ink tabular">{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
                  </div>
                  <div className="flex justify-between text-base font-display font-semibold text-ink pt-3 border-t border-line">
                    <span>Total</span>
                    <span className="tabular">{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Checkout CTA */}
                <button
                  onClick={() => router.push("/checkout")}
                  className="w-full py-4 rounded-full bg-ink text-canvas hover:bg-ink/90 font-mono text-xs uppercase tracking-wider font-semibold transition-all shadow-md flex items-center justify-center gap-2"
                >
                  Proceed to Checkout <ArrowRight className="size-4" />
                </button>
              </div>

              {/* Guarantees */}
              <div className="tile rounded-[24px] p-5 bg-card border border-line space-y-3 text-xs font-mono text-ink-soft">
                <div className="flex items-center gap-2.5">
                  <Truck className="size-4 text-ink-faint" />
                  <span>Ships in 48 hours with carbon-neutral transit</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <RotateCcw className="size-4 text-ink-faint" />
                  <span>30-day calm returns if not completely harmonious</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="size-4 text-ink-faint" />
                  <span>Bank-grade 256-bit encrypted checkout</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
