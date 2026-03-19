import React from "react";
import BlogCard from "./BlogCard";
import BlogToolbar from "./BlogToolbar";

export default function BlogsGroupSection() {
  // Mock data for the grid
  const blogPosts = [
    {
      id: 1,
      title: "7 ways to decor your home like a professional",
      date: "October 16, 2023",
      image: "/pexels-taryn-elliott-4112601.jpg",
    },
    {
      id: 2,
      title: "The best plants for your living room",
      date: "October 20, 2023",
      image: "/blog-2.jpg",
    },
    {
      id: 3,
      title: "Kitchen organization hacks you need to try",
      date: "November 05, 2023",
      image: "/blog-3.jpg",
    },
    {
      id: 4,
      title: "Minimalist bedroom ideas for a better sleep",
      date: "November 12, 2023",
      image: "/blog-4.jpg",
    },
    // ... add more as needed
  ];

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
            {blogPosts.map((post) => (
              <BlogCard
                key={post.id}
                title={post.title}
                date={post.date}
                image={post.image}
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
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((page) => {
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
            })}

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
