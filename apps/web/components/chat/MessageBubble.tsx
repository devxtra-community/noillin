import React from "react";

import { cn } from "@/lib/utils";

export interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  status: "SENT" | "DELIVERED" | "READ";
  messageType?: "TEXT" | "PROPOSAL";
  proposalData?: {
    date: string;
    time: string;
    status: "PENDING" | "ACCEPTED" | "REJECTED";
  };
}

interface Props {
  message: Message;
  currentUserId: string;
  isBrand?: boolean;
  onRespond?: (messageId: string, status: "ACCEPTED" | "REJECTED") => void;
  onTryAgain?: () => void;
  onPay?: () => void;
}

export function MessageBubble({ message, currentUserId, isBrand, onRespond, onTryAgain, onPay }: Props) {
  const isMine = message.senderId.toString() === currentUserId.toString();
  const isProposal = message.messageType === "PROPOSAL";
  const pData = message.proposalData;

  const getProposalStatusColor = (status: string) => {
    switch (status) {
      case "ACCEPTED": return "text-emerald-600 bg-emerald-50 border-emerald-200";
      case "REJECTED": return "text-rose-600 bg-rose-50 border-rose-200";
      default: return "text-orange-600 bg-orange-50 border-orange-200";
    }
  };

  return (
    <div
      className={cn(
        "flex w-full mb-4",
        isMine ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "relative shadow-sm transition-all overflow-hidden",
          isProposal
            ? "w-full max-w-sm bg-white border border-gray-100 rounded-[24px]"
            : cn(
              "px-5 py-3 max-w-[75%] sm:max-w-md text-[15px] leading-relaxed",
              isMine
                ? "bg-gradient-to-br from-[#20B271] to-[#18965f] text-white rounded-[20px] rounded-br-sm"
                : "bg-white text-gray-800 border border-gray-100 rounded-[20px] rounded-bl-sm"
            )
        )}
      >
        {isProposal && pData ? (
          <div className="flex flex-col">
            <div className="p-5 bg-gradient-to-br from-gray-50 to-gray-100/50">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-black uppercase tracking-widest text-gray-400">Collaboration Proposal</span>
                <span className={cn("px-2.5 py-0.5 rounded-full text-[10px] font-bold border", getProposalStatusColor(pData.status))}>
                  {pData.status}
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-emerald-500">
                    <span className="text-lg">📅</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Proposed Date</p>
                    <p className="text-sm font-bold text-gray-900">{new Date(pData.date).toLocaleDateString("en-US", { dateStyle: "long" })}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-blue-500">
                    <span className="text-lg">⏰</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Proposed Time</p>
                    <p className="text-sm font-bold text-gray-900">{pData.time}</p>
                  </div>
                </div>
              </div>
            </div>

            {pData.status === "ACCEPTED" && isBrand && (
              <div className="p-4 bg-emerald-50/50 border-t border-emerald-100 flex flex-col items-center">
                <button
                  onClick={() => onPay?.()}
                  className="w-full py-3 rounded-2xl text-[13px] font-black text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 transition-all active:scale-95 uppercase tracking-[0.2em]"
                >
                  Pay Now & Place Order
                </button>
                <p className="text-[9px] font-black text-emerald-600/60 uppercase tracking-widest mt-3">Final step to secure booking</p>
              </div>
            )}

            {pData.status === "PENDING" && !isMine && (
              <div className="p-4 bg-white border-t border-gray-50 space-y-3">
                <button
                  onClick={() => onRespond?.(message._id, "ACCEPTED")}
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-shadow shadow-md shadow-emerald-500/10 uppercase tracking-wider"
                >
                  Accept & Mark Calendar
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onTryAgain?.()}
                    className="py-2.5 rounded-xl text-[10px] font-bold text-gray-700 hover:bg-gray-50 transition-colors border border-gray-100 uppercase tracking-widest"
                  >
                    Try Another Day
                  </button>
                  <button
                    onClick={() => onRespond?.(message._id, "REJECTED")}
                    className="py-2.5 rounded-xl text-[10px] font-bold text-rose-600 hover:bg-rose-50 transition-colors border border-rose-100 uppercase tracking-widest"
                  >
                    Decline
                  </button>
                </div>
              </div>
            )}

            {pData.status === "PENDING" && isMine && (
              <div className="px-5 py-3 bg-gray-50/50 border-t border-gray-50 flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Waiting for response...</p>
              </div>
            )}
          </div>
        ) : (
          <p className="break-words">{message.content}</p>
        )}

        <div
          className={cn(
            "flex items-center justify-end gap-1 px-5 pb-3 pointer-events-none",
            isProposal ? "mt-0" : "mt-1.5",
            isMine && !isProposal ? "text-green-100" : "text-gray-400"
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