import { Types } from "mongoose";

export interface OrderDocument {
    _id: Types.ObjectId;
    buyerId: Types.ObjectId;
    influencerId: Types.ObjectId;
    gigId: Types.ObjectId;
    connectionId: Types.ObjectId;
    dueDate?: Date;

    amount: number;
    currency: string;

    status: "PENDING" | "IN_ESCROW" | "COMPLETED" | "CANCELLED" | "DISPUTED";
    escrowStatus: "HOLD" | "RELEASED";
    workStatus: "NOT_STARTED" | "SUBMITTED" | "APPROVED";

    stripePaymentIntentId?: string;
    platformFee?: number;
    influencerAmount?: number;

    payoutStatus: "HOLD" | "AVAILABLE" | "PROCESSING" | "PAID";
    availableAt?: Date;
    withdrawRequestedAt?: Date;
    releaseAt?: Date;
    stripePayoutId?: string;

    createdAt: Date;
    updatedAt: Date;
}
