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
        return GigRequestModel.findById(id);
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
        return GigRequestModel.find({
            $or: [
                { brandId: userId },
                { influencerId: userId },
            ],
        })
            .populate("gigId")
            .populate("brandId", "fullName profileImageUrl")
            .populate("influencerId", "fullName profileImageUrl")
            .sort({ createdAt: -1 });
    }
}
