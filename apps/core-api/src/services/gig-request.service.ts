import { GigRequestRepository } from "../repositories/gig-request.repository.js";
import { publishEvent } from "../queue/publisher.js";
import { 
    GIG_REQUEST_CREATED_EVENT,
    GIG_REQUEST_ACCEPTED_EVENT,
    GIG_REQUEST_REJECTED_EVENT 
} from "../queue/events.js";

const repo = new GigRequestRepository();

export class GigRequestService {
    // Brand sends a gig request to an influencer
    async sendRequest(
        brandId: string,
        influencerId: string,
        gigId: string,
        note?: string
    ) {
        if (!influencerId) {
            throw new Error("influencerId is required");
        }
        if (!gigId) {
            throw new Error("gigId is required");
        }

        const existing = await repo.findExisting(brandId, influencerId, gigId);
        if (existing) {
            throw new Error("Already requested this gig.");
        }

        const gigRequest = await repo.create({
            brandId,
            influencerId,
            gigId,
            ...(note ? { note } : {}),
        }) as unknown as { _id: string };

        await publishEvent(GIG_REQUEST_CREATED_EVENT, {
            id: gigRequest._id,
            brandId,
            influencerId,
            gigId,
            note,
        });

        return { gigRequest };
    }

    // Influencer accepts — chat becomes enabled
    async acceptRequest(gigRequestId: string) {
        const request = await repo.findById(gigRequestId);

        if (!request) {
            throw new Error("Gig request not found");
        }
        if (request.status !== "pending") {
            throw new Error("Already processed");
        }

        const updated = await repo.updateStatus(gigRequestId, "accepted");
        
        if (!updated) {
            throw new Error("Failed to update gig request");
        }

        await publishEvent(GIG_REQUEST_ACCEPTED_EVENT, {
            id: request._id || gigRequestId,
            brandId: request.brandId,
            influencerId: request.influencerId,
            gigId: request.gigId,
        });

        return updated;
    }

    // Influencer rejects the request
    async rejectRequest(gigRequestId: string) {
        const request = await repo.findById(gigRequestId);

        if (!request) {
            throw new Error("Gig request not found");
        }
        if (request.status !== "pending") {
            throw new Error("Already processed");
        }

        const updated = await repo.updateStatus(gigRequestId, "rejected");

        if (!updated) {
            throw new Error("Failed to update gig request");
        }

        await publishEvent(GIG_REQUEST_REJECTED_EVENT, {
            id: request._id || gigRequestId,
            brandId: request.brandId,
            influencerId: request.influencerId,
            gigId: request.gigId,
        });

        return updated;
    }

    // Get a single request by ID
    async getById(id: string) {
        return repo.findById(id);
    }

    // Get all requests for the calling user (brand or influencer)
    async getMyRequests(userId: string) {
        return repo.findMyRequests(userId);
    }

    // Find existing request between brand + influencer for a gig
    async getRequestBetween(brandId: string, influencerId: string, gigId: string) {
        return repo.findExisting(brandId, influencerId, gigId);
    }
}
