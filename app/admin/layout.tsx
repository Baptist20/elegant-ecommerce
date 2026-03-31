import React from "react";
import AdminSideNav from "../_components/AdminSideNav";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { User } from "@/models/User";
import connectDB from "@/lib/db";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Protection Guard
  const { getUser, getPermission } = getKindeServerSession();
  const kindeUser = await getUser();
  const isAdminPermission = await getPermission("is-admin");

  // Redirect if not logged in or doesn't have Kinde admin permission
  if (!kindeUser) {
    redirect("/");
  }

  if (!isAdminPermission) {
    redirect("/api/auth/login");
  }

  // 2. Double-check DB role (for total security)
  await connectDB();
  const dbUser = await User.findOne({ kindeUserId: kindeUser.id });

  if (dbUser?.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen bg-[#F3F5F7]">
      {/* Sidebar - Fixed width */}
      <AdminSideNav />

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
