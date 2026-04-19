"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { poppins, inter } from "../utils/font";
import CartItem from "./CartItem";
import Link from "next/link";
import { toast } from "sonner";

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CartItemType {
  _id: string;
  productId: {
    _id: string;
    name: string;
    price: number;
    images: string[];
  };
  quantity: number;
}

interface CartResponse {
  _id: string;
  items: CartItemType[];
}

export default function FlyoutCart({ isOpen, onClose }: CartProps) {
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchCart();
    }
  }, [isOpen]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/cart", { cache: "no-store" });
      if (!response.ok) {
        if (response.status === 401) {
          toast.error("Please log in to view your cart");
          return;
        }
        throw new Error("Failed to fetch cart");
      }
      const data: CartResponse = await response.json();
      setCart(data);
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast.error("Unable to load cart");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (productId: string) => {
    try {
      const response = await fetch(
        `/api/cart?productId=${encodeURIComponent(productId)}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        toast.error(data.error || "Failed to remove item");
        return;
      }

      const updatedCart: CartResponse = await response.json();
      setCart(updatedCart);
      toast.success("Item removed from cart");
    } catch {
      toast.error("Something went wrong while removing item");
    }
  };

  const handleUpdateQuantity = async (
    productId: string,
    newQuantity: number,
  ) => {
    if (newQuantity < 1) {
      handleRemoveItem(productId);
      return;
    }

    try {
      const response = await fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: newQuantity }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        toast.error(data.error || "Failed to update quantity");
        return;
      }

      const updatedCart: CartResponse = await response.json();
      setCart(updatedCart);
    } catch {
      toast.error("Something went wrong while updating quantity");
    }
  };

  const calculateTotal = () => {
    if (!cart?.items?.length) return 0;
    return cart.items.reduce((sum, item) => {
      const price = item.productId?.price || 0;
      return sum + price * item.quantity;
    }, 0);
  };

  const total = calculateTotal();

  return (
    <>
      {/* 1. BACKDROP */}
      <div
        className={`fixed inset-0 bg-black/30 z-[100] transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* 2. CART PANEL */}
      <aside
        className={`fixed top-0 right-0 h-screen bg-white z-[101] shadow-xl transition-transform duration-500 ease-in-out transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } w-full md:w-[413px] flex flex-col`}
      >
        {/* HEADER */}
        <div className="px-6 pt-6 pb-2 flex justify-between items-center">
          <h2
            className={`${poppins.className} text-2xl font-medium text-[#141718]`}
          >
            Cart
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-[#141718]" />
          </button>
        </div>

        {/* PRODUCT LIST SECTION (Top Summary Layout) */}
        <div className="flex-grow overflow-y-auto px-6 scrollbar-hide flex flex-col gap-6">
          {/* Parent div for items (365px width from your specs) */}
          <div className="w-full max-w-[365px] mx-auto flex flex-col gap-[24px]">
            {loading ? (
              <div className="py-8 text-center text-[#6C7275]">
                Loading cart...
              </div>
            ) : cart?.items?.length ? (
              cart.items.map((item) => (
                <CartItem
                  key={item._id}
                  name={item.productId.name}
                  color="Default"
                  price={item.productId.price}
                  quantity={item.quantity}
                  image={item.productId.images?.[0] || "/placeholder.jpg"}
                  onRemove={() => handleRemoveItem(item.productId._id)}
                  onUpdateQuantity={(newQty: number) =>
                    handleUpdateQuantity(item.productId._id, newQty)
                  }
                />
              ))
            ) : (
              <div className="py-8 text-center text-[#6C7275]">
                Your cart is empty
              </div>
            )}
          </div>
        </div>

        {/* PRICING & CHECKOUT SECTION (Second Summary Layout) */}
        <div className="px-6 py-6 border-t border-[#E8ECEF] flex flex-col gap-4">
          {/* Summary Fields (365px width) */}
          <div className="w-full max-w-[365px] mx-auto flex flex-col">
            {/* Shipping Row */}
            <div className="flex justify-between items-center py-[13px] border-b border-[#E8ECEF]">
              <span className={`${inter.className} text-base text-[#141718]`}>
                Shipping
              </span>
              <span
                className={`${inter.className} text-base font-semibold text-[#141718]`}
              >
                Free
              </span>
            </div>

            {/* Total Row */}
            <div className="flex justify-between items-center py-[13px]">
              <span
                className={`${poppins.className} text-xl font-medium text-[#141718]`}
              >
                Total
              </span>
              <span
                className={`${poppins.className} text-xl font-medium text-[#141718]`}
              >
                ${total.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="w-full max-w-[365px] mx-auto flex flex-col items-center gap-4">
            <button
              onClick={() => {
                if (!cart?.items?.length) {
                  toast.error("Your cart is empty");
                  return;
                }
                window.location.href = "/checkout";
              }}
              className="w-full h-[52px] bg-[#141718] text-white rounded-md flex items-center justify-center hover:bg-[#232627] transition-all"
            >
              <span
                className={`${inter.className} text-lg font-medium tracking-[-0.4px]`}
              >
                Checkout
              </span>
            </button>

            <Link
              href={"/cart"}
              className="border-b border-[#121212] pb-0.5 hover:opacity-70 transition-opacity"
            >
              <span
                className={`${inter.className} text-sm font-semibold text-[#121212]`}
              >
                View Cart
              </span>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
