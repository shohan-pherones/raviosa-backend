import mongoose, { Schema } from "mongoose";
import { ICategory } from "./category.interface";

const CategorySchema: Schema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ICategory>("Category", CategorySchema);
