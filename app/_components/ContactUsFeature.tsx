import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { inter } from "../utils/font";

export default function ContactUsFeature() {
  return (
    <div className="flex flex-col lg:flex-row w-full max-w-[1119px] mx-auto bg-[#F3F5F7] overflow-hidden">
      {/* --- IMAGE SIDE --- */}
      <div className="relative w-full lg:w-1/2 min-h-[300px] lg:min-h-[413px]">
        <Image
          src="/contact-us-feature-banner.png"
          alt="Modern sustainable decor"
          fill
          className="object-cover"
        />
      </div>

      {/* --- CONTENT SIDE --- */}
      <div
        className="w-full lg:w-1/2 flex flex-col justify-center items-start 
                      p-8 md:p-12 lg:pl-[72px] lg:pr-12 lg:py-0 
                      min-h-[413px] gap-6"
      >
        {/* Title & Description Group */}
        <div className="flex flex-col items-start gap-4 max-w-[452px]">
          <h2 className="font-poppins font-medium text-3xl lg:text-4xl leading-tight tracking-tight text-[#121212]">
            About Us
          </h2>
          <p
            className={`${inter.className} text-base leading-[26px] text-[#343839]`}
          >
            Phosfluorescently engage worldwide methodologies with web-enabled
            process-centric technology. Interactively coordinate proactive
            e-commerce via process-centric "outside the box" thinking.
            Completely pursue scalable customer service through sustainable
            potentialities.
          </p>
        </div>

        {/* Action Button */}
        <button className="group flex items-center gap-1 border-b border-black pb-1 hover:gap-3 transition-all duration-300">
          <span
            className={`${inter.className} text-base font-medium text-[#121212]`}
          >
            Shop Now
          </span>
          <ArrowRight className="w-5 h-5 text-[#121212]" />
        </button>
      </div>
    </div>
  );
}
