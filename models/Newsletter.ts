import { Schema, models, model } from "mongoose";

const NewsletterSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    subscribedAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const Newsletter =
  models.Newsletter || model("Newsletter", NewsletterSchema);
