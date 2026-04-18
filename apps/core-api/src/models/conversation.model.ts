import { Schema, model, Types } from "mongoose";

export interface ConversationDocument {
  _id: Types.ObjectId;
  connectionId: Types.ObjectId;
  participants: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema = new Schema<ConversationDocument>(
  {
    connectionId: {
      type: Schema.Types.ObjectId,
      ref: "Connection",
      required: true,
      unique: true, // 🔥 one conversation per connection
    },

    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const ConversationModel = model<ConversationDocument>(
  "Conversation",
  ConversationSchema
);