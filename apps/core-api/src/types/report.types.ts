import { type Document, Types } from "mongoose";

export interface AuditTrailEntry {
    action: string;
    performedBy: Types.ObjectId;
    createdAt: Date;
}

export interface ReportDocument extends Document {
    reportId: string;
    entityType: "GIG" | "ORDER" | "USER";
    entityId: Types.ObjectId;
    type: "CONTENT" | "PAYMENT" | "BEHAVIOR";
    subType?: "NOT_RECEIVED" | "LOW_QUALITY" | "SCAM" | "PAYMENT_ISSUE";
    reportedBy: Types.ObjectId;
    usersInvolved: Types.ObjectId[];
    description?: string;
    status: "PENDING" | "UNDER_REVIEW" | "RESOLVED";
    resolution?: "VALID" | "INVALID";
    adminNotes?: string;
    auditTrail: AuditTrailEntry[];
    createdAt: Date;
    updatedAt: Date;
}
