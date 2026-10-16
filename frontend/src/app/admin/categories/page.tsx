"use client";

import React, { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ICategory, Tint } from "@/lib/types";
import { api } from "@/lib/api";
import { tintBgClasses } from "@/lib/utils";
import { Plus, Pencil, Trash2, X, FolderTree, AlertCircle } from "lucide-react";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ICategory | null>(null);
  const [name, setName] = useState("");
  const [tint, setTint] = useState<Tint>("sand");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.getCategories();
      setCategories(res.categories || []);
    } catch (err) {
      console.error("Failed to load categories", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreate = () => {
    setEditingCategory(null);
    setName("");
    setTint("sand");
    setImage("https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1000&q=80");
    setDescription("");
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const openEdit = (cat: ICategory) => {
    setEditingCategory(cat);
    setName(cat.name);
    setTint(cat.tint);
    setImage(cat.image);
    setDescription(cat.description || "");
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !image) return;
    setSubmitting(true);
    setErrorMsg(null);
    try {
      if (editingCategory) {
        await api.updateCategory(editingCategory._id || editingCategory.id, {
          name,
          tint,
          image,
          description,
        });
      } else {
        await api.createCategory({
          name,
          tint,
          image,
          description,
        });
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to save category");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete category "${name}"?`)) {
      try {
        await api.deleteCategory(id);
        fetchCategories();
      } catch (err: any) {
        alert(err.message || "Failed to delete category");
      }
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-ink-faint">
              Taxonomy & Collections
            </span>
            <h1 className="text-3xl font-display font-bold text-ink tracking-tight mt-1">
              Categories ({categories.length})
            </h1>
          </div>

          <button
            onClick={openCreate}
            className="px-5 py-2.5 rounded-full bg-ink text-canvas hover:bg-ink/90 text-xs font-mono uppercase tracking-wider font-semibold transition-all flex items-center gap-2 self-start shadow-sm"
          >
            <Plus className="size-4" /> Add Category
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const tintClass = tintBgClasses[cat.tint] || "bg-sand";
            return (
              <div key={cat.slug} className="tile rounded-[28px] p-5 bg-card border border-line flex flex-col justify-between">
                <div>
                  <div className={`aspect-video rounded-2xl overflow-hidden ${tintClass}/50 mb-4 p-3 flex items-center justify-center`}>
                    <img src={cat.image} alt={cat.name} className="size-full object-cover rounded-xl" />
                  </div>

                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-lg font-display font-semibold text-ink">{cat.name}</h3>
                    <span className="text-xs font-mono text-ink-faint">
                      {cat.productCount} object(s)
                    </span>
                  </div>

                  <span className="text-xs font-mono text-ink-faint block mb-2">
                    Slug: /{cat.slug}
                  </span>

                  <p className="text-xs text-ink-soft line-clamp-2">
                    {cat.description || "No description provided."}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-line/60 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-mono">
                    <span className={`size-3 rounded-full ${tintClass} border border-black/10`} />
                    <span className="capitalize text-ink-soft">{cat.tint}</span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(cat)}
                      className="p-1.5 rounded-lg border border-line hover:border-ink/40 text-ink-soft hover:text-ink transition-colors"
                      title="Edit Category"
                    >
                      <Pencil className="size-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(cat._id || cat.id, cat.name)}
                      className="p-1.5 rounded-lg border border-line hover:border-danger/40 text-ink-faint hover:text-danger transition-colors"
                      title="Delete Category"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm animate-fadeIn">
            <div className="tile rounded-[28px] max-w-md w-full bg-card border border-line shadow-lift p-6 sm:p-8 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-line">
                <h3 className="text-xl font-display font-bold text-ink">
                  {editingCategory ? "Edit Category" : "Create New Category"}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-full text-ink-soft hover:text-ink hover:bg-canvas"
                >
                  <X className="size-5" />
                </button>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-danger/10 text-danger text-xs font-mono flex items-center gap-2">
                  <AlertCircle className="size-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
                <div className="space-y-1">
                  <label className="text-ink-soft">Category Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Storage"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-canvas border border-line text-sm text-ink outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-ink-soft">Theme Tint</label>
                  <select
                    value={tint}
                    onChange={(e) => setTint(e.target.value as Tint)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-canvas border border-line text-xs font-mono text-ink outline-none capitalize"
                  >
                    {["sage", "butter", "sand", "blush", "sky", "stone"].map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-ink-soft">Image URL *</label>
                  <input
                    type="url"
                    required
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-canvas border border-line text-ink outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-ink-soft">Description</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief collection statement..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-canvas border border-line text-ink outline-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-line">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-full border border-line text-ink-soft text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 rounded-full bg-ink text-canvas hover:bg-ink/90 text-xs font-mono uppercase tracking-wider font-semibold"
                  >
                    {submitting ? "Saving..." : "Save Category"}
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
