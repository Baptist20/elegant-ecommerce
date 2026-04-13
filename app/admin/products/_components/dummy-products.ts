import { AdminProduct } from "./types";

export const dummyProducts: AdminProduct[] = [
  {
    id: "PROD-001",
    name: "Nordic Loveseat Sofa",
    slug: "nordic-loveseat-sofa",
    category: "Living Room",
    price: 540,
    stock: 7,
    color: "Ash Gray",
    description:
      "Compact two-seater sofa with premium fabric and solid wood legs.",
    imageUrl: "/loveseat-sofa.png",
  },
  {
    id: "PROD-002",
    name: "Beige Table Lamp",
    slug: "beige-table-lamp",
    category: "Lighting",
    price: 89,
    stock: 12,
    color: "Beige",
    description: "Modern ceramic bedside lamp with warm ambient glow.",
    imageUrl: "/beige-table-lamp.png",
  },
  {
    id: "PROD-003",
    name: "Bamboo Basket",
    slug: "bamboo-basket",
    category: "Decor",
    price: 35,
    stock: 18,
    color: "Natural",
    description: "Handwoven basket perfect for throws and accessories.",
    imageUrl: "/bamboo-basket.png",
  },
  {
    id: "PROD-004",
    name: "Minimal Coffee Table",
    slug: "minimal-coffee-table",
    category: "Living Room",
    price: 230,
    stock: 15,
    color: "Walnut Brown",
    description: "Low profile table with smooth edges and matte finish.",
    imageUrl: "/table-lamp.png",
  },
];
