import http from "http";

import dotenv from "dotenv"

dotenv.config()
import { createServer } from "http";

import express from "express";
import cors from "cors";
import { Server } from "socket.io";

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

    httpServer.listen(PORT, "0.0.0.0", () => {
      logger.info(`Realtime service running at http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("Failed to start realtime server:", error);
    process.exit(1);
  }
};

startServer();