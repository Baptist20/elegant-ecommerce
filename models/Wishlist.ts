import { Schema, models, model } from "mongoose";

const WishlistSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
    ],
  },
  { timestamps: true },
);

export const Wishlist = models.Wishlist || model("Wishlist", WishlistSchema);
