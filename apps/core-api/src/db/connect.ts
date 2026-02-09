import mongoose from "mongoose";

import { logger } from "../utils/logger.js";

const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  throw new Error("MONGO_URI is not defined in environment variables");
}

export const connectDB = async () => {
  try {
    await mongoose.connect(mongoUri, { dbName: "noillin" });
    logger.info("MongoDB connected successfully");
    logger.info(`CONNECTED DB: ${mongoose.connection.name}`);

  } catch (err: unknown) {
    logger.error(`MongoDB connection failed: ${String(err)}`);
    process.exit(1);
  }
};
