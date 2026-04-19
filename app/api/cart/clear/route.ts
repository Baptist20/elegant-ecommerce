import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import connectDB from "@/lib/db";
import { Cart } from "@/models/Cart";
import { User } from "@/models/User";

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

    // Check if user is admin (admins cannot have carts)
    if (dbUser.role === "admin") {
      return NextResponse.json(
        { error: "Admins cannot modify cart" },
        { status: 403 },
      );
    }

    // Clear cart by setting items to empty array
    const cart = await Cart.findOneAndUpdate(
      { userId: dbUser._id },
      { items: [] },
      { new: true, upsert: true },
    );

    return NextResponse.json(cart);
  } catch (error) {
    console.error("Error clearing cart:", error);
    return NextResponse.json(
      { error: "Failed to clear cart" },
      { status: 500 },
    );
  }
}
