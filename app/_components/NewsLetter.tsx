import Image from "next/image";
import { Mail } from "lucide-react";
import { poppins, inter } from "../utils/font";

export default function Newsletter() {
  return (
    <section className="relative w-full h-[360px] flex items-center justify-center overflow-hidden bg-[#F2F4F6]">
      {/* 1. Background Image with Blending */}
      {/* Note: Using two images with multiply blend mode as per your Figma CSS */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/newsletter-banner.png" // 6528420a4a039.jpg
          alt="Newsletter Background"
          fill
          className="object-cover opacity-20 mix-blend-multiply"
        />
      </div>

      {/* 2. Content Container (540px width) */}
      <div className="relative z-10 w-full max-w-[540px] px-4 flex flex-col items-center gap-8">
        {/* Header Text */}
        <div className="flex flex-col items-center gap-2 text-center">
          <h2
            className={`${poppins.className} text-[34px] md:text-[40px] leading-[44px] font-medium tracking-[-0.4px] text-[#141718]`}
          >
            Join Our Newsletter
          </h2>
          <p
            className={`${inter.className} text-base md:text-lg leading-[30px] text-[#141718]`}
          >
            Sign up for deals, new products and promotions
          </p>
        </div>

        {/* 3. Form Input Area (488px width) */}
        <form className="w-full max-w-[488px] flex items-center gap-2 border-b border-[#6C7275]/50 py-3 transition-colors focus-within:border-[#141718]">
          <div className="flex items-center gap-2 flex-grow">
            <Mail className="w-6 h-6 text-[#6C7275]" />
            <input
              type="email"
              placeholder="Email address"
              className={`bg-transparent w-full outline-none ${inter.className} font-medium text-base text-[#141718] placeholder:text-[#6C7275]`}
              required
            />
          </div>

          <button
            type="submit"
            className={`${inter.className} font-medium text-base text-[#6C7275] hover:text-[#141718] transition-colors whitespace-nowrap cursor-pointer`}
          >
            Signup
          </button>
        </form>
      </div>
    </section>
  );
}
