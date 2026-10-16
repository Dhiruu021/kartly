"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X, Loader2, ArrowRight } from "lucide-react";
import { IProduct } from "@/lib/types";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/utils";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const { products } = await api.getProducts({ search: query.trim(), limit: 6 });
        setResults(products);
      } catch (err) {
        console.error("Search failed", err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && query.trim()) {
      onClose();
      router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-ink/40 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-2xl bg-card border border-line rounded-[28px] shadow-lift overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-5 flex items-center gap-3 border-b border-line">
          <Search className="size-5 text-ink-faint shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search chairs, lamps, throws, stoneware..."
            className="w-full bg-transparent text-base sm:text-lg text-ink placeholder:text-ink-faint outline-none font-sans"
          />
          {loading && <Loader2 className="size-4 animate-spin text-ink-soft shrink-0" />}
          <button
            onClick={onClose}
            className="p-1 rounded-full text-ink-soft hover:text-ink hover:bg-canvas transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-5">
          {query.trim() === "" ? (
            <div className="py-8 text-center text-ink-faint text-sm">
              <p className="font-mono text-xs uppercase tracking-wider mb-2">Popular Searches</p>
              <div className="flex flex-wrap justify-center gap-2 mt-3">
                {["Lounge Chair", "Pendant Lamp", "Side Table", "Wool Throw", "Terracotta"].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-3 py-1.5 rounded-full bg-canvas border border-line/60 text-ink-soft hover:text-ink hover:border-ink/20 text-xs transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-2">
              <p className="text-xs font-mono uppercase tracking-wider text-ink-faint mb-3">
                Found {results.length} results
              </p>
              {results.map((product) => (
                <Link
                  key={product._id || product.id}
                  href={`/products/${product.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-4 p-2.5 rounded-2xl hover:bg-canvas transition-colors group"
                >
                  <div className="size-14 rounded-xl overflow-hidden bg-sand/30 shrink-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="size-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-ink truncate group-hover:text-accent transition-colors">
                      {product.name}
                    </h4>
                    <p className="text-xs text-ink-soft capitalize">{product.category}</p>
                  </div>
                  <div className="text-sm font-medium text-ink tabular">
                    {formatPrice(product.salePrice && product.salePrice > 0 ? product.salePrice : product.price)}
                  </div>
                </Link>
              ))}

              <div className="pt-3 border-t border-line/60 text-center">
                <button
                  onClick={() => {
                    onClose();
                    router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-accent hover:underline py-1"
                >
                  View all results on shop page <ArrowRight className="size-3" />
                </button>
              </div>
            </div>
          ) : (
            !loading && (
              <div className="py-12 text-center text-ink-faint">
                <p className="text-sm">No objects found matching "{query}"</p>
                <p className="text-xs mt-1">Try checking for typos or searching by category like "seating" or "lighting".</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
