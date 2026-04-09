import { ConnectionModel } from "../models/connection.model.js";

export class ConnectionRepository {
  // Create new connection
  async create(data: {
    brandId: string;
    influencerId: string;
  }) {
    return ConnectionModel.create(data);
  }

  // Find by ID
  async findById(id: string) {
    return ConnectionModel.findById(id);
  }

  // Check existing connection (prevent duplicate)
  async findExisting(brandId: string, influencerId: string) {
    return ConnectionModel.findOne({
      brandId,
      influencerId,
    });
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
  async findMyConnections(userId: string) {
    return ConnectionModel.find({
      $or: [
        { brandId: userId },
        { influencerId: userId },
      ],
    }).sort({ createdAt: -1 });
  }
}