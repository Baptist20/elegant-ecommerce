import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { poppins, inter } from "../utils/font";
import ArticleCard from "./ArticleCard"; // We'll create this next

export default function Articles() {
  const articleData = [
    {
      name: "7 ways to decor your home",
      imgae: "/article-one.png",
    },
    {
      name: "Kitchen organization",
      imgae: "/article-two.png",
    },
    {
      name: "Decor your bedroom",
      imgae: "/article-three.png",
    },
  ];
  return (
    <section className="bg-white py-12 md:py-20">
      <div className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-40">
        {/* 1. Header Row */}
        <div className="flex items-end justify-between mb-10 md:mb-12">
          <h2
            className={`${poppins.className} text-[34px] md:text-[40px] leading-[44px] font-medium tracking-tight text-[#141718]`}
          >
            Articles
          </h2>

          <Link
            href="/blog"
            className={`flex items-center gap-1 pb-1 border-b border-[#141718] ${inter.className} font-medium text-base text-[#141718] group`}
          >
            More Articles
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 2. Articles Grid */}
        {/* Usually 3 columns in Figma for this section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-[25px]">
          {articleData.map((article) => (
            <ArticleCard
              key={article.name}
              name={article.name}
              image={article.imgae}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
