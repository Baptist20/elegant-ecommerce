import { Schema, model, models } from "mongoose";

const BlogCategorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
  },
  { timestamps: true },
);

export const BlogCategory =
  models.BlogCategory || model("BlogCategory", BlogCategorySchema);
