import cloudinary from "@/lib/cloudinary";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { message: "Use /api/user/[kindeId] to fetch a specific user." },
    { status: 200 },
  );
}

// change profile picture
export async function POST(request: NextRequest) {
  interface result {
    public_id: string;
    secure_url: string;
  }
  const { isAuthenticated } = getKindeServerSession();
  const isAuth = await isAuthenticated();

  if (!isAuth) NextResponse.redirect(new URL("/api/login", request.url));
  const formdata = request.formData();
  const file = ((await formdata).get("file") as File) || null;

  if (!file) {
    return NextResponse.json(
      { message: "image cannot be empty" },
      { status: 400 },
    );
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const result = await new Promise<result>((resolve, reject) => {
    const cloudStream = cloudinary.uploader.upload_stream(
      { allowed_formats: ["png", "jpg", "jpeg"], folder: "users-profile" },
      (err, callResult) => {
        if (err) reject(err);
        else resolve(callResult as result);
      },
    );
    cloudStream.end(buffer);
  });

  return NextResponse.json({ profile_url: result.secure_url });
}
