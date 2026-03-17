"use client";

import { CircleUser, Heart, Menu, Search, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { poppins, space_Grotesk } from "../utils/font";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import FlyoutCart from "./FlyoutCart";

const navLinks = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Shop",
    href: "/shop",
  },
  {
    name: "Products",
    href: "/product",
  },
  {
    name: "Contact Us",
    href: "/contact",
  },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const pathname = usePathname();

  return (
    <>
      <nav>
        {/* MOBILE NAVIGATION */}
        {/* mobile nav header */}
        <div className="md:hidden sticky top-0 z-40 flex justify-between items-center py-4 px-6 w-full h-15 bg-white border-b border-gray-100">
          {/* left - Menu & Logo */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsOpen(true)}
              className="p-1 -ml-1 hover:bg-gray-100 rounded-md transition-colors"
              aria-label="Open Menu"
            >
              <Menu className="w-6 h-6 text-black" />
            </button>

            <p
              className={`${poppins.className} font-semibold text-lg tracking-tight text-black`}
            >
              Elegant
            </p>
          </div>

          {/* right - Cart Icon with Badge */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center group"
          >
            <div className="relative p-1">
              <ShoppingBag className="h-6 w-6 text-black" />
              <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white">
                2
              </span>
            </div>
          </button>
        </div>

        {/* mobile pop-up block */}
        {isOpen && (
          <div className="fixed inset-0 z-50 bg-white md:hidden">
            {/* Main Container: uses inset-0 to fill the whole screen */}
            <div className="flex flex-col justify-between h-full p-6 bg-white overflow-y-auto">
              {/* --- TOP BLOCK --- */}
              <div className="flex flex-col w-full max-w-[295px] mx-auto gap-6">
                {/* Header: Logo & Close */}
                <div className="flex justify-between items-center w-full">
                  <h5
                    className={`${poppins.className} font-semibold text-xl text-black`}
                  >
                    Elegant
                  </h5>
                  <button
                    onClick={() => setIsOpen(false)}
                    aria-label="Close menu"
                  >
                    <X className="w-6 h-6 text-black" />
                  </button>
                </div>

                {/* Search Bar */}
                <div className="flex items-center px-4 gap-3 w-full h-12 bg-white border border-[#6C7275] rounded-lg focus-within:border-black transition-colors">
                  <Search className="w-5 h-5 text-[#6C7275]" />
                  <input
                    type="text"
                    placeholder="Search"
                    className="w-full outline-none text-sm placeholder:text-[#6C7275]"
                  />
                </div>

                {/* Nav Links */}
                <nav className="flex flex-col w-full">
                  {navLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        href={link.href}
                        key={link.name}
                        className={clsx(
                          "py-4 border-b border-[#E8ECEF] text-lg font-medium transition-colors",
                          isActive
                            ? "text-black border-black"
                            : "text-[#6C7275] hover:text-black",
                        )}
                        onClick={() => setIsOpen(false)}
                      >
                        {link.name}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* --- DOWN BLOCK --- */}
              <div className="flex flex-col w-full max-w-[295px] mx-auto gap-4 mt-auto pt-8">
                {/* Cart Item */}
                <Link
                  href="/cart"
                  className="flex justify-between items-center py-3 border-b border-[#E8ECEF] group transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <p className="font-medium text-lg text-[#6C7275] group-hover:text-black">
                    Cart
                  </p>
                  <div className="relative">
                    <ShoppingBag
                      className="w-6 h-6 text-[#6C7275] group-hover:text-black"
                      onClick={() => setIsCartOpen(true)}
                    />
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] text-white">
                      2
                    </span>
                  </div>
                </Link>

                {/* Wishlist Item */}
                <Link
                  href="/wishlist"
                  className="flex justify-between items-center py-3 border-b border-[#E8ECEF] group transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <p className="font-medium text-lg text-[#6C7275] group-hover:text-black">
                    Wishlist
                  </p>
                  <Heart className="w-6 h-6 text-[#6C7275] group-hover:text-black" />
                </Link>

                {/* Sign In Button */}
                <button className="w-full mt-4 py-4 bg-black text-white rounded-lg font-medium text-lg hover:bg-zinc-800 active:scale-[0.98] transition-all">
                  Sign In
                </button>
              </div>
            </div>
          </div>
        )}

        {/* LARGER SCREEN NAVIGATION */}

        <div className="hidden md:block w-full bg-white sticky top-0 z-50">
          {/* Container: Handles the 1440px max-width and the 160px (px-40) padding */}
          <div className="max-w-[1440px] mx-auto h-[60px] flex items-center justify-between px-10 lg:px-40">
            {/* 1. Logo Section */}
            <Link href="/" className="flex-none">
              <span
                className={`${poppins.className} text-[24px] font-medium leading-none text-black tracking-tight`}
              >
                3legant.
              </span>
            </Link>

            {/* 2. Link Group: Center Navigation */}
            <div className="flex items-center gap-10">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    href={link.href}
                    key={link.name}
                    className={clsx(
                      `${space_Grotesk.className} text-[14px] leading-6 transition-colors`,
                      isActive
                        ? "text-[#141718]"
                        : "text-[#6C7275] hover:text-[#141718]",
                    )}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            {/* 3. Icon Group: Search, Profile, Cart */}
            <div className="flex items-center gap-4">
              <button className="p-1 hover:opacity-70 transition-opacity">
                <Search
                  className="w-6 h-6 text-[#141718] cursor-pointer"
                  strokeWidth={1.5}
                />
              </button>

              <Link
                href="/profile"
                className="p-1 hover:opacity-70 transition-opacity"
              >
                <CircleUser
                  className="w-6 h-6 text-[#141718]"
                  strokeWidth={1.5}
                />
              </Link>

              <button
                onClick={() => setIsCartOpen(true)}
                className="flex items-center gap-1 p-1 group cursor-pointer"
              >
                <div className="relative">
                  <ShoppingBag
                    className="w-6 h-6 text-[#141718]"
                    strokeWidth={1.5}
                  />
                  {/* Cart Badge - Matching the #141718 background from Figma */}
                  <span className="absolute -top-1 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#141718] text-[12px] font-bold text-white">
                    2
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* RENDER THE CART COMPONENT */}
      <FlyoutCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
