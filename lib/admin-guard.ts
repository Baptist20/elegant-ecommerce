import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";

export async function validateAdmin() {
  const { isAuthenticated, getPermission } = getKindeServerSession();

  // 1. Check if the user is even logged in
  const isUserAuth = await isAuthenticated();
  if (!isUserAuth) {
    return NextResponse.json(
      {
        message: "Login to perfor this task",
      },
      { status: 400 },
    );
  }

  // 2. Check for the 'admin' permission (set up in Kinde Dashboard)
  const isAdmin = await getPermission("is-admin");
  if (!isAdmin?.isGranted) {
    return NextResponse.json(
      {
        message: "Admin access is required to perform this task",
      },
      { status: 400 },
    );
  }

  return true;
}
