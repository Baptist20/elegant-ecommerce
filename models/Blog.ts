import { Schema, model, models } from "mongoose";

const BlogSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    author: { type: String, default: "Admin" },
    thumbnail: String,
    category: String, // e.g., 'Decor Tips'
  },
  { timestamps: true },
);

export const Blog = models.Blog || model("Blog", BlogSchema);
