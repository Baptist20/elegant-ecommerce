"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { inter, poppins } from "../../utils/font";

interface OrderItem {
  productId: {
    _id: string;
    name: string;
    images: string[];
  };
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  items: OrderItem[];
  totalAmount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  shippingAddress: {
    country: string;
    state: string;
    city: string;
    street: string;
    zipCode: string;
  };
  createdAt: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders", { cache: "no-store" });
      if (!response.ok) {
        toast.error("Failed to fetch orders");
        return;
      }
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        toast.error(data.error || "Failed to update status");
        return;
      }

      const updatedOrder = await response.json();
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId
            ? { ...order, status: updatedOrder.status }
            : order,
        ),
      );
      toast.success("Order status updated");
    } catch {
      toast.error("Something went wrong while updating status");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-[#6C7275]">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-4 py-8 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <h1 className={`${poppins.className} text-3xl font-medium mb-8`}>
          Admin Orders
        </h1>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <p className={`${inter.className} text-xl text-gray-600`}>
              No orders found.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                    Order ID
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                    Customer
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                    Items
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                    Total
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="py-4 px-4">
                      <p className={`${inter.className} text-sm text-gray-900`}>
                        #{order._id.slice(-8).toUpperCase()}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className={`${inter.className} font-medium`}>
                          {order.userId?.name || "N/A"}
                        </p>
                        <p
                          className={`${inter.className} text-sm text-gray-600`}
                        >
                          {order.userId?.email || "N/A"}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        {order.items.slice(0, 2).map((item, idx) => (
                          <p key={idx} className={`${inter.className} text-sm`}>
                            {item.name} × {item.quantity}
                          </p>
                        ))}
                        {order.items.length > 2 && (
                          <p
                            className={`${inter.className} text-sm text-gray-500`}
                          >
                            +{order.items.length - 2} more
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className={`${poppins.className} font-medium`}>
                        ${order.totalAmount.toFixed(2)}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`${inter.className} inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          order.status,
                        )}`}
                      >
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <p className={`${inter.className} text-sm text-gray-600`}>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateOrderStatus(order._id, e.target.value)
                        }
                        className={`${inter.className} text-sm border border-gray-300 rounded-md px-3 py-1.5 focus:ring-2 focus:ring-black focus:border-transparent`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
