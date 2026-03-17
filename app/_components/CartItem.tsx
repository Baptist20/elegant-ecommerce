import React from "react";
import Image from "next/image";
import { Minus, Plus, X } from "lucide-react";
import { inter } from "../utils/font";

interface CartItemProps {
  name: string;
  color: string;
  price: number;
  quantity: number;
  image: string;
}

export default function CartItem({
  name,
  color,
  price,
  quantity,
  image,
}: CartItemProps) {
  return (
    <div className="flex flex-row justify-between items-center py-6 w-full max-w-[376px] border-b border-[#E8ECEF]">
      {/* 1. Content Area (Image + Info) */}
      <div className="flex flex-row items-center gap-4">
        {/* Product Image Wrapper */}
        <div className="relative w-20 h-24 bg-[#F3F5F7] flex-none">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover mix-blend-multiply"
          />
        </div>

        {/* Info Column */}
        <div className="flex flex-col justify-center gap-2 w-[170px]">
          <div>
            <h4
              className={`${inter.className} font-semibold text-sm leading-[22px] text-[#141718]`}
            >
              {name}
            </h4>
            <p
              className={`${inter.className} text-xs leading-5 text-[#6C7275]`}
            >
              Color: {color}
            </p>
          </div>

          {/* Small Quantity Button */}
          <div className="flex items-center justify-between w-20 h-8 px-2 border border-[#6C7275] rounded-sm">
            <button className="hover:text-black text-[#121212] transition-colors">
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span
              className={`${inter.className} font-semibold text-xs text-[#121212]`}
            >
              {quantity}
            </span>
            <button className="hover:text-black text-[#121212] transition-colors">
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Price & Remove Column */}
      <div className="flex flex-col items-end justify-between h-24">
        <span
          className={`${inter.className} font-semibold text-sm leading-[22px] text-[#121212]`}
        >
          ${price.toFixed(2)}
        </span>
        <button className="text-[#6C7275] hover:text-red-500 transition-colors">
          <X className="w-6 h-6" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
