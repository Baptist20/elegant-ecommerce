import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import connectDB from "@/lib/db";
import { Order } from "@/models/Order";
import { User } from "@/models/User";
import { inter, poppins } from "../../utils/font";
import Link from "next/link";

export default async function UserOrdersPage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-[#6C7275]">
          Please log in to view your orders.
        </p>
      </div>
    );
  }

  await connectDB();
  const dbUser = await User.findOne({ kindeUserId: user.id });

  if (!dbUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-[#6C7275]">User not found.</p>
      </div>
    );
  }

  const orders = await Order.find({ userId: dbUser._id })
    .populate("items.productId", "name images")
    .sort({ createdAt: -1 });

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

  return (
    <div className="min-h-screen bg-white px-4 py-8 md:px-8 lg:px-16">
      <div className="max-w-6xl mx-auto">
        <h1 className={`${poppins.className} text-3xl font-medium mb-8`}>
          Your Orders
        </h1>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <p className={`${inter.className} text-xl text-gray-600 mb-4`}>
              You haven't placed any orders yet.
            </p>
            <Link
              href="/shop"
              className="inline-block px-6 py-3 bg-black text-white font-medium rounded-md hover:bg-gray-800"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id.toString()}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <div>
                    <p className={`${inter.className} text-sm text-gray-600`}>
                      Order #{order._id.toString().slice(-8).toUpperCase()}
                    </p>
                    <p className={`${inter.className} text-sm text-gray-600`}>
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`${inter.className} px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        order.status,
                      )}`}
                    >
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                    <p className={`${poppins.className} font-medium`}>
                      ${order.totalAmount.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    {order.items.map((item: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden">
                            {item.productId?.images?.[0] ? (
                              <img
                                src={item.productId.images[0]}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                No image
                              </div>
                            )}
                          </div>
                          <div>
                            <p
                              className={`${inter.className} font-medium text-gray-900`}
                            >
                              {item.name}
                            </p>
                            <p
                              className={`${inter.className} text-sm text-gray-600`}
                            >
                              Qty: {item.quantity} × ${item.price.toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <p className={`${inter.className} font-medium`}>
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className={`${inter.className} font-medium mb-2`}>
                      Shipping Address
                    </h3>
                    <p className={`${inter.className} text-sm text-gray-600`}>
                      {order.shippingAddress.street},{" "}
                      {order.shippingAddress.city}
                      <br />
                      {order.shippingAddress.state},{" "}
                      {order.shippingAddress.country}{" "}
                      {order.shippingAddress.zipCode}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
