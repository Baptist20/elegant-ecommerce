import { Schema, models, model } from "mongoose";
import "./User";
import "./Product";

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
      country: { type: String, required: true },
      state: { type: String, required: true },
      city: { type: String, required: true },
      street: { type: String, required: true },
      zipCode: { type: String, required: true },
    },
    paymentId: String, // From Stripe or PayPal
  },
  { timestamps: true },
);

export const Order = models.Order || model("Order", OrderSchema);
