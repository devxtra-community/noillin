import React from "react";

import { cn } from "@/lib/utils";

export interface Message {
  _id: string;
  senderId: string;
  content: string;
  createdAt: string;
  status: "SENT" | "DELIVERED" | "READ"; // ✅ ADD THIS
}

interface Props {
  message: Message;
  currentUserId: string;
}

export function MessageBubble({ message, currentUserId }: Props) {
  const isMine = message.senderId === currentUserId;

  return (
    <div
      className={cn(
        "flex w-full mb-4",
        isMine ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "relative px-5 py-3 max-w-[75%] sm:max-w-md text-[15px] leading-relaxed shadow-sm transition-all",
          isMine
            ? "bg-gradient-to-br from-[#20B271] to-[#18965f] text-white rounded-[20px] rounded-br-sm"
            : "bg-white text-gray-800 border border-gray-100 rounded-[20px] rounded-bl-sm"
        )}
      >
        <p className="break-words">{message.content}</p>
        <div
          className={cn(
            "flex items-center justify-end gap-1 mt-1.5 font-medium",
            isMine ? "text-green-100" : "text-gray-400"
          )}
        >
          <span className="text-[10px] uppercase tracking-wider">
            {new Date(message.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          {isMine && (
            <span className="text-[12px] ml-0.5 flex gap-[1px]">
              {message.status === "SENT" && "✓"}
              {message.status === "DELIVERED" && "✓✓"}
              {message.status === "READ" && (
                <span className="text-[#a5ffda] font-bold">✓✓</span>
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}