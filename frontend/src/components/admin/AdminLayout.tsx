"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  TicketPercent,
  Users,
  LogOut,
  ArrowLeft,
  ShieldAlert,
  Loader2,
} from "lucide-react";

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, isAdmin, logout } = useAuth();

  const navItems = [
    { label: "Overview", href: "/admin", icon: LayoutDashboard },
    { label: "Products", href: "/admin/products", icon: Package },
    { label: "Categories", href: "/admin/categories", icon: FolderTree },
    { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { label: "Coupons", href: "/admin/coupons", icon: TicketPercent },
    { label: "Customers", href: "/admin/customers", icon: Users },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-ink-soft" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-canvas flex flex-col items-center justify-center p-4">
        <div className="tile rounded-[28px] p-8 sm:p-10 bg-card border border-line max-w-md w-full text-center space-y-4 shadow-lift">
          <div className="size-16 rounded-3xl bg-danger/10 text-danger flex items-center justify-center mx-auto">
            <ShieldAlert className="size-8" />
          </div>
          <h2 className="text-2xl font-display font-bold text-ink">Admin Privileges Required</h2>
          <p className="text-xs text-ink-soft leading-relaxed">
            This area is restricted to authorized Kartly store administrators. Please log in with your administrator credentials.
          </p>
          <div className="space-y-2 pt-2">
            <Link
              href="/login"
              className="w-full py-3.5 rounded-full bg-ink text-canvas hover:bg-ink/90 font-mono text-xs uppercase tracking-wider font-semibold transition-all shadow-sm inline-block"
            >
              Sign In to Admin Portal
            </Link>
            <Link
              href="/"
              className="w-full py-2.5 rounded-full border border-line text-ink-soft hover:text-ink text-xs font-mono inline-block transition-colors"
            >
              Return to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-card border-r border-line p-5 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          {/* Logo & Storefront link */}
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-display text-xl font-bold tracking-tight text-ink">
                KARTLY
              </span>
              <span className="px-2 py-0.5 rounded-full bg-accent-soft text-accent text-[10px] font-mono font-medium">
                Admin
              </span>
            </Link>
          </div>

          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-mono text-ink-soft hover:text-ink transition-colors pb-2 border-b border-line/60"
          >
            <ArrowLeft className="size-3" /> Back to Storefront
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-mono transition-colors ${
                    isActive
                      ? "bg-ink text-canvas font-medium shadow-sm"
                      : "text-ink-soft hover:bg-canvas hover:text-ink"
                  }`}
                >
                  <Icon className="size-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info & Logout */}
        <div className="pt-6 border-t border-line/60 mt-6 space-y-3">
          <div className="text-xs">
            <p className="font-medium text-ink truncate">{user?.name}</p>
            <p className="text-[11px] font-mono text-ink-faint truncate">{user?.email}</p>
          </div>
          <button
            onClick={() => {
              logout();
              router.push("/");
            }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono text-danger hover:bg-danger/10 transition-colors"
          >
            <LogOut className="size-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 max-w-7xl w-full overflow-y-auto">
        {children}
      </main>
    </div>
  );
};
