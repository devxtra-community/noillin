import mongoose from "mongoose";

import { logger } from "../utils/logger.js";

const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  throw new Error("MONGO_URI is not defined in environment variables");
}

export const connectDB = async () => {
  try {
    await mongoose.connect(mongoUri);
    logger.info("MongoDB connected successfully");
  } catch (err: unknown) {
    logger.error(`MongoDB connection failed: ${String(err)}`);
    process.exit(1);
  }
};
