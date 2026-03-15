// "use client";

// import React from "react";
// import Link from "next/link";
// import { ArrowRight } from "lucide-react";
// import { poppins, inter } from "../utils/font";
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
// } from "@/components/ui/carousel";

// import ProductCard from "./ProductCard";

// export default function NewArrivals() {
//   // We'll replace this with your actual card component in the next step
//   const products = [1, 2, 3, 4, 5, 6];

//   return (
//     <section className="bg-white pt-12 md:pt-[48px] overflow-hidden pb-10">
//       <div className="max-w-[1440px] ml-auto">
//         <div className="pl-4 md:pl-10 lg:pl-40 flex flex-col gap-12">
//           {/* 1. HEADER ROW */}
//           <div className="flex items-end justify-between pr-4 md:pr-10 lg:pr-40">
//             <h2
//               className={`${poppins.className} text-[34px] md:text-[40px] leading-[44px] font-medium tracking-[-0.4px] text-[#141718]`}
//             >
//               New <br className="md:hidden" /> Arrivals
//             </h2>

//             <Link
//               href="/shop"
//               className={`hidden md:flex items-center gap-1 pb-1 border-b border-[#141718] ${inter.className} font-medium text-base text-[#141718] group`}
//             >
//               More Products
//               <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
//             </Link>
//           </div>

//           {/* 2. PRODUCT CAROUSEL TRACK */}
//           <div className="w-full">
//             <Carousel
//               opts={{
//                 align: "start",
//                 dragFree: true,
//               }}
//               className="w-full"
//             >
//               <CarouselContent className="-ml-6">
//                 {" "}
//                 {/* Matches Figma's 24px gap (gap-6) */}
//                 {products.map((product) => (
//                   <CarouselItem
//                     key={product}
//                     className="pl-6 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-[262px]"
//                   >
//                     {/* Placeholder for your ProductCard Component */}
//                     <div className="w-full h-[433px] bg-[#F3F5F7] rounded-sm flex items-center justify-center text-gray-400 italic">
//                       Product Card {product}
//                     </div>
//                   </CarouselItem>
//                 ))}
//               </CarouselContent>
//             </Carousel>
//           </div>

//           {/* 3. MOBILE LINK */}
//           <Link
//             href="/shop"
//             className={`flex md:hidden items-center gap-1 w-fit pb-1 border-b border-[#141718] ${inter.className} font-medium text-sm text-[#141718]`}
//           >
//             More Products
//             <ArrowRight className="w-4 h-4" />
//           </Link>
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { poppins, inter } from "../utils/font";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

import ProductCard from "./ProductCard";

export default function NewArrivals() {
  // Array to map through for the carousel items
  const products = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <section className="bg-white pt-12 md:pt-[48px] overflow-hidden pb-10 md:pb-20">
      <div className="max-w-[1440px] ml-auto">
        <div className="pl-4 md:pl-10 lg:pl-40 flex flex-col gap-12">
          {/* 1. HEADER ROW */}
          <div className="flex items-end justify-between pr-4 md:pr-10 lg:pr-40">
            <h2
              className={`${poppins.className} text-[34px] md:text-[40px] leading-[44px] font-medium tracking-[-0.4px] text-[#141718]`}
            >
              New <br className="md:hidden" /> Arrivals
            </h2>

            <Link
              href="/shop"
              className={`hidden md:flex items-center gap-1 pb-1 border-b border-[#141718] ${inter.className} font-medium text-base text-[#141718] group`}
            >
              More Products
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* 2. PRODUCT CAROUSEL TRACK */}
          <div className="w-full">
            <Carousel
              opts={{
                align: "start",
                dragFree: true,
                containScroll: "trimSnaps",
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-6">
                {products.map((product) => (
                  <CarouselItem
                    key={product}
                    // basis-auto allows the ProductCard's internal 262px width to dictate the size
                    className="pl-6 basis-auto"
                  >
                    <ProductCard />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>

          {/* 3. MOBILE LINK (Visible only on small screens) */}
          <Link
            href="/shop"
            className={`flex md:hidden items-center gap-1 w-fit pb-1 border-b border-[#141718] ${inter.className} font-medium text-sm text-[#141718]`}
          >
            More Products
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
