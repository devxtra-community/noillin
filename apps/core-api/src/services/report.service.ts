import { Types } from "mongoose";

import { ReportModel } from "../models/report.model.js";
import { GigModel } from "../models/gig.model.js";
import { OrderModel } from "../models/order.model.js";
import type { JwtPayload } from "../modules/auth/auth.utils.js";

export const createReportService = async (
    user: JwtPayload,
    data: {
        entityType: "GIG" | "ORDER" | "USER";
        entityId: string;
        type: "CONTENT" | "PAYMENT" | "BEHAVIOR";
        subType?: "NOT_RECEIVED" | "LOW_QUALITY" | "SCAM" | "PAYMENT_ISSUE";
        description?: string;
    }
) => {
    const reportId = `REP-${Date.now()}`;

    let usersInvolved: Types.ObjectId[] = [];

    if (data.entityType === "ORDER") {
        const order = await OrderModel.findById(data.entityId);

        if (!order) {
            throw new Error("Order not found");
        }

        const userId = user.userId.toString();

        if (
            order.buyerId.toString() !== userId &&
            order.influencerId.toString() !== userId
        ) {
            throw new Error("Not allowed to report this order");
        }

        const existingReport = await ReportModel.findOne({
            entityType: "ORDER",
            entityId: data.entityId,
            reportedBy: user.userId
        });

        if (existingReport) {
            throw new Error("You already reported this order");
        }

        if (data.type !== "PAYMENT") {
            throw new Error("Invalid report type for order");
        }

        if (!data.description) {
            throw new Error("Description is required for payment reports");
        }

        usersInvolved = [
            order.buyerId,
            order.influencerId
        ];
    }

    if (data.entityType === "GIG") {
        const gig = await GigModel.findById(data.entityId);

        if (!gig) {
            throw new Error("Gig not found");
        }

        usersInvolved = [
            gig.primaryInfluencerId
        ];

        if (gig.primaryInfluencerId.toString() === user.userId) {
            throw new Error("You cannot report your own gig");
        }
    }

    const report = await ReportModel.create({
        reportId,
        entityType: data.entityType,
        entityId: new Types.ObjectId(data.entityId),
        type: data.type,
        reportedBy: new Types.ObjectId(user.userId),
        usersInvolved,
        ...(data.subType && { subType: data.subType }),
        ...(data.description && { description: data.description }),
        auditTrail: [
            {
                action: "REPORT_CREATED",
                performedBy: new Types.ObjectId(user.userId)
            }
        ]
    });

    if (data.entityType === "GIG") {
        await GigModel.updateOne(
            { _id: data.entityId },
            { $inc: { reportCount: 1 } },

        );

        const updatedGig = await GigModel.findById(data.entityId);

        if (
            updatedGig &&
            updatedGig.reportCount >= 3 &&
            updatedGig.status === "published"
        ) {
            await GigModel.updateOne(
                { _id: data.entityId },
                { $set: { status: "flagged" } }
            );
        }
    }

    return report;
};