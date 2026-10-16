"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShoppingBag,
  Search,
  Heart,
  User,
  Menu,
  X,
  LayoutDashboard,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { SearchModal } from "./SearchModal";

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { count: cartCount, openDrawer } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { user, isAdmin, logout } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { label: "Shop All", href: "/shop" },
    { label: "Seating", href: "/shop?c=seating" },
    { label: "Lighting", href: "/shop?c=lighting" },
    { label: "Tables", href: "/shop?c=tables" },
    { label: "Textiles", href: "/shop?c=textiles" },
    { label: "Ceramics", href: "/shop?c=ceramics" },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-canvas/90 backdrop-blur-md border-b border-line/70 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between">
          {/* Left: Mobile Menu Toggle & Brand Logo */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-ink hover:text-ink/70"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>

            <Link href="/" className="flex items-center gap-2 group">
              <span className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink group-hover:opacity-90 transition-opacity">
                KARTLY
              </span>
              <span className="hidden sm:inline-block size-1.5 rounded-full bg-accent mb-2" />
            </Link>
          </div>

          {/* Center: Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-sm tracking-tight transition-colors hover:text-ink ${
                    isActive ? "text-ink font-semibold" : "text-ink-soft"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {isAdmin && (
              <Link
                href="/admin"
                className="px-2.5 py-1 rounded-full bg-accent-soft text-accent text-xs font-mono font-medium flex items-center gap-1.5 hover:bg-accent hover:text-canvas transition-colors"
              >
                <LayoutDashboard className="size-3.5" />
                Admin
              </Link>
            )}
          </nav>

          {/* Right Actions: Search, Wishlist, Account, Cart Bag */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 text-ink-soft hover:text-ink rounded-full hover:bg-canvas transition-colors"
              aria-label="Search catalog"
            >
              <Search className="size-5" />
            </button>

            {/* Wishlist */}
            <Link
              href="/account#wishlist"
              className="relative p-2 text-ink-soft hover:text-ink rounded-full hover:bg-canvas transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="size-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 size-4 rounded-full bg-sand text-ink text-[10px] font-mono flex items-center justify-center font-bold">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Account / Auth */}
            <div className="relative">
              {user ? (
                <div>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-1.5 p-1.5 sm:px-3 sm:py-1.5 rounded-full border border-line text-xs font-medium text-ink hover:bg-card transition-colors"
                  >
                    <User className="size-4 text-ink-soft" />
                    <span className="hidden sm:inline max-w-[100px] truncate">{user.name.split(" ")[0]}</span>
                    <ChevronDown className="size-3 text-ink-faint hidden sm:inline" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-card border border-line rounded-2xl shadow-lift py-2 z-50 animate-fadeIn">
                      <div className="px-4 py-2 border-b border-line/60">
                        <p className="text-xs font-medium text-ink truncate">{user.name}</p>
                        <p className="text-[11px] text-ink-faint font-mono truncate">{user.email}</p>
                      </div>
                      <Link
                        href="/account"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-4 py-2 text-xs text-ink hover:bg-canvas transition-colors"
                      >
                        My Account & Orders
                      </Link>
                      {isAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="block px-4 py-2 text-xs text-accent hover:bg-accent-soft transition-colors"
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-danger hover:bg-canvas transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="p-2 text-ink-soft hover:text-ink rounded-full hover:bg-canvas transition-colors"
                  aria-label="Sign in"
                >
                  <User className="size-5" />
                </Link>
              )}
            </div>

            {/* Cart Bag Trigger */}
            <button
              onClick={openDrawer}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-ink text-canvas hover:bg-ink/90 transition-all shadow-sm"
              aria-label="Open shopping bag"
            >
              <ShoppingBag className="size-4" />
              <span className="text-xs font-mono font-medium">{cartCount}</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-line bg-card p-4 space-y-3 animate-fadeIn">
            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl text-sm font-medium text-ink hover:bg-canvas transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl text-sm font-medium text-accent bg-accent-soft/40 transition-colors"
                >
                  Admin Dashboard
                </Link>
              )}
            </div>
            <div className="pt-3 border-t border-line flex items-center justify-between text-xs text-ink-soft">
              {user ? (
                <div className="flex items-center justify-between w-full">
                  <span>Signed in as {user.name}</span>
                  <button onClick={logout} className="text-danger font-medium">
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="underline">
                    Sign In
                  </Link>
                  <span>·</span>
                  <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="underline">
                    Create Account
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};
