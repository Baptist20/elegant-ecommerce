"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";

interface WishlistButtonProps {
  productId: string;
  className?: string;
}

export default function WishlistButton({
  productId,
  className = "",
}: WishlistButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleAddToWishlist = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to add to wishlist");
        return;
      }

      toast.success("Added to wishlist!");
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      toast.error("log in to perform this action");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleAddToWishlist}
      disabled={loading}
      className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${className}`}
      aria-label="Add to wishlist"
    >
      <Heart className="w-5 h-5 text-gray-600 hover:text-red-500 transition-colors" />
    </button>
  );
}
