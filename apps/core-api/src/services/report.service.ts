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


export const updateReportStatusService = async (
  adminId: string,
  reportId: string
) => {
  const report = await ReportModel.findById(reportId);

  if (!report) {
    throw new Error("Report not found");
  }

  //  Prevent invalid transitions
  if (report.status === "RESOLVED") {
    throw new Error("Cannot update a resolved report");
  }

  if (report.status !== "PENDING") {
    throw new Error("Only PENDING reports can move to UNDER_REVIEW");
  }

  // Update status
  report.status = "UNDER_REVIEW";

  //Audit trail
  report.auditTrail.push({
    action: "STATUS_UPDATED_TO_UNDER_REVIEW",
    performedBy: new Types.ObjectId(adminId),
    createdAt: new Date()
  });

  await report.save();

  return report;
};

//===================RESOLVE REPORT SERVICE===================

export const resolveReportService = async (
  adminId: string,
  reportId: string,
  resolution: "VALID" | "INVALID",
  adminNotes?: string
) => {
  const report = await ReportModel.findById(reportId);

  if (!report) {
    throw new Error("Report not found");
  }

  // ❗ Only allow proper flow
  if (report.status !== "UNDER_REVIEW") {
    throw new Error("Report must be UNDER_REVIEW to resolve");
  }

  // ❗ Validate resolution input
  if (!["VALID", "INVALID"].includes(resolution)) {
    throw new Error("Invalid resolution type");
  }

  // ✅ Apply resolution
  report.resolution = resolution;
  report.status = "RESOLVED";
  if (adminNotes) report.adminNotes = adminNotes;

  // =========================
  // 🔥 ENTITY EFFECTS
  // =========================

  if (report.entityType === "GIG") {
    const gig = await GigModel.findById(report.entityId);

    if (!gig) throw new Error("Gig not found");

    if (resolution === "VALID") {
      // Keep flagged (or enforce flag)
      if (gig.status !== "flagged") {
        gig.status = "flagged";
      }
    }

    if (resolution === "INVALID") {
      // Restore gig
      gig.status = "published";

      // Optional: reduce report count
      gig.reportCount = Math.max(0, gig.reportCount - 1);
    }

    await gig.save();
  }

  if (report.entityType === "ORDER") {
    if (resolution === "VALID") {
      const order = await OrderModel.findById(report.entityId);

      if (!order) throw new Error("Order not found");

      order.status = "DISPUTED";
      await order.save();
    }
  }

  // =========================
  // 📜 AUDIT TRAIL
  // =========================

  report.auditTrail.push({
    action: `RESOLVED_${resolution}`,
    performedBy: new Types.ObjectId(adminId),
    createdAt: new Date()
  });

  await report.save();

  return report;
};


//=============GET REPORTS SERVICE =============

export const getReportsService = async (filters: {
  status?: string;
  entityType?: string;
}) => {
  const query: { status?: string; entityType?: string } = {};

  // ✅ Filter by status
  if (filters.status) {
    query.status = filters.status;
  }

  // ✅ Filter by entity type
  if (filters.entityType) {
    query.entityType = filters.entityType;
  }

  const reports = await ReportModel.find(query)
    .sort({ createdAt: -1 })
    .populate("reportedBy", "name email")
    .populate("usersInvolved", "name email")
    .lean();

  return reports;
};

//=====================GET REPORT BY ID====================

export const getReportByIdService = async (reportId: string) => {
  const report = await ReportModel.findById(reportId)
    .populate("reportedBy", "name email")
    .populate("usersInvolved", "name email")
    .lean();

  if (!report) {
    throw new Error("Report not found");
  }

  let entityDetails: unknown = null;

  // 🔍 Attach entity info (this is the key upgrade)
  if (report.entityType === "GIG") {
    const gig = await GigModel.findById(report.entityId)
      .select("title status reportCount primaryInfluencerId")
      .populate("primaryInfluencerId", "name email")
      .lean();

    entityDetails = gig;
  }

  if (report.entityType === "ORDER") {
    const order = await OrderModel.findById(report.entityId)
      .select("status buyerId influencerId")
      .populate("buyerId", "name email")
      .populate("influencerId", "name email")
      .lean();

    entityDetails = order;
  }

  return {
    ...report,
    entityDetails
  };
};