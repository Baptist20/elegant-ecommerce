"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight, Heart, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { inter, poppins } from "../utils/font";

type ProductDetailClientProps = {
  product: {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    images: string[];
    colors: string[];
    categoryName: string;
    categorySlug: string;
    stock: number;
    sku: string;
    measurements: string;
    details: string;
    packaging: string;
  };
};

type WishlistResponse = {
  products?: Array<{ _id: string }>;
};

export default function ProductDetailClient({
  product,
}: ProductDetailClientProps) {
  const galleryImages = useMemo(() => {
    if (product.images.length === 0) return [];
    return product.images.slice(0, 6);
  }, [product.images]);

  const [selectedImage, setSelectedImage] = useState(galleryImages[0] ?? "");
  const [selectedColor, setSelectedColor] = useState(
    product.colors[0] ?? "Default",
  );
  const [quantity, setQuantity] = useState(1);
  const [descriptionOpen, setDescriptionOpen] = useState(true);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [isCartLoading, setIsCartLoading] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const checkWishlistStatus = async () => {
      try {
        const response = await fetch("/api/wishlist", { cache: "no-store" });
        if (!response.ok) return;

        const data: WishlistResponse = await response.json();
        const exists =
          data.products?.some(
            (wishlistProduct) => wishlistProduct._id === product.id,
          ) ?? false;
        setIsWishlisted(exists);
      } catch {
        // no-op
      }
    };

    checkWishlistStatus();
  }, [product.id]);

  const decrement = () => setQuantity((prev) => Math.max(1, prev - 1));
  const increment = () =>
    setQuantity((prev) => Math.min(Math.max(product.stock, 1), prev + 1));

  const handleWishlist = async () => {
    try {
      setIsWishlistLoading(true);

      const response = await fetch(
        isWishlisted
          ? `/api/wishlist?productId=${encodeURIComponent(product.id)}`
          : "/api/wishlist",
        {
          method: isWishlisted ? "DELETE" : "POST",
          headers: isWishlisted
            ? undefined
            : { "Content-Type": "application/json" },
          body: isWishlisted
            ? undefined
            : JSON.stringify({ productId: product.id }),
        },
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        toast.error(data.error || "Unable to update wishlist");
        return;
      }

      setIsWishlisted((prev) => !prev);
      toast.success(
        isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      );
    } catch {
      toast.error("Something went wrong while updating wishlist");
    } finally {
      setIsWishlistLoading(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      setIsCartLoading(true);

      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId: product.id, quantity }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        toast.error(data.error || "Unable to add item to cart");
        return;
      }

      toast.success("Product added to cart");
    } catch {
      toast.error("Something went wrong while adding to cart");
    } finally {
      setIsCartLoading(false);
    }
  };

  return (
    <section className="bg-white px-4 py-4 md:px-8 md:py-6 lg:px-10 xl:px-0">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 pb-10 lg:gap-6">
        <nav className="flex flex-wrap items-center gap-2 text-sm text-[#605F5F] md:gap-4 md:px-2 lg:px-0">
          <Link
            href="/"
            className="flex items-center gap-1 font-medium hover:text-[#141718]"
          >
            Home
            <ChevronRight className="h-3 w-3" />
          </Link>
          <Link
            href="/shop"
            className="flex items-center gap-1 font-medium hover:text-[#141718]"
          >
            Shop
            <ChevronRight className="h-3 w-3" />
          </Link>
          <Link
            href={`/shop?category=${product.categorySlug}`}
            className="flex items-center gap-1 font-medium hover:text-[#141718]"
          >
            {product.categoryName}
            <ChevronRight className="h-3 w-3" />
          </Link>
          <span className="font-medium text-[#121212]">{product.name}</span>
        </nav>

        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-12">
          <div className="grid w-full grid-cols-2 gap-4 md:gap-5 lg:w-[54%]">
            {galleryImages.map((image, index) => {
              return (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setSelectedImage(image)}
                  className={`relative overflow-hidden bg-[#F3F5F7] text-left transition ${
                    selectedImage === image
                      ? "ring-2 ring-[#141718]"
                      : "ring-1 ring-transparent"
                  } aspect-[4/5] w-full rounded-sm`}
                >
                  {index === 0 && (
                    <div className="absolute left-3 top-3 z-10 flex flex-col gap-2">
                      <span className="rounded bg-white px-3 py-1.5 text-sm font-bold text-[#121212]">
                        New
                      </span>
                    </div>
                  )}
                  <img
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              );
            })}
          </div>

          <div className="w-full lg:max-w-[32rem] xl:max-w-[36rem]">
            <div className="border-b border-[#E8ECEF] pb-4">
              <h1
                className={`${poppins.className} text-3xl font-medium leading-tight tracking-tight text-[#141718] md:text-4xl`}
              >
                {product.name}
              </h1>

              <p
                className={`${inter.className} mt-4 text-base leading-7 text-[#6C7275]`}
              >
                {product.description}
              </p>

              <div className="mt-4 flex items-center gap-3">
                <span
                  className={`${poppins.className} text-3xl font-medium tracking-tight text-[#121212]`}
                >
                  ${product.price.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="border-b border-[#E8ECEF] py-4">
              <div className="space-y-2">
                <p
                  className={`${inter.className} text-base font-semibold text-[#6C7275]`}
                >
                  Measurements
                </p>
                <p
                  className={`${inter.className} text-xl leading-8 text-black`}
                >
                  {product.measurements}
                </p>
              </div>

              {product.colors.length > 0 && (
                <div className="mt-6 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1 text-[#6C7275]">
                      <p
                        className={`${inter.className} text-base font-semibold`}
                      >
                        Choose Color
                      </p>
                      <ChevronDown className="h-5 w-5" />
                    </div>
                    <p
                      className={`${inter.className} text-xl leading-8 text-black`}
                    >
                      {selectedColor}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {product.colors.map((color, index) => {
                      const swatchImage =
                        galleryImages[
                          index % Math.max(galleryImages.length, 1)
                        ] || selectedImage;
                      const isSelected = selectedColor === color;
                      return (
                        <button
                          key={color}
                          type="button"
                          onClick={() => {
                            setSelectedColor(color);
                            if (swatchImage) setSelectedImage(swatchImage);
                          }}
                          className={`h-14 w-14 overflow-hidden border ${
                            isSelected
                              ? "border-[#141718]"
                              : "border-transparent"
                          }`}
                          aria-label={`Select ${color}`}
                        >
                          {swatchImage ? (
                            <img
                              src={swatchImage}
                              alt={color}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="flex h-full w-full items-center justify-center bg-[#F3F5F7] text-xs text-[#141718]">
                              {color.slice(0, 1)}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="py-6">
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="flex h-13 w-full items-center justify-between rounded-lg bg-[#F5F5F5] px-4 sm:max-w-[8rem]">
                  <button
                    type="button"
                    onClick={decrement}
                    className="text-[#121212]"
                  >
                    <Minus className="h-5 w-5" />
                  </button>
                  <span
                    className={`${inter.className} text-base font-semibold text-[#121212]`}
                  >
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={increment}
                    className="text-[#121212]"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleWishlist}
                  disabled={isWishlistLoading}
                  className="flex h-13 w-full items-center justify-center gap-2 rounded-lg border border-[#141718] px-8 text-lg font-medium tracking-tight text-[#141718]"
                >
                  <Heart
                    className={`h-5 w-5 ${isWishlisted ? "fill-[#141718]" : ""}`}
                  />
                  {isWishlistLoading
                    ? "Updating..."
                    : isWishlisted
                      ? "Wishlisted"
                      : "Wishlist"}
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isCartLoading || product.stock <= 0}
                className="mt-4 flex h-13 w-full items-center justify-center rounded-lg bg-[#141718] px-8 text-lg font-medium tracking-tight text-white"
              >
                {isCartLoading
                  ? "Adding..."
                  : product.stock <= 0
                    ? "Out of stock"
                    : "Add to cart"}
              </button>
            </div>

            <div className="border-t border-[#E8ECEF] py-4">
              <div className="flex flex-col gap-2 text-xs uppercase tracking-wide text-[#6C7275]">
                <div className="flex gap-8">
                  <span>SKU</span>
                  <span className="text-[#141718] normal-case tracking-normal">
                    {product.sku}
                  </span>
                </div>
                <div className="flex gap-8">
                  <span>Category</span>
                  <span className="text-[#141718] normal-case tracking-normal">
                    {product.categoryName}
                  </span>
                </div>
                <div className="flex gap-8">
                  <span>Stock</span>
                  <span className="text-[#141718] normal-case tracking-normal">
                    {product.stock}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3 py-2">
              <div className="border-b border-[#6C7275] pb-2">
                <button
                  type="button"
                  onClick={() => setDescriptionOpen((prev) => !prev)}
                  className="flex w-full items-center justify-between text-left"
                >
                  <span
                    className={`${inter.className} text-lg font-medium tracking-tight text-[#141718]`}
                  >
                    Description
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 text-[#141718] transition-transform ${
                      descriptionOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {descriptionOpen && (
                  <div className="space-y-4 pt-4">
                    <div>
                      <h3
                        className={`${inter.className} text-sm font-semibold text-[#6C7275]`}
                      >
                        Details
                      </h3>
                      <p
                        className={`${inter.className} mt-2 text-sm leading-5 text-[#141718]`}
                      >
                        {product.details}
                      </p>
                    </div>
                    <div>
                      <h3
                        className={`${inter.className} text-sm font-semibold text-[#6C7275]`}
                      >
                        Packaging
                      </h3>
                      <p
                        className={`${inter.className} mt-2 text-sm leading-5 text-[#141718]`}
                      >
                        {product.packaging}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
