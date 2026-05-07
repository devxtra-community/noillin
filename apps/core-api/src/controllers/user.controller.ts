import type { Response } from "express";

import { MessageModel } from "../models/chat.model.js";
import { GigRequestModel } from "../models/gig-request.model.js";
import type { AuthRequest } from "../middlewares/auth.middleware.js";

export const getDashboardCounts = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const userId = req.user.userId;

  try {
    // 1. Unread messages count
    const unreadMessagesCount = await MessageModel.countDocuments({
      receiverId: userId,
      status: { $ne: "READ" },
    });

    // 2. Pending requests count
    // For Influencers: Incoming requests from Brands
    // For Brands: Outgoing requests to Influencers (though usually we show incoming to influencers)
    // The user said "both influencer and brand on sidebar message or booking count indication"
    // Let's count pending requests where the user is either brand or influencer
    const pendingRequestsCount = await GigRequestModel.countDocuments({
      $or: [{ brandId: userId }, { influencerId: userId }],
      status: "pending",
    });

    res.json({
      success: true,
      data: {
        unreadMessagesCount,
        pendingRequestsCount,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard counts:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
