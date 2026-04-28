import type { Response } from "express";

import { GigRequestService } from "../services/gig-request.service.js";
import type { AuthRequest } from "../middlewares/auth.middleware.js";

const service = new GigRequestService();

export class GigRequestController {
    // Brand sends a gig request
    async sendRequest(req: AuthRequest, res: Response) {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const brandId = req.user.userId;
        const { influencerId, gigId, note } = req.body;

        if (!gigId) {
            return res.status(400).json({ success: false, message: "gigId is required" });
        }

        try {
            const data = await service.sendRequest(
                brandId,
                influencerId as string,
                gigId as string,
                note as string | undefined
            );

            return res.status(201).json({
                success: true,
                message: "Gig request sent",
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

    // Influencer accepts a request
    async accept(req: AuthRequest, res: Response) {
        try {
            const id = req.params.id as string;
            const data = await service.acceptRequest(id);
            return res.json({ success: true, message: "Gig request accepted", data });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    // Influencer rejects a request
    async reject(req: AuthRequest, res: Response) {
        try {
            const id = req.params.id as string;
            const data = await service.rejectRequest(id);
            return res.json({ success: true, message: "Gig request rejected", data });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    // Get all requests for the calling user
    async myRequests(req: AuthRequest, res: Response) {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const userId = req.user.userId;
        const data = await service.getMyRequests(userId);

        return res.json({ success: true, data });
    }

    // Get a single request by ID
    async getById(req: AuthRequest, res: Response) {
        const id = req.params.id as string;
        const gigRequest = await service.getById(id);
        return res.json({ success: true, gigRequest });
    }
}
