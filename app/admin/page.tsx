import StatCards from "../_components/StatCards";
import RecentOrders from "../_components/RecentOrders";
import InventoryAlerts from "../_components/InventoryAlerts";
import BlogSummary from "../_components/BlogSummary";
import { poppins } from "../utils/font";
import { ArrowRight, Plus, FilePlus, BarChart3 } from "lucide-react";
import Link from "next/link";

// Mock data (Keep this until you hook up Mongoose)
const mockStats = { revenue: 125430, orders: 892, products: 156, users: 324 };
const mockOrders = [
  {
    _id: "ORD-001",
    customerName: "John Doe",
    createdAt: "2024-03-15",
    totalPrice: 249.99,
    status: "Delivered",
  },
  {
    _id: "ORD-002",
    customerName: "Jane Smith",
    createdAt: "2024-03-14",
    totalPrice: 89.99,
    status: "Processing",
  },
  {
    _id: "ORD-003",
    customerName: "Robert Johnson",
    createdAt: "2024-03-14",
    totalPrice: 599.99,
    status: "Pending",
  },
  {
    _id: "ORD-004",
    customerName: "Emily Davis",
    createdAt: "2024-03-13",
    totalPrice: 129.99,
    status: "Delivered",
  },
  {
    _id: "ORD-005",
    customerName: "Michael Wilson",
    createdAt: "2024-03-12",
    totalPrice: 299.99,
    status: "Cancelled",
  },
];
const mockProducts = [
  { _id: "PROD-001", name: "Premium Leather Sofa", stock: 3 },
  { _id: "PROD-002", name: "Modern Coffee Table", stock: 8 },
  { _id: "PROD-004", name: "Minimalist Bookshelf", stock: 2 },
];
const mockBlogPost = {
  title: "The Future of Sustainable Furniture Design",
  createdAt: new Date(),
};

export default function AdminDashboardPage() {
  return (
    // The space-y-10 adds vertical breathing room between sections
    <div className="space-y-10 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1
            className={`text-3xl font-bold text-gray-900 tracking-tight ${poppins.className}`}
          >
            Dashboard Overview
          </h1>
          <p className="text-gray-500 mt-1 text-sm md:text-base">
            Welcome back! Here's what's happening with <b>3legant</b> today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full">
            Store Live
          </span>
        </div>
      </div>

      {/* 1. Stats Grid (Custom Tailwind from my previous response) */}
      <StatCards data={mockStats} />

      {/* 2. Main Data Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Recent Orders (2/3 width) */}
        <div className="lg:col-span-2">
          <RecentOrders orders={mockOrders} />
        </div>

        {/* Right: Inventory & Content (1/3 width) */}
        <div className="flex flex-col gap-8">
          <InventoryAlerts products={mockProducts} />
          <BlogSummary latestBlog={mockBlogPost} totalCount={24} />
        </div>
      </div>

      {/* 3. Bottom Row: Quick Actions & Activity */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Quick Actions Card */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3
            className={`text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4 ${poppins.className}`}
          >
            Quick Actions
          </h3>
          <div className="space-y-2">
            <Link
              href="/admin/add-product"
              className="flex items-center justify-between w-full p-3 text-sm font-medium text-gray-600 border border-gray-50 rounded-xl hover:bg-black hover:text-white transition-all group"
            >
              <span className="flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add Product
              </span>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
            </Link>
            <Link
              href="/admin/add-blog"
              className="flex items-center justify-between w-full p-3 text-sm font-medium text-gray-600 border border-gray-50 rounded-xl hover:bg-black hover:text-white transition-all group"
            >
              <span className="flex items-center gap-2">
                <FilePlus className="w-4 h-4" /> Create Blog
              </span>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
            </Link>
          </div>
        </div>

        {/* Performance Card */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3
            className={`text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4 ${poppins.className}`}
          >
            <BarChart3 className="w-5 h-5 text-blue-500" /> Performance
          </h3>
          <div className="space-y-4 mt-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">Conversion Rate</span>
                <span className="font-bold text-emerald-600">+12.5%</span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[75%] rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Card */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3
            className={`text-lg font-semibold text-gray-900 mb-4 ${poppins.className}`}
          >
            Recent Activity
          </h3>
          <ul className="space-y-4">
            <li className="flex gap-3 items-start">
              <div className="w-2 h-2 mt-1.5 rounded-full bg-blue-500 shrink-0" />
              <p className="text-sm text-gray-600 line-clamp-1">
                New order #ORD-006 placed
              </p>
            </li>
            <li className="flex gap-3 items-start">
              <div className="w-2 h-2 mt-1.5 rounded-full bg-orange-400 shrink-0" />
              <p className="text-sm text-gray-600 line-clamp-1">
                Product {"Modern Chair"} updated
              </p>
            </li>
            <li className="flex gap-3 items-start">
              <div className="w-2 h-2 mt-1.5 rounded-full bg-emerald-500 shrink-0" />
              <p className="text-sm text-gray-600 line-clamp-1">
                Blog post published
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
