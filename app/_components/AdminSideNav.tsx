"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  ShoppingBag,
  PlusCircle,
  FileText,
  Users,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { name: "Products", href: "/admin/add-product", icon: PlusCircle },
  { name: "Blogs", href: "/admin/add-blog", icon: FileText },
  { name: "Categories", href: "/admin/categories", icon: LayoutGrid },
  { name: "Users List", href: "/admin/users", icon: Users },
];

export default function AdminSideNav() {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col w-64 h-screen bg-white border-r border-gray-200 sticky top-0">
      <div className="p-6">
        <h1 className="text-xl font-bold text-black tracking-tight">
          Elegant Admin
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-black text-white"
                  : "text-gray-600 hover:bg-gray-100 hover:text-black"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <LogoutLink className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full">
          <LogOut className="w-5 h-5" />
          Logout
        </LogoutLink>
      </div>
    </aside>
  );
}
