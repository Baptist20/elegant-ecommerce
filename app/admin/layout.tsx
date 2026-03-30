import AdminSideNav from "../_components/AdminSideNav";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import connectDB from "@/lib/db";
import { User } from "@/models/User";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { getUser, getPermission } = getKindeServerSession();
  const kindeUser = await getUser();

  if (!kindeUser || !kindeUser.id) {
    redirect("/api/auth/login");
  }

  const permission = await getPermission("is-admin");

  if (!permission) {
    redirect("/");
  }

  await connectDB();

  const user = await User.findOneAndUpdate(
    { kindeUserId: kindeUser.id },
    { $set: { role: "admin" } },
    { new: true },
  );

  return (
    <section className="max-w-[1440px] mx-auto px-10 lg:px-40 py-20">
      <h1 className="text-[54px] font-medium leading-[58px] text-center mb-10">
        {`Welcome admin ${user.firstName}`}
      </h1>

      {/* Admin section parent div */}
      <div className="flex flex-col md:flex-row items-start p-0 gap-[72px] w-full max-w-[1120px] mx-auto">
        {/* Sidenav */}
        <AdminSideNav />

        {/* Outlet / Main Content */}
        <div className="flex flex-col items-start p-0 gap-10 w-full md:max-w-[851px]">
          {children}
        </div>
      </div>
    </section>
  );
}
