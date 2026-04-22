import mongoose from "mongoose";

import { ConnectionRepository } from "../repositories/connection.repository.js";
import { AvailabilityService } from "../services/availability.service.js";
import { MessageModel } from "../models/chat.model.js";
import { GigModel } from "../models/gig.model.js";

const repo = new ConnectionRepository();
const availabilityService = new AvailabilityService();

export class ConnectionService {
  //  Send request
  async sendRequest(brandId: string, influencerId: string, gigId?: string) {
      if (!influencerId) {
        throw new Error("influencerId is required");
      }

      const existing = await repo.findExisting(brandId, influencerId, gigId);

      if (existing) {
        return {
          connection: existing,
        };
      }

      const isAvailable =
        await availabilityService.isAvailableToday(influencerId);

      const connection = (await repo.create({
        brandId,
        influencerId,
        gigId,
      })) as unknown as { _id: string };

      await this.sendAutoBookingMessages(brandId, influencerId, connection._id.toString(), gigId);

        return {
          connection,
          isAvailable,
        };
  }

  //  Helper for auto-messages
  private async sendAutoBookingMessages(brandId: string, influencerId: string, connectionId: string, gigId?: string) {
    let gigTitle = "your service";
    if (gigId && mongoose.Types.ObjectId.isValid(gigId)) {
      const gig = await GigModel.findById(gigId);
      if (gig) gigTitle = gig.title;
    } else if (gigId) {
       console.warn("Invalid gigId for auto-messages:", gigId);
    }

    // 1. User Message (Intent)
    await MessageModel.create({
      connectionId: new mongoose.Types.ObjectId(connectionId),
      senderId: brandId,
      receiverId: influencerId,
      content: `Hi, I'd like to book your "${gigTitle}".`,
      status: "SENT",
    });

    // 2. Status Message
    await MessageModel.create({
      connectionId: new mongoose.Types.ObjectId(connectionId),
      senderId: brandId,
      receiverId: influencerId,
      content: `📌 New Booking Request for: ${gigTitle}`,
      status: "SENT",
    });
  }

  //  Accept request + CREATE CHAT
  async acceptRequest(connectionId: string) {
  const connection = await repo.findById(connectionId);

  if (!connection) {
    throw new Error("Connection not found");
  }

  if (connection.status !== "pending") {
    throw new Error("Already processed");
  }

  const updatedConnection = await repo.updateStatus(
    connectionId,
    "accepted"
  );

  //  FIX: handle possible null
  if (!updatedConnection) {
    throw new Error("Failed to update connection");
  }

  //  CONVERSATION ALREADY CREATED ON REQUEST
  return updatedConnection;
}
  //  Reject request
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

  //  Get connection by ID
  async getConnectionById(id: string) {
    return repo.findById(id);
  }

  //  Get connection between two users
  async getConnectionBetween(u1: string, u2: string, gigId?: string) {
    const c1 = await repo.findExisting(u1, u2, gigId);
    if (c1) return c1;
    return repo.findExisting(u2, u1, gigId);
  }

  // Get connections
  async getMyConnections(userId: string) {
    return repo.findMyConnections(userId);
  }
}