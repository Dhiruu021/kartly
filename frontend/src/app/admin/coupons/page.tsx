"use client";

import React, { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ICoupon } from "@/lib/types";
import { api } from "@/lib/api";
import { Plus, Trash2, X, TicketPercent } from "lucide-react";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<ICoupon[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage");
  const [discountValue, setDiscountValue] = useState("");
  const [minOrderValue, setMinOrderValue] = useState("");
  const [usageLimit, setUsageLimit] = useState("500");
  const [submitting, setSubmitting] = useState(false);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await api.getCoupons();
      setCoupons(res.coupons || []);
    } catch (err) {
      console.error("Failed to load coupons", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !discountValue) return;
    setSubmitting(true);
    try {
      await api.createCoupon({
        code: code.trim().toUpperCase(),
        discountType,
        discountValue: Number(discountValue),
        minOrderValue: Number(minOrderValue || 0),
        usageLimit: Number(usageLimit || 1000),
      });
      setIsModalOpen(false);
      setCode("");
      setDiscountValue("");
      fetchCoupons();
    } catch (err: any) {
      alert(err.message || "Failed to create coupon");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, code: string) => {
    if (confirm(`Are you sure you want to delete coupon "${code}"?`)) {
      try {
        await api.deleteCoupon(id);
        fetchCoupons();
      } catch (err: any) {
        alert(err.message || "Failed to delete coupon");
      }
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-ink-faint">
              Promotions & Marketing
            </span>
            <h1 className="text-3xl font-display font-bold text-ink tracking-tight mt-1">
              Coupons ({coupons.length})
            </h1>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 rounded-full bg-ink text-canvas hover:bg-ink/90 text-xs font-mono uppercase tracking-wider font-semibold transition-all flex items-center gap-2 self-start shadow-sm"
          >
            <Plus className="size-4" /> Create Coupon
          </button>
        </div>

        {/* Coupons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {coupons.map((coupon) => (
            <div
              key={coupon._id}
              className="tile rounded-[28px] p-6 bg-card border border-line flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-3 py-1 rounded-full bg-sand text-ink text-xs font-mono font-bold tracking-wider">
                    {coupon.code}
                  </span>
                  <span className="text-xs font-mono text-ok bg-ok-soft px-2 py-0.5 rounded-full">
                    Active
                  </span>
                </div>

                <div className="text-2xl font-display font-bold text-ink mt-2">
                  {coupon.discountType === "percentage" ? `${coupon.discountValue}% OFF` : `$${coupon.discountValue} OFF`}
                </div>
                <p className="text-xs font-mono text-ink-soft mt-1">
                  {coupon.minOrderValue > 0 ? `On orders of $${coupon.minOrderValue} or more` : "No minimum order requirement"}
                </p>
              </div>

              <div className="pt-3 border-t border-line/60 flex items-center justify-between text-xs font-mono text-ink-faint">
                <span>Used: {coupon.timesUsed} / {coupon.usageLimit || "∞"}</span>
                <button
                  onClick={() => handleDelete(coupon._id, coupon.code)}
                  className="p-1 rounded text-ink-faint hover:text-danger"
                  title="Delete Coupon"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm animate-fadeIn">
            <div className="tile rounded-[28px] max-w-md w-full bg-card border border-line shadow-lift p-6 sm:p-8 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-line">
                <h3 className="text-xl font-display font-bold text-ink">Create Promotional Code</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-1 text-ink-soft hover:text-ink">
                  <X className="size-5" />
                </button>
              </div>

              <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs font-mono">
                <div className="space-y-1">
                  <label className="text-ink-soft">Coupon Code *</label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="e.g. SLOW20"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-canvas border border-line text-sm uppercase text-ink outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-ink-soft">Type</label>
                    <select
                      value={discountType}
                      onChange={(e) => setDiscountType(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-canvas border border-line text-xs font-mono text-ink outline-none"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Dollar ($)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-ink-soft">Discount Value *</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={discountValue}
                      onChange={(e) => setDiscountValue(e.target.value)}
                      placeholder={discountType === "percentage" ? "15" : "25"}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-canvas border border-line text-ink outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-ink-soft">Min Order ($)</label>
                    <input
                      type="number"
                      min={0}
                      value={minOrderValue}
                      onChange={(e) => setMinOrderValue(e.target.value)}
                      placeholder="0"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-canvas border border-line text-ink outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-ink-soft">Usage Limit</label>
                    <input
                      type="number"
                      min={1}
                      value={usageLimit}
                      onChange={(e) => setUsageLimit(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-canvas border border-line text-ink outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-line">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-full border border-line text-ink-soft text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 rounded-full bg-ink text-canvas hover:bg-ink/90 text-xs font-mono uppercase tracking-wider font-semibold"
                  >
                    {submitting ? "Saving..." : "Create Coupon"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
