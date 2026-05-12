import { Schema, model, Document } from "mongoose";

export interface IPlatformRevenue extends Document {
    totalRevenue: number;
    availableBalance: number;
}

const PlatformRevenueSchema = new Schema<IPlatformRevenue>(
    {
        totalRevenue: {
            type: Number,
            default: 0,
        },
        availableBalance: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

export const PlatformRevenueModel = model<IPlatformRevenue>(
    "PlatformRevenue",
    PlatformRevenueSchema
);
