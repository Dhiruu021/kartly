"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

export const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-card border-t border-line text-ink pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-14">
          {/* Brand & Editorial Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-display text-2xl font-bold tracking-tight text-ink">
                KARTLY
              </span>
            </Link>
            <p className="text-sm text-ink-soft max-w-sm leading-relaxed">
              Calm objects crafted for slow homes. Solid oak, heavy bouclé and wheel-thrown clay,
              designed to age gracefully and live with you.
            </p>
            <div className="pt-2">
              <p className="text-xs font-mono uppercase tracking-wider text-ink-faint mb-2">
                Join our Slow Home Journal
              </p>
              {subscribed ? (
                <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-ok-soft text-ok text-xs font-mono">
                  <Check className="size-3.5" />
                  <span>Welcome to the journal. Check your inbox soon.</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex gap-2 max-w-sm">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="flex-1 px-4 py-2.5 rounded-full bg-canvas border border-line text-xs font-mono text-ink placeholder:text-ink-faint outline-none focus:border-ink/50"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-full bg-ink text-canvas hover:bg-ink/90 text-xs font-mono uppercase tracking-wider transition-colors shrink-0"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Catalog Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-ink-faint">Catalog</h4>
            <ul className="space-y-2 text-sm text-ink-soft">
              <li>
                <Link href="/shop" className="hover:text-ink transition-colors">
                  All Objects
                </Link>
              </li>
              <li>
                <Link href="/shop?c=seating" className="hover:text-ink transition-colors">
                  Seating
                </Link>
              </li>
              <li>
                <Link href="/shop?c=lighting" className="hover:text-ink transition-colors">
                  Lighting
                </Link>
              </li>
              <li>
                <Link href="/shop?c=tables" className="hover:text-ink transition-colors">
                  Tables & Desks
                </Link>
              </li>
              <li>
                <Link href="/shop?c=textiles" className="hover:text-ink transition-colors">
                  Lambswool & Linen
                </Link>
              </li>
              <li>
                <Link href="/shop?c=ceramics" className="hover:text-ink transition-colors">
                  Stoneware Ceramics
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-ink-faint">Customer Care</h4>
            <ul className="space-y-2 text-sm text-ink-soft">
              <li>
                <Link href="/account" className="hover:text-ink transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-ink transition-colors">
                  Shopping Bag
                </Link>
              </li>
              <li>
                <span className="text-ink-soft">48-Hour Dispatch</span>
              </li>
              <li>
                <span className="text-ink-soft">30-Day Calm Returns</span>
              </li>
              <li>
                <span className="text-ink-soft">FSC® Certified Timber</span>
              </li>
            </ul>
          </div>

          {/* Studio & Admin */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-ink-faint">Studio</h4>
            <ul className="space-y-2 text-sm text-ink-soft">
              <li>
                <span className="text-ink-soft">Global Studios · New Delhi & Worldwide</span>
              </li>
              <li>
                <span className="text-ink-soft">care@kartly.in</span>
              </li>
              <li className="pt-2">
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-accent hover:underline"
                >
                  Admin Portal →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-line/60 flex flex-col sm:flex-row items-center justify-between text-xs text-ink-faint font-mono gap-4">
          <p>© {new Date().getFullYear()} Kartly Objects Ltd. All rights reserved.</p>
          <div className="flex gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Sustainable Sourcing</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
