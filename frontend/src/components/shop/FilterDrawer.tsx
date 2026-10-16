"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { X, SlidersHorizontal, RotateCcw } from "lucide-react";
import { ICategory } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

interface FilterDrawerProps {
  categories: ICategory[];
  minCatalogPrice: number;
  maxCatalogPrice: number;
}

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  categories,
  minCatalogPrice,
  maxCatalogPrice,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const activeCategory = searchParams.get("c") || "all";
  const activeMinPrice = Number(searchParams.get("minPrice")) || minCatalogPrice || 0;
  const activeMaxPrice = Number(searchParams.get("maxPrice")) || maxCatalogPrice || 25000;
  const inStockOnly = searchParams.get("inStock") === "true";

  const [priceMax, setPriceMax] = useState(activeMaxPrice);
  const [stockOnly, setStockOnly] = useState(inStockOnly);

  useEffect(() => {
    setPriceMax(activeMaxPrice);
    setStockOnly(inStockOnly);
  }, [activeMaxPrice, inStockOnly]);

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("maxPrice", String(priceMax));
    if (stockOnly) {
      params.set("inStock", "true");
    } else {
      params.delete("inStock");
    }
    params.delete("page");
    router.push(`/shop?${params.toString()}`);
    setIsOpen(false);
  };

  const clearAllFilters = () => {
    router.push("/shop");
    setIsOpen(false);
  };

  const hasActiveFilters =
    (activeCategory && activeCategory !== "all") ||
    searchParams.has("maxPrice") ||
    searchParams.has("inStock") ||
    searchParams.has("q");

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-card border border-line text-xs font-mono text-ink-soft hover:text-ink hover:border-ink/30 transition-colors shadow-sm"
      >
        <SlidersHorizontal className="size-3.5" />
        <span>Filters</span>
        {hasActiveFilters && (
          <span className="size-1.5 rounded-full bg-accent" />
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-ink/40 backdrop-blur-sm transition-opacity">
          <div className="absolute inset-0" onClick={() => setIsOpen(false)} />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-sm bg-card border-l border-line flex flex-col shadow-lift">
              {/* Header */}
              <div className="p-5 border-b border-line flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="size-4 text-ink" />
                  <h3 className="text-base font-display font-medium text-ink">Catalog Filters</h3>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-full text-ink-soft hover:text-ink hover:bg-canvas transition-colors"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-5 space-y-6">
                {/* Max Price Slider */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-ink-soft">Maximum Price</span>
                    <span className="text-ink font-semibold tabular">{formatPrice(priceMax)}</span>
                  </div>
                  <input
                    type="range"
                    min={minCatalogPrice || 0}
                    max={maxCatalogPrice || 25000}
                    step={100}
                    value={priceMax}
                    onChange={(e) => setPriceMax(Number(e.target.value))}
                    className="w-full accent-ink cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] font-mono text-ink-faint">
                    <span>{formatPrice(minCatalogPrice || 0)}</span>
                    <span>{formatPrice(maxCatalogPrice || 25000)}</span>
                  </div>
                </div>

                {/* Stock Availability Toggle */}
                <div className="pt-4 border-t border-line/70">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-xs font-mono text-ink">In-Stock Only</span>
                    <input
                      type="checkbox"
                      checked={stockOnly}
                      onChange={(e) => setStockOnly(e.target.checked)}
                      className="size-4 rounded accent-ink cursor-pointer"
                    />
                  </label>
                  <p className="text-[11px] text-ink-faint mt-1">
                    Show only objects currently ready for 48h dispatch
                  </p>
                </div>

                {/* Quick Categories list in drawer */}
                <div className="pt-4 border-t border-line/70 space-y-2">
                  <span className="text-xs font-mono text-ink-soft block mb-2">Category</span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        const params = new URLSearchParams(searchParams.toString());
                        params.delete("c");
                        router.push(`/shop?${params.toString()}`);
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs font-mono transition-colors ${
                        activeCategory === "all"
                          ? "bg-ink text-canvas"
                          : "bg-canvas text-ink-soft hover:text-ink"
                      }`}
                    >
                      All
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat.slug}
                        onClick={() => {
                          const params = new URLSearchParams(searchParams.toString());
                          params.set("c", cat.slug);
                          router.push(`/shop?${params.toString()}`);
                        }}
                        className={`px-3 py-1.5 rounded-full text-xs font-mono transition-colors ${
                          activeCategory === cat.slug
                            ? "bg-ink text-canvas"
                            : "bg-canvas text-ink-soft hover:text-ink"
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-5 border-t border-line bg-card space-y-2">
                <button
                  onClick={applyFilters}
                  className="w-full py-3 rounded-full bg-ink text-canvas hover:bg-ink/90 font-mono text-xs uppercase tracking-wider font-semibold transition-colors"
                >
                  Apply Filters
                </button>
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="w-full py-2.5 rounded-full border border-line text-ink-soft hover:text-ink text-xs font-mono flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <RotateCcw className="size-3" />
                    Reset All Filters
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
