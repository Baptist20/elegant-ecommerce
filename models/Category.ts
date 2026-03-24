import { Schema, model, models } from "mongoose";

const CategorySchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true }, // e.g., 'living-room'
  image: String,
  description: String,
});

export const Category = models.Category || model("Category", CategorySchema);
