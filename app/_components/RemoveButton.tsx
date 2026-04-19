"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RemoveButton({ productId }: { productId: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleRemove = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/wishlist?productId=${productId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // router.refresh() updates the Server Component data without a full page reload
        router.refresh();
      } else {
        alert("Failed to remove item");
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleRemove}
      disabled={isDeleting}
      className={`${
        isDeleting ? "text-gray-400" : "text-red-600 hover:text-red-800"
      } text-sm font-medium transition-colors`}
    >
      {isDeleting ? "Removing..." : "Remove"}
    </button>
  );
}
