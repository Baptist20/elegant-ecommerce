import React from "react";
import Image from "next/image";
import { Star, Heart } from "lucide-react";
import { inter } from "../utils/font";

export default function ProductCard({
  name,
  image,
  price,
  rating,
}: {
  name: string;
  image: string;
  price: number;
  rating: number;
}) {
  const blurData =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+ZNPQAIXwM496Xn8QAAAABJRU5ErkJggg==";

  return (
    <div className="flex flex-col w-[262px] h-[433px] group">
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

        {/* Wishlist Button */}
        <button className="absolute top-4 right-4 z-20 p-1.5 bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:text-red-500">
          <Heart className="w-5 h-5 cursor-pointer" />
        </button>

        {/* Product Image */}
        <Image
          src={image}
          alt={name}
          fill
          quality={100}
          placeholder="blur"
          blurDataURL={blurData}
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Add to Cart Hover Button */}
        <div className="absolute inset-x-4 bottom-4 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <button className="w-full py-2.5 bg-[#141718] text-white rounded-lg font-medium text-sm hover:bg-[#232627] cursor-pointer">
            Add to cart
          </button>
        </div>
      </div>

      {/* --- CONTENT SECTION --- */}
      <div className="mt-3 flex flex-col gap-1">
        {/* Rating */}
        <div className="flex items-center gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 ${
                i < rating
                  ? "fill-[#141718] text-[#141718]" // Filled stars
                  : "fill-transparent text-[#6C7275]" // Unfilled stars
              }`}
            />
          ))}
        </div>

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
    </div>
  );
}
