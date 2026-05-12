import React from "react";
import Link from "next/link";

import { SecureMediaPreview } from "../shared/SecureMediaPreview";

import { cn } from "@/lib/utils";

export interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  status: "SENT" | "DELIVERED" | "READ";
  messageType?: "TEXT" | "PROPOSAL" | "SYSTEM" | "DELIVERABLE" | "ORDER_COMPLETED";
  proposalData?: {
    date: string;
    time: string;
    status: "PENDING" | "ACCEPTED" | "REJECTED";
  };
  deliverableData?: {
    url: string;
    mediaType: "VIDEO" | "IMAGE";
    status: "PENDING" | "ACCEPTED" | "REJECTED";
    rejectionNote?: string;
  };
}

interface Props {
  message: Message;
  currentUserId: string;
  isBrand?: boolean;
  onRespond?: (messageId: string, status: "ACCEPTED" | "REJECTED") => void;
  onRespondDeliverable?: (messageId: string, status: "ACCEPTED" | "REJECTED", note?: string) => void;
  onTryAgain?: () => void;
  onPay?: () => void;
}

export function MessageBubble({ message, currentUserId, isBrand, onRespond, onRespondDeliverable, onTryAgain, onPay }: Props) {
  const isMine = message.senderId.toString() === currentUserId.toString();
  const isProposal = message.messageType === "PROPOSAL";
  const isSystem = message.messageType === "SYSTEM";
  const isDeliverable = message.messageType === "DELIVERABLE";
  const isOrderCompleted = message.messageType === "ORDER_COMPLETED";
  const pData = message.proposalData;
  const dData = message.deliverableData;

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
        isSystem || isOrderCompleted ? "justify-center" : isMine ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "relative shadow-sm transition-all overflow-hidden",
          isSystem || isProposal || isDeliverable || isOrderCompleted
            ? "w-full max-w-sm bg-white border border-gray-100 rounded-[24px]"
            : cn(
              "px-5 py-3 max-w-[75%] sm:max-w-md text-[15px] leading-relaxed",
              isMine
                ? "bg-gradient-to-br from-[#20B271] to-[#18965f] text-white rounded-[20px] rounded-br-sm"
                : "bg-white text-gray-800 border border-gray-100 rounded-[20px] rounded-bl-sm"
            )
        )}
      >
        {isOrderCompleted ? (
          <div className="flex flex-col w-full">
            <div className="p-6 bg-gradient-to-br from-emerald-50/50 to-emerald-100/30 text-center">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4 border border-emerald-50">
                <span className="text-3xl">🎉</span>
              </div>
              <h3 className="text-lg font-black text-emerald-950 uppercase tracking-tighter mb-1">
                {isBrand ? "Collaboration Finished!" : "Earnings Available!"}
              </h3>
              <p className="text-xs text-emerald-700 font-medium leading-relaxed max-w-[240px] mx-auto">
                {isBrand 
                  ? "Thank you for choosing this influencer! We hope you enjoyed the content." 
                  : "Excellent work! Your deliverable has been approved and funds are now in your wallet."}
              </p>
            </div>
            {!isBrand && (
              <div className="p-4 bg-white border-t border-emerald-50">
                <Link 
                  href="/influencer-dashboard/earnings"
                  className="block w-full py-3.5 rounded-2xl text-[13px] font-black text-center text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 transition-all active:scale-95 uppercase tracking-[0.2em]"
                >
                  View Earnings
                </Link>
              </div>
            )}
            {isBrand && (
              <div className="p-4 bg-white border-t border-emerald-50">
                 <p className="text-[10px] text-center font-black uppercase tracking-widest text-emerald-600/60">
                   Transaction Completed successfully
                 </p>
              </div>
            )}
          </div>
        ) : isSystem ? (() => {
          let title = "System Update";
          let subtitle = "Status Update";
          let icon = "🔔";
          let colorClass = "gray";

          const txt = message.content.toLowerCase();
          if (txt.includes("escrow") || txt.includes("secured")) {
            title = "Escrow Success";
            icon = "🔒";
            colorClass = "emerald";
            subtitle = "Project deliverables can officially begin";
          } else if (txt.includes("released") || txt.includes("paid")) {
            title = "Funds Released";
            icon = "💸";
            colorClass = "blue";
            subtitle = "Payment transferred successfully";
          } else if (txt.includes("submitted") || txt.includes("review")) {
            title = "Work Submitted";
            icon = "📤";
            colorClass = "purple";
            subtitle = "Waiting for brand review";
          } else if (txt.includes("approved")) {
            title = "Work Approved";
            icon = "✅";
            colorClass = "emerald";
            subtitle = "Funds are now available";
          } else if (txt.includes("rejected") || txt.includes("revision") || txt.includes("changes")) {
            title = "Revision Requested";
            icon = "🔄";
            colorClass = "rose";
            subtitle = "Action required from influencer";
          }

          const gradients: Record<string, string> = {
            emerald: "from-emerald-50/50 to-emerald-100/30",
            blue: "from-blue-50/50 to-blue-100/30",
            purple: "from-purple-50/50 to-purple-100/30",
            rose: "from-rose-50/50 to-rose-100/30",
            gray: "from-gray-50/50 to-gray-100/30"
          };
          const textTitles: Record<string, string> = { emerald: "text-emerald-600/80", blue: "text-blue-600/80", purple: "text-purple-600/80", rose: "text-rose-600/80", gray: "text-gray-600/80" };
          const textBadges: Record<string, string> = { emerald: "text-emerald-600 border-emerald-200", blue: "text-blue-600 border-blue-200", purple: "text-purple-600 border-purple-200", rose: "text-rose-600 border-rose-200", gray: "text-gray-600 border-gray-200" };
          const bgIcons: Record<string, string> = { emerald: "text-emerald-500", blue: "text-blue-500", purple: "text-purple-500", rose: "text-rose-500", gray: "text-gray-500" };
          const bgFooters: Record<string, string> = { emerald: "bg-emerald-50/50 border-emerald-100", blue: "bg-blue-50/50 border-blue-100", purple: "bg-purple-50/50 border-purple-100", rose: "bg-rose-50/50 border-rose-100", gray: "bg-gray-50/50 border-gray-100" };
          const textFooters: Record<string, string> = { emerald: "text-emerald-600/60", blue: "text-blue-600/60", purple: "text-purple-600/60", rose: "text-rose-600/60", gray: "text-gray-600/60" };

          return (
            <div className="flex flex-col w-full text-left">
              <div className={`p-5 bg-gradient-to-br ${gradients[colorClass]}`}>
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-[11px] font-black uppercase tracking-widest ${textTitles[colorClass]}`}>{title}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border bg-white shadow-sm ${textBadges[colorClass]}`}>
                    SYSTEM
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center ${bgIcons[colorClass]}`}>
                      <span className="text-lg">{icon}</span>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">System Notification</p>
                      <p className="text-sm font-bold text-gray-900 leading-snug">{message.content}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className={`p-4 border-t ${bgFooters[colorClass]}`}>
                <p className={`text-[10px] text-center font-black uppercase tracking-widest ${textFooters[colorClass]}`}>{subtitle}</p>
              </div>
            </div>
          );
        })() : isProposal && pData ? (
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
        ) : isDeliverable && dData ? (
          <div className="flex flex-col">
            <div className="p-5 bg-gradient-to-br from-gray-50 to-white">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-black uppercase tracking-widest text-emerald-600">Final Deliverable</span>
                <span className={cn("px-2.5 py-0.5 rounded-full text-[10px] font-bold border capitalize",
                  dData.status === "ACCEPTED" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                    dData.status === "REJECTED" ? "bg-rose-50 text-rose-600 border-rose-100" :
                      "bg-orange-50 text-orange-600 border-orange-100"
                )}>
                  {dData.status}
                </span>
              </div>

              {/* Secure Media Viewer */}
              <div className="mt-2">
                <SecureMediaPreview
                  url={dData.url}
                  type={dData.mediaType === "VIDEO" ? "video" : "image"}
                />
              </div>

              {dData.status === "REJECTED" && dData.rejectionNote && (
                <div className="mt-4 p-3 bg-rose-50 rounded-xl border border-rose-100">
                  <p className="text-[10px] font-black text-rose-500 uppercase tracking-tight mb-1">Feedback</p>
                  <p className="text-xs text-rose-700 font-medium italic">&ldquo;{dData.rejectionNote}&rdquo;</p>
                </div>
              )}
            </div>

            {dData.status === "PENDING" && isBrand && (
              <div className="p-4 bg-white border-t border-gray-50 space-y-3">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center mb-1">Action Required</p>
                <button
                  onClick={() => onRespondDeliverable?.(message._id, "ACCEPTED")}
                  className="w-full py-3 rounded-2xl text-[13px] font-black text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 transition-all active:scale-95 uppercase tracking-[0.2em]"
                >
                  Approve & Release Funds
                </button>
                <button
                  onClick={() => {
                    const note = prompt("Enter rejection reason:");
                    if (note) onRespondDeliverable?.(message._id, "REJECTED", note);
                  }}
                  className="w-full py-2.5 rounded-xl text-[10px] font-bold text-rose-600 hover:bg-rose-50 transition-colors border border-rose-100 uppercase tracking-widest"
                >
                  Request Changes
                </button>
              </div>
            )}

            {dData.status === "PENDING" && !isBrand && (
              <div className="px-5 py-4 bg-gray-50/50 border-t border-gray-50 flex items-center justify-center gap-3">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
                <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest">Waiting for Brand Review</p>
              </div>
            )}
          </div>
        ) : (
          <p className="break-words">{message.content}</p>
        )}

        {!isSystem && (
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
        )}
      </div>
    </div>
  );
}