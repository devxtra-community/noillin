import mongoose from "mongoose";

import { User } from "../models/user.model.js";
import { GigModel } from "../models/gig.model.js";
import { OrderModel } from "../models/order.model.js";
import { ReportModel } from "../models/report.model.js";

interface IPopulatedUser {
    _id: mongoose.Types.ObjectId;
    displayName: string;
    email: string;
    profileImage?: string;
}

export const getRecentActivityService = async (limit: number = 10) => {
    const fetchLimit = Math.ceil(limit / 2) + 2; // Fetch slightly more to ensure we get enough after sorting

    // Fetch recent entities
    const [users, gigs, orders] = await Promise.all([
        User.find().sort({ createdAt: -1 }).limit(fetchLimit),
        GigModel.find().populate("primaryInfluencerId", "displayName profileImage").sort({ createdAt: -1 }).limit(fetchLimit),
        OrderModel.find().sort({ createdAt: -1 }).limit(fetchLimit),
    ]);

    // Map to a common activity format
    const activities = [
        ...users.map(u => ({
            id: u._id,
            type: "signup",
            title: "New Signup",
            entityName: u.email,
            createdAt: u.createdAt as Date,
            status: u.status,
            icon: "👤"
        })),
        ...gigs.map(g => ({
            id: g._id,
            type: "gig",
            title: "New Gig Published",
            entityName: g.title,
            createdAt: g.createdAt as Date,
            status: g.status,
            icon: "🎬"
        })),
        ...orders.map(o => ({
            id: o._id,
            type: "booking",
            title: "New Booking",
            entityName: `Booking #${o._id.toString().slice(-6).toUpperCase()}`,
            createdAt: o.createdAt as Date,
            status: o.status,
            icon: "💰"
        }))
    ];

    // Sort by date and take top 10
    return activities
        .sort((a, b) => {
            const dateA = a.createdAt instanceof Date ? a.createdAt.getTime() : 0;
            const dateB = b.createdAt instanceof Date ? b.createdAt.getTime() : 0;
            return dateB - dateA;
        })
        .slice(0, limit);
};

export const getGigModerationStatsService = async () => {
    const [activeGigs, reportedGigs, pausedGigs, totalOrders] = await Promise.all([
        GigModel.countDocuments({ status: "published", isDeleted: false }),
        GigModel.countDocuments({ status: "flagged", isDeleted: false }),
        GigModel.countDocuments({ status: "paused", isDeleted: false }),
        OrderModel.find({ status: "COMPLETED" }).select("amount"),
    ]);

    const totalRevenue = totalOrders.reduce((sum: number, order) => sum + (order.amount || 0), 0);

    return {
        activeGigs,
        reportedGigs,
        pausedGigs,
        totalRevenue
    };
};
//=================PAUSE GIG=================


export const pauseGigService = async (
    gigId: string,
    adminId: string,
    reportId: string,
    reason: string
) => {
    const gig = await GigModel.findById(gigId);
    if (!gig) throw new Error("Gig not found");

    gig.status = "paused";
    await gig.save();

    // 🔥 link to report
    const report = await ReportModel.findOne({ reportId });

    if (report) {
        report.status = "RESOLVED";
        report.adminNotes = reason;

        report.auditTrail.push({
            action: "GIG_PAUSED",
            performedBy: new mongoose.Types.ObjectId(adminId),
            createdAt: new Date()
        });

        await report.save();
    }

    return gig;
};

//===================IGNORE GIG===================
export const ignoreGigService = async (
    gigId: string,
    adminId: string,
    reportId: string,
    reason: string
) => {
    const gig = await GigModel.findById(gigId);
    if (!gig) throw new Error("Gig not found");

    // If gig was reported, we might want to restore it to "published"
    if (gig.status === "flagged") {
        gig.status = "published";
        await gig.save();
    }

    const report = await ReportModel.findOne({ reportId });

    if (report) {
        report.status = "RESOLVED";
        report.adminNotes = reason;

        report.auditTrail.push({
            action: "REPORTS_IGNORED",
            performedBy: new mongoose.Types.ObjectId(adminId),
            createdAt: new Date()
        });

        await report.save();
    }

    return gig;
};

//===================REJECT GIG===================
export const rejectGigService = async (
    gigId: string,
    adminId: string,
    reportId: string,
    reason: string
) => {
    const gig = await GigModel.findById(gigId);
    if (!gig) throw new Error("Gig not found");

    gig.status = "rejected";
    await gig.save();

    const report = await ReportModel.findOne({ reportId });

    if (report) {
        report.status = "RESOLVED";
        report.adminNotes = reason;

        report.auditTrail.push({
            action: "GIG_REJECTED",
            performedBy: new mongoose.Types.ObjectId(adminId),
            createdAt: new Date()
        });

        await report.save();
    }

    return gig;
};

export const getBookingsAuditService = async () => {
    const orders = await OrderModel.find()
        .populate("buyerId", "displayName email profileImage")
        .populate("influencerId", "displayName email profileImage")
        .sort({ createdAt: -1 });

    // const totalOrders = orders.length; (removed as per ESLint unused warning)

    const completedBookings = orders.filter(o => o.status === "COMPLETED").length;
    const pendingPayments = orders.filter(o => o.status === "PENDING").length;
    const activeEscrows = orders.filter(o => o.status === "IN_ESCROW").length;
    const totalVolume = orders
        .filter(o => o.status === "COMPLETED" || o.status === "IN_ESCROW")
        .reduce((sum, o) => sum + (o.amount || 0), 0);

    return {
        metrics: {
            completedBookings,
            pendingPayments,
            activeEscrows,
            totalVolume
        },
        bookings: orders.map(o => ({
            id: `#BK-${o._id.toString().slice(-5).toUpperCase()}`,
            _id: o._id,
            brand: (o.buyerId as unknown as IPopulatedUser)?.displayName || "Unknown Brand",
            brandEmail: (o.buyerId as unknown as IPopulatedUser)?.email,
            brandLogo: (o.buyerId as unknown as IPopulatedUser)?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent((o.buyerId as unknown as IPopulatedUser)?.displayName || "B")}`,
            influencer: (o.influencerId as unknown as IPopulatedUser)?.displayName || "Unknown Influencer",
            influencerEmail: (o.influencerId as unknown as IPopulatedUser)?.email,
            influencerAvatar: (o.influencerId as unknown as IPopulatedUser)?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent((o.influencerId as unknown as IPopulatedUser)?.displayName || "I")}`,

            amount: `${o.currency === "INR" ? "₹" : "$"}${o.amount.toLocaleString()}`,
            paymentStatus: o.status,
            bookingStatus: o.workStatus.replace(/_/g, " "),
            createdAt: o.createdAt
        }))
    };
};