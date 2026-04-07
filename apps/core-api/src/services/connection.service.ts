import { ConnectionRepository } from "../repositories/connection.repository.js";
import { AvailabilityService } from "../services/availability.service.js";

const repo = new ConnectionRepository();
const availabilityService = new AvailabilityService();

export class ConnectionService {
  // 🟢 Send request
  async sendRequest(brandId: string, influencerId: string) {
    // 1️⃣ Check duplicate
    const existing = await repo.findExisting(brandId, influencerId);

    if (existing) {
      throw new Error("Connection already exists");
    }

    // 2️⃣ Check availability
    const isAvailable =
      await availabilityService.isAvailableToday(influencerId);

    // 3️⃣ Create connection
    const connection = await repo.create({
      brandId,
      influencerId,
    });

    // 4️⃣ Return with availability info
    return {
      connection,
      isAvailable,
    };
  }

  // 🟢 Accept request
  async acceptRequest(connectionId: string) {
    const connection = await repo.findById(connectionId);

    if (!connection) {
      throw new Error("Connection not found");
    }

    if (connection.status !== "pending") {
      throw new Error("Already processed");
    }

    return repo.updateStatus(connectionId, "accepted");
  }

  // 🔴 Reject request
  async rejectRequest(connectionId: string) {
    const connection = await repo.findById(connectionId);

    if (!connection) {
      throw new Error("Connection not found");
    }

    if (connection.status !== "pending") {
      throw new Error("Already processed");
    }

    return repo.updateStatus(connectionId, "rejected");
  }

  // 🟡 Get all connections
  async getMyConnections(userId: string) {
    return repo.findMyConnections(userId);
  }
}