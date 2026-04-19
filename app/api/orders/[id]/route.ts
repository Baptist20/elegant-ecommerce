import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import connectDB from "@/lib/db";
import { Order } from "@/models/Order";
import { User } from "@/models/User";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET: Get single order by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
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

    const { id } = await params;
    const order = await Order.findById(id)
      .populate("userId", "name email")
      .populate("items.productId", "name price images");

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const permission = await getPermission("is-admin");
    const isAdmin = permission?.isGranted || false;

    // Check if user owns the order or is admin
    if (!isAdmin && order.userId._id.toString() !== dbUser._id.toString()) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 },
    );
  }
}

// PUT: Update order status (admin only)
export async function PUT(request: NextRequest, { params }: RouteParams) {
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

    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const { status } = await request.json();

    if (
      !status ||
      !["pending", "processing", "shipped", "delivered", "cancelled"].includes(
        status,
      )
    ) {
      return NextResponse.json(
        { error: "Valid status is required" },
        { status: 400 },
      );
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    ).populate("items.productId", "name price images");

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 },
    );
  }
}
