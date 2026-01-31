import amqp from "amqplib"

import { logger } from "../utils/logger.js"

const rabbitUrl = process.env.RABBIT_URL as string

export const connectRabbit = async() => {
      if (!process.env.RABBIT_URL) {
    console.warn("RabbitMQ disabled: RABBIT_URL not set");
    return;
    }

    try{
    const connection = await amqp.connect(rabbitUrl)
    logger.info("RabbitMQ is connected")
    
    connection.on("close", () => {
  logger.warn("RabbitMQ connection closed");
});

    return connection
    
} catch (err:unknown){
    logger.error(`RabbitMQ connection failed ${String(err)}`)
}
}
