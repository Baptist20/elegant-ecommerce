"use client";

import { useState, useEffect, useRef } from "react";
import {
  Plus,
  Loader2,
  Edit,
  Trash2,
  Tag,
  BookOpen,
  X,
  Image,
} from "lucide-react";
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

interface BlogCategory {
  _id: string;
  name: string;
  slug: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface ProductCategory {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

interface CategoryFormData {
  name: string;
  description: string;
  type: "product" | "blog";
  image: File | null;
  imagePreview: string;
}

export default function AdminCategoriesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingBlogCategories, setIsFetchingBlogCategories] =
    useState(false);
  const [isFetchingProductCategories, setIsFetchingProductCategories] =
    useState(false);
  const [blogCategories, setBlogCategories] = useState<BlogCategory[]>([]);
  const [productCategories, setProductCategories] = useState<ProductCategory[]>(
    [],
  );
  const [editingCategory, setEditingCategory] = useState<
    BlogCategory | ProductCategory | null
  >(null);
  const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null);
  const [categoryType, setCategoryType] = useState<"product" | "blog">("blog");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    description: "",
    type: "blog",
    image: null,
    imagePreview: "",
  });

  // Fetch categories on component mount
  useEffect(() => {
    fetchBlogCategories();
    fetchProductCategories();
  }, []);

  const fetchBlogCategories = async () => {
    try {
      setIsFetchingBlogCategories(true);
      const response = await fetch("/api/blog-categories");
      if (!response.ok) {
        throw new Error("Failed to fetch blog categories");
      }
      const data = await response.json();
      setBlogCategories(data);
    } catch (error) {
      console.error("Error fetching blog categories:", error);
      toast.error("Failed to load blog categories");
    } finally {
      setIsFetchingBlogCategories(false);
    }
  };

  const fetchProductCategories = async () => {
    try {
      setIsFetchingProductCategories(true);
      const response = await fetch("/api/categories");
      if (!response.ok) {
        throw new Error("Failed to fetch product categories");
      }
      const data = await response.json();
      setProductCategories(data);
    } catch (error) {
      console.error("Error fetching product categories:", error);
      toast.error("Failed to load product categories");
    } finally {
      setIsFetchingProductCategories(false);
    }
  };

  const handleInputChange = (field: keyof CategoryFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (file) {
      // Create preview URL
      const preview = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      });

      setFormData((prev) => ({
        ...prev,
        image: file,
        imagePreview: preview,
      }));
    }
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    setIsLoading(true);

    try {
      let url = "";
      let method = editingCategory ? "PUT" : "POST";

      if (formData.type === "blog") {
        url = "/api/blog-categories";
        const response = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: editingCategory?._id,
            name: formData.name,
            description: formData.description,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          toast.error(result.error || "Failed to save blog category");
          return;
        }

        toast.success(
          editingCategory
            ? "Blog category updated successfully!"
            : "Blog category created successfully!",
        );

        fetchBlogCategories();
      } else {
        url = "/api/categories";
        const formDataToSend = new FormData();
        formDataToSend.append("name", formData.name);
        formDataToSend.append("description", formData.description);

        if (editingCategory) {
          formDataToSend.append("id", editingCategory._id);
        }

        if (formData.image) {
          formDataToSend.append("image", formData.image);
        }

        const response = await fetch(url, {
          method,
          body: formDataToSend,
        });

        const result = await response.json();

        if (!response.ok) {
          toast.error(result.error || "Failed to save product category");
          return;
        }

        toast.success(
          editingCategory
            ? "Product category updated successfully!"
            : "Product category created successfully!",
        );

        fetchProductCategories();
      }

      // Reset form and close modal
      resetForm();
      setIsModalOpen(false);
      setEditingCategory(null);
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save category",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (
    category: BlogCategory | ProductCategory,
    type: "blog" | "product",
  ) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      type: type,
      image: null,
      imagePreview:
        type === "product" && "image" in category ? category.image || "" : "",
    });
    setCategoryType(type);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteCategoryId || !categoryType) return;

    try {
      const url =
        categoryType === "blog"
          ? `/api/blog-categories?id=${deleteCategoryId}`
          : `/api/categories?id=${deleteCategoryId}`;

      const response = await fetch(url, {
        method: "DELETE",
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Failed to delete category");
      }

      toast.success("Category deleted successfully!");

      if (categoryType === "blog") {
        fetchBlogCategories();
      } else {
        fetchProductCategories();
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete category",
      );
    } finally {
      setDeleteCategoryId(null);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      type: "blog",
      image: null,
      imagePreview: "",
    });
    setEditingCategory(null);
    setCategoryType("blog");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: null,
      imagePreview: "",
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-sm text-gray-500 mt-2">
            Manage product and blog categories
          </p>
        </div>
        <div className="text-sm text-gray-500">
          {categoryType === "blog"
            ? `${blogCategories.length} blog categor${blogCategories.length !== 1 ? "ies" : "y"}`
            : `${productCategories.length} product categor${productCategories.length !== 1 ? "ies" : "y"}`}
        </div>
      </div>

      {/* Category Type Selector */}
      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <Button
            variant={categoryType === "blog" ? "default" : "outline"}
            onClick={() => setCategoryType("blog")}
            className="flex items-center"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Blog Categories
          </Button>
          <Button
            variant={categoryType === "product" ? "default" : "outline"}
            onClick={() => setCategoryType("product")}
            className="flex items-center"
          >
            <Tag className="h-4 w-4 mr-2" />
            Product Categories
          </Button>
        </div>
      </div>

      {/* Blog Categories Grid */}
      {categoryType === "blog" && (
        <>
          {isFetchingBlogCategories ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              <span className="ml-2 text-gray-600">
                Loading blog categories...
              </span>
            </div>
          ) : blogCategories.length === 0 ? (
            <div className="bg-white rounded-lg border p-8 text-center">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No blog categories yet</p>
              <p className="text-sm text-gray-500 mt-2">
                Click the + button to add your first blog category
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogCategories.map((category) => (
                <div
                  key={category._id}
                  className="bg-white rounded-lg border overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <BookOpen className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="ml-3">
                          <h3 className="font-semibold text-lg text-gray-900">
                            {category.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {category.slug}
                          </p>
                        </div>
                      </div>
                    </div>

                    {category.description && (
                      <p className="text-sm text-gray-600 mb-4">
                        {category.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>Created: {formatDate(category.createdAt)}</span>
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(category, "blog")}
                        className="h-8 px-3"
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setDeleteCategoryId(category._id);
                          setCategoryType("blog");
                        }}
                        className="h-8 px-3"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Product Categories Grid */}
      {categoryType === "product" && (
        <>
          {isFetchingProductCategories ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              <span className="ml-2 text-gray-600">
                Loading product categories...
              </span>
            </div>
          ) : productCategories.length === 0 ? (
            <div className="bg-white rounded-lg border p-8 text-center">
              <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No product categories yet</p>
              <p className="text-sm text-gray-500 mt-2">
                Click the + button to add your first product category
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {productCategories.map((category) => (
                <div
                  key={category._id}
                  className="bg-white rounded-lg border overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Tag className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="ml-3">
                          <h3 className="font-semibold text-lg text-gray-900">
                            {category.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {category.slug}
                          </p>
                        </div>
                      </div>
                    </div>

                    {category.image && (
                      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {category.description && (
                      <p className="text-sm text-gray-600 mb-4">
                        {category.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>Created: {formatDate(category.createdAt)}</span>
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(category, "product")}
                        className="h-8 px-3"
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setDeleteCategoryId(category._id);
                          setCategoryType("product");
                        }}
                        className="h-8 px-3"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
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
          Add a new category
        </span>
      </Button>

      {/* Add/Edit Category Modal */}
      <Dialog
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) resetForm();
        }}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Edit Category" : "Add New Category"}
            </DialogTitle>
            <DialogDescription>
              {editingCategory
                ? "Update category information."
                : "Create a new category for your content."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Category Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#141718]">
                Category Type
              </label>
              <Select
                value={formData.type}
                onValueChange={(value: "product" | "blog") => {
                  setFormData((prev) => ({ ...prev, type: value }));
                }}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blog">
                    <div className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Blog Category
                    </div>
                  </SelectItem>
                  <SelectItem value="product">
                    <div className="flex items-center">
                      <Tag className="h-4 w-4 mr-2" />
                      Product Category
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#141718]">
                Name *
              </label>
              <Input
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder={
                  formData.type === "blog" ? "Decor Tips" : "Living Room"
                }
                disabled={isLoading}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#141718]">
                Description (optional)
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Describe this category..."
                rows={3}
                disabled={isLoading}
              />
            </div>

            {/* Image Upload (Product Categories Only) */}
            {formData.type === "product" && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-[#141718]">
                    Category Image (optional)
                  </label>
                  {formData.imagePreview && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={removeImage}
                      className="h-6 px-2 text-xs"
                    >
                      Remove
                    </Button>
                  )}
                </div>

                {!formData.imagePreview ? (
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileChange}
                    className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-[#141718] file:text-white hover:file:bg-black"
                    disabled={isLoading}
                  />
                ) : (
                  <div className="relative">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={formData.imagePreview}
                        alt="Category image preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}

                <p className="text-xs text-gray-500">
                  Recommended size: 400x400px (JPG, PNG, WebP, max 5MB)
                </p>
              </div>
            )}

            {/* Info Note */}
            {formData.type === "blog" && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <strong>Blog Categories</strong> are used to organize your
                  blog posts. They will appear as selectable options when
                  creating or editing blogs.
                </p>
              </div>
            )}

            {formData.type === "product" && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-800">
                  <strong>Product Categories</strong> are used to organize your
                  products. They will appear as selectable options when creating
                  or editing products.
                </p>
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
                  {editingCategory ? "Updating..." : "Creating..."}
                </>
              ) : editingCategory ? (
                "Update Category"
              ) : (
                "Add Category"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteCategoryId}
        onOpenChange={(open) => !open && setDeleteCategoryId(null)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this category? This action cannot
              be undone.
              {categoryType === "blog" &&
                " Any blogs using this category will need to be reassigned."}
              {categoryType === "product" &&
                " Any products using this category will need to be reassigned."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteCategoryId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
