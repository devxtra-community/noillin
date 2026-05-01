import { Types } from "mongoose";

import { MessageModel } from "../models/chat.model.js";

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
}) => {
  return MessageModel.create(data);
};

//  Get conversation list (sidebar) — only shows accepted gig request chats
export const aggregateConversations = async (userId: string, role?: string) => {
  const userObjectId = new Types.ObjectId(userId);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pipeline: any[] = [
    {
      $match: {
        gigRequestId: { $exists: true, $ne: null },
        $or: [
          { senderId: userObjectId },
          { receiverId: userObjectId },
        ],
      },
    },

    { $sort: { createdAt: -1 } },

    {
      $group: {
        _id: "$gigRequestId", // Group by gigRequestId

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

    //  Determine other user
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

    //  Join other user
    {
      $lookup: {
        from: "users",
        localField: "otherUserId",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },

    //  Influencer profile
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

    //  Brand profile
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

    //  Name + image logic
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

    //  Lookup gig request to get gigId
    {
      $lookup: {
        from: "gigrequests",
        localField: "_id",
        foreignField: "_id",
        as: "gigRequest",
      },
    },
    { $unwind: "$gigRequest" },
  ];

  if (role === "brand") {
    pipeline.push({ $match: { "gigRequest.brandId": userObjectId } });
  } else if (role === "influencer") {
    pipeline.push({ $match: { "gigRequest.influencerId": userObjectId } });
  }

  pipeline.push(
    //  Lookup gig details
    {
      $lookup: {
        from: "gigs",
        localField: "gigRequest.gigId",
        foreignField: "_id",
        as: "gig",
      },
    },
    { $unwind: { path: "$gig", preserveNullAndEmptyArrays: true } },

    //  Final output
    {
      $project: {
        _id: 1, // gigRequestId
        gigRequestId: "$_id",
        lastMessage: 1,
        lastMessageTime: 1,
        unreadCount: 1,
        gigTitle: { $ifNull: ["$gig.title", "Unknown Gig"] },

        user: {
          _id: "$user._id",
          name: { $ifNull: ["$name", "Unknown"] },
          role: "$user.role",
          profileImage: "$profileImage",
        },
      },
    }
  );

  return MessageModel.aggregate(pipeline);
};