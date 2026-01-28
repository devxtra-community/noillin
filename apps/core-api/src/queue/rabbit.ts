import amqp from "amqplib"

import { logger } from "../utils/logger.js"

const rabbitUrl = process.env.RABBIT_URL
if (!rabbitUrl) {
    throw new Error("RABBIT_URL is not defined in environment variables")
}

export const connectRabbit = async() => {
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
