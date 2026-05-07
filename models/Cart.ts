import { Schema, models, model } from "mongoose";
import "./User";
import "./Product";

const CartSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, default: 1 },
      },
    ],
  },
  { timestamps: true },
);

export const Cart = models.Cart || model("Cart", CartSchema);
