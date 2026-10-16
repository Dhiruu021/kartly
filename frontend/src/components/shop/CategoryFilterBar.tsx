"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ICategory, Tint } from "@/lib/types";
import { tintBgClasses } from "@/lib/utils";

interface CategoryFilterBarProps {
  categories: ICategory[];
  totalProducts: number;
}

export const CategoryFilterBar: React.FC<CategoryFilterBarProps> = ({ categories, totalProducts }) => {
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("c") || "all";

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none py-1">
      {/* All Option */}
      <Link
        href="/shop"
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono font-medium whitespace-nowrap transition-all border ${
          activeCategory === "all"
            ? "bg-ink text-canvas border-ink shadow-sm"
            : "bg-card text-ink-soft border-line hover:border-ink/40 hover:text-ink"
        }`}
      >
        <span>All</span>
        <span
          className={`px-1.5 py-0.2 rounded-full text-[10px] ${
            activeCategory === "all" ? "bg-canvas/20 text-canvas" : "bg-canvas text-ink-faint"
          }`}
        >
          {totalProducts}
        </span>
      </Link>

      {/* Category Pills */}
      {categories.map((cat) => {
        const isActive = activeCategory.toLowerCase() === cat.slug.toLowerCase();
        const tintClass = tintBgClasses[cat.tint] || "bg-sand";

        return (
          <Link
            key={cat.slug}
            href={`/shop?c=${cat.slug}`}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono font-medium whitespace-nowrap transition-all border ${
              isActive
                ? "bg-ink text-canvas border-ink shadow-sm"
                : "bg-card text-ink-soft border-line hover:border-ink/40 hover:text-ink"
            }`}
          >
            <span
              className={`size-2 rounded-full ${tintClass} border border-black/10`}
              aria-hidden="true"
            />
            <span>{cat.name}</span>
            {cat.productCount !== undefined && (
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  isActive ? "bg-canvas/20 text-canvas" : "bg-canvas text-ink-faint"
                }`}
              >
                {cat.productCount}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
};
