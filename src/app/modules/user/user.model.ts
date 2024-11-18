import mongoose, { Schema } from "mongoose";
import { IUser } from "./user.interface";

const UserSchema: Schema = new Schema<IUser>(
  {
    username: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    image: { type: String },
    address: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUser>("User", UserSchema);
