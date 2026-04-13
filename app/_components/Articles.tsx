"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { poppins, inter } from "../utils/font";
import ArticleCard from "./ArticleCard";

interface Blog {
  _id: string;
  title: string;
  slug: string;
  thumbnail: string;
}

export default function Articles() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/blogs?limit=3");

        if (!response.ok) {
          throw new Error(`Failed to fetch blogs: ${response.status}`);
        }

        const data = await response.json();
        setBlogs(data);
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load articles",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, []);
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
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-600">Loading articles...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-red-600">Error: {error}</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-600">No articles available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-[25px]">
            {blogs.map((blog) => (
              <ArticleCard
                key={blog._id}
                name={blog.title}
                image={blog.thumbnail || "/placeholder-blog.png"}
                slug={blog.slug}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
