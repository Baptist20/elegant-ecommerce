import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { poppins, inter } from "../utils/font";

export default function PromoBanner() {
  const blurData =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+ZNPQAIXwM496Xn8QAAAABJRU5ErkJggg==";

  return (
    <section className="bg-white w-full">
      {/* Container: Stacked on mobile, 50/50 split on desktop */}
      <div className="flex flex-col md:flex-row min-h-[532px] w-full max-w-[1440px] mx-auto">
        {/* LEFT SIDE: Image */}
        <div className="relative w-full md:w-1/2 h-[360px] md:h-auto overflow-hidden">
          <Image
            src="/promo-banner.png" // spacejoy-umAXneH4GhA-unsplash.jpg
            alt="Interior Design Promo"
            fill
            quality={100}
            placeholder="blur"
            blurDataURL={blurData}
            className="object-cover"
          />
        </div>

        {/* RIGHT SIDE: Content */}
        <div className="w-full md:w-1/2 bg-[#F3F5F7] flex flex-col justify-center px-8 md:pl-[72px] md:pr-20 lg:pr-[160px] py-16 md:py-0">
          <div className="max-w-[452px] flex flex-col gap-6">
            {/* SALE Label */}
            <div className="flex flex-col gap-4">
              <span
                className={`${inter.className} text-[#377DFF] font-bold text-base uppercase tracking-wider`}
              >
                SALE UP TO 35% OFF
              </span>

              {/* Title */}
              <h2
                className={`${poppins.className} text-[34px] md:text-[40px] leading-[40px] md:leading-[44px] font-medium tracking-[-0.4px] text-[#141718]`}
              >
                HUNDREDS of <br /> New lower prices!
              </h2>

              {/* Description */}
              <p
                className={`${inter.className} text-[18px] md:text-20 leading-[32px] text-[#141718]`}
              >
                It’s more affordable than ever to give every room in your home a
                stylish makeover.
              </p>
            </div>

            {/* CTA Button */}
            <Link
              href="/"
              className={`inline-flex items-center gap-1 w-fit pb-1 border-b border-[#141718] ${inter.className} font-medium text-base text-[#141718] group`}
            >
              Shop Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
