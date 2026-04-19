import type{ Response } from "express";

import { ConnectionService } from "../services/connection.service.js";
import type { AuthRequest } from "../middlewares/auth.middleware.js";

const service = new ConnectionService();

export class ConnectionController {
  async sendRequest(req: AuthRequest, res: Response) {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const brandId = req.user.userId;
    const { influencerId, gigId } = req.body;

    const data = await service.sendRequest(
      brandId,
      influencerId as string,
      gigId as string
    );

    res.json({
      success: true,
      message: "Connection request sent",
      data,
    });
  }

  async accept(req: AuthRequest, res: Response) {
    const id = req.params.id as string;

    const data = await service.acceptRequest(id);

    res.json({
      success: true,
      message: "Connection accepted",
      data,
    });
  }

  async reject(req: AuthRequest, res: Response) {
    const id = req.params.id as string;

    const data = await service.rejectRequest(id);

    res.json({
      success: true,
      message: "Connection rejected",
      data,
    });
  }

  async myConnections(req: AuthRequest, res: Response) {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.userId;

    const data = await service.getMyConnections(userId);

    res.json({
      success: true,
      data,
    });
  }

  async getConnectionWithReceiver(req: AuthRequest, res: Response) {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const currentUserId = req.user.userId;
    const receiverId = req.params.receiverId as string;

    const connection = await service.getConnectionBetween(currentUserId, receiverId);

    res.json({
      success: true,
      connection,
    });
  }
}