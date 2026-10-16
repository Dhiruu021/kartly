"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Heart, Plus, Check } from "lucide-react";
import { IProduct, IFinish } from "@/lib/types";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { formatPrice, tintBgClasses } from "@/lib/utils";

interface ProductCardProps {
  product: IProduct;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [selectedFinish, setSelectedFinish] = useState<IFinish>(
    product.finishes && product.finishes.length > 0
      ? product.finishes[0]
      : { name: "Standard", color: "#d8c4a4" }
  );
  const [added, setAdded] = useState(false);

  const id = product._id || product.id || "";
  const wishlisted = isWishlisted(id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1, selectedFinish);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const tintClass = tintBgClasses[product.tint] || "bg-sand/30";

  return (
    <div className="tile rounded-[28px] p-4 flex flex-col group transition-all duration-300 hover:shadow-lift border border-line/60">
      {/* Product Image & Badges */}
      <div className={`relative aspect-[4/5] rounded-[22px] overflow-hidden ${tintClass} flex items-center justify-center`}>
        {/* Badge */}
        {product.badge && (
          <div className="absolute top-3 left-3 z-10">
            <span className="px-2.5 py-1 rounded-full bg-card/90 backdrop-blur-md text-[11px] font-mono font-medium text-ink border border-line/70 shadow-sm">
              {product.badge}
            </span>
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          aria-label={wishlisted ? "Remove from wishlist" : "Save to wishlist"}
          className={`absolute top-3 right-3 z-10 size-8 rounded-full flex items-center justify-center transition-all ${
            wishlisted
              ? "bg-card text-danger shadow-sm"
              : "bg-card/80 backdrop-blur-md text-ink-soft hover:text-ink hover:bg-card"
          }`}
        >
          <Heart className={`size-4 ${wishlisted ? "fill-danger" : ""}`} />
        </button>

        {/* Product Image */}
        <Link href={`/products/${product.slug}`} className="size-full flex items-center justify-center p-6">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="size-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        </Link>

        {/* Quick Add overlay button on hover */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handleQuickAdd}
            aria-label="Quick add to bag"
            className="size-9 rounded-full bg-ink text-canvas hover:bg-ink/90 flex items-center justify-center shadow-md transition-transform hover:scale-105"
          >
            {added ? <Check className="size-4 text-ok-soft" /> : <Plus className="size-4" />}
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="pt-3.5 pb-1 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-ink-faint">
              {product.category}
            </span>
            {product.rating && (
              <span className="text-[11px] font-mono text-ink-soft">
                ★ {product.rating.toFixed(1)}
              </span>
            )}
          </div>

          <Link href={`/products/${product.slug}`} className="block group-hover:text-accent transition-colors">
            <h3 className="text-base font-display font-medium text-ink tracking-tight line-clamp-1">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Finish swatches & Price */}
        <div className="mt-3 pt-2.5 border-t border-line/50 flex items-center justify-between">
          {/* Finish swatches */}
          <div className="flex items-center gap-1.5">
            {product.finishes &&
              product.finishes.map((finish) => (
                <button
                  key={finish.name}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedFinish(finish);
                  }}
                  title={finish.name}
                  className={`size-3.5 rounded-full border transition-all ${
                    selectedFinish.name === finish.name
                      ? "ring-1 ring-offset-1 ring-ink border-transparent"
                      : "border-black/20 hover:scale-110"
                  }`}
                  style={{ backgroundColor: finish.color }}
                />
              ))}
          </div>

          {/* Price */}
          <div className="text-right">
            {product.salePrice && product.salePrice > 0 ? (
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-ink-faint line-through tabular">
                  {formatPrice(product.price)}
                </span>
                <span className="text-sm font-medium text-ink tabular">
                  {formatPrice(product.salePrice)}
                </span>
              </div>
            ) : (
              <span className="text-sm font-medium text-ink tabular">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
