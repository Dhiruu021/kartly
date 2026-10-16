"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { ProductCard } from "@/components/shop/ProductCard";
import { IProduct, IFinish } from "@/lib/types";
import { api } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { formatPrice, tintBgClasses } from "@/lib/utils";
import {
  Heart,
  Plus,
  Minus,
  ShoppingBag,
  Check,
  Truck,
  RotateCcw,
  Shield,
  Loader2,
  Sparkles,
  ArrowLeft,
} from "lucide-react";

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { addItem } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState<IProduct | null>(null);
  const [related, setRelated] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>("");
  const [selectedFinish, setSelectedFinish] = useState<IFinish | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { product, related } = await api.getProductBySlug(resolvedParams.slug);
        setProduct(product);
        setRelated(related || []);
        setActiveImage(product.image);
        if (product.finishes && product.finishes.length > 0) {
          setSelectedFinish(product.finishes[0]);
        }
      } catch (err) {
        console.error("Failed to load product", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [resolvedParams.slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas flex flex-col">
        <AnnouncementBar />
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="size-8 animate-spin text-ink-soft" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-canvas flex flex-col">
        <AnnouncementBar />
        <Header />
        <div className="flex-1 max-w-7xl mx-auto px-4 py-24 text-center">
          <h2 className="text-2xl font-display font-bold text-ink mb-2">Object not found</h2>
          <p className="text-sm text-ink-soft mb-6">This piece may have been archived or removed from the catalog.</p>
          <Link
            href="/shop"
            className="px-6 py-3 rounded-full bg-ink text-canvas hover:bg-ink/90 text-xs font-mono uppercase tracking-wider"
          >
            Return to Shop
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const id = product._id || product.id || "";
  const wishlisted = isWishlisted(id);
  const tintClass = tintBgClasses[product.tint] || "bg-sand/30";
  const galleryImages = product.gallery && product.gallery.length > 0
    ? product.gallery
    : [product.image, ...(product.scene ? [product.scene] : [])];

  const handleAddToCart = () => {
    if (!product || product.stock <= 0) return;
    addItem(product, quantity, selectedFinish || undefined);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const currentPrice = product.salePrice && product.salePrice > 0 ? product.salePrice : product.price;

  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono text-ink-faint mb-8">
          <Link href="/shop" className="hover:text-ink transition-colors flex items-center gap-1">
            <ArrowLeft className="size-3" /> Shop
          </Link>
          <span>/</span>
          <Link href={`/shop?c=${product.category}`} className="hover:text-ink capitalize transition-colors">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-ink truncate max-w-xs">{product.name}</span>
        </div>

        {/* Product Showcase Bento Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Gallery */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Stage */}
            <div className={`tile rounded-[28px] ${tintClass} aspect-square sm:aspect-[4/3] p-8 flex items-center justify-center relative overflow-hidden border border-line/70`}>
              {product.badge && (
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-3 py-1 rounded-full bg-card/90 backdrop-blur-md text-xs font-mono font-medium text-ink border border-line/70 shadow-sm">
                    {product.badge}
                  </span>
                </div>
              )}

              <button
                onClick={() => toggleWishlist(product)}
                className={`absolute top-4 right-4 z-10 size-10 rounded-full flex items-center justify-center transition-all ${
                  wishlisted
                    ? "bg-card text-danger shadow-sm"
                    : "bg-card/80 backdrop-blur-md text-ink-soft hover:text-ink hover:bg-card"
                }`}
                aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart className={`size-5 ${wishlisted ? "fill-danger" : ""}`} />
              </button>

              <img
                src={activeImage}
                alt={product.name}
                className="size-full object-contain mix-blend-multiply transition-all duration-500 ease-out"
              />
            </div>

            {/* Thumbnails */}
            {galleryImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`size-20 sm:size-24 rounded-2xl overflow-hidden p-2 border-2 transition-all shrink-0 ${
                      activeImage === img ? "border-ink bg-card shadow-sm" : "border-line bg-card/50 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt={`${product.name} view ${idx + 1}`} className="size-full object-cover rounded-xl" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Object Configuration & Purchasing */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-ink-faint">
                  Category: {product.category}
                </span>
                {product.rating && (
                  <span className="text-xs font-mono text-ink font-medium">
                    ★ {product.rating.toFixed(1)} ({product.reviewsCount} reviews)
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl font-display font-bold text-ink tracking-tight">
                {product.name}
              </h1>

              {/* Price */}
              <div className="flex items-baseline gap-3 pt-1">
                <span className="text-2xl sm:text-3xl font-display font-semibold text-ink tabular">
                  {formatPrice(currentPrice)}
                </span>
                {product.salePrice && product.salePrice > 0 && (
                  <span className="text-base font-mono text-ink-faint line-through tabular">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
            </div>

            {/* Blurb */}
            <p className="text-sm sm:text-base text-ink-soft leading-relaxed border-t border-line/60 pt-4">
              {product.blurb}
            </p>

            {/* Finish Selection */}
            {product.finishes && product.finishes.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-ink-soft">Selected Finish:</span>
                  <span className="text-ink font-semibold">{selectedFinish?.name}</span>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {product.finishes.map((finish) => {
                    const isSelected = selectedFinish?.name === finish.name;
                    return (
                      <button
                        key={finish.name}
                        onClick={() => setSelectedFinish(finish)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-full border text-xs font-mono transition-all ${
                          isSelected
                            ? "border-ink bg-card text-ink shadow-sm ring-1 ring-ink"
                            : "border-line bg-canvas/70 text-ink-soft hover:border-ink/30 hover:text-ink"
                        }`}
                      >
                        <span
                          className="size-3 rounded-full border border-black/10"
                          style={{ backgroundColor: finish.color }}
                        />
                        <span>{finish.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Stock status */}
            <div className="pt-2">
              {product.stock > 0 ? (
                <div className="flex items-center gap-2 text-xs font-mono text-ok">
                  <span className="size-2 rounded-full bg-ok animate-pulse" />
                  <span>
                    In stock · {product.stock <= 10 ? `Only ${product.stock} pieces remaining` : "Ready to dispatch in 48 hours"}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs font-mono text-danger">
                  <span className="size-2 rounded-full bg-danger" />
                  <span>Currently out of stock</span>
                </div>
              )}
            </div>

            {/* Quantity & Add to Cart Action */}
            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center border border-line rounded-full bg-card p-1">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2 rounded-full hover:bg-canvas text-ink-soft hover:text-ink transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="size-3.5" />
                </button>
                <span className="px-3 text-sm font-mono font-medium text-ink tabular">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock || 20, q + 1))}
                  className="p-2 rounded-full hover:bg-canvas text-ink-soft hover:text-ink transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="size-3.5" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex-1 py-4 px-6 rounded-full bg-ink text-canvas hover:bg-ink/90 disabled:opacity-50 font-mono text-xs uppercase tracking-wider font-semibold transition-all shadow-md flex items-center justify-center gap-2"
              >
                {added ? (
                  <>
                    <Check className="size-4 text-ok-soft" /> Added to Bag
                  </>
                ) : (
                  <>
                    <ShoppingBag className="size-4" /> Add to Bag · {formatPrice(currentPrice * quantity)}
                  </>
                )}
              </button>
            </div>

            {/* Product Specifications & Details Accordion / Cards */}
            <div className="tile rounded-[24px] p-5 bg-card border border-line space-y-4 text-xs font-mono">
              {product.dimensions && (
                <div className="pb-3 border-b border-line/60">
                  <span className="text-ink-faint block uppercase tracking-wider text-[10px] mb-1">
                    Dimensions
                  </span>
                  <span className="text-ink">{product.dimensions}</span>
                </div>
              )}

              {product.details && product.details.length > 0 && (
                <div className="pb-3 border-b border-line/60">
                  <span className="text-ink-faint block uppercase tracking-wider text-[10px] mb-1.5">
                    Specifications
                  </span>
                  <ul className="space-y-1 list-disc list-inside text-ink-soft">
                    {product.details.map((detail, idx) => (
                      <li key={idx}>{detail}</li>
                    ))}
                  </ul>
                </div>
              )}

              {product.care && (
                <div>
                  <span className="text-ink-faint block uppercase tracking-wider text-[10px] mb-1">
                    Care & Maintenance
                  </span>
                  <span className="text-ink-soft leading-relaxed block">{product.care}</span>
                </div>
              )}
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-mono text-ink-soft">
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-canvas border border-line/70">
                <Truck className="size-4 text-ink-faint shrink-0" />
                <span>Dispatches in 48 hours</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-canvas border border-line/70">
                <RotateCcw className="size-4 text-ink-faint shrink-0" />
                <span>30-day calm returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="mt-20 pt-12 border-t border-line/70 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-ink-faint">
                  Complementary Objects
                </span>
                <h3 className="text-2xl font-display font-bold text-ink tracking-tight mt-1">
                  You May Also Appreciate
                </h3>
              </div>
              <Link
                href={`/shop?c=${product.category}`}
                className="text-xs font-mono uppercase tracking-wider text-accent hover:underline"
              >
                More {product.category} →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((rel) => (
                <ProductCard key={rel._id || rel.id} product={rel} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
      <CartDrawer />
    </div>
  );
}
