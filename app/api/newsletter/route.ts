import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Newsletter } from "@/models/Newsletter";
import { sendNewsletterWelcomeEmail } from "@/lib/sendMail";

// POST: Subscribe to newsletter
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 },
      );
    }

    // Check if email already exists
    const existingSubscription = await Newsletter.findOne({
      email: email.toLowerCase(),
    });

    if (existingSubscription) {
      if (existingSubscription.isActive) {
        return NextResponse.json(
          { error: "This email is already subscribed" },
          { status: 400 },
        );
      } else {
        // Reactivate subscription
        existingSubscription.isActive = true;
        existingSubscription.subscribedAt = new Date();
        await existingSubscription.save();

        // Send welcome email
        await sendNewsletterWelcomeEmail(email);

        return NextResponse.json({
          success: true,
          message: "Subscription reactivated successfully",
          subscription: existingSubscription,
        });
      }
    }

    // Create new subscription
    const subscription = await Newsletter.create({
      email: email.toLowerCase(),
      subscribedAt: new Date(),
      isActive: true,
    });

    // Send welcome email
    await sendNewsletterWelcomeEmail(email);

    return NextResponse.json({
      success: true,
      message: "Subscribed successfully!",
      subscription,
    });
  } catch (error) {
    console.error("Error subscribing to newsletter:", error);

    // Check for duplicate key error
    if (error instanceof Error && error.message.includes("duplicate key")) {
      return NextResponse.json(
        { error: "This email is already subscribed" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Failed to subscribe to newsletter" },
      { status: 500 },
    );
  }
}

// GET: Get all newsletter subscribers (admin only)
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Note: In production, you should add admin authentication here
    // For now, we'll return all active subscribers

    const subscribers = await Newsletter.find({ isActive: true })
      .sort({ subscribedAt: -1 })
      .select("email subscribedAt");

    return NextResponse.json(subscribers);
  } catch (error) {
    console.error("Error fetching newsletter subscribers:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscribers" },
      { status: 500 },
    );
  }
}

// DELETE: Unsubscribe from newsletter
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const subscription = await Newsletter.findOne({
      email: email.toLowerCase(),
    });

    if (!subscription) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 },
      );
    }

    if (!subscription.isActive) {
      return NextResponse.json(
        { error: "Already unsubscribed" },
        { status: 400 },
      );
    }

    // Soft delete: mark as inactive
    subscription.isActive = false;
    await subscription.save();

    return NextResponse.json({
      success: true,
      message: "Unsubscribed successfully",
    });
  } catch (error) {
    console.error("Error unsubscribing from newsletter:", error);
    return NextResponse.json(
      { error: "Failed to unsubscribe" },
      { status: 500 },
    );
  }
}
