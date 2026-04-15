"use client";

import { useState, useEffect } from "react";
import { ChevronDown, Search } from "lucide-react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { inter } from "../utils/font";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

export default function ShopToolbar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get current search query from URL
  const currentQuery = searchParams.get("query") || "";
  const currentSort = searchParams.get("sort") || "";
  const currentCategory = searchParams.get("category") || "";
  const currentPrice = searchParams.get("price") || "";

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

  // Handle sorting
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
    if (categoryId) {
      params.set("category", categoryId);
    } else {
      params.delete("category");
    }
    replace(`${pathname}?${params.toString()}`);
  }

  // Handle price filter
  function handlePriceFilter(priceRange: string) {
    const params = new URLSearchParams(searchParams);
    if (priceRange && priceRange !== "all") {
      params.set("price", priceRange);
    } else {
      params.delete("price");
    }
    replace(`${pathname}?${params.toString()}`);
  }

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/categories");

        if (!response.ok) {
          throw new Error(`Failed to fetch categories: ${response.status}`);
        }

        const data = await response.json();
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories:", err);
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
    <div className="flex flex-col lg:flex-row lg:items-end justify-between w-full gap-8 lg:gap-4 py-8 lg:py-0">
      {/* --- LEFT: FILTERS SECTION --- */}
      <div className="flex flex-col sm:flex-row items-start gap-6 w-full lg:w-auto">
        {/* Search Bar */}
        <div className="flex flex-col gap-2 w-full sm:w-[262px]">
          <label
            className={`${inter.className} text-sm font-semibold uppercase text-[#6C7275]`}
          >
            Search
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full h-12 px-4 pl-10 bg-transparent border-2 border-[#6C7275] rounded-lg font-semibold text-[#141718] focus:outline-none focus:ring-2 focus:ring-black/5"
              defaultValue={currentQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6C7275]" />
          </div>
        </div>

        {/* Categories Dropdown */}
        <div className="flex flex-col gap-2 w-full sm:w-[262px]">
          <label
            className={`${inter.className} text-sm font-semibold uppercase text-[#6C7275]`}
          >
            Categories
          </label>
          <div className="relative">
            <select
              className="w-full h-12 px-4 bg-transparent border-2 border-[#6C7275] rounded-lg appearance-none font-semibold text-[#141718] focus:outline-none focus:ring-2 focus:ring-black/5 cursor-pointer"
              disabled={isLoading}
              value={currentCategory}
              onChange={(e) => handleCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
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
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6C7275] pointer-events-none" />
          </div>
        </div>

        {/* Price Dropdown */}
        <div className="flex flex-col gap-2 w-full sm:w-[262px]">
          <label
            className={`${inter.className} text-sm font-semibold uppercase text-[#6C7275]`}
          >
            Price
          </label>
          <div className="relative">
            <select
              className="w-full h-12 px-4 bg-transparent border-2 border-[#6C7275] rounded-lg appearance-none font-semibold text-[#141718] focus:outline-none focus:ring-2 focus:ring-black/5 cursor-pointer"
              value={currentPrice}
              onChange={(e) => handlePriceFilter(e.target.value)}
            >
              <option value="all">All Price</option>
              <option value="0-100">$0.00 - $100.00</option>
              <option value="100-200">$100.00 - $200.00</option>
              <option value="200+">$200.00+</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6C7275] pointer-events-none" />
          </div>
        </div>
      </div>

      {/* --- RIGHT: VIEW CONTROLS --- */}
      <div className="flex items-center justify-between lg:justify-end w-full lg:w-auto gap-8 border-t border-b lg:border-none border-[#E8ECEF] py-4 lg:py-0">
        {/* Sort Selector */}
        <div className="relative flex items-center group">
          <select
            className={`${inter.className} appearance-none bg-transparent pr-8 py-1 font-semibold text-[#121212] cursor-pointer focus:outline-none z-10`}
            value={currentSort}
            onChange={(e) => handleSorting(e.target.value)}
          >
            <option value="">Sort by</option>
            <option value="-createdAt">Newest</option>
            <option value="createdAt">Oldest</option>
            <option value="price">Price: Low to High</option>
            <option value="-price">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
            <option value="-name">Name: Z to A</option>
          </select>
          <div className="absolute right-0 pointer-events-none group-hover:translate-y-0.5 transition-transform duration-200">
            <ChevronDown className="w-5 h-5 text-[#121212]" />
          </div>
        </div>
      </div>
    </div>
  );
}
