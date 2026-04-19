// import Stripe from "stripe";

// if (!process.env.STRIPE_SECRET_KEY) {
//   throw new Error("STRIPE_SECRET_KEY is not defined in environment variables");
// }

// export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
//   apiVersion: "2025-11-15.acacia",
//   typescript: true,
// });

// @/lib/stripe.ts
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // @ts-expect-error - Some TS versions might complain if the SDK is slightly older
  apiVersion: "2024-06-20", // Force this specific stable version
  typescript: true,
});
