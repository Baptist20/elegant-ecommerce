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
    stock: { type: Number, default: 0 },
    images: [{ type: String }],
    colors: [{ type: String }],
  },
  { timestamps: true },
);

ProductSchema.pre("validate", function (next: (err?: Error) => void) {
  if (this.name && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .trim() // Added trim to handle accidental leading/trailing spaces
      .replace(/[^\w ]+/g, "")
      .replace(/ +/g, "-");
  }
  next();
});

export const Product = models.Product || model("Product", ProductSchema);
