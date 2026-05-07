import { Schema, model, models } from "mongoose";
import "./BlogCategory";

const BlogSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    author: { type: String, default: "Admin" },
    thumbnail: String,
    category: {
      type: Schema.Types.ObjectId,
      ref: "BlogCategory",
    },
  },
  { timestamps: true },
);

export const Blog = models.Blog || model("Blog", BlogSchema);
