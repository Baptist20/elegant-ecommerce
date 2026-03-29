import React from "react";
import { X } from "lucide-react";
import Image from "next/image";

interface WishlistCardProps {
  imageSrc: string;
  altText: string;
  productName: string;
  productColor: string;
  price: string;
}

export default function WishlistCard({
  imageSrc,
  altText,
  productName,
  productColor,
  price,
}: WishlistCardProps) {
  return (
    <div className="flex items-center justify-between w-full min-h-[120px] py-6 border-b border-[#E8ECEF] md:gap-14">
      {/* Product Info */}
      <div className="flex items-center gap-4 flex-grow">
        <X className="w-6 h-6 text-[#6C7275] cursor-pointer hover:text-black transition-colors" />
        <div className="w-16 h-18 bg-[#F3F5F7] relative flex-shrink-0">
          <Image
            src={imageSrc}
            alt={altText}
            fill
            objectFit="cover"
            className="mix-blend-multiply"
          />
        </div>
        <div className="flex flex-col justify-center items-start gap-2 h-full">
          <p className="text-sm font-semibold text-[#141718] whitespace-nowrap">
            {productName}
          </p>
          <p className="text-xs text-[#6C7275]">{productColor}</p>
        </div>
      </div>

      {/* Price */}
      <p className="flex-none w-[120px] text-sm font-normal text-[#141718]">
        {price}
      </p>

      {/* Add to Cart Button */}
      <button className="flex items-center justify-center px-6 py-2 gap-2 w-[130px] h-10 bg-[#141718] text-white text-base font-medium rounded-lg hover:bg-black transition-all active:scale-[0.98]">
        Add to cart
      </button>
    </div>
  );
}
