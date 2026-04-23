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

  // Redirect to home if not logged in at all
  if (!kindeUser) {
    redirect("/");
  }

  // Check Kinde permission
  const adminPermission = await getPermission("is-admin");
  if (!adminPermission || !adminPermission.isGranted) {
    redirect("/");
  }

  // 2. Check for user in database
  await connectDB();
  const dbUser = await User.findOne({ kindeUserId: kindeUser.id });

  // Check for user before setting admin
  if (!dbUser) {
    await User.create({
      kindeUserId: kindeUser.id,
      email: kindeUser.email,
      firstName: kindeUser.given_name,
      lastName: kindeUser.family_name,
      role: "admin",
    });
  } else if (dbUser.role !== "admin") {
    dbUser.role = "admin";
    await dbUser.save();
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
