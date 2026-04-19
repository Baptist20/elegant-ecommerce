import ProductDetailClient from "@/app/_components/ProductDetailClient";
import connectDB from "@/lib/db";
import { Product } from "@/models/Product";
import { notFound } from "next/navigation";

type ProductDocument = {
  _id: { toString(): string };
  name: string;
  slug: string;
  description?: string;
  price: number;
  stock: number;
  images?: string[];
  colors?: string[];
  category?: {
    name?: string;
    slug?: string;
  };
};

async function getProductDetail(id: string) {
  await connectDB();

  let product = null;
  if (/^[0-9a-fA-F]{24}$/.test(id)) {
    product = await Product.findById(id)
      .populate("category", "name slug")
      .lean<ProductDocument | null>();
  }

  if (!product) {
    product = await Product.findOne({ slug: id })
      .populate("category", "name slug")
      .lean<ProductDocument | null>();
  }

  if (!product) {
    notFound();
  }

  const categoryName = product.category?.name || "Uncategorized";
  const categorySlug = product.category?.slug || "shop";
  const normalizedDescription =
    product.description?.trim() || "No description available.";

  return {
    id: product._id.toString(),
    name: product.name,
    slug: product.slug,
    description: normalizedDescription,
    price: product.price,
    images: product.images || [],
    colors: product.colors || [],
    categoryName,
    categorySlug,
    stock: product.stock,
    sku: product._id.toString().slice(-6).toUpperCase(),
    measurements:
      product.stock > 0 ? `${product.stock} units available` : "Out of stock",
    details: normalizedDescription,
    packaging: categoryName,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductDetail(id);

  return {
    title: `${product.name} | Elegant Shop`,
    description: product.description,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductDetail(id);

  return <ProductDetailClient product={product} />;
}
