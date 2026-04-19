"use client";

import { useState, useEffect } from "react";
import { ChevronDown, Search } from "lucide-react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { inter } from "../utils/font";

interface BlogCategory {
  _id: string;
  name: string;
  slug: string;
}

export default function BlogToolbar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get current search query from URL
  const currentQuery = searchParams.get("query") || "";
  const currentSort = searchParams.get("sort") || "";
  const currentCategory = searchParams.get("category") || "";
  const currentPage = searchParams.get("page") || "1";

  // Debounced search handler
  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  // Handle sorting (only newest and oldest)
  function handleSorting(term: string) {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("sort", term);
    } else {
      params.delete("sort");
    }
    replace(`${pathname}?${params.toString()}`);
  }

  // Handle category filter
  function handleCategoryFilter(categoryId: string) {
    const params = new URLSearchParams(searchParams);
    if (categoryId && categoryId !== "all") {
      params.set("category", categoryId);
    } else {
      params.delete("category");
    }
    replace(`${pathname}?${params.toString()}`);
  }

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
      {/* --- LEFT: SEARCH BAR --- */}
      <div className="flex flex-col gap-2 w-full md:w-auto">
        <div className="relative">
          <input
            type="text"
            placeholder="Search blogs..."
            className="w-full h-12 px-4 pl-10 bg-transparent border-2 border-[#6C7275] rounded-lg font-semibold text-[#141718] focus:outline-none focus:ring-2 focus:ring-black/5"
            defaultValue={currentQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6C7275]" />
        </div>
      </div>

      {/* --- RIGHT: FILTERS & SORTING --- */}
      <div className="flex flex-col sm:flex-row items-center justify-between lg:justify-end w-full lg:w-auto gap-8">
        {/* Category Filter */}
        <div className="relative w-full sm:w-[200px]">
          <select
            className={`${inter.className} w-full h-12 appearance-none bg-transparent border-2 border-[#6C7275] rounded-lg px-4 pr-10 font-semibold text-base text-[#141718] focus:outline-none cursor-pointer z-10 relative`}
            value={currentCategory}
            disabled={isLoading}
            onChange={(e) => handleCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
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
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none z-20">
            <ChevronDown className="w-5 h-5 text-[#141718]" />
          </div>
        </div>

        {/* Sort Selector (Only Newest and Oldest) */}
        <div className="relative w-full sm:w-[200px]">
          <select
            className={`${inter.className} w-full h-12 appearance-none bg-transparent border-2 border-[#6C7275] rounded-lg px-4 pr-10 font-semibold text-base text-[#141718] focus:outline-none cursor-pointer z-10 relative`}
            value={currentSort}
            onChange={(e) => handleSorting(e.target.value)}
          >
            <option value="">Sort by</option>
            <option value="-createdAt">Newest</option>
            <option value="createdAt">Oldest</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none z-20">
            <ChevronDown className="w-5 h-5 text-[#141718]" />
          </div>
        </div>
      </div>
    </div>
  );
}
