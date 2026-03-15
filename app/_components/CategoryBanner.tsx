import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { inter, poppins } from "../utils/font";

export default function BannerGrid() {
  // Placeholder transparent pixel for blur effect
  const blurData =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+ZNPQAIXwM496Xn8QAAAABJRU5ErkJggg==";

  return (
    <section className="bg-white py-10 xl:py-16">
      <div className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-40">
        <div className="flex flex-col md:flex-row gap-6">
          {/* 1. Large Banner (Living Room) */}
          <div className="relative flex-1 bg-[#F3F5F7] overflow-hidden group aspect-[311/377] md:aspect-[548/664]">
            <Image
              src="/living-room.png"
              alt="Living Room"
              fill
              quality={100}
              placeholder="blur"
              blurDataURL={blurData}
              className="object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-8 left-8 md:top-12 md:left-12 z-10">
              <h3
                className={`${poppins.className} text-[28px] md:text-[34px] font-medium leading-[38px] tracking-[-0.6px] text-[#141718] mb-3`}
              >
                Living Room
              </h3>
              <Link
                href="/shop/living-room"
                className={`inline-flex items-center gap-1 pb-1 border-b border-[#141718] ${inter.className} font-medium text-base text-[#141718] group/btn`}
              >
                Shop Now
                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* 2. Small Banners Column */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Bedroom Card */}
            <div className="relative flex-1 bg-[#F3F5F7] overflow-hidden group aspect-[311/311] md:aspect-[548/320]">
              <Image
                src="/bedroom.png"
                alt="Bedroom"
                fill
                quality={100}
                placeholder="blur"
                blurDataURL={blurData}
                className="object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-8 left-8 md:bottom-10 md:left-10 z-10">
                <h3
                  className={`${poppins.className} text-[28px] md:text-[34px] font-medium leading-[38px] tracking-[-0.6px] text-[#141718] mb-3`}
                >
                  Bedroom
                </h3>
                <Link
                  href="/shop/bedroom"
                  className={`inline-flex items-center gap-1 pb-1 border-b border-[#141718] ${inter.className} font-medium text-base text-[#141718] group/btn`}
                >
                  Shop Now
                  <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Kitchen Card */}
            <div className="relative flex-1 bg-[#F3F5F7] overflow-hidden group aspect-[311/311] md:aspect-[548/320]">
              <Image
                src="/kitchen.png"
                alt="Kitchen"
                fill
                quality={100}
                placeholder="blur"
                blurDataURL={blurData}
                className="object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-8 left-8 md:bottom-10 md:left-10 z-10">
                <h3
                  className={`${poppins.className} text-[28px] md:text-[34px] font-medium leading-[38px] tracking-[-0.6px] text-[#141718] mb-3`}
                >
                  Kitchen
                </h3>
                <Link
                  href="/shop/kitchen"
                  className={`inline-flex items-center gap-1 pb-1 border-b border-[#141718] ${inter.className} font-medium text-base text-[#141718] group/btn`}
                >
                  Shop Now
                  <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
