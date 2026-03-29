import { Schema, models, model } from "mongoose";

const OrderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: String,
        price: Number,
        quantity: Number,
      },
    ],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    shippingAddress: {
      country: String,
      state: String,
      city: String,
      street: String,
      zipCode: String,
    },
    paymentId: String, // From Stripe or PayPal
  },
  { timestamps: true },
);

export const Order = models.Order || model("Order", OrderSchema);
