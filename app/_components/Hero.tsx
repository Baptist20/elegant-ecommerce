// "use-client";
// import Image from "next/image";
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from "@/components/ui/carousel";
// import { poppins } from "../utils/font"; // Adjust based on your font setup

// const carouselImage = [
//   { id: 1, href: "/carousel-one.png" },
//   { id: 2, href: "/carousel-two.png" },
//   { id: 3, href: "/carousel-three.png" },
// ];

// export default function Hero() {
//   return (
//     <section className="bg-white pt-4 pb-10 md:pb-20">
//       {/* 1. Carousel Section */}
//       <div className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-40 mb-8 md:mb-12">
//         <Carousel className="w-full relative group">
//           <CarouselContent>
//             {carouselImage.map((item) => (
//               <CarouselItem key={item.id}>
//                 <div className="relative w-full aspect-[311/304] md:aspect-[1120/536] overflow-hidden">
//                   <Image
//                     src={item.href} // Replace with your pexels-leah-kelley image
//                     alt="Interior Decor"
//                     fill
//                     className="object-cover"
//                     priority
//                   />
//                   {/* Figma's Linear Gradient Overlay */}
//                   <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#343839]/40" />
//                 </div>
//               </CarouselItem>
//             ))}
//           </CarouselContent>

//           {/* Desktop Navigation Arrows (Hidden on Mobile, Visible on Hover) */}
//           <div className="hidden md:block">
//             <CarouselPrevious className="left-8 h-12 w-12 border-none shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" />
//             <CarouselNext className="right-8 h-12 w-12 border-none shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" />
//           </div>

//           {/* Figma's Navigation Dots (Indicator Logic would go here) */}
//           <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4">
//             <div className="w-[30px] h-2 bg-white rounded-full" />
//             <div className="w-2 h-2 bg-white/60 rounded-full" />
//             <div className="w-2 h-2 bg-white/60 rounded-full" />
//           </div>
//         </Carousel>
//       </div>

//       {/* 2. Header Section (Text Content) */}
//       <div className="max-w-[1440px] mx-auto px-8 md:px-10 lg:px-40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6">
//         <h1
//           className={`${poppins.className} text-[40px] leading-[44px] md:text-[72px] md:leading-[76px] font-medium tracking-tight md:tracking-[-2px] text-[#141718] max-w-[643px]`}
//         >
//           Simply Unique<span className="text-[#6C7275]">/</span>{" "}
//           <br className="hidden md:block" /> Simply Better
//           <span className="text-[#6C7275]">.</span>
//         </h1>

//         <div className="max-w-[453px]">
//           <p className="font-['Inter'] font-semibold text-[14px] leading-[22px] md:text-[16px] md:leading-[26px] text-[#343839]">
//             3legant is a gift & decorations store based in HCMC, Vietnam. Est
//             since 2019.
//           </p>
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay"; // Import the plugin
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { poppins } from "../utils/font";
import { clsx } from "clsx";

const carouselImage = [
  { id: 1, href: "/carousel-one.png" },
  { id: 2, href: "/carousel-two.png" },
  { id: 3, href: "/carousel-three.png" },
];

export default function Hero() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  // Setup Autoplay plugin with 4-second delay
  const plugin = useRef(Autoplay({ delay: 4000, stopOnInteraction: false }));

  useEffect(() => {
    if (!api) return;

    // Set initial slide count and current slide
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <section className="bg-white pt-4 pb-10 md:pb-20">
      {/* 1. Carousel Section */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-40 mb-8 md:mb-12">
        <Carousel
          setApi={setApi}
          plugins={[plugin.current]} // Add the autoplay plugin here
          opts={{
            loop: true, // Enable infinite looping
          }}
          className="w-full relative"
        >
          <CarouselContent>
            {carouselImage.map((item) => (
              <CarouselItem key={item.id}>
                <div className="relative w-full aspect-[311/304] md:aspect-[1120/536] overflow-hidden rounded-sm">
                  {/* Temporary fix: Using img tag instead of Next.js Image */}
                  <img
                    src={item.href}
                    alt="Interior Decor"
                    className="w-full h-full object-cover"
                  />
                  {/* Figma's Linear Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#343839]/40" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Dynamic Navigation Dots - Controllable */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 z-20">
            {carouselImage.map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={clsx(
                  "h-2 rounded-full transition-all duration-300",
                  current === index
                    ? "w-[30px] bg-white" // Figma Active Style
                    : "w-2 bg-white/60 hover:bg-white", // Figma Inactive Style
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </Carousel>
      </div>

      {/* 2. Header Section (Text Content) */}
      <div className="max-w-[1440px] mx-auto px-8 md:px-10 lg:px-40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6">
        <h1
          className={`${poppins.className} text-[40px] leading-[44px] md:text-[72px] md:leading-[76px] font-medium tracking-tight md:tracking-[-2px] text-[#141718] max-w-[643px]`}
        >
          Simply Unique<span className="text-[#6C7275]">/</span>{" "}
          <br className="hidden md:block" /> Simply Better
          <span className="text-[#6C7275]">.</span>
        </h1>

        <div className="max-w-[453px]">
          <p className="font-['Inter'] font-semibold text-[14px] leading-[22px] md:text-[16px] md:leading-[26px] text-[#343839]">
            3legant is a gift & decorations store based in HCMC, Vietnam. Est
            since 2019.
          </p>
        </div>
      </div>
    </section>
  );
}
