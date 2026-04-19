import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { message: "Use /api/user/[kindeId] to fetch a specific user." },
    { status: 200 },
  );
}
