import { Schema, model, Types } from "mongoose";

export interface MessageDocument {
  _id: Types.ObjectId;
  connectionId: Types.ObjectId;

  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;

  content: string;

  messageType: "TEXT";

  status: "SENT" | "DELIVERED" | "READ";

  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<MessageDocument>(
  {
    connectionId: {
      type: Schema.Types.ObjectId,
      ref: "Connection",
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
      enum: ["TEXT"],
      default: "TEXT"
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