
import cors from "cors"
import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cron from "node-cron";

import { httpLogger } from "./middlewares/httpLogger.js";
import { logger } from "./utils/logger.js";
import { errorHandler, notFound } from "./middlewares/errorHandler.js";
import { connectRabbit } from "./queue/rabbit.js";
import "./cache/redis.js";
import "./search/meili.js";
import router from "./routes/index.js";
import { connectDB } from "./db/connect.js";
import { cleanupExpiredSignups } from "./services/verification.service.js";



const app = express()
const PORT = Number(process.env.PORT) || 5000
app.use(httpLogger)
app.use(express.json())
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
}))

connectDB()
app.use(httpLogger);
app.use(express.json());
app.use("/api", router);

// 🔥 Connect Database
connectDB();

// 🔥 CRON JOB (Runs every hour)
cron.schedule("0 * * * *", async () => {
  logger.info("Running cleanup for expired pending signups...");
  await cleanupExpiredSignups();
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "core-api",
    timestamp: new Date().toISOString(),
  });
});

app.use(notFound);
app.use(errorHandler);

connectRabbit();

app.listen(PORT, "127.0.0.1", () => {
  logger.info(`Core API is running at http://localhost:${PORT}`);
});
