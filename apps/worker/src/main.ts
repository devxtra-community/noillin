import 'dotenv/config'; 
import "./jobs/notification.worker";
import { connectRabbit } from "./rabbit/connection";
import { startGigConsumer } from "./consumers/gig.consumer";
import { logger } from "./utils/logger";
import { startBrandConsumer } from './consumers/brand.cosumer';
import { startInfluencerConsumer } from './consumers/influencer.consumer';
import { startOrderConsumer } from './consumers/order.consumer';
async function bootstrap() {
  try {
    const channel = await connectRabbit();


    await Promise.all([
      startGigConsumer(channel),
      startBrandConsumer(channel),
      startInfluencerConsumer(channel),
      startOrderConsumer(channel)
    ])

    logger.info("Worker started successfully");
  } catch (err) {
    logger.error("Worker failed to start", err);
    process.exit(1);
  }
}

bootstrap();



