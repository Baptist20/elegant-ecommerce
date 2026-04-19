"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { inter, poppins } from "../../utils/font";
import Link from "next/link";

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<any>(null);

  const sessionId = searchParams.get("session_id");
  const orderId = searchParams.get("order_id");

  useEffect(() => {
    if (!sessionId || !orderId) {
      toast.error("Invalid checkout session");
      router.push("/shop");
      return;
    }

    const confirmPayment = async () => {
      try {
        // Verify payment with backend
        const response = await fetch(
          `/api/stripe/verify-payment?session_id=${sessionId}&order_id=${orderId}`,
          {
            method: "POST",
          },
        );

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          toast.error(data.error || "Payment verification failed");
          router.push("/checkout/cancel");
          return;
        }

        const orderData = await response.json();
        setOrder(orderData);
        toast.success("Payment successful! Your order has been placed.");
      } catch (error) {
        console.error("Error confirming payment:", error);
        toast.error("Something went wrong while confirming payment");
        router.push("/checkout/cancel");
      } finally {
        setLoading(false);
      }
    };

    confirmPayment();
  }, [sessionId, orderId, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h1 className={`${poppins.className} text-2xl font-medium mb-2`}>
            Confirming your payment...
          </h1>
          <p className={`${inter.className} text-gray-600`}>
            Please wait while we verify your payment.
          </p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 className={`${poppins.className} text-2xl font-medium mb-2`}>
            Payment Failed
          </h1>
          <p className={`${inter.className} text-gray-600 mb-6`}>
            We couldn't verify your payment. Please try again.
          </p>
          <Link
            href="/shop"
            className="inline-block px-6 py-3 bg-black text-white font-medium rounded-md hover:bg-gray-800"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-4 py-12 md:px-8 lg:px-16">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className={`${poppins.className} text-3xl font-medium mb-2`}>
            Payment Successful!
          </h1>
          <p className={`${inter.className} text-gray-600`}>
            Thank you for your order. We'll send you a confirmation email
            shortly.
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className={`${poppins.className} text-xl font-medium mb-4`}>
            Order Details
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className={`${inter.className} text-gray-700`}>
                Order ID
              </span>
              <span className={`${inter.className} font-medium`}>
                #{order._id.slice(-8).toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className={`${inter.className} text-gray-700`}>Date</span>
              <span className={`${inter.className} font-medium`}>
                {new Date(order.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className={`${inter.className} text-gray-700`}>
                Total Amount
              </span>
              <span className={`${poppins.className} font-medium`}>
                ${order.totalAmount.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className={`${inter.className} text-gray-700`}>Status</span>
              <span
                className={`${inter.className} px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium`}
              >
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className={`${poppins.className} text-xl font-medium mb-4`}>
            Shipping Address
          </h2>
          <p className={`${inter.className} text-gray-700`}>
            {order.shippingAddress.street}
            <br />
            {order.shippingAddress.city}, {order.shippingAddress.state}
            <br />
            {order.shippingAddress.country} {order.shippingAddress.zipCode}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/user-dashboard/orders"
            className="px-6 py-3 bg-black text-white font-medium rounded-md hover:bg-gray-800 text-center"
          >
            View Your Orders
          </Link>
          <Link
            href="/shop"
            className="px-6 py-3 border border-black text-black font-medium rounded-md hover:bg-gray-50 text-center"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
