"use client";

import React, { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { IOrder } from "@/lib/types";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import {
  Search,
  CheckCircle2,
  Truck,
  Package,
  Clock,
  ChevronDown,
  ChevronUp,
  MapPin,
  ExternalLink,
} from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const [trackingInputs, setTrackingInputs] = useState<Record<string, string>>({});
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.adminGetOrders({
        status: statusFilter === "all" ? undefined : statusFilter,
        search: search.trim() || undefined,
      });
      setOrders(res.orders || []);
    } catch (err) {
      console.error("Failed to load admin orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, search]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      await api.adminUpdateOrderStatus(orderId, { status: newStatus });
      fetchOrders();
    } catch (err) {
      console.error("Failed to update status", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSaveTracking = async (orderId: string) => {
    const tracking = trackingInputs[orderId];
    if (!tracking) return;
    setUpdatingId(orderId);
    try {
      await api.adminUpdateOrderStatus(orderId, { trackingNumber: tracking });
      fetchOrders();
    } catch (err) {
      console.error("Failed to update tracking", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const statusOptions = ["paid", "packing", "shipped", "delivered", "cancelled"];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-ink-faint">
              Fulfillment Pipeline
            </span>
            <h1 className="text-3xl font-display font-bold text-ink tracking-tight mt-1">
              Customer Orders ({orders.length})
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-card border border-line text-xs font-mono text-ink outline-none capitalize"
            >
              <option value="all">All Statuses</option>
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="size-4 text-ink-faint absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order #, customer name, or email..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-card border border-line text-xs font-mono text-ink placeholder:text-ink-faint outline-none focus:border-ink/50"
          />
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {loading ? (
            <div className="tile rounded-[28px] p-12 text-center text-ink-soft bg-card border border-line">
              Loading customer orders...
            </div>
          ) : orders.length === 0 ? (
            <div className="tile rounded-[28px] p-12 text-center text-ink-soft bg-card border border-line">
              No orders found matching the filter criteria.
            </div>
          ) : (
            orders.map((ord) => {
              const isExpanded = expandedOrder === ord._id;
              return (
                <div
                  key={ord._id}
                  className="tile rounded-[28px] p-5 sm:p-6 bg-card border border-line space-y-4 transition-all"
                >
                  {/* Top Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div>
                        <span className="font-display font-bold text-base text-ink">{ord.orderNumber}</span>
                        <p className="text-xs font-mono text-ink-faint">
                          {ord.customerName} ({ord.guestEmail || "Registered"}) · {new Date(ord.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Status Selector */}
                      <select
                        value={ord.status}
                        disabled={updatingId === ord._id}
                        onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                        className="px-3 py-1.5 rounded-full bg-canvas border border-line text-xs font-mono text-ink capitalize outline-none cursor-pointer"
                      >
                        {statusOptions.map((s) => (
                          <option key={s} value={s}>
                            ● {s}
                          </option>
                        ))}
                      </select>

                      <span className="font-mono font-semibold text-sm text-ink tabular">
                        {formatPrice(ord.total)}
                      </span>

                      <button
                        onClick={() => setExpandedOrder(isExpanded ? null : ord._id)}
                        className="p-1 rounded-full text-ink-soft hover:text-ink hover:bg-canvas"
                      >
                        {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Order Inspector */}
                  {isExpanded && (
                    <div className="pt-4 border-t border-line/60 space-y-4 animate-fadeIn">
                      {/* Items */}
                      <div className="space-y-2">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-ink-faint block">
                          Ordered Items ({ord.items.length})
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {ord.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-3 rounded-2xl bg-canvas border border-line/60 text-xs font-mono">
                              <div className="size-12 rounded-xl overflow-hidden bg-sand/30 shrink-0">
                                <img src={item.image} alt={item.name} className="size-full object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-ink truncate">{item.name}</p>
                                <p className="text-[11px] text-ink-soft">
                                  {item.finishName} × {item.quantity} · {formatPrice(item.price)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Delivery Address & Tracking */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs font-mono">
                        <div className="p-4 rounded-2xl bg-canvas border border-line/60 space-y-1">
                          <span className="text-[10px] text-ink-faint uppercase tracking-wider block mb-1">
                            Shipping Destination
                          </span>
                          <p className="font-medium text-ink">{ord.shippingAddress.fullName}</p>
                          <p className="text-ink-soft">{ord.shippingAddress.street} {ord.shippingAddress.apartment}</p>
                          <p className="text-ink-soft">{ord.shippingAddress.city}, {ord.shippingAddress.state} {ord.shippingAddress.postalCode}</p>
                          <p className="text-ink-soft">{ord.shippingAddress.country}</p>
                        </div>

                        <div className="p-4 rounded-2xl bg-canvas border border-line/60 space-y-2">
                          <span className="text-[10px] text-ink-faint uppercase tracking-wider block">
                            Carrier Tracking Details
                          </span>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder={ord.trackingNumber || "Enter tracking # (e.g. TRK-8921)"}
                              value={trackingInputs[ord._id] ?? ""}
                              onChange={(e) =>
                                setTrackingInputs({ ...trackingInputs, [ord._id]: e.target.value })
                              }
                              className="flex-1 px-3 py-1.5 rounded-xl bg-card border border-line text-xs font-mono text-ink outline-none"
                            />
                            <button
                              onClick={() => handleSaveTracking(ord._id)}
                              className="px-3 py-1.5 rounded-xl bg-ink text-canvas text-xs font-mono"
                            >
                              Save
                            </button>
                          </div>
                          {ord.trackingNumber && (
                            <p className="text-[11px] text-ok">
                              Active: {ord.trackingNumber}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
