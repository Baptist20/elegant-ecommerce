import React from "react";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { inter } from "../utils/font";

export default function ShopHeader() {
  return (
    <header className="relative w-full h-[308px] lg:h-[392px] flex items-center justify-center overflow-hidden">
      {/* --- BACKGROUND IMAGE & OVERLAY --- */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/carousel-two.png"
          alt="Modern Interior"
          fill
          priority
          className="object-cover"
        />
        {/* Figma Linear Gradient Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(243, 245, 247, 0) 27.68%, rgba(243, 245, 247, 0.6) 66.63%, rgba(243, 245, 247, 0.2) 100%)",
            mixBlendMode: "multiply",
          }}
        />
      </div>

      {/* --- CONTENT CONTAINER --- */}
      <div className="relative z-10 flex flex-col items-center gap-4 lg:gap-6 px-8 max-w-[1120px] w-full text-center">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-4">
          <div className="flex items-center gap-1 group cursor-pointer">
            <span
              className={`${inter.className} text-sm font-medium text-[#605F5F] hover:text-black transition-colors`}
            >
              Home
            </span>
            <ChevronRight className="w-3 h-3 text-[#605F5F]" />
          </div>
          <span
            className={`${inter.className} text-sm font-medium text-[#121212]`}
          >
            Shop
          </span>
        </nav>

        {/* Title & Subtitle */}
        <div className="flex flex-col items-center gap-2 lg:gap-6">
          <h1 className="font-poppins font-medium text-4xl lg:text-[54px] leading-tight lg:leading-[58px] tracking-[-1px] text-black">
            Shop Page
          </h1>
          <p
            className={`${inter.className} text-base lg:text-xl leading-relaxed lg:leading-[32px] text-[#121212] max-w-[311px] lg:max-w-[413px]`}
          >
            Let’s design the place you always imagined.
          </p>
        </div>
      </div>
    </header>
  );
}
