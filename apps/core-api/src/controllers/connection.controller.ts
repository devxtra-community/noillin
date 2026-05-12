import type { Response } from "express";

import { ConnectionService } from "../services/connection.service.js";
import type { AuthRequest } from "../middlewares/auth.middleware.js";

const service = new ConnectionService();

export class ConnectionController {
  async sendRequest(req: AuthRequest, res: Response) {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const brandId = req.user.userId;
    const { influencerId, gigId, note } = req.body;

    try {
      const data = await service.sendRequest(
        brandId,
        influencerId as string,
        gigId as string,
        note as string
      );

      res.json({
        success: true,
        message: "Connection request sent",
        data,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.message === "Already requested this gig.") {
        return res.status(400).json({ success: false, message: error.message });
      }
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
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
    const role = (req.query.role as string) || undefined;

    const data = await service.getMyConnections(userId, role);

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
    const gigId = req.query.gigId as string;

    const connection = await service.getConnectionBetween(currentUserId, receiverId, gigId);

    res.json({
      success: true,
      connection,
    });
  }

  async getById(req: AuthRequest, res: Response) {
    const id = req.params.id as string;
    const connection = await service.getConnectionById(id);

    res.json({
      success: true,
      connection,
    });
  }
}