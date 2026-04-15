"use client";

import { useState, useEffect } from "react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { poppins, inter } from "../utils/font";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

import ProductCard from "./ProductCard";

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  rating?: number;
}

export default function NewArrivals() {
  const { user, getPermission } = useKindeBrowserClient();
  const [isAdmin, setIsAdmin] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        const permission = await getPermission("is-admin");
        setIsAdmin(permission?.isGranted || false);
      }
    };

    checkAdminStatus();
  }, [user, getPermission]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/products?limit=4&sort=-createdAt");

        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.status}`);
        }

        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load products",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (isLoading) {
    return (
      <section className="bg-white pt-12 md:pt-[48px] overflow-hidden pb-10 md:pb-20">
        <div className="max-w-[1440px] ml-auto">
          <div className="pl-4 md:pl-10 lg:pl-40 flex flex-col gap-12">
            <div className="flex items-end justify-between pr-4 md:pr-10 lg:pr-40">
              <h2
                className={`${poppins.className} text-[34px] md:text-[40px] leading-[44px] font-medium tracking-[-0.4px] text-[#141718]`}
              >
                New <br className="md:hidden" /> Arrivals
              </h2>
            </div>
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-600">Loading new arrivals...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-white pt-12 md:pt-[48px] overflow-hidden pb-10 md:pb-20">
        <div className="max-w-[1440px] ml-auto">
          <div className="pl-4 md:pl-10 lg:pl-40 flex flex-col gap-12">
            <div className="flex items-end justify-between pr-4 md:pr-10 lg:pr-40">
              <h2
                className={`${poppins.className} text-[34px] md:text-[40px] leading-[44px] font-medium tracking-[-0.4px] text-[#141718]`}
              >
                New <br className="md:hidden" /> Arrivals
              </h2>
            </div>
            <div className="flex justify-center items-center h-64">
              <p className="text-red-600">Error: {error}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="bg-white pt-12 md:pt-[48px] overflow-hidden pb-10 md:pb-20">
        <div className="max-w-[1440px] ml-auto">
          <div className="pl-4 md:pl-10 lg:pl-40 flex flex-col gap-12">
            <div className="flex items-end justify-between pr-4 md:pr-10 lg:pr-40">
              <h2
                className={`${poppins.className} text-[34px] md:text-[40px] leading-[44px] font-medium tracking-[-0.4px] text-[#141718]`}
              >
                New <br className="md:hidden" /> Arrivals
              </h2>
            </div>
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-600">No products available</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white pt-12 md:pt-[48px] overflow-hidden pb-10 md:pb-20">
      <div className="max-w-[1440px] ml-auto">
        <div className="pl-4 md:pl-10 lg:pl-40 flex flex-col gap-12">
          {/* 1. HEADER ROW */}
          <div className="flex items-end justify-between pr-4 md:pr-10 lg:pr-40">
            <h2
              className={`${poppins.className} text-[34px] md:text-[40px] leading-[44px] font-medium tracking-[-0.4px] text-[#141718]`}
            >
              New <br className="md:hidden" /> Arrivals
            </h2>

            <Link
              href="/shop"
              className={`hidden md:flex items-center gap-1 pb-1 border-b border-[#141718] ${inter.className} font-medium text-base text-[#141718] group`}
            >
              More Products
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* 2. PRODUCT CAROUSEL TRACK */}
          <div className="w-full">
            <Carousel
              opts={{
                align: "start",
                dragFree: true,
                containScroll: "trimSnaps",
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-6">
                {products.map((product) => (
                  <CarouselItem
                    key={product._id}
                    // basis-auto allows the ProductCard's internal 262px width to dictate the size
                    className="pl-6 basis-auto"
                  >
                    <ProductCard
                      name={product.name}
                      image={product.images?.[0] || "/placeholder-product.png"}
                      price={product.price}
                      isAdmin={isAdmin}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>

          {/* 3. MOBILE LINK (Visible only on small screens) */}
          <Link
            href="/shop"
            className={`flex md:hidden items-center gap-1 w-fit pb-1 border-b border-[#141718] ${inter.className} font-medium text-sm text-[#141718]`}
          >
            More Products
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
