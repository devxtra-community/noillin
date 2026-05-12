// import { Schema, model } from "mongoose";

// import type { AvailabilityDocument } from "../types/availability.types.js";

// const TimeSlotSchema = new Schema(
//   {
//     startTime: {
//       type: String,
//       required: true
//     },
//     endTime: {
//       type: String,
//       required: true
//     }
//   },
//   { _id: false }
// );

// const WeeklyRuleSchema = new Schema(
//   {
//     day: {
//       type: String,
//       enum: [
//         "monday",
//         "tuesday",
//         "wednesday",
//         "thursday",
//         "friday",
//         "saturday",
//         "sunday"
//       ],
//       required: true
//     },
//     isEnabled: {
//       type: Boolean,
//       default: false
//     },
//     slots: {
//       type: [TimeSlotSchema],
//       default: []
//     }
//   },
//   { _id: false }
// );

// const DateOverrideSchema = new Schema(
//   {
//     date: {
//       type: String,
//       required: true
//     },
//     isAvailable: {
//       type: Boolean,
//       required: true
//     },
//     slots: {
//       type: [TimeSlotSchema],
//       default: []
//     }
//   },
//   { _id: false }
// );

// const AvailabilitySchema = new Schema<AvailabilityDocument>(
//   {
//     influencerProfileId: {
//       type: Schema.Types.ObjectId,
//       ref: "InfluencerProfile",
//       required: true,
//       unique: true,
//       index: true
//     },

//     timezone: {
//       type: String,
//       required: true
//     },

//     weeklyRules: {
//       type: [WeeklyRuleSchema],
//       default: []
//     },

//     dateOverrides: {
//       type: [DateOverrideSchema],
//       default: []
//     }
//   },
//   { timestamps: true }
// );

// export const AvailabilityModel = model<AvailabilityDocument>(
//   "Availability",
//   AvailabilitySchema
// );

import { Schema, model } from "mongoose";

const availabilitySchema = new Schema(
  {
    influencerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // Only store unavailable dates
    overrides: [
      {
        date: { type: Date, required: true },
        reason: { type: String },
      },
    ],
  },
  { timestamps: true }
);

export const AvailabilityModel = model(
  "Availability",
  availabilitySchema
);