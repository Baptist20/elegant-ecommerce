import React from "react";
import WishlistCard from "../../_components/WishlistCard";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import { Product } from "@/models/Product"; // Ensure Product model is registered
import { ProductType } from "@/app/utils/types";

export default async function WishlistPage() {
  const { getUser } = getKindeServerSession();
  const kindeUser = await getUser();

  if (!kindeUser || !kindeUser.id) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-xl text-[#6C7275]">
          Please log in to view your wishlist.
        </p>
      </div>
    );
  }

  await connectDB();

  // Explicitly import Product model to ensure it's registered with Mongoose
  // This resolves the MissingSchemaError
  const user = await User.findOne({ kindeUserId: kindeUser.id }).populate(
    "wishlist",
  );

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-xl text-[#6C7275]">User not found in database.</p>
      </div>
    );
  }

  const wishlistItems: ProductType[] = user.wishlist;

  return (
    <div className="flex flex-col items-start w-full max-w-[851px] p-0 md:px-[72px] gap-10">
      <h2 className="text-2xl font-semibold text-black">Your Wishlist</h2>

      <div className="w-full overflow-x-auto">
        <div className="flex flex-col items-start w-full min-w-max">
          {/* Table Header */}
          <div className="flex justify-between items-center w-full px-0 pb-2 pl-8 gap-14 border-b border-[#E8ECEF] text-sm font-normal leading-tight text-[#6C7275]">
            <p className="flex-none w-[160px]">Product</p>
            <p className="flex-none w-[120px]">Price</p>
            <p className="flex-none w-[137px]">Action</p>
          </div>

          {wishlistItems.length === 0 ? (
            <div className="flex items-center justify-center w-full py-10">
              <p className="text-xl text-[#6C7275]">Your wishlist is empty.</p>
            </div>
          ) : (
            wishlistItems.map((item) => (
              <WishlistCard
                key={item._id.toString()}
                imageSrc={item.images[0]}
                altText={item.name}
                productName={item.name}
                productColor={`Color: ${item.colors[0]}`}
                price={`$${item.price.toFixed(2)}`}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
