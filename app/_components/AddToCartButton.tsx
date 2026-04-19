"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";

interface AddToCartButtonProps {
  productId: string;
  productName: string;
  price: number;
  className?: string;
  variant?: "default" | "icon" | "full";
}

export default function AddToCartButton({
  productId,
  productName,
  price,
  className = "",
  variant = "default",
}: AddToCartButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          quantity: 1,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to add to cart");
        return;
      }

      toast.success(`${productName} added to cart!`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (variant === "icon") {
    return (
      <button
        onClick={handleAddToCart}
        disabled={loading}
        className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${className}`}
        aria-label="Add to cart"
      >
        <ShoppingCart className="w-5 h-5 text-gray-600 hover:text-black transition-colors" />
      </button>
    );
  }

  if (variant === "full") {
    return (
      <button
        onClick={handleAddToCart}
        disabled={loading}
        className={`w-full py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${className}`}
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Adding...
          </>
        ) : (
          <>
            <ShoppingCart className="w-5 h-5" />
            Add to Cart - ${price.toFixed(2)}
          </>
        )}
      </button>
    );
  }

  // Default variant
  return (
    <button
      onClick={handleAddToCart}
      disabled={loading}
      className={`px-6 py-2 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${className}`}
    >
      {loading ? (
        <>
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          Adding...
        </>
      ) : (
        <>
          <ShoppingCart className="w-4 h-4" />
          Add to Cart
        </>
      )}
    </button>
  );
}
