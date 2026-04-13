import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import connectDB from "@/lib/db";
import { Wishlist } from "@/models/Wishlist";
import { User } from "@/models/User";

// GET: Get user's wishlist
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await User.findOne({ kindeUserId: user.id });

    // Find or create wishlist
    let wishlist = await Wishlist.findOne({ userId: dbUser?._id }).populate({
      path: "products",
      select: "name price images rating",
    });

    if (!wishlist) {
      wishlist = await Wishlist.create({ userId: dbUser?._id, products: [] });
    }

    return NextResponse.json(wishlist);
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return NextResponse.json(
      { error: "Failed to fetch wishlist" },
      { status: 500 },
    );
  }
}

// POST: Add product to wishlist
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 },
      );
    }

    const dbUser = await User.findOne({ kindeUserId: user.id });

    // Find or create wishlist
    let wishlist = await Wishlist.findOne({ userId: dbUser?._id });

    if (!wishlist) {
      wishlist = await Wishlist.create({ userId: dbUser?._id, products: [] });
    }

    // Check if product already exists in wishlist
    const productExists = wishlist.products.some(
      (product: any) => product.toString() === productId,
    );

    if (productExists) {
      return NextResponse.json(
        { error: "Product already in wishlist" },
        { status: 400 },
      );
    }

    // Add product to wishlist
    wishlist.products.push(productId);
    await wishlist.save();

    // Populate product details
    await wishlist.populate({
      path: "products",
      select: "name price images rating",
    });

    return NextResponse.json(wishlist);
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    return NextResponse.json(
      { error: "Failed to add product to wishlist" },
      { status: 500 },
    );
  }
}

// DELETE: Remove product from wishlist
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 },
      );
    }

    const dbUser = await User.findOne({ kindeUserId: user.id });
    const wishlist = await Wishlist.findOne({ userId: dbUser?._id });

    if (!wishlist) {
      return NextResponse.json(
        { error: "Wishlist not found" },
        { status: 404 },
      );
    }

    // Remove product from wishlist
    wishlist.products = wishlist.products.filter(
      (product: any) => product.toString() !== productId,
    );

    await wishlist.save();

    // Populate product details
    await wishlist.populate({
      path: "products",
      select: "name price images rating",
    });

    return NextResponse.json(wishlist);
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    return NextResponse.json(
      { error: "Failed to remove product from wishlist" },
      { status: 500 },
    );
  }
}
