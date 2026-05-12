import { Types } from "mongoose";

import { GigRequestModel } from "../models/gig-request.model.js";

export class GigRequestRepository {
    // Create new gig request
    async create(data: {
        brandId: string;
        influencerId: string;
        gigId: string;
        note?: string | undefined;
    }) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return GigRequestModel.create(data as any);
    }

    // Find by ID
    async findById(id: string) {
        const results = await GigRequestModel.aggregate([
            { $match: { _id: new Types.ObjectId(id) } },
            {
                $lookup: {
                    from: "brandprofiles",
                    localField: "brandId",
                    foreignField: "userId",
                    as: "brandProfile",
                },
            },
            {
                $lookup: {
                    from: "influencerprofiles",
                    localField: "influencerId",
                    foreignField: "userId",
                    as: "influencerProfile",
                },
            },
            {
                $lookup: {
                    from: "gigs",
                    localField: "gigId",
                    foreignField: "_id",
                    as: "gigData",
                },
            },
            {
                $project: {
                    _id: 1,
                    brandId: 1,
                    influencerId: 1,
                    gigId: { $arrayElemAt: ["$gigData", 0] },
                    status: 1,
                    note: 1,
                    brandProfile: { $arrayElemAt: ["$brandProfile", 0] },
                    influencerProfile: { $arrayElemAt: ["$influencerProfile", 0] },
                }
            }
        ]);
        return results[0] || null;
    }

    // Check existing request (prevent duplicate per gig)
    async findExisting(brandId: string, influencerId: string, gigId: string) {
        return GigRequestModel.findOne({ brandId, influencerId, gigId });
    }

    // Update status (accept/reject)
    async updateStatus(id: string, status: "accepted" | "rejected") {
        return GigRequestModel.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );
    }

    // Get all requests for a user (brand or influencer)
    async findMyRequests(userId: string) {
        return GigRequestModel.aggregate([
            {
                $match: {
                    $or: [
                        { brandId: new Types.ObjectId(userId) },
                        { influencerId: new Types.ObjectId(userId) },
                    ],
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "brandId",
                    foreignField: "_id",
                    as: "brandUser",
                },
            },
            {
                $lookup: {
                    from: "brandprofiles",
                    localField: "brandId",
                    foreignField: "userId",
                    as: "brandProfile",
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "influencerId",
                    foreignField: "_id",
                    as: "influencerUser",
                },
            },
            {
                $lookup: {
                    from: "influencerprofiles",
                    localField: "influencerId",
                    foreignField: "userId",
                    as: "influencerProfile",
                },
            },
            {
                $lookup: {
                    from: "gigs",
                    localField: "gigId",
                    foreignField: "_id",
                    as: "gigData",
                },
            },
            {
                $project: {
                    _id: 1,
                    status: 1,
                    note: 1,
                    createdAt: 1,
                    brandId: {
                        _id: { $arrayElemAt: ["$brandUser._id", 0] },
                        fullName: { $arrayElemAt: ["$brandProfile.companyName", 0] },
                        profileImageUrl: { $arrayElemAt: ["$brandProfile.profileImageUrl", 0] },
                    },
                    influencerId: {
                        _id: { $arrayElemAt: ["$influencerUser._id", 0] },
                        fullName: { $arrayElemAt: ["$influencerProfile.fullName", 0] },
                        profileImageUrl: { $arrayElemAt: ["$influencerProfile.profileImageUrl", 0] },
                    },
                    gigId: { $arrayElemAt: ["$gigData", 0] },
                },
            },
            { $sort: { createdAt: -1 } },
        ]);
    }
}
