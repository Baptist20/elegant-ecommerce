import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import connectDB from "@/lib/db";
import { Order } from "@/models/Order";
import { User } from "@/models/User";
import { Cart } from "@/models/Cart";

// GET: Get user's orders (or all orders for admin)
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { getUser, getPermission } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await User.findOne({ kindeUserId: user.id });
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const permission = await getPermission("is-admin");
    const isAdmin = permission?.isGranted || false;

    if (isAdmin) {
      const orders = await Order.find()
        .populate("userId", "name email")
        .populate("items.productId", "name price images")
        .sort({ createdAt: -1 });
      return NextResponse.json(orders);
    } else {
      const orders = await Order.find({ userId: dbUser._id })
        .populate("items.productId", "name price images")
        .sort({ createdAt: -1 });
      return NextResponse.json(orders);
    }
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 },
    );
  }
}

// POST: Create a new order from cart
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await User.findOne({ kindeUserId: user.id });
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user is admin (admins cannot place orders)
    if (dbUser.role === "admin") {
      return NextResponse.json(
        { error: "Admins cannot place orders" },
        { status: 403 },
      );
    }

    const { items, totalAmount, shippingAddress } = await request.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Cart items are required" },
        { status: 400 },
      );
    }

    if (!totalAmount || totalAmount <= 0) {
      return NextResponse.json(
        { error: "Valid total amount is required" },
        { status: 400 },
      );
    }

    if (
      !shippingAddress ||
      !shippingAddress.country ||
      !shippingAddress.state ||
      !shippingAddress.city ||
      !shippingAddress.street ||
      !shippingAddress.zipCode
    ) {
      return NextResponse.json(
        { error: "Complete shipping address is required" },
        { status: 400 },
      );
    }

    // Transform cart items to order items
    const orderItems = items.map((item: any) => ({
      productId: item.productId._id,
      name: item.productId.name,
      price: item.productId.price,
      quantity: item.quantity,
    }));

    // Create order
    const order = await Order.create({
      userId: dbUser._id,
      items: orderItems,
      totalAmount,
      shippingAddress,
      status: "pending",
    });

    // Clear user's cart after successful order
    await Cart.findOneAndUpdate(
      { userId: dbUser._id },
      { items: [] },
      { new: true },
    );

    // Populate product details for response
    await order.populate("items.productId", "name price images");

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 },
    );
  }
}
