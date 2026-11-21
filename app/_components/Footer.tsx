import React from "react";
import Link from "next/link";
import { poppins, inter } from "../utils/font";

type SocialIconProps = {
  className?: string;
};

function Instagram({ className }: SocialIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function Facebook({ className }: SocialIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function Youtube({ className }: SocialIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  );
}

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
                href="/"
                className={`${poppins.className} text-xs font-semibold text-[#FEFEFE] hover:underline`}
              >
                Privacy Policy
              </Link>
              <Link
                href="/"
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
