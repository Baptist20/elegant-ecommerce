import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { poppins, inter } from "../utils/font";

export default function ArticleCard({
  name,
  image,
  slug,
}: {
  name: string;
  image: string;
  slug: string;
}) {
  const blurData =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+ZNPQAIXwM496Xn8QAAAABJRU5ErkJggg==";

  return (
    <div className="flex flex-col items-start gap-6 w-full max-w-[357px] group">
      {/* 1. Image Container (357x325px) */}
      <div className="relative w-full aspect-[357/325] overflow-hidden">
        <Image
          src={image} // pexels-taryn-elliott-4112601.jpg
          alt={name}
          fill
          quality={100}
          placeholder="blur"
          blurDataURL={blurData}
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* 2. Info Content */}
      <div className="flex flex-col items-start gap-2">
        {/* Title */}
        <h3
          className={`${poppins.className} text-xl font-medium leading-7 text-[#23262F] line-clamp-2`}
        >
          {name}
        </h3>

        {/* Read More Button */}
        <Link
          href={`/blog/${slug}`}
          className={`flex items-center gap-1 pb-1 border-b border-[#141718] ${inter.className} font-medium text-base text-[#141718] group/btn`}
        >
          <span>Read More</span>
          <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
