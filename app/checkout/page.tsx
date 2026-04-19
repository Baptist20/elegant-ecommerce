"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { inter, poppins } from "../utils/font";

export default function CheckoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    country: "",
    state: "",
    city: "",
    street: "",
    zipCode: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Fetch current cart to get items and total
      const cartRes = await fetch("/api/cart", { cache: "no-store" });
      if (!cartRes.ok) {
        toast.error("Unable to fetch cart");
        return;
      }
      const cart = await cartRes.json();

      if (!cart.items?.length) {
        toast.error("Your cart is empty");
        return;
      }

      // 2. Create order
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.items,
          totalAmount: cart.items.reduce(
            (sum: number, item: any) =>
              sum + (item.productId?.price || 0) * item.quantity,
            0,
          ),
          shippingAddress: formData,
        }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        toast.error(orderData.error || "Failed to create order");
        return;
      }

      // 3. Clear cart after successful order
      await fetch("/api/cart/clear", { method: "POST" });

      toast.success("Order placed successfully!");
      router.push(`/user-dashboard/orders/${orderData._id}`);
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Something went wrong during checkout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white px-4 py-8 md:px-8 lg:px-16">
      <div className="max-w-4xl mx-auto">
        <h1 className={`${poppins.className} text-3xl font-medium mb-8`}>
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping Address Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className={`${poppins.className} text-xl font-medium mb-4`}>
                  Shipping Address
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      className={`${inter.className} block text-sm font-medium text-gray-700 mb-1`}
                    >
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="United States"
                    />
                  </div>

                  <div>
                    <label
                      className={`${inter.className} block text-sm font-medium text-gray-700 mb-1`}
                    >
                      State/Province
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="California"
                    />
                  </div>

                  <div>
                    <label
                      className={`${inter.className} block text-sm font-medium text-gray-700 mb-1`}
                    >
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="Los Angeles"
                    />
                  </div>

                  <div>
                    <label
                      className={`${inter.className} block text-sm font-medium text-gray-700 mb-1`}
                    >
                      ZIP/Postal Code
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="90001"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label
                      className={`${inter.className} block text-sm font-medium text-gray-700 mb-1`}
                    >
                      Street Address
                    </label>
                    <input
                      type="text"
                      name="street"
                      value={formData.street}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="123 Main St"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-black text-white font-medium rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Processing..." : "Place Order"}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-6 rounded-lg sticky top-8">
              <h2 className={`${poppins.className} text-xl font-medium mb-4`}>
                Order Summary
              </h2>
              <p className={`${inter.className} text-gray-600 mb-6`}>
                Your order total will be calculated based on your cart items.
                Shipping is free.
              </p>
              <div className="border-t border-gray-300 pt-4">
                <div className="flex justify-between mb-2">
                  <span className={`${inter.className} text-gray-700`}>
                    Subtotal
                  </span>
                  <span className={`${inter.className} font-medium`}>
                    Calculated at checkout
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className={`${inter.className} text-gray-700`}>
                    Shipping
                  </span>
                  <span
                    className={`${inter.className} font-medium text-green-600`}
                  >
                    Free
                  </span>
                </div>
                <div className="flex justify-between mt-4 pt-4 border-t border-gray-300">
                  <span className={`${poppins.className} text-lg font-medium`}>
                    Total
                  </span>
                  <span className={`${poppins.className} text-lg font-medium`}>
                    Calculated at checkout
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
