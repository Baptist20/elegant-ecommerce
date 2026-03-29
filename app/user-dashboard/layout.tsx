import UserSideNav from "../_components/UserSideNav";

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="max-w-[1440px] mx-auto px-10 lg:px-40 py-20">
      <h1 className="text-[54px] font-medium leading-[58px] text-center mb-10">
        My Account
      </h1>

      {/* Account section parent div */}
      <div className="flex flex-col md:flex-row items-start p-0 gap-[72px] w-full max-w-[1120px] mx-auto">
        {/* Sidenav */}
        <UserSideNav />

        {/* Outlet / Main Content */}
        <div className="flex flex-col items-start p-0 gap-10 w-full md:max-w-[851px]">
          {children}
        </div>
      </div>
    </section>
  );
}
