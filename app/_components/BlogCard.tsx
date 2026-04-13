import React from "react";
import Image from "next/image";
import Link from "next/link";
import { inter } from "../utils/font";

interface BlogCardProps {
  title: string;
  date: string;
  image: string;
  slug: string;
}

export default function BlogCard({ title, date, image, slug }: BlogCardProps) {
  return (
    <Link href={`/blog/${slug}`} className="block">
      <article className="flex flex-col items-start gap-6 w-full group cursor-pointer">
        {/* --- IMAGE CONTAINER --- */}
        <div className="relative w-full aspect-[357/325] overflow-hidden rounded-sm bg-[#F3F5F7]">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* --- INFO SECTION --- */}
        <div className="flex flex-col items-start gap-2 w-full">
          <h3 className="font-poppins font-medium text-lg lg:text-xl leading-7 lg:leading-8 text-[#23262F] group-hover:text-black transition-colors line-clamp-2">
            {title}
          </h3>
          <time
            className={`${inter.className} text-xs leading-5 uppercase tracking-wider text-[#6C7275]`}
          >
            {date}
          </time>
        </div>
      </article>
    </Link>
  );
}
