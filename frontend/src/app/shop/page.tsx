"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { CategoryFilterBar } from "@/components/shop/CategoryFilterBar";
import { ProductCard } from "@/components/shop/ProductCard";
import { FilterDrawer } from "@/components/shop/FilterDrawer";
import { SortDropdown } from "@/components/shop/SortDropdown";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { ICategory, IProduct } from "@/lib/types";
import { api } from "@/lib/api";
import { Loader2, X, SlidersHorizontal, Sparkles } from "lucide-react";

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [categories, setCategories] = useState<ICategory[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 25000 });
  const [loading, setLoading] = useState<boolean>(true);

  const activeCategory = searchParams.get("c") || "";
  const sort = searchParams.get("sort") || "featured";
  const search = searchParams.get("q") || searchParams.get("search") || "";
  const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined;
  const inStock = searchParams.get("inStock") === "true";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [catRes, prodRes] = await Promise.all([
          api.getCategories(),
          api.getProducts({
            c: activeCategory,
            sort,
            search,
            maxPrice,
            inStock,
          }),
        ]);

        setCategories(catRes.categories || []);
        setProducts(prodRes.products || []);
        setTotal(prodRes.total || 0);
        if (prodRes.priceRange) {
          setPriceRange(prodRes.priceRange);
        }
      } catch (err) {
        console.error("Failed to load shop catalog", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeCategory, sort, search, maxPrice, inStock]);

  const clearFilter = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    router.push(`/shop?${params.toString()}`);
  };

  const clearAll = () => {
    router.push("/shop");
  };

  // Human category title
  const currentCategoryObj = categories.find((c) => c.slug === activeCategory);
  const pageTitle = currentCategoryObj ? currentCategoryObj.name : "All Objects";
  const pageDescription = currentCategoryObj?.description ||
    "Solid oak, heavy bouclé and hand-thrown clay objects crafted for slow living.";

  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
        {/* Page Heading & Tagline */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-mono text-ink-faint uppercase tracking-wider mb-2">
            <span>Catalog</span>
            <span>/</span>
            <span className="text-ink">{pageTitle}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-ink tracking-tight">
                {pageTitle}
              </h1>
              <p className="text-sm sm:text-base text-ink-soft mt-2 max-w-xl">
                {pageDescription}
              </p>
            </div>

            <div className="text-xs font-mono text-ink-faint">
              {total} {total === 1 ? "object" : "objects"} in catalog
            </div>
          </div>
        </div>

        {/* Filter Bar & Controls */}
        <div className="space-y-4 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-line/60">
            {/* Category horizontal pills */}
            <div className="flex-1 overflow-hidden">
              <CategoryFilterBar categories={categories} totalProducts={total} />
            </div>

            {/* Filter Drawer and Sort Dropdown */}
            <div className="flex items-center gap-2 shrink-0">
              <FilterDrawer
                categories={categories}
                minCatalogPrice={priceRange.min}
                maxCatalogPrice={priceRange.max}
              />
              <SortDropdown />
            </div>
          </div>

          {/* Active Filters Badges */}
          {(activeCategory || search || maxPrice || inStock) && (
            <div className="flex flex-wrap items-center gap-2 pt-2 text-xs font-mono">
              <span className="text-ink-faint">Active:</span>

              {activeCategory && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sand text-ink border border-line">
                  <span>Category: {activeCategory}</span>
                  <button onClick={() => clearFilter("c")} className="hover:text-danger">
                    <X className="size-3" />
                  </button>
                </span>
              )}

              {search && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sand text-ink border border-line">
                  <span>Query: "{search}"</span>
                  <button onClick={() => clearFilter("q")} className="hover:text-danger">
                    <X className="size-3" />
                  </button>
                </span>
              )}

              {maxPrice && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sand text-ink border border-line">
                  <span>Max ${maxPrice}</span>
                  <button onClick={() => clearFilter("maxPrice")} className="hover:text-danger">
                    <X className="size-3" />
                  </button>
                </span>
              )}

              {inStock && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sand text-ink border border-line">
                  <span>In-stock only</span>
                  <button onClick={() => clearFilter("inStock")} className="hover:text-danger">
                    <X className="size-3" />
                  </button>
                </span>
              )}

              <button
                onClick={clearAll}
                className="text-ink-faint hover:text-ink underline ml-1"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="tile rounded-[28px] p-4 h-[440px] bg-card/60 flex flex-col justify-between">
                <div className="aspect-[4/5] rounded-[22px] bg-line/40" />
                <div className="space-y-2 mt-4">
                  <div className="h-4 w-1/3 bg-line/40 rounded" />
                  <div className="h-5 w-2/3 bg-line/50 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="tile rounded-[28px] p-12 text-center my-12 border border-line">
            <div className="size-14 rounded-2xl bg-sand/40 mx-auto flex items-center justify-center mb-4">
              <SlidersHorizontal className="size-6 text-ink-faint" />
            </div>
            <h3 className="text-lg font-display font-medium text-ink mb-1">
              No matching objects found
            </h3>
            <p className="text-xs text-ink-soft max-w-sm mx-auto mb-6">
              We couldn't find any objects matching your active filter criteria. Try adjusting your
              search or clearing selected filters.
            </p>
            <button
              onClick={clearAll}
              className="px-5 py-2.5 rounded-full bg-ink text-canvas hover:bg-ink/90 text-xs font-mono uppercase tracking-wider transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </main>

      <Footer />
      <CartDrawer />
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-canvas flex items-center justify-center">
          <Loader2 className="size-6 animate-spin text-ink-soft" />
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
