"use client";

import React, { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { IProduct, ICategory, Tint } from "@/lib/types";
import { api } from "@/lib/api";
import { formatPrice, tintBgClasses } from "@/lib/utils";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Check,
  X,
  Loader2,
  Package,
} from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);

  // Form Fields
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState("seating");
  const [formPrice, setFormPrice] = useState("");
  const [formSalePrice, setFormSalePrice] = useState("");
  const [formStock, setFormStock] = useState("20");
  const [formTint, setFormTint] = useState<Tint>("sand");
  const [formImage, setFormImage] = useState("");
  const [formBlurb, setFormBlurb] = useState("");
  const [formBadge, setFormBadge] = useState("");
  const [formDimensions, setFormDimensions] = useState("");
  const [formCare, setFormCare] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchCatalog = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        api.getProducts({ limit: 100 }),
        api.getCategories(),
      ]);
      setProducts(prodRes.products || []);
      setCategories(catRes.categories || []);
    } catch (err) {
      console.error("Failed to load admin products", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormName("");
    setFormCategory(categories[0]?.slug || "seating");
    setFormPrice("");
    setFormSalePrice("");
    setFormStock("20");
    setFormTint("sand");
    setFormImage("https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1000&q=80");
    setFormBlurb("");
    setFormBadge("");
    setFormDimensions("");
    setFormCare("");
    setIsModalOpen(true);
  };

  const openEditModal = (prod: IProduct) => {
    setEditingProduct(prod);
    setFormName(prod.name);
    setFormCategory(prod.category);
    setFormPrice(String(prod.price));
    setFormSalePrice(prod.salePrice ? String(prod.salePrice) : "");
    setFormStock(String(prod.stock));
    setFormTint(prod.tint);
    setFormImage(prod.image);
    setFormBlurb(prod.blurb);
    setFormBadge(prod.badge || "");
    setFormDimensions(prod.dimensions || "");
    setFormCare(prod.care || "");
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formPrice || !formImage || !formBlurb) return;

    setSubmitting(true);
    try {
      const payload: Partial<IProduct> = {
        name: formName,
        category: formCategory,
        price: Number(formPrice),
        salePrice: formSalePrice ? Number(formSalePrice) : undefined,
        stock: Number(formStock),
        tint: formTint,
        image: formImage,
        blurb: formBlurb,
        badge: formBadge ? formBadge : null,
        dimensions: formDimensions,
        care: formCare,
      };

      if (editingProduct) {
        await api.updateProduct(editingProduct._id, payload);
      } else {
        await api.createProduct(payload);
      }

      setIsModalOpen(false);
      fetchCatalog();
    } catch (err: any) {
      alert(err.message || "Failed to save product");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await api.deleteProduct(id);
        setProducts((prev) => prev.filter((p) => p._id !== id));
      } catch (err: any) {
        alert(err.message || "Failed to delete product");
      }
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-ink-faint">
              Inventory & Object Management
            </span>
            <h1 className="text-3xl font-display font-bold text-ink tracking-tight mt-1">
              Products ({products.length})
            </h1>
          </div>

          <button
            onClick={openCreateModal}
            className="px-5 py-2.5 rounded-full bg-ink text-canvas hover:bg-ink/90 text-xs font-mono uppercase tracking-wider font-semibold transition-all flex items-center gap-2 self-start shadow-sm"
          >
            <Plus className="size-4" /> Add Object
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="size-4 text-ink-faint absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter products by name or category..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-card border border-line text-xs font-mono text-ink placeholder:text-ink-faint outline-none focus:border-ink/50"
          />
        </div>

        {/* Products Table */}
        <div className="tile rounded-[28px] bg-card border border-line overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-canvas border-b border-line text-ink-faint uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Object</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Stock</th>
                  <th className="py-3.5 px-4">Badge</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/60">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-ink-soft">
                      Loading catalog objects...
                    </td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-ink-soft">
                      No matching objects found.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((prod) => (
                    <tr key={prod._id} className="hover:bg-canvas/50 transition-colors">
                      <td className="py-3.5 px-4 flex items-center gap-3">
                        <div className="size-12 rounded-xl overflow-hidden bg-sand/30 shrink-0">
                          <img src={prod.image} alt={prod.name} className="size-full object-cover" />
                        </div>
                        <div>
                          <p className="font-semibold text-ink text-sm font-display line-clamp-1">
                            {prod.name}
                          </p>
                          <span className="text-[11px] text-ink-faint">/{prod.slug}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-full bg-canvas border border-line capitalize">
                          {prod.category}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 tabular font-medium text-ink">
                        {formatPrice(prod.price)}
                        {prod.salePrice && (
                          <span className="text-[10px] text-ok block">Sale: {formatPrice(prod.salePrice)}</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full font-medium ${
                            prod.stock <= 10 ? "bg-warn-soft text-warn" : "bg-ok-soft text-ok"
                          }`}
                        >
                          {prod.stock} units
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        {prod.badge ? (
                          <span className="px-2 py-0.5 rounded-full bg-sand text-ink text-[10px]">
                            {prod.badge}
                          </span>
                        ) : (
                          <span className="text-ink-faint">—</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => openEditModal(prod)}
                          className="p-1.5 rounded-lg border border-line hover:border-ink/40 text-ink-soft hover:text-ink transition-colors"
                          title="Edit Product"
                        >
                          <Pencil className="size-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(prod._id, prod.name)}
                          className="p-1.5 rounded-lg border border-line hover:border-danger/40 text-ink-faint hover:text-danger transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal for Create / Edit */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm animate-fadeIn">
            <div className="tile rounded-[28px] max-w-2xl w-full bg-card border border-line shadow-lift max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-line">
                <h3 className="text-xl font-display font-bold text-ink">
                  {editingProduct ? "Edit Product" : "Create New Object"}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-full text-ink-soft hover:text-ink hover:bg-canvas"
                >
                  <X className="size-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4 text-xs font-mono">
                <div className="space-y-1">
                  <label className="text-ink-soft">Object Name *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Bolle Lounge Chair"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-canvas border border-line text-sm text-ink outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-ink-soft">Category *</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-canvas border border-line text-xs font-mono text-ink outline-none"
                    >
                      {categories.map((c) => (
                        <option key={c.slug} value={c.slug}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-ink-soft">Tint Background</label>
                    <select
                      value={formTint}
                      onChange={(e) => setFormTint(e.target.value as Tint)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-canvas border border-line text-xs font-mono text-ink outline-none capitalize"
                    >
                      {["sage", "butter", "sand", "blush", "sky", "stone"].map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-ink-soft">Price ($) *</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={formPrice}
                      onChange={(e) => setFormPrice(e.target.value)}
                      placeholder="890"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-canvas border border-line text-ink outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-ink-soft">Sale Price ($)</label>
                    <input
                      type="number"
                      min={0}
                      value={formSalePrice}
                      onChange={(e) => setFormSalePrice(e.target.value)}
                      placeholder="Optional"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-canvas border border-line text-ink outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-ink-soft">Stock Count *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={formStock}
                      onChange={(e) => setFormStock(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-canvas border border-line text-ink outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-ink-soft">Image URL *</label>
                  <input
                    type="url"
                    required
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-canvas border border-line text-ink outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-ink-soft">Description / Blurb *</label>
                  <textarea
                    rows={3}
                    required
                    value={formBlurb}
                    onChange={(e) => setFormBlurb(e.target.value)}
                    placeholder="Handcrafted details, materials, tactile finish..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-canvas border border-line text-ink outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-ink-soft">Badge Tag</label>
                    <input
                      type="text"
                      value={formBadge}
                      onChange={(e) => setFormBadge(e.target.value)}
                      placeholder="e.g. Bestseller, New"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-canvas border border-line text-ink outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-ink-soft">Dimensions</label>
                    <input
                      type="text"
                      value={formDimensions}
                      onChange={(e) => setFormDimensions(e.target.value)}
                      placeholder="W 82 × D 78 × H 74 cm"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-canvas border border-line text-ink outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-line">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-full border border-line hover:border-ink/40 text-ink-soft text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 rounded-full bg-ink text-canvas hover:bg-ink/90 text-xs font-mono uppercase tracking-wider font-semibold"
                  >
                    {submitting ? "Saving..." : editingProduct ? "Update Object" : "Create Object"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
