import React from "react";
import Link from "next/link";
import { Instagram, Facebook, Youtube } from "lucide-react";
import { poppins, inter } from "../utils/font";

export default function Footer() {
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
      href: "/products",
    },
    {
      name: "Blog",
      href: "/blog",
    },
    {
      name: "Contact Us",
      href: "/contact-us",
    },
  ];
  return (
    <footer className="bg-[#141718] text-white pt-20 pb-8 px-4 md:px-10 lg:px-40">
      <div className="max-w-[1120px] mx-auto flex flex-col gap-[49px]">
        {/* --- TOP SECTION: Logo, Slogan & Nav --- */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-10 lg:gap-0">
          {/* Logo and Slogan Group */}
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-center md:text-left">
            <h2
              className={`${poppins.className} text-2xl font-medium tracking-tight`}
            >
              3legant<span className="text-[#6C7275]">.</span>
            </h2>

            {/* Vertical Divider (Hidden on mobile) */}
            <div className="hidden md:block w-[1px] h-6 bg-[#6C7275]" />

            <p
              className={`${inter.className} text-sm text-[#E8ECEF] max-w-[350px]`}
            >
              Gift & Decoration Store
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-wrap justify-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`${inter.className} text-sm text-[#FEFEFE] hover:text-[#6C7275] transition-colors`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* --- BOTTOM SECTION: Copyright & Socials --- */}
        <div className="pt-4 border-t border-[#6C7275]/50 flex flex-col-reverse md:flex-row justify-between items-center gap-8 md:gap-0">
          {/* Copyright & Legal */}
          <div className="flex flex-col md:flex-row items-center gap-7">
            <p className={`${poppins.className} text-xs text-[#E8ECEF]`}>
              Copyright © 2026 3legant. All rights reserved
            </p>
            <div className="flex gap-7">
              <Link
                href="/privacy"
                className={`${poppins.className} text-xs font-semibold text-[#FEFEFE] hover:underline`}
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className={`${poppins.className} text-xs font-semibold text-[#FEFEFE] hover:underline`}
              >
                Terms of Use
              </Link>
            </div>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-6">
            <Link
              href="https://instagram.com"
              target="_blank"
              className="text-[#FEFEFE] hover:text-[#E8ECEF] transition-colors"
            >
              <Instagram className="w-6 h-6" />
            </Link>
            <Link
              href="https://facebook.com"
              target="_blank"
              className="text-[#FEFEFE] hover:text-[#E8ECEF] transition-colors"
            >
              <Facebook className="w-6 h-6" />
            </Link>
            <Link
              href="https://youtube.com"
              target="_blank"
              className="text-[#FEFEFE] hover:text-[#E8ECEF] transition-colors"
            >
              <Youtube className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
