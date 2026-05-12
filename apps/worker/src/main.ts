import 'dotenv/config'; 
import "./jobs/notification.worker";
import "./workers/chat.worker";
import mongoose from "mongoose";

import { connectRabbit } from "./rabbit/connection";
import { startGigConsumer } from "./consumers/gig.consumer";
import { logger } from "./utils/logger";
import { startBrandConsumer } from './consumers/brand.cosumer';
import { startInfluencerConsumer } from './consumers/influencer.consumer';
import { startOrderConsumer } from './consumers/order.consumer';
import { startGigRequestConsumer } from './consumers/gig-request.consumer';
import { consumeChatMessages } from './consumers/chat.consumer';
import { startUserConsumer } from './consumers/user.consumer';


async function connectDB() {
  if (!process.env.MONGO_URI) {
    logger.warn("MONGO_URI not defined, worker DB connection skipped");
    return;
  }
  await mongoose.connect(process.env.MONGO_URI);
  logger.info("Worker connected to MongoDB");
}

async function bootstrap() {
  try {
    await connectDB();
    const channel = await connectRabbit();


    await Promise.all([
      startGigConsumer(channel),
      startBrandConsumer(channel),
      startInfluencerConsumer(channel),
      startOrderConsumer(channel),
      startGigRequestConsumer(channel),
      consumeChatMessages(channel),
      startUserConsumer(channel)
    ])

    logger.info("Worker started successfully");
  } catch (err) {
    logger.error("Worker failed to start", err);
    process.exit(1);
  }
}

bootstrap();
