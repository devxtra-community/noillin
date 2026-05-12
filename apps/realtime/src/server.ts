
import dotenv from "dotenv"

dotenv.config()
import { createServer } from "http";

import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import amqp from "amqplib";

import {connectDB} from "./db/db"
import { httpLogger } from "./middlewares/httpLogger";
import { logger } from "./utils/logger";
import { errorHandler, notFound } from "./middlewares/errorHandler";
import { registerChatHandlers } from "./sockets/chat.socket";

const app = express();
app.use(cors())
app.use(express.json())
app.use(httpLogger)
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*"
  }
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "realtime"
  });
});

io.on("connection", (socket) => {
  logger.info("Socket connected:", socket.id);
  registerChatHandlers(io, socket);
  socket.on("disconnect", () => {
    logger.info("Socket disconnected:", socket.id);
  });
});

app.post('/internal/emit', (req, res) => {
  const secret = req.headers['x-internal-secret'];
  if (!secret || secret !== process.env.INTERNAL_SECRET) {
    return res.status(403).json({ error: 'Forbidden: Invalid internal secret' });
  }

  const { event, room, payload } = req.body;
  if (!event || !room || !payload) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  io.to(room).emit(event, payload);
  logger.info(`Emitted internal event  to room `);
  res.status(200).json({ success: true });
});

app.use(notFound)
app.use(errorHandler)
const PORT = Number(process.env.PORT) || 6001;
const startServer = async () => {
  try {
    await connectDB(); // ✅ FIRST

    const rabbitConn = await amqp.connect(process.env.RABBIT_URL || "amqp://localhost:5672");
    const rabbitChannel = await rabbitConn.createChannel();
    await rabbitChannel.assertQueue("notification.events", { durable: true });
    rabbitChannel.consume("notification.events", (msg) => {
      if (msg !== null) {
        try {
          const { event, room, payload } = JSON.parse(msg.content.toString());
          if (event && room && payload) {
            io.to(room).emit(event, payload);
            logger.info(`Emitted ${event} from RabbitMQ to room ${room}`);
          }
        } catch (err) {
          logger.error("Failed to process rabbitmq message", err);
        }
        rabbitChannel.ack(msg);
      }
    });

    await rabbitChannel.assertQueue("notification.created", { durable: true });
    rabbitChannel.consume("notification.created", (msg) => {
      if (msg !== null) {
        try {
          const notification = JSON.parse(msg.content.toString());
          const userId = notification.userId || notification.receiverId;
          if (userId) {
            io.to(`user:${userId}`).emit("notification:new", notification);
            logger.info(`Emitted notification:new from notification.created queue to room user:${userId}`);
          }
        } catch (err) {
          logger.error("Failed to process notification.created message", err);
        }
        rabbitChannel.ack(msg);
      }
    });

    httpServer.listen(PORT, "0.0.0.0", () => {
      logger.info(`Realtime service running at http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("Failed to start realtime server:", error);
    process.exit(1);
  }
};

startServer();