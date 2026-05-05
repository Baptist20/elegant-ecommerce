"use client";

import { Camera } from "lucide-react";
import {
  useKindeBrowserClient,
  LogoutLink,
} from "@kinde-oss/kinde-auth-nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import Image from "next/image";
import { inter } from "../utils/font";

const menuItems = [
  { name: "Account", href: "/user-dashboard" },
  { name: "Orders", href: "/user-dashboard/orders" },
  { name: "Wishlist", href: "/user-dashboard/wishlist" },
];

export default function UserSideNav() {
  const { user, isLoading } = useKindeBrowserClient();
  const pathname = usePathname();

  return (
    <aside className="flex flex-col items-center py-10 px-4 gap-10 w-[262px] h-[498px] bg-[#F3F5F7] rounded-lg flex-none order-0 grow-0">
      {/* Profile Section (Frame 743) */}
      <div className="flex flex-col items-center p-0 gap-[6px] w-[131px] h-[120px] flex-none order-0 grow-0">
        {/* Avatar/Edit (Elements/Menu/Avatar Edit) */}
        <div className="relative w-[82px] h-[82px] flex-none order-0 grow-0">
          {/* <div className="absolute w-20 h-20 left-0 top-0 bg-[#121212] rounded-[93px]">
            {user?.picture ? (
              <Image
                // src={user.picture}
                src="/"
                alt="Profile"
                width={80}
                height={80}
                className="rounded-[82px] object-cover"
              />
            ) : (
              <div className="w-full h-full bg-[#121212] rounded-[82px]" />
            )}
          </div> */}

          {/* Camera Icon Box */}
          {/* <div className="absolute flex flex-row items-start p-[7px] gap-[10px] w-[30px] h-[30px] left-[50px] top-[52px] bg-[#141718] border-[1.5px] border-white rounded-[125px] box-border cursor-pointer hover:scale-110 transition-transform">
            <Camera className="w-4 h-4 text-[#FEFEFE]" />
          </div> */}
        </div>

        {/* User Name (Sofia Havertz) */}
        {isLoading ? (
          <div className="w-[131px] h-8 bg-gray-200 animate-pulse rounded flex-none order-1 grow-0" />
        ) : (
          <p
            className={`w-[131px] h-8 ${inter.className} font-semibold text-xl leading-8 text-black flex-none order-1 grow-0 text-center truncate`}
          >
            {user?.given_name} {user?.family_name}
          </p>
        )}
      </div>

      {/* Menu List (Frame 742) */}
      <nav className="flex flex-col items-start p-0 gap-3 w-[230px] h-[258px] flex-none order-1 grow-0">
        {menuItems.map((item, index) => {
          const isActive = pathname === item.href;
          return (
            <div
              key={item.name}
              className={clsx(
                "flex flex-col items-start py-2 px-0 gap-[10px] w-[230px] h-[42px] border-b box-border flex-none grow-0",
                isActive ? "border-[#141718]" : "border-transparent",
                `order-${index}`,
              )}
            >
              <Link
                href={item.href}
                className={clsx(
                  `w-[230px] h-[26px] ${inter.className} font-semibold text-base leading-[26px] flex-none order-0 self-stretch grow-0 transition-colors`,
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

        {/* Log Out Item */}
        <div className="flex flex-col items-start py-2 px-0 gap-[10px] w-[230px] h-[42px] flex-none order-[4] grow-0">
          <LogoutLink
            className={`w-[230px] h-[26px] ${inter.className} font-semibold text-base leading-[26px] text-[#6C7275] hover:text-[#141718] flex-none order-0 self-stretch grow-0 transition-colors`}
          >
            Log Out
          </LogoutLink>
        </div>
      </nav>
    </aside>
  );
}
