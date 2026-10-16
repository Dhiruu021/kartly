"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import {
  DollarSign,
  Package,
  ShoppingBag,
  Users,
  AlertTriangle,
  ArrowRight,
  Clock,
  CheckCircle2,
  Truck,
  Box,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [data, setData] = useState<{
    metrics: {
      totalRevenue: number;
      totalOrders: number;
      totalProducts: number;
      totalCustomers: number;
      lowStockCount: number;
      orderStatusBreakdown: Record<string, number>;
    };
    lowStockProducts: any[];
    recentOrders: any[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await api.getDashboardMetrics();
        setData(res);
      } catch (err) {
        console.error("Failed to load dashboard metrics", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-ink-faint">
            Administrative Control Center
          </span>
          <h1 className="text-3xl font-display font-bold text-ink tracking-tight mt-1">
            Store Overview
          </h1>
        </div>

        {/* Top Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="tile rounded-[24px] p-5 bg-card border border-line space-y-2">
            <span className="text-xs font-mono text-ink-soft">Total Revenue</span>
            <div className="text-2xl sm:text-3xl font-display font-bold text-ink tabular">
              {formatPrice(data?.metrics.totalRevenue || 0)}
            </div>
            <p className="text-[11px] font-mono text-ok">From authorized paid transactions</p>
          </div>

          <div className="tile rounded-[24px] p-5 bg-card border border-line space-y-2">
            <span className="text-xs font-mono text-ink-soft">Total Orders</span>
            <div className="text-2xl sm:text-3xl font-display font-bold text-ink tabular">
              {data?.metrics.totalOrders || 0}
            </div>
            <p className="text-[11px] font-mono text-ink-faint">Recorded across all customers</p>
          </div>

          <div className="tile rounded-[24px] p-5 bg-card border border-line space-y-2">
            <span className="text-xs font-mono text-ink-soft">Active Objects</span>
            <div className="text-2xl sm:text-3xl font-display font-bold text-ink tabular">
              {data?.metrics.totalProducts || 0}
            </div>
            <p className="text-[11px] font-mono text-ink-faint">Catalog items live on storefront</p>
          </div>

          <div className="tile rounded-[24px] p-5 bg-card border border-line space-y-2">
            <span className="text-xs font-mono text-ink-soft">Registered Customers</span>
            <div className="text-2xl sm:text-3xl font-display font-bold text-ink tabular">
              {data?.metrics.totalCustomers || 0}
            </div>
            <p className="text-[11px] font-mono text-ink-faint">Active shopper accounts</p>
          </div>
        </div>

        {/* Order Fulfillment Status Breakdown */}
        <div className="tile rounded-[28px] p-6 bg-card border border-line space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-display font-semibold text-ink">Fulfillment Pipeline</h3>
            <Link href="/admin/orders" className="text-xs font-mono text-accent hover:underline flex items-center gap-1">
              Manage Orders <ArrowRight className="size-3" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-sand/40 border border-line/60">
              <span className="text-xs font-mono text-ink-soft block mb-1">Paid / Queue</span>
              <span className="text-xl font-display font-bold text-ink tabular">
                {data?.metrics.orderStatusBreakdown?.paid || 0}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-butter/40 border border-line/60">
              <span className="text-xs font-mono text-ink-soft block mb-1">Packing at Studio</span>
              <span className="text-xl font-display font-bold text-ink tabular">
                {data?.metrics.orderStatusBreakdown?.packing || 0}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-sky/40 border border-line/60">
              <span className="text-xs font-mono text-ink-soft block mb-1">In Transit / Shipped</span>
              <span className="text-xl font-display font-bold text-ink tabular">
                {data?.metrics.orderStatusBreakdown?.shipped || 0}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-ok-soft/50 border border-line/60">
              <span className="text-xs font-mono text-ink-soft block mb-1">Delivered</span>
              <span className="text-xl font-display font-bold text-ok tabular">
                {data?.metrics.orderStatusBreakdown?.delivered || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Low Stock Alerts & Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Low Stock Alerts */}
          <div className="lg:col-span-5 tile rounded-[28px] p-6 bg-card border border-line space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="size-4 text-warn" />
                <h3 className="text-base font-display font-semibold text-ink">Low Stock Alerts</h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-warn-soft text-warn text-xs font-mono">
                {data?.lowStockProducts.length || 0} items
              </span>
            </div>

            <div className="space-y-3">
              {data?.lowStockProducts && data.lowStockProducts.length > 0 ? (
                data.lowStockProducts.map((p) => (
                  <div key={p._id} className="flex items-center justify-between p-3 rounded-2xl bg-canvas border border-line/60">
                    <div className="flex items-center gap-3">
                      <div className="size-12 rounded-xl overflow-hidden bg-sand/30 shrink-0">
                        <img src={p.image} alt={p.name} className="size-full object-cover" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-ink line-clamp-1">{p.name}</p>
                        <p className="text-[11px] font-mono text-ink-faint">{formatPrice(p.price)}</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-warn-soft text-warn font-mono text-xs font-semibold">
                      {p.stock} left
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-ink-soft py-4 text-center">All inventory levels healthy.</p>
              )}
            </div>
          </div>

          {/* Recent Orders List */}
          <div className="lg:col-span-7 tile rounded-[28px] p-6 bg-card border border-line space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-display font-semibold text-ink">Recent Orders</h3>
              <Link href="/admin/orders" className="text-xs font-mono text-accent hover:underline">
                View All →
              </Link>
            </div>

            <div className="space-y-3">
              {data?.recentOrders && data.recentOrders.length > 0 ? (
                data.recentOrders.map((ord) => (
                  <div key={ord._id} className="flex items-center justify-between p-3 rounded-2xl bg-canvas border border-line/60 text-xs font-mono">
                    <div>
                      <span className="font-semibold text-ink">{ord.orderNumber}</span>
                      <p className="text-ink-soft text-[11px]">{ord.customerName} · {ord.items?.length || 0} item(s)</p>
                    </div>
                    <div className="text-right">
                      <span className="text-ink font-semibold tabular">{formatPrice(ord.total)}</span>
                      <p className="text-[11px] text-ink-faint capitalize">{ord.status}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-ink-soft py-4 text-center">No orders registered yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
