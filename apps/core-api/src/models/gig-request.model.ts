import { Schema, model } from "mongoose";

const gigRequestSchema = new Schema(
    {
        brandId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        influencerId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        gigId: {
            type: Schema.Types.ObjectId,
            ref: "Gig",
            required: true,
        },

        note: {
            type: String,
        },

        status: {
            type: String,
            enum: ["pending", "accepted", "rejected"],
            default: "pending",
        },
    },
    { timestamps: true }
);

// One request per brand-influencer-gig combo
gigRequestSchema.index(
    { brandId: 1, influencerId: 1, gigId: 1 },
    { unique: true }
);

export const GigRequestModel = model("GigRequest", gigRequestSchema);
