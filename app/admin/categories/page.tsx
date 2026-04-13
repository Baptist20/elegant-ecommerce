"use client";
import React, { useState, useEffect } from "react";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { poppins } from "../../utils/font";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null,
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      setLoading(true);
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
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;

    try {
      setIsDeleting(true);
      const response = await fetch(
        `/api/category/?id=${categoryToDelete._id}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete category");
      }

      // Update local state
      setCategories(
        categories.filter((cat) => cat._id !== categoryToDelete._id),
      );

      toast.success("Category deleted successfully");
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete category",
      );
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setCategoryToDelete(null);
    }
  };

  const handleAddNewCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      setIsAdding(true);
      const response = await fetch("/api/category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newCategoryName.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create category");
      }

      // Update local state with new category
      setCategories([...categories, data.category]);
      setNewCategoryName("");
      setShowAddModal(false);

      toast.success("Category created successfully");
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create category",
      );
    } finally {
      setIsAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1
        className={`text-3xl font-bold text-gray-900 mb-6 ${poppins.className}`}
      >
        Categories
      </h1>

      {categories.length === 0 ? (
        <div className="text-center py-12 border border-gray-200 rounded-lg bg-white">
          <p className="text-gray-600">No categories found</p>
          <p className="text-sm text-gray-500 mt-2">
            Click the + button to add your first category
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {categories.map((category) => (
            <div
              key={category._id}
              className="flex items-center justify-between border border-gray-200 rounded-lg p-4 bg-white"
            >
              <div>
                <span className="text-lg font-medium text-gray-800">
                  {category.name}
                </span>
                <p className="text-sm text-gray-500 mt-1">{category.slug}</p>
              </div>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => handleDeleteClick(category)}
                disabled={isDeleting}
              >
                <Trash2 className="w-5 h-5" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Floating Add Button / Add New Category Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogTrigger asChild>
          <Button className="fixed bottom-8 right-8 bg-black text-white p-4 rounded-full shadow-lg hover:bg-gray-800 transition-colors group cursor-pointer">
            <Plus className="w-6 h-6" />
            <span className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-700 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Add a new category
            </span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogDescription>
              Enter the name for the new category.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              id="categoryName"
              placeholder="Category Name"
              value={newCategoryName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewCategoryName(e.target.value)
              }
              className="col-span-3"
              disabled={isAdding}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddModal(false)}
              disabled={isAdding}
            >
              Close
            </Button>
            <Button onClick={handleAddNewCategory} disabled={isAdding}>
              {isAdding ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete category{" "}
              <span className="font-bold">{categoryToDelete?.name}</span>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Continue"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
