"use client";

import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { inter } from "../utils/font";

interface BlogCategory {
  _id: string;
  name: string;
  slug: string;
}

export default function BlogToolbar() {
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/blog-categories");

        if (!response.ok) {
          throw new Error(`Failed to fetch categories: ${response.status}`);
        }

        const data = await response.json();
        setCategories(data);
      } catch (err) {
        console.error("Error fetching blog categories:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load categories",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="w-full flex flex-col md:flex-row items-start lg:items-center justify-between gap-4 lg:gap-0 px-8 lg:px-0 py-8 lg:py-4 max-w-[1120px] mx-auto">
      {/* --- LEFT: CATEGORY TABS (Desktop) / DROPDOWN (Mobile) --- */}
      <div className="flex items-center gap-10 w-full lg:w-auto">
        {/* Desktop View: Tabs */}
        <div className="hidden md:flex items-center gap-10">
          <button
            className={`${inter.className} text-sm font-semibold text-[#121212] border-b border-[#121212] pb-1`}
          >
            All Blog
          </button>
          {/* <button
            className={`${inter.className} text-sm font-semibold text-[#807E7E] hover:text-black transition-colors`}
          >
            Featured
          </button> */}
        </div>

        {/* Mobile View: Integrated into the Filter logic below or visible only on mobile */}
      </div>

      {/* --- RIGHT: FILTERS & GRID SELECTOR --- */}
      <div className="flex flex-col sm:flex-row items-center justify-between lg:justify-end w-full lg:w-auto gap-8">
        {/* Category Filter (The Select Element you requested) */}
        <div className="relative w-full sm:w-[312px] lg:w-[200px]">
          <select
            className={`${inter.className} w-full h-12 lg:h-auto appearance-none bg-transparent border-2 lg:border-none border-[#6C7275] rounded-lg px-4 lg:px-0 pr-10 font-semibold text-base lg:text-base text-[#141718] focus:outline-none cursor-pointer z-10 relative`}
            defaultValue="all"
            disabled={isLoading}
          >
            <option value="all">All Blog</option>
            {isLoading ? (
              <option value="loading" disabled>
                Loading categories...
              </option>
            ) : error ? (
              <option value="error" disabled>
                Error loading categories
              </option>
            ) : categories.length === 0 ? (
              <option value="none" disabled>
                No categories available
              </option>
            ) : (
              categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))
            )}
          </select>
          <div className="absolute right-3 lg:right-0 top-1/2 -translate-y-1/2 pointer-events-none z-20">
            <ChevronDown className="w-5 h-5 text-[#141718]" />
          </div>
        </div>
      </div>
    </div>
  );
}
