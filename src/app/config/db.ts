import mongoose from "mongoose";
import config from "./env";

const connectDB = async () => {
  try {
    if (!config.mongodb_uri) {
      throw new Error("MongoDB URI is not defined");
    }

    await mongoose.connect(config.mongodb_uri);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

export default connectDB;
