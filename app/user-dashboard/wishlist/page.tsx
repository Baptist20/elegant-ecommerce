import React from "react";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import connectDB from "@/lib/db";
import { Wishlist } from "@/models/Wishlist";
import { User } from "@/models/User";
import Link from "next/link";
import RemoveButton from "@/app/_components/RemoveButton"; // We will create this next

export default async function WishlistPage() {
  const { getUser } = getKindeServerSession();
  const kindeUser = await getUser();

  if (!kindeUser || !kindeUser.id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-[#6C7275]">
          Please log in to view your wishlist.
        </p>
      </div>
    );
  }

  await connectDB();

  const dbUser = await User.findOne({ kindeUserId: kindeUser.id });

  if (!dbUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-[#6C7275]">User not found in database.</p>
      </div>
    );
  }

  const wishlist = await Wishlist.findOne({ userId: dbUser._id }).populate({
    path: "products",
    select: "_id name price images colors", // Added _id explicitly
  });

  const wishlistItems = wishlist?.products || [];

  return (
    <div className="min-h-screen bg-white px-4 py-8 md:px-8 lg:px-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-medium mb-8">Your Wishlist</h1>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 mb-4">
              Your wishlist is empty.
            </p>
            <Link
              href="/shop"
              className="inline-block px-6 py-3 bg-black text-white font-medium rounded-md hover:bg-gray-800"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item: any) => (
              <div
                key={item._id.toString()}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="aspect-square bg-gray-100 relative">
                  <img
                    src={item.images?.[0] || "/placeholder.jpg"}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-1">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {item.colors?.[0] ? `Color: ${item.colors[0]}` : "Default"}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">
                      ${item.price.toFixed(2)}
                    </span>

                    {/* CLIENT COMPONENT CALLED HERE */}
                    <RemoveButton productId={item._id.toString()} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
