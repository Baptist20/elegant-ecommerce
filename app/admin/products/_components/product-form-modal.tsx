"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ProductDraft } from "./types";

interface ProductFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "edit";
  formValues: ProductDraft;
  onFieldChange: (field: keyof ProductDraft, value: string) => void;
  onSubmit: () => void;
}

export default function ProductFormModal({
  open,
  onOpenChange,
  mode,
  formValues,
  onFieldChange,
  onSubmit,
}: ProductFormModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Edit Product" : "Add New Product"}
          </DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Update the product information below."
              : "Fill in the product information to add a new item."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2 sm:grid-cols-2">
          <div className="space-y-2">
            <p className="text-sm font-medium text-[#141718]">Product Name</p>
            <Input
              value={formValues.name}
              onChange={(event) => onFieldChange("name", event.target.value)}
              placeholder="Nordic Loveseat Sofa"
            />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-[#141718]">Slug</p>
            <Input
              value={formValues.slug}
              onChange={(event) => onFieldChange("slug", event.target.value)}
              placeholder="nordic-loveseat-sofa"
            />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-[#141718]">Category</p>
            <Input
              value={formValues.category}
              onChange={(event) =>
                onFieldChange("category", event.target.value)
              }
              placeholder="Living Room"
            />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-[#141718]">Color</p>
            <Input
              value={formValues.color}
              onChange={(event) => onFieldChange("color", event.target.value)}
              placeholder="Ash Gray"
            />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-[#141718]">Price ($)</p>
            <Input
              type="number"
              min="0"
              value={formValues.price}
              onChange={(event) => onFieldChange("price", event.target.value)}
              placeholder="540"
            />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-[#141718]">Stock</p>
            <Input
              type="number"
              min="0"
              value={formValues.stock}
              onChange={(event) => onFieldChange("stock", event.target.value)}
              placeholder="20"
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <p className="text-sm font-medium text-[#141718]">Image URL</p>
            <Input
              value={formValues.imageUrl}
              onChange={(event) =>
                onFieldChange("imageUrl", event.target.value)
              }
              placeholder="/loveseat-sofa.png"
              disabled={mode === "edit"}
            />
            {mode === "edit" && (
              <p className="text-sm text-[#6C7275]">
                Image updates are disabled here. Create a new product if you
                want to change the image.
              </p>
            )}
          </div>

          <div className="space-y-2 sm:col-span-2">
            <p className="text-sm font-medium text-[#141718]">Description</p>
            <textarea
              value={formValues.description}
              onChange={(event) =>
                onFieldChange("description", event.target.value)
              }
              placeholder="Write a short product description..."
              rows={4}
              className="w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>
            {mode === "edit" ? "Save Changes" : "Add Product"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
