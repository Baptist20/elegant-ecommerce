"use client";

import { X } from "lucide-react";
import { poppins, inter } from "../utils/font";
import CartItem from "./CartItem"; // Importing the component as requested
import Link from "next/link";

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FlyoutCart({ isOpen, onClose }: CartProps) {
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
            <CartItem
              name="Tray Table"
              color="Black"
              price={19.19}
              quantity={2}
              image="/table.jpg"
            />
            <CartItem
              name="Tray Table"
              color="Black"
              price={19.19}
              quantity={2}
              image="/table.jpg"
            />
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
                $148.00
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="w-full max-w-[365px] mx-auto flex flex-col items-center gap-4">
            <button className="w-full h-[52px] bg-[#141718] text-white rounded-md flex items-center justify-center hover:bg-[#232627] transition-all">
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
