import { Types, type PipelineStage } from "mongoose";

import { MessageModel } from "../models/chat.model.js";
import { GigRequestModel } from "../models/gig-request.model.js";

//  Get messages by gigRequestId
export const findMessagesByGigRequest = async (
  gigRequestId: Types.ObjectId
) => {
  return MessageModel.find({
    gigRequestId: new Types.ObjectId(gigRequestId),
  })
    .sort({ createdAt: 1 })
    .lean();
};

//  Add new message
export const addMessage = async (data: {
  gigRequestId: Types.ObjectId;
  senderId: string;
  receiverId: string;
  content: string;
  status: string;
  messageType?: string;
  proposalData?: Record<string, unknown>;
  deliverableData?: Record<string, unknown>;
}) => {
  return MessageModel.create(data);
};

//  Get conversation list (sidebar)
export const aggregateConversations = async (userId: string, role?: string) => {
  const userObjectId = new Types.ObjectId(userId);

  // Matches for pipeline match stage
  const pipeline: PipelineStage[] = [];

  // Match active gig requests based on role
  const matchRoles: Record<string, unknown>[] = [];
  if (role === "brand") {
    matchRoles.push({ brandId: userObjectId });
  } else if (role === "influencer") {
    matchRoles.push({ influencerId: userObjectId });
  } else {
    matchRoles.push({ brandId: userObjectId });
    matchRoles.push({ influencerId: userObjectId });
  }

  pipeline.push({
    $match: {
      $or: matchRoles
    }
  });

  // Determine other user's ID
  pipeline.push({
    $addFields: {
      otherUserId: {
        $cond: [
          { $eq: ["$brandId", userObjectId] },
          "$influencerId",
          "$brandId",
        ],
      },
    },
  });

  // Join User
  pipeline.push({
    $lookup: {
      from: "users",
      localField: "otherUserId",
      foreignField: "_id",
      as: "user",
    },
  });
  pipeline.push({ $unwind: "$user" });

  // Look up profiles based on role
  pipeline.push({
    $lookup: {
      from: "influencerprofiles",
      let: { uid: "$user._id" },
      pipeline: [{ $match: { $expr: { $eq: ["$userId", "$$uid"] } } }],
      as: "influencerProfile",
    },
  });
  pipeline.push({
    $lookup: {
      from: "brandprofiles",
      let: { uid: "$user._id" },
      pipeline: [{ $match: { $expr: { $eq: ["$userId", "$$uid"] } } }],
      as: "brandProfile",
    },
  });

  // Resolve name and image
  pipeline.push({
    $addFields: {
      name: {
        $cond: [
          { $eq: ["$user.role", "INFLUENCER"] },
          { $ifNull: [{ $arrayElemAt: ["$influencerProfile.fullName", 0] }, { $arrayElemAt: ["$influencerProfile.username", 0] }] },
          { $ifNull: [{ $arrayElemAt: ["$brandProfile.companyName", 0] }, { $arrayElemAt: ["$brandProfile.contactPersonName", 0] }] },
        ],
      },
      profileImage: {
        $cond: [
          { $eq: ["$user.role", "INFLUENCER"] },
          { $arrayElemAt: ["$influencerProfile.profileImageUrl", 0] },
          { $arrayElemAt: ["$brandProfile.profileImageUrl", 0] },
        ],
      },
    },
  });

  // Look up gig details
  pipeline.push({
    $lookup: {
      from: "gigs",
      localField: "gigId",
      foreignField: "_id",
      as: "gig",
    },
  });
  pipeline.push({ $unwind: { path: "$gig", preserveNullAndEmptyArrays: true } });

  // Merge legacy "connectionId" field for messages since connection was renamed to gigRequest
  pipeline.push({
    $lookup: {
      from: "messages",
      let: { reqId: "$_id" },
      pipeline: [
        {
          $match: {
            $expr: {
              $or: [
                { $eq: ["$gigRequestId", "$$reqId"] },
                { $eq: ["$connectionId", "$$reqId"] }
              ]
            }
          }
        },
        { $sort: { createdAt: -1 } }
      ],
      as: "messages",
    },
  });

  // Parse out the last message and unread count
  pipeline.push({
    $addFields: {
      lastMessageDoc: { $arrayElemAt: ["$messages", 0] },
      unreadCount: {
        $size: {
          $filter: {
            input: "$messages",
            as: "msg",
            cond: {
              $and: [
                { $eq: ["$$msg.receiverId", userObjectId] },
                { $eq: ["$$msg.status", "SENT"] }
              ]
            }
          }
        }
      }
    }
  });

  // Final Output Formatting
  pipeline.push({
    $project: {
      _id: 1,
      gigRequestId: "$_id",
      lastMessage: { $ifNull: ["$lastMessageDoc.content", "No messages yet"] },
      lastMessageTime: { $ifNull: ["$lastMessageDoc.createdAt", "$updatedAt"] },
      unreadCount: 1,
      gigTitle: { $ifNull: ["$gig.title", "Unknown Gig"] },
      user: {
        _id: "$user._id",
        name: { $ifNull: ["$name", "Unknown"] },
        role: "$user.role",
        profileImage: "$profileImage",
      },
    },
  });

  pipeline.push({ $sort: { lastMessageTime: -1 } });

  return GigRequestModel.aggregate(pipeline);
};