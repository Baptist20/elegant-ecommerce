import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import connectDB from "@/lib/db";
import { Cart } from "@/models/Cart";
import { User } from "@/models/User";

// GET: Get user's cart
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const dbUser = await User.findOne({ kindeUserId: user.id });
    if (dbUser?.role === "admin") {
      return NextResponse.json(
        { error: "Admins cannot have shopping carts" },
        { status: 403 },
      );
    }

    // Find or create cart
    let cart = await Cart.findOne({ userId: dbUser?._id }).populate({
      path: "items.productId",
      select: "name price images",
    });

    if (!cart) {
      cart = await Cart.create({ userId: dbUser?._id, items: [] });
    }

    return NextResponse.json(cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 },
    );
  }
}

// POST: Add item to cart
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const dbUser = await User.findOne({ kindeUserId: user.id });
    if (dbUser?.role === "admin") {
      return NextResponse.json(
        { error: "Admins cannot add items to cart" },
        { status: 403 },
      );
    }

    const { productId, quantity = 1 } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 },
      );
    }

    // Find or create cart
    let cart = await Cart.findOne({ userId: dbUser?._id });

    if (!cart) {
      cart = await Cart.create({ userId: dbUser?._id, items: [] });
    }

    // Check if product already exists in cart
    const existingItemIndex = cart.items.findIndex(
      (item: any) => item.productId.toString() === productId,
    );

    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({ productId, quantity });
    }

    await cart.save();

    // Populate product details
    await cart.populate({
      path: "items.productId",
      select: "name price images",
    });

    return NextResponse.json(cart);
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json(
      { error: "Failed to add item to cart" },
      { status: 500 },
    );
  }
}

// PUT: Update cart item quantity
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const dbUser = await User.findOne({ kindeUserId: user.id });
    if (dbUser?.role === "admin") {
      return NextResponse.json(
        { error: "Admins cannot update cart" },
        { status: 403 },
      );
    }

    const { productId, quantity } = await request.json();

    if (!productId || quantity === undefined) {
      return NextResponse.json(
        { error: "Product ID and quantity are required" },
        { status: 400 },
      );
    }

    const cart = await Cart.findOne({ userId: dbUser?._id });

    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    const itemIndex = cart.items.findIndex(
      (item: any) => item.productId.toString() === productId,
    );

    if (itemIndex === -1) {
      return NextResponse.json(
        { error: "Item not found in cart" },
        { status: 404 },
      );
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      cart.items.splice(itemIndex, 1);
    } else {
      // Update quantity
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();

    // Populate product details
    await cart.populate({
      path: "items.productId",
      select: "name price images",
    });

    return NextResponse.json(cart);
  } catch (error) {
    console.error("Error updating cart:", error);
    return NextResponse.json(
      { error: "Failed to update cart" },
      { status: 500 },
    );
  }
}

// DELETE: Remove item from cart
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const dbUser = await User.findOne({ kindeUserId: user.id });
    if (dbUser?.role === "admin") {
      return NextResponse.json(
        { error: "Admins cannot modify cart" },
        { status: 403 },
      );
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 },
      );
    }

    const cart = await Cart.findOne({ userId: dbUser?._id });

    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    // Remove item
    cart.items = cart.items.filter(
      (item: any) => item.productId.toString() !== productId,
    );

    await cart.save();

    // Populate product details
    await cart.populate({
      path: "items.productId",
      select: "name price images",
    });

    return NextResponse.json(cart);
  } catch (error) {
    console.error("Error removing from cart:", error);
    return NextResponse.json(
      { error: "Failed to remove item from cart" },
      { status: 500 },
    );
  }
}
