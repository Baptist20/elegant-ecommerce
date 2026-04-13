"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Loader2, X, Edit, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface Category {
  _id: string;
  name: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  category: {
    _id: string;
    name: string;
  };
  description?: string;
  stock: number;
  images: string[];
  colors: string[];
  createdAt: string;
  updatedAt: string;
}

interface ProductFormData {
  name: string;
  price: string;
  categoryId: string;
  description: string;
  stock: string;
  colors: string;
  images: File[];
  imagePreviews: string[];
}

export default function AdminProductsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingProducts, setIsFetchingProducts] = useState(false);
  const [isFetchingCategories, setIsFetchingCategories] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    price: "",
    categoryId: "",
    description: "",
    stock: "",
    colors: "",
    images: [],
    imagePreviews: [],
  });

  // Fetch products and categories on component mount
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsFetchingProducts(true);
      const response = await fetch("/api/products");
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setIsFetchingProducts(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setIsFetchingCategories(true);
      const response = await fetch("/api/category");
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    } finally {
      setIsFetchingCategories(false);
    }
  };

  const getStockColor = (stock: number) => {
    if (stock <= 10) return "bg-red-100 text-red-800";
    if (stock <= 15) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  const getStockText = (stock: number) => {
    if (stock <= 10) return "Low Stock";
    if (stock <= 15) return "Medium Stock";
    return "In Stock";
  };

  const handleInputChange = (field: keyof ProductFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const limitedFiles = files.slice(0, 5); // Limit to 5 images

    // Create preview URLs for each file
    const filesWithPreview = await Promise.all(
      limitedFiles.map(async (file) => {
        const preview = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            resolve(e.target?.result as string);
          };
          reader.readAsDataURL(file);
        });
        return { file, preview };
      }),
    );

    setFormData((prev) => ({
      ...prev,
      images: filesWithPreview.map((item) => item.file),
      imagePreviews: filesWithPreview.map((item) => item.preview),
    }));
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.name.trim()) {
      toast.error("Product name is required");
      return;
    }

    if (!formData.price || Number(formData.price) <= 0) {
      toast.error("Valid price is required");
      return;
    }

    if (!formData.categoryId) {
      toast.error("Category is required");
      return;
    }

    if (!formData.stock || Number(formData.stock) < 0) {
      toast.error("Valid stock number is required");
      return;
    }

    if (formData.images.length === 0 && !editingProduct) {
      toast.error("At least one image is required for new products");
      return;
    }

    if (formData.images.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }

    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("category", formData.categoryId);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("stock", formData.stock);
      formDataToSend.append("colors", formData.colors);

      if (editingProduct) {
        formDataToSend.append("id", editingProduct._id);
        // For editing, send existing images as JSON
        formDataToSend.append("images", JSON.stringify(editingProduct.images));
      }

      // Append each image file (only for new products or when adding new images)
      if (!editingProduct || formData.images.length > 0) {
        formData.images.forEach((file) => {
          formDataToSend.append("images", file);
        });
      }

      const url = editingProduct ? "/api/products" : "/api/products";
      const method = editingProduct ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: formDataToSend,
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || "Failed to save product");
        return;
      }

      toast.success(
        editingProduct
          ? "Product updated successfully!"
          : "Product created successfully!",
      );

      // Refresh products and reset form
      fetchProducts();
      resetForm();
      setIsModalOpen(false);
      setEditingProduct(null);
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save product",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      categoryId: product.category._id,
      description: product.description || "",
      stock: product.stock.toString(),
      colors: product.colors.join(", "),
      images: [],
      imagePreviews: [],
    });
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteProductId) return;

    try {
      const response = await fetch(`/api/products?id=${deleteProductId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Failed to delete product");
      }

      toast.success("Product deleted successfully!");
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete product",
      );
    } finally {
      setDeleteProductId(null);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      categoryId: "",
      description: "",
      stock: "",
      colors: "",
      images: [],
      imagePreviews: [],
    });
    setEditingProduct(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...formData.images];
    const newPreviews = [...formData.imagePreviews];
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    setFormData((prev) => ({
      ...prev,
      images: newImages,
      imagePreviews: newPreviews,
    }));
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-sm text-gray-500 mt-2">
            Manage your store products and inventory
          </p>
        </div>
        <div className="text-sm text-gray-500">
          {products.length} product{products.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Products Grid */}
      {isFetchingProducts ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          <span className="ml-2 text-gray-600">Loading products...</span>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-lg border p-8 text-center">
          <p className="text-gray-600">No products yet</p>
          <p className="text-sm text-gray-500 mt-2">
            Click the + button to add your first product
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-lg border overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Product Image */}
              <div className="aspect-square bg-gray-100 overflow-hidden">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Eye className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg text-gray-900 truncate">
                    {product.name}
                  </h3>
                  <span className="font-bold text-gray-900">
                    ${product.price.toFixed(2)}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-2">
                  {product.category?.name || "Uncategorized"}
                </p>

                {product.description && (
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                    {product.description}
                  </p>
                )}

                <div className="flex justify-between items-center mt-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStockColor(
                      product.stock,
                    )}`}
                  >
                    {getStockText(product.stock)} ({product.stock})
                  </span>

                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(product)}
                      className="h-8 px-3"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setDeleteProductId(product._id)}
                      className="h-8 px-3"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Hover Plus Icon Button */}
      <Button
        onClick={() => {
          resetForm();
          setIsModalOpen(true);
        }}
        size="icon-lg"
        className="group fixed right-8 bottom-8 rounded-full bg-[#141718] text-white shadow-lg hover:bg-black transition-all duration-200"
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="size-5 animate-spin" />
        ) : (
          <Plus className="size-5" />
        )}
        <span className="pointer-events-none absolute right-14 rounded-md bg-[#141718] px-3 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100">
          Add a new product
        </span>
      </Button>

      {/* Add/Edit Product Modal */}
      <Dialog
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) resetForm();
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Edit Product" : "Add New Product"}
            </DialogTitle>
            <DialogDescription>
              {editingProduct
                ? "Update product information. Note: To change images, create a new product."
                : "Fill in the product information to add a new item to your store."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4 sm:grid-cols-2">
            {/* Product Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#141718]">
                Product Name *
              </label>
              <Input
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Nordic Loveseat Sofa"
                disabled={isLoading}
              />
            </div>

            {/* Price */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#141718]">
                Price ($) *
              </label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                placeholder="540.00"
                disabled={isLoading}
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#141718]">
                Category *
              </label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) =>
                  handleInputChange("categoryId", value)
                }
                disabled={isLoading || isFetchingCategories}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {isFetchingCategories ? (
                    <SelectItem value="loading" disabled>
                      Loading categories...
                    </SelectItem>
                  ) : categories.length === 0 ? (
                    <SelectItem value="none" disabled>
                      No categories found
                    </SelectItem>
                  ) : (
                    categories.map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Stock */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#141718]">
                Stock *
              </label>
              <Input
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => handleInputChange("stock", e.target.value)}
                placeholder="20"
                disabled={isLoading}
              />
            </div>

            {/* Description */}
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium text-[#141718]">
                Description (optional)
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Describe your product..."
                rows={3}
                disabled={isLoading}
              />
            </div>

            {/* Colors (Optional) */}
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium text-[#141718]">
                Colors (comma-separated, optional)
              </label>
              <Input
                value={formData.colors}
                onChange={(e) => handleInputChange("colors", e.target.value)}
                placeholder="Ash Gray, Beige, Natural"
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500">
                Separate multiple colors with commas
              </p>
            </div>

            {/* Images - Only for new products */}
            {!editingProduct && (
              <div className="space-y-2 sm:col-span-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-[#141718]">
                    Images (max 5) *
                  </label>
                  <span className="text-xs text-gray-500">
                    {formData.images.length}/5 selected
                  </span>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleFileChange}
                  className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-[#141718] file:text-white hover:file:bg-black"
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500">
                  Select up to 5 images (JPG, PNG, WebP, GIF, max 10MB each)
                </p>

                {/* Image previews */}
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                    {formData.images.map((file, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                          {formData.imagePreviews[index] ? (
                            <img
                              src={formData.imagePreviews[index]}
                              alt={file.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <div className="text-center p-4">
                                <p className="text-xs font-medium truncate">
                                  {file.name}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {(file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Image note for editing */}
            {editingProduct && (
              <div className="space-y-2 sm:col-span-2">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800 font-medium">
                    Images cannot be edited
                  </p>
                  <p className="text-xs text-yellow-700 mt-1">
                    To change product images, create a new product with the
                    updated images.
                  </p>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {editingProduct ? "Updating..." : "Creating..."}
                </>
              ) : editingProduct ? (
                "Update Product"
              ) : (
                "Add Product"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteProductId}
        onOpenChange={(open) => !open && setDeleteProductId(null)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteProductId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
