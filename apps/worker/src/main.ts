import 'dotenv/config'; 

import { connectRabbit } from "./rabbit/connection";
import { startGigConsumer } from "./consumers/gig.consumer";
import { logger } from "./utils/logger";
async function bootstrap() {
  try {
    const channel = await connectRabbit();

    await startGigConsumer(channel);

    logger.info("Worker started successfully");
  } catch (err) {
    logger.error("Worker failed to start", err);
    process.exit(1);
  }
}

bootstrap();



