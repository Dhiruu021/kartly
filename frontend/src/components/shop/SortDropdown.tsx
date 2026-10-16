"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, Check } from "lucide-react";

export const SortDropdown: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentSort = searchParams.get("sort") || "featured";

  const sortOptions = [
    { label: "Featured Objects", value: "featured" },
    { label: "Newest Arrivals", value: "newest" },
    { label: "Price: Low to High", value: "price-asc" },
    { label: "Price: High to Low", value: "price-desc" },
    { label: "Highest Rated", value: "rating" },
    { label: "Name: A to Z", value: "name-asc" },
  ];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", val);
    router.push(`/shop?${params.toString()}`);
    setIsOpen(false);
  };

  const activeLabel = sortOptions.find((o) => o.value === currentSort)?.label || "Featured";

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-card border border-line text-xs font-mono text-ink-soft hover:text-ink hover:border-ink/30 transition-colors shadow-sm"
      >
        <span>Sort:</span>
        <span className="text-ink font-medium">{activeLabel}</span>
        <ChevronDown className="size-3.5 text-ink-faint" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-52 bg-card border border-line rounded-2xl shadow-lift py-2 z-30 animate-fadeIn">
          {sortOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              className={`w-full flex items-center justify-between px-4 py-2 text-xs font-mono text-left transition-colors ${
                currentSort === opt.value
                  ? "bg-canvas text-ink font-semibold"
                  : "text-ink-soft hover:bg-canvas hover:text-ink"
              }`}
            >
              <span>{opt.label}</span>
              {currentSort === opt.value && <Check className="size-3.5 text-accent" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
