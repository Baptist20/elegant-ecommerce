import React from "react";
import { ChevronRight } from "lucide-react";
import { inter } from "../utils/font";

export default function ContactUsHeader() {
  return (
    <div className="flex flex-col items-start w-full max-w-[1121px] gap-10 lg:gap-[40px]">
      {/* --- BREADCRUMBS --- */}
      <nav className="flex items-center gap-4 h-6">
        <div className="flex items-center gap-1 group cursor-pointer">
          <span
            className={`${inter.className} text-sm font-medium text-[#605F5F] group-hover:text-black transition-colors`}
          >
            Home
          </span>
          <ChevronRight className="w-3 h-3 text-[#605F5F]" />
        </div>
        <span
          className={`${inter.className} text-sm font-medium text-[#121212]`}
        >
          Contact Us
        </span>
      </nav>

      {/* --- TEXT CONTENT --- */}
      <div className="flex flex-col items-start gap-6 w-full">
        {/* Main Headline */}
        <h1 className="font-poppins font-medium text-3xl md:text-4xl lg:text-[54px] lg:leading-[58px] tracking-tight text-[#141718] max-w-[834px]">
          We believe in sustainable decor. We’re passionate about life at home.
        </h1>

        {/* Sub-description */}
        <p
          className={`${inter.className} text-sm md:text-base leading-6 md:leading-[26px] text-[#141718] max-w-[834px]`}
        >
          Our features timeless furniture, with natural fabrics, curved lines,
          plenty of mirrors and classic design, which can be incorporated into
          any decor project. The pieces enchant for their sobriety, to last for
          generations, faithful to the shapes of each period, with a touch of
          the present.
        </p>
      </div>
    </div>
  );
}
