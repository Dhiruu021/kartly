"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { ProductCard } from "@/components/shop/ProductCard";
import { ICategory, IProduct } from "@/lib/types";
import { api } from "@/lib/api";
import { tintBgClasses } from "@/lib/utils";
import { ArrowRight, Sparkles, Truck, ShieldCheck, Clock } from "lucide-react";

export default function HomePage() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<IProduct[]>([]);
  const [heroProduct, setHeroProduct] = useState<IProduct | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          api.getCategories(),
          api.getProducts({ limit: 6, sort: "featured" }),
        ]);

        setCategories(catRes.categories || []);
        const prods = prodRes.products || [];
        setFeaturedProducts(prods);
        if (prods.length > 0) {
          setHeroProduct(prods[0]);
        }
      } catch (err) {
        console.error("Failed to load home data", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full space-y-16 sm:space-y-24">
        {/* Hero Section Bento Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Main Hero Card */}
          <div className="lg:col-span-8 tile rounded-[28px] p-8 sm:p-12 bg-card border border-line flex flex-col justify-between relative overflow-hidden group">
            <div className="relative z-10 max-w-lg space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sand text-ink text-xs font-mono font-medium border border-line">
                <Sparkles className="size-3 text-ink-soft" />
                2026 Nordic Slow Home Edition
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-ink tracking-tight leading-[1.05]">
                Calm objects for slow homes.
              </h1>
              <p className="text-sm sm:text-base text-ink-soft leading-relaxed max-w-md">
                Handcrafted solid oak, warm bouclé, and wheel-thrown stoneware made to be lived with.
                Dispatched from our Scandinavian studio in 48 hours.
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  href="/shop"
                  className="px-6 py-3 rounded-full bg-ink text-canvas hover:bg-ink/90 text-xs font-mono uppercase tracking-wider font-semibold transition-all inline-flex items-center gap-2 shadow-sm"
                >
                  Explore Collection <ArrowRight className="size-3.5" />
                </Link>
                <Link
                  href="/shop?c=seating"
                  className="px-5 py-3 rounded-full bg-canvas border border-line text-ink hover:border-ink/40 text-xs font-mono transition-colors"
                >
                  View Seating
                </Link>
              </div>
            </div>

            {/* Background Image / Feature */}
            {heroProduct && (
              <div className="mt-8 lg:mt-0 lg:absolute lg:right-6 lg:bottom-6 size-64 sm:size-80 flex items-center justify-center pointer-events-none">
                <img
                  src={heroProduct.image}
                  alt={heroProduct.name}
                  className="size-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
            )}
          </div>

          {/* Secondary Hero Bento Card */}
          <div className="lg:col-span-4 tile rounded-[28px] p-6 sm:p-8 bg-butter/40 border border-line flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-ink-soft">
                Featured Lighting
              </span>
              <h3 className="text-2xl font-display font-semibold text-ink">
                Linne Table Lamp
              </h3>
              <p className="text-xs text-ink-soft leading-relaxed">
                Hand-pleated linen shade over a turned oak base. Throws a warm, low pool of light for quiet evenings.
              </p>
            </div>

            <div className="my-6 aspect-square rounded-2xl bg-card/60 p-4 flex items-center justify-center overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=80"
                alt="Linne Table Lamp"
                className="size-full object-contain mix-blend-multiply hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-line/60">
              <span className="font-mono text-sm font-semibold text-ink">$189</span>
              <Link
                href="/products/linne-table-lamp"
                className="text-xs font-mono uppercase tracking-wider text-accent hover:underline flex items-center gap-1"
              >
                Inspect Object <ArrowRight className="size-3" />
              </Link>
            </div>
          </div>
        </section>

        {/* Categories Bento Grid */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-ink-faint">
                Shop By Room & Space
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-ink tracking-tight mt-1">
                Explore Categories
              </h2>
            </div>
            <Link
              href="/shop"
              className="text-xs font-mono uppercase tracking-wider text-ink-soft hover:text-ink flex items-center gap-1"
            >
              All Categories <ArrowRight className="size-3" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat) => {
              const tintClass = tintBgClasses[cat.tint] || "bg-sand";
              return (
                <Link
                  key={cat.slug}
                  href={`/shop?c=${cat.slug}`}
                  className="tile rounded-[24px] p-4 border border-line flex flex-col justify-between group hover:shadow-lift transition-all"
                >
                  <div className={`aspect-square rounded-[18px] overflow-hidden ${tintClass}/50 mb-3 p-3 flex items-center justify-center`}>
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="size-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-display font-semibold text-ink group-hover:text-accent transition-colors">
                      {cat.name}
                    </h4>
                    <span className="text-[11px] font-mono text-ink-faint">
                      {cat.productCount ? `${cat.productCount} objects` : "View collection"}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Bestseller Products Bento Section */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-ink-faint">
                Calm Living Essentials
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-ink tracking-tight mt-1">
                Curated Objects
              </h2>
            </div>
            <Link
              href="/shop"
              className="text-xs font-mono uppercase tracking-wider text-ink-soft hover:text-ink flex items-center gap-1"
            >
              Browse Complete Catalog <ArrowRight className="size-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.slice(0, 6).map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Studio Philosophy & Craft Banner */}
        <section className="tile rounded-[28px] p-8 sm:p-14 bg-card border border-line grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <div className="size-10 rounded-2xl bg-sage/50 flex items-center justify-center mb-3">
              <Truck className="size-5 text-ok" />
            </div>
            <h4 className="text-base font-display font-semibold text-ink">48-Hour Studio Dispatch</h4>
            <p className="text-xs text-ink-soft leading-relaxed">
              Every chair, lamp, and textile is stocked and packaged with recycled honeycomb wrap from our Portland studio.
            </p>
          </div>

          <div className="space-y-2">
            <div className="size-10 rounded-2xl bg-butter/50 flex items-center justify-center mb-3">
              <ShieldCheck className="size-5 text-warn" />
            </div>
            <h4 className="text-base font-display font-semibold text-ink">FSC® Solid Oak</h4>
            <p className="text-xs text-ink-soft leading-relaxed">
              Sourced exclusively from certified sustainable European forests and sealed with non-toxic matte hard-wax oils.
            </p>
          </div>

          <div className="space-y-2">
            <div className="size-10 rounded-2xl bg-sky/50 flex items-center justify-center mb-3">
              <Clock className="size-5 text-accent" />
            </div>
            <h4 className="text-base font-display font-semibold text-ink">30-Day Calm Return Policy</h4>
            <p className="text-xs text-ink-soft leading-relaxed">
              Live with the object in your space. If the scale or finish isn’t harmonious, return it effortlessly with zero friction.
            </p>
          </div>
        </section>
      </main>

      <Footer />
      <CartDrawer />
    </div>
  );
}
