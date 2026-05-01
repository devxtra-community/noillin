import { Schema, model, Types } from "mongoose";

export interface MessageDocument {
  _id: Types.ObjectId;
  gigRequestId: Types.ObjectId;

  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;

  content: string;

  messageType?: "TEXT" | "PROPOSAL" | "SYSTEM" | "DELIVERABLE";
  proposalData?: {
    date: Date;
    time: string;
    status: "PENDING" | "ACCEPTED" | "REJECTED";
  };
  deliverableData?: {
    url: string;
    mediaType: "VIDEO" | "IMAGE";
    status: "PENDING" | "ACCEPTED" | "REJECTED";
    rejectionNote?: string;
  };

  status: "SENT" | "DELIVERED" | "READ";

  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<MessageDocument>(
  {
    gigRequestId: {
      type: Schema.Types.ObjectId,
      ref: "GigRequest",
      required: true,
      index: true,
    },

    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    content: {
      type: String,
      required: true
    },

    messageType: {
      type: String,
      enum: ["TEXT", "PROPOSAL", "SYSTEM", "DELIVERABLE"],
      default: "TEXT"
    },

    proposalData: {
      date: Date,
      time: String,
      status: {
        type: String,
        enum: ["PENDING", "ACCEPTED", "REJECTED"],
      }
    },

    deliverableData: {
      url: String,
      mediaType: {
        type: String,
        enum: ["VIDEO", "IMAGE"],
      },
      status: {
        type: String,
        enum: ["PENDING", "ACCEPTED", "REJECTED"],
        default: "PENDING"
      },
      rejectionNote: String
    },

    status: {
      type: String,
      enum: ["SENT", "DELIVERED", "READ"],
      default: "SENT",
      index: true
    }
  },
  {
    timestamps: true
  }
);

export const MessageModel = model<MessageDocument>(
  "Message",
  MessageSchema
);