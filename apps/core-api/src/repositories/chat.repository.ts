import { Types } from "mongoose";

import { MessageModel } from "../models/chat.model.js";

// 🟢 Get messages by conversationId
export const findMessagesByConversation = async (
  conversationId: Types.ObjectId
) => {
  return MessageModel.find({
    conversationId: new Types.ObjectId(conversationId), // 🔥 ensure correct type
  })
    .sort({ createdAt: 1 })
    .lean();
};

// 🔵 Add new message
export const addMessage = async (data: {
    conversationId: Types.ObjectId;
    senderId: string;
    receiverId: string;
    content: string;
    status: string;
}) => {
    return MessageModel.create(data);
};

// 🟡 Get conversation list (sidebar)
export const aggregateConversations = async (userId: string) => {
  const userObjectId = new Types.ObjectId(userId);

  return MessageModel.aggregate([
    {
      $match: {
        $or: [
          { senderId: userObjectId },
          { receiverId: userObjectId },
        ],
      },
    },

    { $sort: { createdAt: -1 } },

    {
      $group: {
        _id: "$conversationId", // 🔥 now ObjectId (correct)

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
                  { $eq: ["$status", "SENT"] },
                ],
              },
              1,
              0,
            ],
          },
        },
      },
    },

    // 🔥 Determine other user
    {
      $addFields: {
        otherUserId: {
          $cond: [
            { $eq: ["$senderId", userObjectId] },
            "$receiverId",
            "$senderId",
          ],
        },
      },
    },

    // 🔥 Join user
    {
      $lookup: {
        from: "users",
        localField: "otherUserId",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },

    // 🔥 Influencer profile
    {
      $lookup: {
        from: "influencerprofiles",
        let: { uid: "$user._id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$userId", "$$uid"] },
            },
          },
        ],
        as: "influencerProfile",
      },
    },

    // 🔥 Brand profile
    {
      $lookup: {
        from: "brandprofiles",
        let: { uid: "$user._id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$userId", "$$uid"] },
            },
          },
        ],
        as: "brandProfile",
      },
    },

    // 🔥 Name + image logic
    {
      $addFields: {
        name: {
          $cond: [
            { $eq: ["$user.role", "INFLUENCER"] },
            { $arrayElemAt: ["$influencerProfile.fullName", 0] },
            { $arrayElemAt: ["$brandProfile.contactPersonName", 0] },
          ],
        },
        profileImage: {
          $cond: [
            { $eq: ["$user.role", "INFLUENCER"] },
            { $arrayElemAt: ["$influencerProfile.profileImageUrl", 0] },
            null,
          ],
        },
      },
    },

    // 🔥 Final output
    {
      $project: {
        _id: 1, // conversationId
        lastMessage: 1,
        lastMessageTime: 1,
        unreadCount: 1,

        user: {
          _id: "$user._id",
          name: { $ifNull: ["$name", "Unknown"] },
          role: "$user.role",
          profileImage: "$profileImage",
        },
      },
    },
  ]);
};