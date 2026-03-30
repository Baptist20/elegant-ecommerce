import React from "react";
import OrderCard from "../../_components/OrderCard";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import { Order } from "@/models/Order";

export default async function OrdersPage() {
  const { getUser } = getKindeServerSession();
  const kindeUser = await getUser();

  if (!kindeUser || !kindeUser.id) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-xl text-[#6C7275]">
          Please log in to view your orders.
        </p>
      </div>
    );
  }

  await connectDB();

  const user = await User.findOne({ kindeUserId: kindeUser.id });

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-xl text-[#6C7275]">User not found in database.</p>
      </div>
    );
  }

  const orders = await Order.find({ userId: user._id }).sort({ createdAt: -1 });

  return (
    <div className="flex flex-col items-start w-full max-w-[851px] p-0 md:px-[72px] gap-10">
      <h2 className="text-2xl font-semibold text-black">Orders History</h2>

      <div className="w-full overflow-x-auto">
        <div className="flex flex-col items-start w-full min-w-max">
          {/* Table Header */}
          <div className="flex justify-between items-center w-full px-0 pb-2 gap-14 border-b border-[#E8ECEF] text-sm font-normal leading-tight text-[#6C7275]">
            <p className="flex-none w-[160px]">Order ID</p>
            <p className="flex-none w-[120px]">Date</p>
            <p className="flex-none w-[120px]">Status</p>
            <p className="flex-none w-[137px]">Total</p>
          </div>

          {orders.length === 0 ? (
            <div className="flex items-center justify-center w-full py-10">
              <p className="text-xl text-[#6C7275]">
                You have no order history.
              </p>
            </div>
          ) : (
            orders.map((order: any) => (
              <OrderCard
                key={order._id.toString()}
                orderId={order._id.toString().slice(-8).toUpperCase()}
                products={order.items.map((item: any) => ({
                  name: item.name,
                  quantity: item.quantity,
                }))}
                orderDate={order.createdAt}
                status={order.status}
                totalPrice={order.totalAmount}
                deliveryLocation={{
                  street: order.shippingAddress.street,
                  city: order.shippingAddress.city,
                  zipCode: order.shippingAddress.zipCode,
                  country: order.shippingAddress.country,
                  state: order.shippingAddress.state,
                }}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
