import React from "react";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { inter } from "../utils/font";

export default function BlogHeader() {
  return (
    <header className="relative w-full h-[308px] lg:h-[392px] flex items-center justify-center overflow-hidden bg-[#F3F5F7]">
      {/* 1. Next.js Optimized Image */}
      <Image
        src="/blog-header.png"
        alt="Blog Header Background"
        fill
        priority // Tells Next.js to load this immediately (LCP optimization)
        className="object-cover z-0"
      />

      {/* 2. The Figma "Multiply" Overlay */}
      <div
        className="absolute inset-0 bg-[#F3F5F7] mix-blend-multiply z-10"
        aria-hidden="true"
      />

      {/* 3. The Content Layer */}
      <div className="relative z-20 w-full max-w-[1120px] px-8 lg:px-0 flex flex-col items-center gap-4 lg:gap-6 text-center">
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
            Blog
          </span>
        </nav>

        {/* Title & Subtitle */}
        <div className="flex flex-col items-center gap-2 lg:gap-6">
          <h1 className="font-poppins font-medium text-4xl lg:text-[54px] lg:leading-[58px] tracking-tight text-black">
            Our Blog
          </h1>
          <p
            className={`${inter.className} text-base lg:text-xl leading-relaxed text-[#121212] max-w-[311px] lg:max-w-[413px]`}
          >
            Home ideas and design inspiration
          </p>
        </div>
      </div>
    </header>
  );
}
