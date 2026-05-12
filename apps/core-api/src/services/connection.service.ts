import mongoose from "mongoose";

import { ConnectionRepository } from "../repositories/connection.repository.js";
import { AvailabilityService } from "../services/availability.service.js";
import { MessageModel } from "../models/chat.model.js";
import { GigModel } from "../models/gig.model.js";
import { publishEvent } from "../queue/publisher.js";
import { GIG_REQUEST_CREATED_EVENT } from "../queue/events.js";
import { logger } from "../utils/logger.js";

const repo = new ConnectionRepository();
const availabilityService = new AvailabilityService();

export class ConnectionService {
  //  Send request
  async sendRequest(brandId: string, influencerId: string, gigId?: string, note?: string) {
    if (!influencerId) {
      throw new Error("influencerId is required");
    }

    if (brandId === influencerId) {
      throw new Error("You cannot request your own gig");
    }

    const existing = await repo.findExisting(brandId, influencerId, gigId);

    if (existing) {
      throw new Error("Already requested this gig.");
    }

    const isAvailable =
      await availabilityService.isAvailableToday(influencerId);

    const connection = (await repo.create({
      brandId,
      influencerId,
      gigId,
      note,
    })) as unknown as { _id: string };

    await this.sendAutoBookingMessages(brandId, influencerId, connection._id.toString(), gigId, note);

    publishEvent(GIG_REQUEST_CREATED_EVENT, {
      id: connection._id,
      brandId,
      influencerId,
      gigId,
      note,
    }).catch((err) => logger.error(`Failed to publish gig_request.created: ${err}`));

    return {
      connection,
      isAvailable,
    };
  }

  //  Helper for auto-messages
  private async sendAutoBookingMessages(brandId: string, influencerId: string, connectionId: string, gigId?: string, note?: string) {
    let gigTitle = "your service";
    if (gigId && mongoose.Types.ObjectId.isValid(gigId)) {
      const gig = await GigModel.findById(gigId);
      if (gig) gigTitle = gig.title;
    } else if (gigId) {
      console.warn("Invalid gigId for auto-messages:", gigId);
    }

    // 1. User Message (Intent)
    let content = `Hi, I'd like to book your "${gigTitle}".`;
    if (note) {
      content += `\n\nNote from brand: ${note}`;
    }

    await MessageModel.create({
      gigRequestId: new mongoose.Types.ObjectId(connectionId),
      senderId: brandId,
      receiverId: influencerId,
      content,
      status: "SENT",
    });

    // 2. Status Message
    await MessageModel.create({
      gigRequestId: new mongoose.Types.ObjectId(connectionId),
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
    await publishEvent("gig_request.accepted", {
    id: connectionId,
    brandId: connection.brandId,
    influencerId: connection.influencerId,
  });
    await MessageModel.create({
      gigRequestId: new mongoose.Types.ObjectId(connectionId),
      senderId: connection.influencerId,
      receiverId: connection.brandId,
      content: "✅ Influencer accepted the request",
      status: "SENT",
    });

    //  CONVERSATION ALREADY CREATED ON REQUEST
    return updatedConnection;
  }

  async rejectRequest(connectionId: string) {
  const connection = await repo.findById(connectionId);

  if (!connection) {
    throw new Error("Connection not found");
  }

  if (connection.status !== "pending") {
    throw new Error("Already processed");
  }

  const updatedConnection = await repo.updateStatus(
    connectionId,
    "rejected"
  );

  if (!updatedConnection) {
    throw new Error("Failed to update connection");
  }

  // ✅ Publish AFTER update
  await publishEvent("gig_request.rejected", {
    id: connectionId,
    brandId: connection.brandId,
    influencerId: connection.influencerId,
  });

  return updatedConnection;
}
  // //  Reject request
  // async rejectRequest(connectionId: string) {
  //   const connection = await repo.findById(connectionId);

  //   if (!connection) {
  //     throw new Error("Connection not found");
  //   }

  //   if (connection.status !== "pending") {
  //     throw new Error("Already processed");
  //   }

  //   return repo.updateStatus(connectionId, "rejected");
  // }

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
  async getMyConnections(userId: string, role?: string) {
    return repo.findMyConnections(userId, role);
  }
}