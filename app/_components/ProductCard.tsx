import React from "react";
import Image from "next/image";
import { ArrowUpRight, Heart } from "lucide-react";
import Link from "next/link";
import { inter } from "../utils/font";
import { toast } from "sonner";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

export default function ProductCard({
  id,
  name,
  image,
  price,
  isAdmin = false,
}: {
  id: string;
  name: string;
  image: string;
  price: number;
  isAdmin?: boolean;
}) {
  const blurData =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+ZNPQAIXwM496Xn8QAAAABJRU5ErkJggg==";

  const { isAuthenticated } = useKindeBrowserClient();

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Please log in to add items to your wishlist");
      return;
    }

    try {
      const response = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: id }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        toast.error(data.error || "Unable to add to wishlist");
        return;
      }

      toast.success("Added to wishlist");
    } catch {
      toast.error("Something went wrong while adding to wishlist");
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Please log in to add items to your cart");
      return;
    }

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: id, quantity: 1 }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        toast.error(data.error || "Unable to add item to cart");
        return;
      }

      toast.success("Product added to cart");
    } catch {
      toast.error("Something went wrong while adding to cart");
    }
  };

  return (
    <Link
      href={`/shop/${id}`}
      className="group flex h-[433px] w-[262px] flex-col"
    >
      {/* --- IMAGE CONTAINER --- */}
      <div className="relative w-full h-[349px] bg-[#F3F5F7] overflow-hidden">
        {/* Badges Layout */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
          <span className="bg-white text-black text-xs font-bold px-3 py-1 rounded-sm uppercase">
            New
          </span>
          <span className="bg-[#38CB89] text-white text-xs font-bold px-3 py-1 rounded-sm">
            -50%
          </span>
        </div>

        {/* Arrow Button for Product Detail Navigation */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            window.location.href = `/shop/${id}`;
          }}
          className="absolute top-4 right-4 z-20 p-1.5 bg-white rounded-full shadow-sm lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-100"
          aria-label="View product details"
        >
          <ArrowUpRight className="w-5 h-5 cursor-pointer" />
        </button>

        {/* Wishlist Button (Hidden for admins) */}
        {!isAdmin && (
          <button
            onClick={handleWishlist}
            className="absolute top-12 right-4 z-20 p-1.5 bg-white rounded-full shadow-sm lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 hover:text-red-500"
          >
            <Heart className="w-5 h-5 cursor-pointer" />
          </button>
        )}

        {/* Product Image */}
        <Image
          src={image}
          alt={name}
          fill
          quality={100}
          placeholder="blur"
          blurDataURL={blurData}
          className="object-cover lg:group-hover:scale-105 lg:transition-transform lg:duration-500"
        />

        {/* Add to Cart Hover Button (Hidden for admins) */}
        {!isAdmin && (
          <div className="absolute inset-x-4 bottom-4 z-20 lg:opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
            <button
              onClick={handleAddToCart}
              className="w-full py-2.5 bg-[#141718] text-white rounded-lg font-medium text-sm hover:bg-[#232627] cursor-pointer"
            >
              Add to cart
            </button>
          </div>
        )}
      </div>

      {/* --- CONTENT SECTION --- */}
      <div className="mt-3 flex flex-col gap-1">
        {/* Name */}
        <h4
          className={`${inter.className} font-semibold text-base text-[#141718] truncate`}
        >
          {name}
        </h4>

        {/* Price */}
        <div className="flex items-center gap-3">
          <span
            className={`${inter.className} font-semibold text-sm text-[#141718]`}
          >
            ${price}
          </span>
          <span
            className={`${inter.className} text-sm text-[#6C7275] line-through`}
          >
            $400.00
          </span>
        </div>
      </div>
    </Link>
  );
}
