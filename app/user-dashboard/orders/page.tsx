import React from "react";
import OrderCard from "../../_components/OrderCard";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import { orders } from "@/app/utils/types";

export default async function OrdersPage() {
  const { getUser } = getKindeServerSession();

  const user = await getUser();

  const userID = user?.id;

  if (!userID) return;

  await connectDB();

  const orders: orders = await User.findOne({ kindeUserId: userID }).populate(
    "order",
  );

  const dummyOrders = [
    {
      orderId: "3456_768",
      products: [{ name: "Tray Table", quantity: 1 }],
      orderDate: new Date("2023-10-17"),
      status: "Delivered",
      totalPrice: 1234.0,
      deliveryLocation: {
        street: "123 Main St",
        city: "New York",
        zipCode: "10001",
      },
    },
    {
      orderId: "3456_980",
      products: [{ name: "Loveset Sofa", quantity: 1 }],
      orderDate: new Date("2023-10-11"),
      status: "Delivered",
      totalPrice: 345.0,
      deliveryLocation: {
        street: "456 Oak Ave",
        city: "Los Angeles",
        zipCode: "90001",
      },
    },
    {
      orderId: "3456_120",
      products: [{ name: "Bamboo Basket", quantity: 2 }],
      orderDate: new Date("2023-08-24"),
      status: "Delivered",
      totalPrice: 2345.0,
      deliveryLocation: {
        street: "789 Pine Rd",
        city: "Chicago",
        zipCode: "60601",
      },
    },
    {
      orderId: "3456_030",
      products: [{ name: "Pillow", quantity: 4 }],
      orderDate: new Date("2023-08-12"),
      status: "Delivered",
      totalPrice: 845.0,
      deliveryLocation: {
        street: "101 Elm Blvd",
        city: "Houston",
        zipCode: "77001",
      },
    },
  ];

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

          {
            // orders.length == 0
            //   ? "you have no orders"
            //   :
            dummyOrders.map((order) => (
              <OrderCard
                key={order.orderId}
                orderId={order.orderId}
                products={order.products}
                orderDate={order.orderDate}
                status={order.status}
                totalPrice={order.totalPrice}
                deliveryLocation={order.deliveryLocation}
              />
            ))
          }
        </div>
      </div>
    </div>
  );
}
