"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { poppins } from "../utils/font"; // Assuming poppins is the correct font

const menuItems = [
  { name: "Add Product/Blog", href: "/admin" },
  { name: "All Products", href: "/admin/products" },
  { name: "All Blogs", href: "/admin/blogs" },
];

export default function AdminSideNav() {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col items-center py-10 px-4 gap-10 w-full md:w-[262px] h-[498px] bg-[#F3F5F7] rounded-lg flex-none order-0 grow-0">
      {/* Admin Title */}
      <h2 className="text-2xl font-semibold text-black">Admin Panel</h2>

      {/* Menu List */}
      <nav className="flex flex-col items-start p-0 gap-3 w-full md:w-[230px] flex-none order-1 grow-0">
        {menuItems.map((item, index) => {
          const isActive = pathname === item.href;
          return (
            <div
              key={item.name}
              className={clsx(
                "flex flex-col items-start py-2 px-0 gap-[10px] w-full md:w-[230px] h-[42px] border-b box-border flex-none grow-0",
                isActive ? "border-[#141718]" : "border-transparent",
                `order-${index}`,
              )}
            >
              <Link
                href={item.href}
                className={clsx(
                  `w-full md:w-[230px] h-[26px] ${poppins.className} font-semibold text-base leading-[26px] flex-none order-0 self-stretch grow-0 transition-colors`,
                  isActive
                    ? "text-[#141718]"
                    : "text-[#6C7275] hover:text-[#141718]",
                )}
              >
                {item.name}
              </Link>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
