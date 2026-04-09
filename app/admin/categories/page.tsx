"use client";
import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
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

interface Category {
  id: string;
  name: string;
}

const dummyCategories: Category[] = [
  { id: "CAT-001", name: "Electronics" },
  { id: "CAT-002", name: "Clothing" },
  { id: "CAT-003", name: "Home Goods" },
  { id: "CAT-004", name: "Books" },
];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(dummyCategories);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null,
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (categoryToDelete) {
      setCategories(categories.filter((cat) => cat.id !== categoryToDelete.id));
      setShowDeleteModal(false);
      setCategoryToDelete(null);
    }
  };

  const handleAddNewCategory = () => {
    if (newCategoryName.trim()) {
      const newCategory: Category = {
        id: `CAT-${Date.now()}`,
        name: newCategoryName.trim(),
      };
      setCategories([...categories, newCategory]);
      setNewCategoryName("");
      setShowAddModal(false);
    }
  };

  return (
    <div className="p-6">
      <h1
        className={`text-3xl font-bold text-gray-900 mb-6 ${poppins.className}`}
      >
        Categories
      </h1>

      <div className="space-y-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex items-center justify-between border border-gray-200 rounded-lg p-4 bg-white"
          >
            <span className="text-lg font-medium text-gray-800">
              {category.name}
            </span>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => handleDeleteClick(category)}
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          </div>
        ))}
      </div>

      {/* Floating Add Button / Add New Category Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogTrigger asChild>
          <Button className="fixed bottom-8 right-8 bg-black text-white p-4 rounded-full shadow-lg hover:bg-gray-800 transition-colors group">
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
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Close
            </Button>
            <Button onClick={handleAddNewCategory}>Add</Button>
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
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
