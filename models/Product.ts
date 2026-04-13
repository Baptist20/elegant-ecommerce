import { Schema, models, model } from "mongoose";

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    price: { type: Number, required: true },

    // Link to the Category model
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    description: { type: String },
    stock: { type: Number, default: 0 },
    images: [String],
    colors: [String],
  },
  { timestamps: true },
);

export const Product = models.Product || model("Product", ProductSchema);
