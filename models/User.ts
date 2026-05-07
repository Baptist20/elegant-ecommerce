import { Schema, model, models } from "mongoose";
import "./Order";
import "./Wishlist";

const UserSchema = new Schema(
  {
    kindeUserId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    firstName: String,
    lastName: String,
    profileImage: String,
    role: { type: String, enum: ["user", "admin"], default: "user" },
    order: [{ type: Schema.Types.ObjectId, ref: "Order" }],
    wishlist: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true },
);

export const User = models.User || model("User", UserSchema);
