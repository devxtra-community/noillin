import { Types } from "mongoose";

import { MessageModel } from "../models/chat.model.js";

export const findMessagesByConversation = async (
  conversationId: string
) => {
  return MessageModel.find({ conversationId })
    .sort({ createdAt: 1 })
    .lean();
};

export const aggregateConversations = async (userId: string) => {
  const userObjectId = new Types.ObjectId(userId);

  return MessageModel.aggregate([
    {
      $match: {
        $or: [
          { senderId: userObjectId },
          { receiverId: userObjectId }
        ]
      }
    },
    { $sort: { createdAt: -1 } },

    {
      $group: {
        _id: "$conversationId",
        lastMessage: { $first: "$content" },
        lastMessageTime: { $first: "$createdAt" },
        senderId: { $first: "$senderId" },
        receiverId: { $first: "$receiverId" },

        unreadCount: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ["$receiverId", userObjectId] },
                  { $eq: ["$status", "SENT"] }
                ]
              },
              1,
              0
            ]
          }
        }
      }
    },

    {
      $addFields: {
        otherUserId: {
          $cond: [
            { $eq: ["$senderId", userObjectId] },
            "$receiverId",
            "$senderId"
          ]
        }
      }
    },

    {
      $lookup: {
        from: "users",
        localField: "otherUserId",
        foreignField: "_id",
        as: "user"
      }
    },
    { $unwind: "$user" },

    {
      $lookup: {
        from: "influencerprofiles",
        let: { uid: "$user._id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$userId", "$$uid"] }
            }
          }
        ],
        as: "influencerProfile"
      }
    },
    {
      $lookup: {
        from: "brandprofiles",
        let: { uid: "$user._id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$userId", "$$uid"] }
            }
          }
        ],
        as: "brandProfile"
      }
    },

    {
      $addFields: {
        name: {
          $cond: [
            { $eq: ["$user.role", "INFLUENCER"] },
            { $arrayElemAt: ["$influencerProfile.fullName", 0] },
            { $arrayElemAt: ["$brandProfile.contactPersonName", 0] }
          ]
        },
        profileImage: {
          $cond: [
            { $eq: ["$user.role", "INFLUENCER"] },
            { $arrayElemAt: ["$influencerProfile.profileImageUrl", 0] },
            null
          ]
        }
      }
    },

    {
      $project: {
        _id: 1,
        lastMessage: 1,
        lastMessageTime: 1,
        unreadCount: 1,
        user: {
          _id: "$user._id",
          name: { $ifNull: ["$name", "Unknown"] },
          role: "$user.role",
          profileImage: "$profileImage"
        }
      }
    }
  ]);
};