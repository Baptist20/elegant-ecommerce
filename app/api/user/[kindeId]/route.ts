import connectDB from "@/lib/db";
import { User } from "@/models/User";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ kindeId: string }> },
) {
  const kindeUserId = (await params).kindeId;

  await connectDB();
  const user = await User.findOne({ kindeUserId: kindeUserId });

  try {
    if (!user) {
      const { getUser } = getKindeServerSession();
      const kindeUserDetails = await getUser();

      if (!kindeUserDetails) {
        return NextResponse.json(
          { error: "User not found in Kinde session" },
          { status: 401 },
        );
      }

      const newUser = await User.create({
        kindeUserId: kindeUserDetails.id,
        email: kindeUserDetails.email,
        firstName: kindeUserDetails.given_name,
        lastName: kindeUserDetails.family_name,
      });

      return NextResponse.json(newUser, { status: 201 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.log(`Error from api/user/kindId : ${error}`);
  }
}
