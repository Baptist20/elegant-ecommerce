import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function validateAdmin() {
  const { isAuthenticated, getPermission } = getKindeServerSession();

  // 1. Check if the user is even logged in
  const isUserAuth = await isAuthenticated();
  if (!isUserAuth) {
    throw new Error("Unauthorized: You must be logged in.");
  }

  // 2. Check for the 'admin' permission (set up in Kinde Dashboard)
  const isAdmin = await getPermission("is-admin");
  if (!isAdmin?.isGranted) {
    throw new Error("Forbidden: Admin access required.");
  }

  return true;
}
