"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { poppins } from "@/app/utils/font";
import { Button } from "@/components/ui/button";
import { dummyProducts } from "./dummy-products";
import ProductFormModal from "./product-form-modal";
import ProductsTable from "./products-table";
import type { AdminProduct, ProductDraft } from "./types";

const emptyDraft: ProductDraft = {
  id: "",
  name: "",
  slug: "",
  category: "",
  price: "",
  stock: "",
  color: "",
  description: "",
  imageUrl: "",
};

const toDraft = (product: AdminProduct): ProductDraft => ({
  id: product.id,
  name: product.name,
  slug: product.slug,
  category: product.category,
  price: String(product.price),
  stock: String(product.stock),
  color: product.color,
  description: product.description,
  imageUrl: product.imageUrl,
});

const toProduct = (values: ProductDraft): AdminProduct => ({
  id: values.id,
  name: values.name.trim(),
  slug: values.slug.trim(),
  category: values.category.trim(),
  price: Number(values.price) || 0,
  stock: Number(values.stock) || 0,
  color: values.color.trim(),
  description: values.description.trim(),
  imageUrl: values.imageUrl.trim() || "/table-lamp.png",
});

export default function AdminProductsClient() {
  const [products, setProducts] = useState<AdminProduct[]>(dummyProducts);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [formValues, setFormValues] = useState<ProductDraft>(emptyDraft);

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((product) => product.id !== productId));
  };

  const handleOpenAddModal = () => {
    setModalMode("add");
    setFormValues(emptyDraft);
    setModalOpen(true);
  };

  const handleOpenEditModal = (product: AdminProduct) => {
    setModalMode("edit");
    setFormValues(toDraft(product));
    setModalOpen(true);
  };

  const handleFormFieldChange = (field: keyof ProductDraft, value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const buildNextId = () => {
    const maxId = products.reduce((highest, product) => {
      const numeric = Number(product.id.replace("PROD-", ""));
      return Number.isNaN(numeric) ? highest : Math.max(highest, numeric);
    }, 0);

    return `PROD-${String(maxId + 1).padStart(3, "0")}`;
  };

  const handleSubmitProduct = () => {
    if (modalMode === "edit") {
      const updated = toProduct(formValues);

      setProducts((prev) =>
        prev.map((product) =>
          product.id === updated.id
            ? {
                ...updated,
                imageUrl: product.imageUrl,
              }
            : product,
        ),
      );
    } else {
      const newProduct = toProduct({ ...formValues, id: buildNextId() });
      setProducts((prev) => [newProduct, ...prev]);
    }

    setModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-24">
      <header className="space-y-1">
        <h1
          className={`text-3xl font-bold tracking-tight ${poppins.className}`}
        >
          Products
        </h1>
        <p className="text-sm text-[#6C7275]">
          Manage your store products, stock counts, and updates.
        </p>
      </header>

      <ProductsTable
        products={products}
        onEdit={handleOpenEditModal}
        onDelete={handleDeleteProduct}
      />

      <ProductFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        mode={modalMode}
        formValues={formValues}
        onFieldChange={handleFormFieldChange}
        onSubmit={handleSubmitProduct}
      />

      <Button
        onClick={handleOpenAddModal}
        size="icon-lg"
        className="group fixed right-8 bottom-8 rounded-full bg-[#141718] text-white shadow-lg hover:bg-black"
      >
        <Plus className="size-5" />
        <span className="pointer-events-none absolute right-14 rounded-md bg-[#141718] px-3 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100">
          Add a new product
        </span>
      </Button>
    </div>
  );
}
