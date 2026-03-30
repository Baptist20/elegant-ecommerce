import React from "react";
import { format } from "date-fns";

interface OrderCardProps {
  orderId: string;
  products: Array<{ name: string; quantity: number }>;
  orderDate: Date;
  status: string;
  totalPrice: number;
  deliveryLocation: {
    street: string;
    city: string;
    zipCode: string;
    country: string;
    state: string;
  };
}

export default function OrderCard({
  orderId,
  products,
  orderDate,
  status,
  totalPrice,
  deliveryLocation,
}: OrderCardProps) {
  return (
    <div className="flex flex-col items-start w-full py-6 gap-3 border-b border-[#E8ECEF] text-sm font-normal text-[#141718]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full gap-2 md:gap-4">
        {/* Order ID */}
        <p className="flex-none w-auto md:w-[160px] font-semibold">
          Order ID: {orderId}
        </p>

        {/* Order Date & Status */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-1 md:gap-4">
          <p className="flex-none w-auto md:w-[120px]">
            Date: {format(orderDate, "PPP")}
          </p>
          <p className="flex-none w-auto md:w-[120px]">Status: {status}</p>
        </div>

        {/* Total Price */}
        <p className="flex-none w-auto md:w-[137px] font-semibold">
          Total: ${totalPrice.toFixed(2)}
        </p>
      </div>

      {/* Products List */}
      <div className="w-full">
        <p className="text-xs font-semibold uppercase text-[#6C7275] mb-2">
          Products:
        </p>
        {products.map((product, index) => (
          <p key={index} className="text-sm text-[#141718]">
            {product.name} (x{product.quantity})
          </p>
        ))}
      </div>

      {/* Delivery Location */}
      <div className="w-full">
        <p className="text-xs font-semibold uppercase text-[#6C7275] mb-2">
          Delivery Address:
        </p>
        <p className="text-sm text-[#141718]">
          {deliveryLocation.street}, {deliveryLocation.city},{" "}
          {deliveryLocation.state}, {deliveryLocation.country},{" "}
          {deliveryLocation.zipCode}
        </p>
      </div>
    </div>
  );
}
