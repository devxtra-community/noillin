import { createServer } from "http";

import express from "express";
import { Server } from "socket.io";

import { httpLogger } from "./middlewares/httpLogger";
import { logger } from "./utils/logger";
import { errorHandler, notFound } from "./middlewares/errorHandler";

const app = express();
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

  socket.on("disconnect", () => {
    logger.info("Socket disconnected:", socket.id);
  });
});
app.use(notFound)
app.use(errorHandler)
const PORT = Number(process.env.PORT) || 6001;
httpServer.listen(PORT, "127.0.0.1",() => {
  logger.info(`Realtime service running at http://localhost:${PORT}`);
});
