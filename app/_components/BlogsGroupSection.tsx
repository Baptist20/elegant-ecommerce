"use client";

import { useState, useEffect } from "react";
import BlogCard from "./BlogCard";
import BlogToolbar from "./BlogToolbar";

interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  author: string;
  category: {
    _id: string;
    name: string;
    slug: string;
  } | null;
  thumbnail: string;
  createdAt: string;
  updatedAt: string;
}

interface BlogsGroupSectionProps {
  query?: string;
  sort?: string;
  category?: string;
  page?: string;
}

export default function BlogsGroupSection({
  query = "",
  sort = "",
  category = "",
  page = "1",
}: BlogsGroupSectionProps) {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setIsLoading(true);

        // Build query params
        const params = new URLSearchParams();
        if (query) params.set("query", query);
        if (sort) params.set("sort", sort);
        if (category) params.set("category", category);
        if (page && page !== "1") params.set("page", page);

        const url = `/api/blogs?${params.toString()}`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Failed to fetch blogs: ${response.status}`);
        }

        const data = await response.json();
        setBlogs(data);
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError(err instanceof Error ? err.message : "Failed to load blogs");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, [query, sort, category, page]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <section className="w-full bg-white">
        <div className="max-w-[1440px] mx-auto flex flex-col items-center gap-10 lg:gap-20 px-8 lg:px-[160px] pt-10 pb-20">
          <BlogToolbar />
          <div className="flex justify-center items-center h-64 w-full">
            <p className="text-gray-600">Loading blog posts...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full bg-white">
        <div className="max-w-[1440px] mx-auto flex flex-col items-center gap-10 lg:gap-20 px-8 lg:px-[160px] pt-10 pb-20">
          <BlogToolbar />
          <div className="flex justify-center items-center h-64 w-full">
            <p className="text-red-600">Error: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (blogs.length === 0) {
    return (
      <section className="w-full bg-white">
        <div className="max-w-[1440px] mx-auto flex flex-col items-center gap-10 lg:gap-20 px-8 lg:px-[160px] pt-10 pb-20">
          <BlogToolbar />
          <div className="flex justify-center items-center h-64 w-full">
            <p className="text-gray-600">No blog posts available</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-white">
      {/* 1. PARENT CONTAINER (The 40px 160px 80px padding from Figma) */}
      <div className="max-w-[1440px] mx-auto flex flex-col items-center gap-10 lg:gap-20 px-8 lg:px-[160px] pt-10 pb-20">
        {/* Toolbar Component */}
        <BlogToolbar />

        {/* 2. BLOG GRID (The 1121px width part) */}
        <div className="w-full flex flex-col items-center gap-10 lg:gap-20">
          {/* Responsive Grid System */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12 w-full max-w-[1121px]">
            {blogs.map((blog) => (
              <BlogCard
                key={blog._id}
                title={blog.title}
                date={formatDate(blog.createdAt)}
                image={blog.thumbnail || "/placeholder-blog.png"}
                slug={blog.slug}
              />
            ))}
          </div>

          {/* Show More Button (Optional but standard for modern blogs) */}
          {/* <button className="px-10 py-3 border border-[#121212] rounded-full font-medium text-[#121212] hover:bg-[#121212] hover:text-white transition-all duration-300">
            Show more
          </button> */}
          {/* --- PAGINATION --- */}
          <div className="flex items-center justify-center gap-2 mt-8 lg:mt-16">
            {/* Previous Button (Optional) */}
            <button className="hidden sm:flex items-center justify-center w-10 h-10 rounded-sm border border-[#EAEAEA] hover:border-[#121212] transition-colors group cursor-pointer">
              <span className="sr-only">Previous</span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="rotate-180 text-[#6C7275] group-hover:text-black"
              >
                <path
                  d="M7.5 15L12.5 10L7.5 5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* Page Numbers Mapping */}
            {/* {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((page) => {
              const isActive = page === 1; // You'll replace this with state like: currentPage === page

              return (
                <button
                  key={page}
                  className={`w-10 h-10 flex items-center justify-center rounded-sm text-sm font-semibold transition-all duration-200
          ${
            isActive
              ? "bg-[#121212] text-white"
              : "bg-white text-[#6C7275] border border-[#EAEAEA] hover:border-[#121212] hover:text-[#121212] cursor-pointer"
          }`}
                >
                  {page}
                </button>
              );
            })} */}

            {/* Next Button */}
            <button className="flex items-center justify-center w-10 h-10 rounded-sm border border-[#EAEAEA] hover:border-[#121212] transition-colors group cursor-pointer">
              <span className="sr-only">Next</span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-[#6C7275] group-hover:text-black"
              >
                <path
                  d="M7.5 15L12.5 10L7.5 5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
