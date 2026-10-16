"use client";

import React, { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { Users, Search, ShoppingBag, MapPin, Mail, Calendar } from "lucide-react";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await api.getCustomers();
        setCustomers(res.customers || []);
      } catch (err) {
        console.error("Failed to load customers", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-ink-faint">
            Shopper Accounts & Insights
          </span>
          <h1 className="text-3xl font-display font-bold text-ink tracking-tight mt-1">
            Customers ({customers.length})
          </h1>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="size-4 text-ink-faint absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name or email..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-card border border-line text-xs font-mono text-ink placeholder:text-ink-faint outline-none focus:border-ink/50"
          />
        </div>

        {/* Table */}
        <div className="tile rounded-[28px] bg-card border border-line overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-canvas border-b border-line text-ink-faint uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Joined Date</th>
                  <th className="py-3.5 px-4">Total Orders</th>
                  <th className="py-3.5 px-4">Lifetime Spent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/60">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-ink-soft">
                      Loading customer records...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-ink-soft">
                      No matching customer accounts found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((c) => (
                    <tr key={c._id} className="hover:bg-canvas/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="size-9 rounded-full bg-sand flex items-center justify-center font-display font-bold text-ink">
                            {c.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-ink text-sm font-display">{c.name}</p>
                            <span className="text-[11px] text-ink-faint capitalize">{c.role}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-ink-soft">
                        <div className="flex items-center gap-1.5">
                          <Mail className="size-3 text-ink-faint" />
                          <span>{c.email}</span>
                        </div>
                        {c.addresses && c.addresses[0] && (
                          <div className="flex items-center gap-1.5 text-[11px] text-ink-faint mt-0.5">
                            <MapPin className="size-3" />
                            <span>{c.addresses[0].city}, {c.addresses[0].country}</span>
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-ink-soft">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </td>

                      <td className="py-3.5 px-4 tabular">
                        <span className="px-2.5 py-0.5 rounded-full bg-canvas border border-line">
                          {c.orderCount || 0} order(s)
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-ink tabular">
                        {formatPrice(c.totalSpent || 0)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
