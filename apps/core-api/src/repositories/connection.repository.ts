import { ConnectionModel } from "../models/connection.model.js";

export class ConnectionRepository {
  // Create new connection
  async create(data: {
    brandId: string;
    influencerId: string;
    gigId?: string | undefined;
    note?: string | undefined;
  }) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return ConnectionModel.create(data as any);
  }

  // Find by ID
  async findById(id: string) {
    return ConnectionModel.findById(id);
  }

  // Check existing connection (prevent duplicate)
  async findExisting(brandId: string, influencerId: string, gigId?: string) {
    const query: { brandId: string; influencerId: string; gigId?: string } = { brandId, influencerId };
    if (gigId) {
      query.gigId = gigId;
    }
    return ConnectionModel.findOne(query);
  }

  // Update status (accept/reject)
  async updateStatus(id: string, status: string) {
    return ConnectionModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
  }

  // Get all connections for user
  async findMyConnections(userId: string, role?: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = {};
    if (role === "brand") {
      filter.brandId = userId;
    } else if (role === "influencer") {
      filter.influencerId = userId;
    } else {
      filter.$or = [
        { brandId: userId },
        { influencerId: userId },
      ];
    }

    return ConnectionModel.find(filter)
      .populate("gigId")
      .populate("brandId", "fullName profileImageUrl")
      .populate("influencerId", "fullName profileImageUrl")
      .sort({ createdAt: -1 });
  }
}