"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X, Plus, Minus, Trash2, ArrowRight, ShoppingBag, Sparkles, Tag, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";

export const CartDrawer: React.FC = () => {
  const {
    items,
    count,
    subtotal,
    shipping,
    discount,
    total,
    coupon,
    isDrawerOpen,
    closeDrawer,
    updateQuantity,
    removeItem,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponCode, setCouponCode] = useState("");
  const [couponMsg, setCouponMsg] = useState<{ text: string; error: boolean } | null>(null);
  const [loadingCoupon, setLoadingCoupon] = useState(false);
  const router = useRouter();

  if (!isDrawerOpen) return null;

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

  const proceedToCheckout = () => {
    closeDrawer();
    router.push("/checkout");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-ink/40 backdrop-blur-sm transition-opacity">
      <div className="absolute inset-0" onClick={closeDrawer} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-card border-l border-line flex flex-col shadow-lift">
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-line flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="size-5 text-ink" />
              <h2 className="text-lg font-display text-ink tracking-tight font-semibold">Your Bag</h2>
              <span className="px-2 py-0.5 rounded-full bg-sand text-ink text-xs font-mono font-medium">
                {count}
              </span>
            </div>
            <button
              onClick={closeDrawer}
              className="p-1.5 rounded-full text-ink-soft hover:text-ink hover:bg-canvas transition-colors"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Free shipping progress bar */}
          <div className="px-5 sm:px-6 py-3.5 bg-canvas/60 border-b border-line/70">
            <div className="flex items-center justify-between text-xs font-mono mb-1.5">
              <span className="text-ink-soft">
                {amountToFreeShipping > 0
                  ? `Add ${formatPrice(amountToFreeShipping)} for free delivery`
                  : "🎉 Free standard delivery unlocked"}
              </span>
              <span className="text-ink font-medium">{Math.round(progressPercent)}%</span>
            </div>
            <div className="w-full h-1.5 bg-line rounded-full overflow-hidden">
              <div
                className="h-full bg-ok transition-all duration-500 ease-out rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Item List */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16">
                <div className="size-16 rounded-3xl bg-sand/40 flex items-center justify-center mb-4">
                  <ShoppingBag className="size-8 text-ink-faint" />
                </div>
                <h3 className="text-base font-display font-medium text-ink mb-1">Your bag is empty</h3>
                <p className="text-xs text-ink-soft max-w-xs mb-6">
                  Explore calm handcrafted furniture, lighting, and textiles for your home.
                </p>
                <button
                  onClick={() => {
                    closeDrawer();
                    router.push("/shop");
                  }}
                  className="px-5 py-2.5 rounded-full bg-ink text-canvas hover:bg-ink/90 text-xs font-mono uppercase tracking-wider transition-colors inline-flex items-center gap-2"
                >
                  Browse Shop <ArrowRight className="size-3.5" />
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={`${item.productId}-${item.finishName}`}
                  className="flex gap-4 p-3 rounded-2xl bg-canvas/40 border border-line/60 transition-colors"
                >
                  <div className="size-20 rounded-xl overflow-hidden bg-sand/30 shrink-0">
                    <img src={item.image} alt={item.name} className="size-full object-cover" />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/products/${item.slug}`}
                          onClick={closeDrawer}
                          className="text-sm font-medium text-ink hover:text-accent transition-colors truncate"
                        >
                          {item.name}
                        </Link>
                        <span className="text-sm font-medium text-ink tabular shrink-0">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span
                          className="size-2.5 rounded-full border border-black/10"
                          style={{ backgroundColor: item.finishColor }}
                        />
                        <span className="text-xs text-ink-soft">{item.finishName}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-line/40">
                      <div className="flex items-center border border-line rounded-lg bg-card overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.productId, item.finishName, item.quantity - 1)}
                          className="p-1 hover:bg-canvas text-ink-soft hover:text-ink transition-colors"
                        >
                          <Minus className="size-3" />
                        </button>
                        <span className="px-2.5 text-xs font-mono text-ink font-medium tabular">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.finishName, item.quantity + 1)}
                          className="p-1 hover:bg-canvas text-ink-soft hover:text-ink transition-colors"
                        >
                          <Plus className="size-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.productId, item.finishName)}
                        className="text-ink-faint hover:text-danger text-xs transition-colors flex items-center gap-1 p-1"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer with totals and checkout */}
          {items.length > 0 && (
            <div className="p-5 sm:p-6 border-t border-line bg-card space-y-4">
              {/* Promo input */}
              <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="size-3.5 text-ink-faint absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Promo code (e.g. KARTLY10)"
                      className="w-full pl-8 pr-3 py-2 text-xs font-mono uppercase bg-canvas border border-line rounded-xl text-ink placeholder:text-ink-faint outline-none focus:border-ink/40"
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
                {coupon && !couponMsg && (
                  <div className="flex items-center justify-between text-[11px] font-mono text-ok bg-ok-soft/40 px-2 py-1 rounded-lg">
                    <span>Code {coupon.code} active</span>
                    <button onClick={removeCoupon} className="text-ink-faint hover:text-ink">
                      Remove
                    </button>
                  </div>
                )}
              </form>

              {/* Subtotal lines */}
              <div className="space-y-2 text-xs font-mono text-ink-soft pt-2 border-t border-line/60">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-ink tabular">{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-ok">
                    <span>Discount ({coupon?.code})</span>
                    <span className="tabular">-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-ink tabular">{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between text-sm font-sans font-semibold text-ink pt-2 border-t border-line">
                  <span>Total</span>
                  <span className="tabular font-display text-base">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <button
                onClick={proceedToCheckout}
                className="w-full py-3.5 rounded-full bg-ink text-canvas hover:bg-ink/90 font-mono text-xs uppercase tracking-wider font-semibold transition-all shadow-md flex items-center justify-center gap-2"
              >
                Proceed to Checkout <ArrowRight className="size-4" />
              </button>

              <button
                onClick={closeDrawer}
                className="w-full text-center text-xs text-ink-soft hover:text-ink underline underline-offset-4 py-1"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
