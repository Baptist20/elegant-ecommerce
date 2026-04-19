"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { inter, poppins } from "../utils/font";
import { loadStripe } from "@stripe/stripe-js";

// Initialize Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
);

export default function CheckoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState<any>(null);
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

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch("/api/cart", { cache: "no-store" });
        if (!response.ok) {
          toast.error("Unable to fetch cart");
          return;
        }
        const data = await response.json();
        setCart(data);
      } catch (error) {
        console.error("Error fetching cart:", error);
        toast.error("Unable to load cart");
      }
    };

    fetchCart();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!cart?.items?.length) {
        toast.error("Your cart is empty");
        return;
      }

      // Create Stripe checkout session
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shippingAddress: formData }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to create checkout session");
        return;
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.assign(data.url);
      } else {
        toast.error("Stripe session URL not found");
      }
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
            <form
              onSubmit={handleSubmit}
              className="space-y-6"
              id="checkout-form"
            >
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
              {cart ? (
                <>
                  <div className="space-y-3 mb-4">
                    {cart.items.map((item: any) => (
                      <div key={item._id} className="flex justify-between">
                        <div>
                          <p className={`${inter.className} text-sm`}>
                            {item.productId?.name} × {item.quantity}
                          </p>
                        </div>
                        <p className={`${inter.className} text-sm font-medium`}>
                          $
                          {(
                            (item.productId?.price || 0) * item.quantity
                          ).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-gray-300 pt-4">
                    <div className="flex justify-between mb-2">
                      <span className={`${inter.className} text-gray-700`}>
                        Subtotal
                      </span>
                      <span className={`${inter.className} font-medium`}>
                        $
                        {cart.items
                          .reduce(
                            (sum: number, item: any) =>
                              sum +
                              (item.productId?.price || 0) * item.quantity,
                            0,
                          )
                          .toFixed(2)}
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
                      <span
                        className={`${poppins.className} text-lg font-medium`}
                      >
                        Total
                      </span>
                      <span
                        className={`${poppins.className} text-lg font-medium`}
                      >
                        $
                        {cart.items
                          .reduce(
                            (sum: number, item: any) =>
                              sum +
                              (item.productId?.price || 0) * item.quantity,
                            0,
                          )
                          .toFixed(2)}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <div className="h-4 w-32 bg-gray-200 animate-pulse rounded mx-auto mb-2"></div>
                  <div className="h-4 w-24 bg-gray-200 animate-pulse rounded mx-auto"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
