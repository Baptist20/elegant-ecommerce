import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    kindeId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    firstName: String,
    lastName: String,
    profileImage: String,
    role: { type: String, enum: ["user", "admin"], default: "user" },
    wishlist: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true },
);

export const User = models.User || model("User", UserSchema);
