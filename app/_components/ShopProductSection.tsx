"use client";

import { useState, useEffect } from "react";
import ShopToolbar from "./ShopToolbar";
import ProductCard from "./ProductCard";

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  rating?: number;
}

export default function ShopProductSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/products");

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
      <section className="flex flex-row items-start px-10 lg:px-[160px] pt-[60px] gap-6 w-full max-w-[1440px] h-auto flex-none pb-30">
        <div className="flex flex-col items-start p-0 gap-10 w-full max-w-[1120px] h-auto flex-none">
          <ShopToolbar />
          <div className="flex justify-center items-center h-64 w-full">
            <p className="text-gray-600">Loading products...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="flex flex-row items-start px-10 lg:px-[160px] pt-[60px] gap-6 w-full max-w-[1440px] h-auto flex-none pb-30">
        <div className="flex flex-col items-start p-0 gap-10 w-full max-w-[1120px] h-auto flex-none">
          <ShopToolbar />
          <div className="flex justify-center items-center h-64 w-full">
            <p className="text-red-600">Error: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="flex flex-row items-start px-10 lg:px-[160px] pt-[60px] gap-6 w-full max-w-[1440px] h-auto flex-none pb-30">
        <div className="flex flex-col items-start p-0 gap-10 w-full max-w-[1120px] h-auto flex-none">
          <ShopToolbar />
          <div className="flex justify-center items-center h-64 w-full">
            <p className="text-gray-600">No products available</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-row items-start px-10 lg:px-[160px] pt-[60px] gap-6 w-full max-w-[1440px] h-auto flex-none pb-30">
      <div className="flex flex-col items-start p-0 gap-10 w-full max-w-[1120px] h-auto flex-none">
        <ShopToolbar />
        <div className="flex flex-col justify-center flex-wrap items-center md:items-start gap-20 w-full max-w-[1120px] h-auto flex-none">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                name={product.name}
                image={product.images?.[0] || "/placeholder-product.png"}
                price={product.price}
                rating={product.rating || 4}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
