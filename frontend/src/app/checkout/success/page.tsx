"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { IOrder } from "@/lib/types";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { CheckCircle2, Truck, Package, Clock, ArrowRight, Loader2 } from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber");
  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderNumber) {
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const res = await api.getOrderById(orderNumber);
        setOrder(res.order);
      } catch (err) {
        console.error("Failed to load order confirmation", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderNumber]);

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas flex flex-col">
        <AnnouncementBar />
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="size-8 animate-spin text-ink-soft" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full space-y-8">
        {/* Success Header */}
        <div className="text-center space-y-3">
          <div className="size-16 rounded-3xl bg-ok-soft text-ok flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="size-8" />
          </div>
          <span className="text-xs font-mono uppercase tracking-wider text-ok font-semibold">
            Payment Confirmed
          </span>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-ink tracking-tight">
            Thank you for your order.
          </h1>
          <p className="text-sm text-ink-soft max-w-md mx-auto">
            Your piece is now queued for packaging at our studio. We will notify you once your order is
            dispatched with live tracking.
          </p>
        </div>

        {/* Order Details Bento Card */}
        {order ? (
          <div className="tile rounded-[28px] p-6 sm:p-8 bg-card border border-line space-y-6">
            {/* Order meta bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-line/60 text-xs font-mono">
              <div>
                <span className="text-ink-faint block">Order Reference</span>
                <span className="text-ink font-semibold text-sm">{order.orderNumber}</span>
              </div>
              <div>
                <span className="text-ink-faint block">Status</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-ok-soft text-ok font-medium">
                  ● {order.status.toUpperCase()}
                </span>
              </div>
              <div>
                <span className="text-ink-faint block">Estimated Dispatch</span>
                <span className="text-ink font-medium">Within 48 Hours</span>
              </div>
            </div>

            {/* Purchased Items List */}
            <div className="space-y-4">
              <h3 className="text-sm font-mono uppercase tracking-wider text-ink-faint">
                Ordered Objects ({order.items.length})
              </h3>
              <div className="space-y-3 divide-y divide-line/40">
                {order.items.map((it, idx) => (
                  <div key={idx} className="pt-3 first:pt-0 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="size-16 rounded-xl overflow-hidden bg-sand/30 shrink-0">
                        <img src={it.image} alt={it.name} className="size-full object-cover" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-ink">{it.name}</h4>
                        <div className="flex items-center gap-1.5 text-xs text-ink-soft font-mono mt-0.5">
                          <span className="size-2 rounded-full border border-black/10" style={{ backgroundColor: it.finishColor }} />
                          <span>{it.finishName} × {it.quantity}</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-ink tabular font-mono">
                      {formatPrice(it.price * it.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="pt-4 border-t border-line/60 space-y-2 text-xs font-mono text-ink-soft">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-ink tabular">{formatPrice(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-ok">
                  <span>Discount ({order.couponCode})</span>
                  <span className="tabular">-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-ink tabular">{order.shippingFee === 0 ? "Complimentary" : formatPrice(order.shippingFee)}</span>
              </div>
              <div className="flex justify-between text-base font-display font-semibold text-ink pt-3 border-t border-line">
                <span>Total Paid</span>
                <span className="tabular">{formatPrice(order.total)}</span>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="pt-4 border-t border-line/60 text-xs font-mono text-ink-soft">
              <span className="text-ink-faint block uppercase tracking-wider text-[10px] mb-1">
                Delivering To
              </span>
              <p className="text-ink font-medium">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.street} {order.shippingAddress.apartment}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>
        ) : (
          <div className="tile rounded-[28px] p-8 bg-card border border-line text-center">
            <p className="text-sm text-ink-soft">Order information could not be retrieved.</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/account"
            className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-ink text-canvas hover:bg-ink/90 font-mono text-xs uppercase tracking-wider font-semibold transition-colors text-center"
          >
            Track in My Account
          </Link>
          <Link
            href="/shop"
            className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-card border border-line text-ink hover:border-ink/40 font-mono text-xs uppercase tracking-wider transition-colors text-center"
          >
            Continue Shopping
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-canvas flex items-center justify-center">
          <Loader2 className="size-6 animate-spin text-ink-soft" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
