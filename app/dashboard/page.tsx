import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardRedirect() {
  const { isAuthenticated, getPermission } = getKindeServerSession();

  // 1. Check if the user is authenticated
  const isUserAuth = await isAuthenticated();
  if (!isUserAuth) {
    redirect("/api/auth/login");
  }

  // 2. Check if the user has the 'is-admin' permission
  const isAdmin = await getPermission("is-admin");

  if (isAdmin?.isGranted) {
    // Redirect to Admin dashboard
    redirect("/admin");
  } else {
    // Redirect to Regular user dashboard
    redirect("/user-dashboard");
  }

  // Fallback
  return null;
}
