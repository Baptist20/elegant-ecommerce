import React from "react";
import { X } from "lucide-react";
import Image from "next/image";
import WishlistCard from "../../_components/WishlistCard";

export default function WishlistPage() {
  return (
    <div className="flex flex-col items-start w-full max-w-[851px] p-0 md:px-[72px] gap-10">
      <h2 className="text-2xl font-semibold text-black">Your Wishlist</h2>

      <div className="w-full overflow-x-auto">
        <div className="flex flex-col items-start w-full min-w-max">
          {/* Table Header */}
          <div className="flex justify-between items-center w-full px-0 pb-2 pl-8 gap-14 border-b border-[#E8ECEF] text-sm font-normal leading-tight text-[#6C7275]">
            <p className="flex-none w-[160px]">Product</p>
            <p className="flex-none w-[120px]">Price</p>
            <p className="flex-none w-[137px]">Action</p>
          </div>

          {/* Wishlist Items */}
          <WishlistCard
            imageSrc="/table-lamp.png"
            altText="Tray Table"
            productName="Tray Table"
            productColor="Color: Black"
            price="$19.19"
          />
          <WishlistCard
            imageSrc="/loveseat-sofa.png"
            altText="Sofa"
            productName="Sofa"
            productColor="Color: Beige"
            price="$345.00"
          />
          <WishlistCard
            imageSrc="/bamboo-basket.png"
            altText="Bamboo basket"
            productName="Bamboo basket"
            productColor="Color: Beige"
            price="$8.80"
          />
          <WishlistCard
            imageSrc="/pillow.png"
            altText="Pillow"
            productName="Pillow"
            productColor="Color: Beige"
            price="$8.80"
          />
        </div>
      </div>
    </div>
  );
}
