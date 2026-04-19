import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import connectDB from "@/lib/db";
import { Order } from "@/models/Order";
import { Cart } from "@/models/Cart";

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");
    const orderId = searchParams.get("order_id");

    if (!sessionId || !orderId) {
      return NextResponse.json(
        { error: "Session ID and Order ID are required" },
        { status: 400 },
      );
    }

    await connectDB();

    // Retrieve Stripe session
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { error: "Payment not completed" },
        { status: 400 },
      );
    }

    // Find and update order
    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Update order status to processing (payment received)
    order.status = "processing";
    order.paymentId = sessionId;
    await order.save();

    // Clear user's cart
    await Cart.findOneAndUpdate(
      { userId: order.userId },
      { items: [] },
      { new: true },
    );

    // Populate product details for response
    await order.populate("items.productId", "name price images");

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json(
      { error: "Failed to verify payment" },
      { status: 500 },
    );
  }
}
