"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { io, Socket } from "socket.io-client";
import { MoreVertical, Info, Check, X, MessageSquare, Calendar, ChevronLeft, ChevronRight, UploadCloud, FileText, Trash2, Loader2 } from "lucide-react";
import Image from "next/image";
import { ShieldAlert } from "lucide-react";

import { ReportingModal } from "../shared/ReportingModal";

import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";

import api from "@/lib/axios.client";
import { useAuthStore } from "@/store/auth.store";
import { uploadToS3 } from "@/lib/s3-uploads";
import { useDashboardStore } from "@/store/dashboard.store";

export interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  gigRequestId: string;
  status: "SENT" | "DELIVERED" | "READ";
  messageType?: "TEXT" | "PROPOSAL" | "SYSTEM" | "DELIVERABLE";
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

interface ChatWindowProps {
  currentUserId: string;
  gigRequestId: string;
  receiverId: string;
  receiverName?: string;
  receiverImage?: string;
  disabled?: boolean;
  onBack?: () => void;
}

interface Order {
  _id: string;
  connectionId: string;
  status: "PENDING" | "IN_ESCROW" | "COMPLETED" | "CANCELLED" | "DISPUTED";
  workStatus: "NOT_STARTED" | "SUBMITTED" | "APPROVED" | "REJECTED";
  deliverableUrl?: string;
}

export function ChatWindow({
  currentUserId,
  gigRequestId,
  receiverId,
  receiverName,
  receiverImage,
  onBack,
}: ChatWindowProps) {
  const searchParams = useSearchParams();
  const urlGigId = searchParams.get("gigId") || searchParams.get("gig");

  const [messages, setMessages] = useState<Message[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const { accessToken, user } = useAuthStore();
  const { fetchCounts } = useDashboardStore();
  const [connection, setConnection] = useState<{ _id: string; status: string; gigId?: string } | null>(null);

  // Proposal State
  const [isProposing, setIsProposing] = useState(false);
  const [proposalDate, setProposalDate] = useState("");
  const [proposalTime, setProposalTime] = useState("");

  // Deliverable State
  const [isSubmittingDeliverable, setIsSubmittingDeliverable] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  // Reporting State
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);

  // --- Custom Calendar Logic ---
  const [viewDate, setViewDate] = useState(new Date());

  const calendarDays = (() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    // Padding for start of month
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(new Date(year, month, d));
    return days;
  })();

  const timeSlots = [
    "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM",
    "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM"
  ];

  const handleMonthChange = (offset: number) => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1));
  };
  // --- End Custom Calendar Logic ---

  // ✅ load messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await api.get(`/chat/${gigRequestId}`);
        setMessages(res.data.messages || []);
      } catch (err) {
        console.error(err);
      }
    };

    if (gigRequestId) {
      setTimeout(() => {
        fetchMessages();
      }, 0);
    }
  }, [gigRequestId, accessToken]);

  // ✅ load gig request details
  const fetchConnection = useCallback(async () => {
    try {
      const res = await api.get(`/connections/details/${gigRequestId}`);
      if (res.data && res.data.gigRequest) {
        console.log("Connection loaded:", res.data.gigRequest.status);
        setConnection(res.data.gigRequest);
      }
    } catch (err) {
      console.error(err);
    }
  }, [gigRequestId]);

  const fetchOrder = useCallback(async () => {
    try {
      const res = await api.get(`/orders/history`);
      const order = res.data.find((o: Order) => o.connectionId === gigRequestId);
      setActiveOrder(order || null);
    } catch (err) {
      console.error("Failed to fetch order:", err);
    }
  }, [gigRequestId]);

  useEffect(() => {
    if (gigRequestId && accessToken) {
      setTimeout(() => {
        fetchConnection();
        fetchOrder();
      }, 0);
    }
  }, [gigRequestId, accessToken, fetchConnection, fetchOrder]);

  // ✅ socket
  useEffect(() => {
    if (!currentUserId) return;

    const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
      path: "/socket.io",
      auth: { userId: currentUserId },
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    socketInstance.on("connect", () => {
      console.log("Chat socket connected ✅");
      if (gigRequestId) {
        socketInstance.emit("join_conversation", gigRequestId);
      }
    });

    socketInstance.on("receive_message", (message: Message) => {
      console.log("New message received via socket:", message);
      setMessages((prev) => {
        const withoutTemp = prev.filter(m =>
          !(m._id.startsWith("temp-") && m.content === message.content && m.senderId === message.senderId)
        );
        const exists = withoutTemp.some((m) => m._id === message._id);
        if (exists) return prev;
        return [...withoutTemp, message];
      });

      if (message.content.includes("accepted") || message.content.includes("rejected")) {
        fetchConnection();
      }
    });

    socketInstance.on("receive_proposal_update", (updatedMessage: Message) => {
      console.log("Proposal updated via socket:", updatedMessage);
      setMessages((prev) =>
        prev.map((m) => m._id === updatedMessage._id ? updatedMessage : m)
      );

      // If it's a deliverable update, refetch the order
      if (updatedMessage.messageType === "DELIVERABLE") {
        fetchOrder();
      }
    });

    socketInstance.on("messages_read", ({ gigRequestId: readGigRequestId }: { gigRequestId: string; readByUserId: string }) => {
      setMessages((prev) =>
        prev.map((m) =>
          m.gigRequestId === readGigRequestId && m.senderId === currentUserId
            ? { ...m, status: "READ" }
            : m
        )
      );
    });

    socketRef.current = socketInstance;

    return () => {
      if (gigRequestId) {
        socketInstance.emit("leave_conversation", gigRequestId);
      }
      console.log("Disconnecting chat socket...");
      socketInstance.disconnect();
    };
  }, [currentUserId, gigRequestId, fetchConnection, fetchOrder]);

  // ✅ auto scroll
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ send message
  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const tempId = "temp-" + Date.now();
    const tempMessage: Message = {
      _id: tempId,
      senderId: currentUserId,
      receiverId,
      content,
      createdAt: new Date().toISOString(),
      gigRequestId,
      status: "SENT"
    };

    setMessages((prev) => [...prev, tempMessage]);

    try {
      const res = await api.post("/chat/send", {
        gigRequestId,
        content
      });

      const savedMessage = res.data.message;

      if (socketRef.current) {
        socketRef.current.emit("send_message", {
          message: savedMessage
        });
      }

      setMessages((prev) =>
        prev.map(m => m._id === tempId ? savedMessage : m)
      );

    } catch (err) {
      console.error("Failed to send message:", err);
      setMessages((prev) => prev.filter(m => m._id !== tempId));
    }
  };

  const handleSendProposal = async (date: string, time: string) => {
    try {
      const res = await api.post("/chat/send", {
        gigRequestId,
        content: `Proposed Collaboration Date: ${date} at ${time}`,
        messageType: "PROPOSAL",
        proposalData: { date, time, status: "PENDING" }
      });

      const savedMessage = res.data.message;
      if (socketRef.current) {
        socketRef.current.emit("send_message", { message: savedMessage });
      }
      setMessages((prev) => [...prev, savedMessage]);
    } catch (err) {
      console.error("Failed to send proposal:", err);
    }
  };

  const handleRespondToProposal = async (messageId: string, status: "ACCEPTED" | "REJECTED") => {
    try {
      const res = await api.patch(`/chat/proposal-respond/${messageId}`, { status });
      const updatedMessage = res.data.message;

      setMessages((prev) => prev.map(m => m._id === messageId ? updatedMessage : m));

      if (socketRef.current) {
        socketRef.current.emit("proposal_update", {
          gigRequestId,
          message: updatedMessage
        });
      }
      if (status === "ACCEPTED") fetchConnection();
    } catch (err) {
      console.error("Failed to respond to proposal:", err);
    }
  };

  const handleSendDeliverable = async () => {
    if (!selectedFile || !activeOrder?._id) return;
    try {
      setUploading(true);
      const url = await uploadToS3(selectedFile, "deliverables");

      const mediaType = selectedFile.type.startsWith("video") ? "VIDEO" : "IMAGE";
      const res = await api.post("/chat/submit-deliverable", {
        gigRequestId,
        deliverableData: { url, mediaType }
      });

      const savedMessage = res.data.message;
      if (socketRef.current) {
        socketRef.current.emit("send_message", { message: savedMessage });
      }
      setMessages((prev) => [...prev, savedMessage]);

      setActiveOrder((prev) => prev ? { ...prev, workStatus: "SUBMITTED", deliverableUrl: url } : prev);
      setIsSubmittingDeliverable(false);
      setSelectedFile(null);
    } catch (err) {
      console.error("Failed to upload deliverable:", err);
      alert("Failed to upload file. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleRespondToDeliverable = async (messageId: string, status: "ACCEPTED" | "REJECTED", rejectionNote?: string) => {
    try {
      const res = await api.patch(`/chat/deliverable-respond/${messageId}`, { status, rejectionNote });
      const updatedMessage = res.data.message;

      setMessages((prev) => prev.map(m => m._id === messageId ? updatedMessage : m));

      if (socketRef.current) {
        socketRef.current.emit("proposal_update", {
          gigRequestId,
          message: updatedMessage
        });
      }

      // Refetch messages to pull the new SYSTEM event card generated by the backend
      try {
        const msgsRes = await api.get(`/chat/${gigRequestId}`);
        setMessages(msgsRes.data.messages || []);
      } catch (e) {
        console.error(e);
      }
    } catch (err) {
      console.error("Failed to respond to deliverable:", err);
    }
  };

  const handleTryAnotherDay = () => {
    setIsProposing(true);
  };

  const handleUpdateConnection = async (status: "accepted" | "rejected") => {
    try {
      if (!connection?._id) return;

      const action = status === "accepted" ? "accept" : "reject";
      await api.patch(`/connections/${connection._id}/${action}`);
      await fetchConnection();

      const statusMsg = status === "accepted" ? "✅ Influencer accepted the request" : "❌ Influencer rejected the request";
      handleSendMessage(statusMsg);
    } catch (err) {
      console.error(err);
    }
  };

  const isPending = connection?.status === "pending";
  const isInfluencer = user?.role === "INFLUENCER";
  const isBrand = user?.role === "BRAND";
  const isChatDisabled = isPending && isBrand;

  useEffect(() => {
    if (!gigRequestId) return;
    api.post(`/chat/read/${gigRequestId}`).then(() => {
      fetchCounts();
    }).catch(console.error);
    if (socketRef.current?.connected) {
      socketRef.current.emit("mark_read", gigRequestId);
    }
  }, [gigRequestId, accessToken, fetchCounts]);

  return (
    <div className="flex flex-col h-full bg-transparent shadow-none relative w-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-gray-100 bg-white/95 backdrop-blur-xl sticky top-0 z-20">
        <div className="flex items-center space-x-3">
          {onBack && (
            <button onClick={onBack} className="p-1.5 -ml-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg lg:hidden">
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-100 to-gray-200 overflow-hidden flex items-center justify-center ring-2 ring-white shadow-sm relative">
              {receiverImage ? (
                <>
                  <Image 
                    src={receiverImage} 
                    alt={receiverName || "profile"} 
                    fill 
                    className="object-cover" 
                    unoptimized 
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                  <span className="hidden w-full h-full items-center justify-center text-[16px] font-semibold text-gray-500">
                    {(receiverName || "U").substring(0, 2).toUpperCase()}
                  </span>
                </>
              ) : (
                <span className="text-[16px] font-semibold text-gray-500">
                  {(receiverName || "U").substring(0, 2).toUpperCase()}
                </span>
              )}
            </div>
            <div className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <h2 className="text-[15px] sm:text-base font-bold text-gray-900 tracking-tight leading-none">{receiverName || "Loading..."}</h2>
            <p className="text-[11px] sm:text-xs text-emerald-500 font-medium mt-0.5">Online</p>
          </div>
        </div>
        <div className="relative">
          <button onClick={() => setIsOptionsOpen(!isOptionsOpen)} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100/80 rounded-full transition-all">
            <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {isOptionsOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
              <div className="py-2">
                <button
                  onClick={() => {
                    setIsOptionsOpen(false);
                    setIsReportModalOpen(true);
                  }}
                  className="w-full px-4 py-3 text-left text-[11px] font-black text-rose-500 hover:bg-rose-50 flex items-center gap-2 uppercase tracking-widest transition-colors"
                >
                  <ShieldAlert size={14} />
                  Report Issue
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Connection Banners */}
      {isPending && isBrand && (
        <div className="bg-blue-50 border-b border-blue-100 p-3 flex items-center justify-center gap-2">
          <Info className="w-4 h-4 text-blue-600" />
          <p className="text-xs font-bold text-blue-900 text-center">Booking request sent. Waiting for approval...</p>
        </div>
      )}
      {isPending && isInfluencer && (
        <div className="bg-emerald-50 border-b border-emerald-100 p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center"><MessageSquare className="w-4 h-4" /></div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-emerald-900 leading-none">New Booking Request</p>
              <p className="text-[10px] sm:text-xs text-emerald-600 mt-1 font-medium">Review to enable chat</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => handleUpdateConnection("rejected")} className="bg-white border border-red-100 text-red-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-50">Reject</button>
            <button onClick={() => handleUpdateConnection("accepted")} className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-700">Accept Request</button>
          </div>
        </div>
      )}
      {connection?.status === "accepted" && (
        <div className="bg-emerald-50/50 border-b border-emerald-100/50 p-2 flex items-center justify-center gap-2 text-emerald-700 uppercase tracking-[0.2em] animate-pulse text-[10px] font-black">
          <Check className="w-3.5 h-3.5 text-emerald-500" /> Collaboration Negotiating
        </div>
      )}
      {connection?.status === "rejected" && (
        <div className="bg-red-50 border-b border-red-100 p-2 flex items-center justify-center gap-2 text-red-700 uppercase tracking-wider text-[11px] font-bold">
          <X className="w-3.5 h-3.5 text-red-500" /> Request Rejected
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 pb-2" data-lenis-prevent>
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4"><span className="text-2xl">👋</span></div>
            <h3 className="text-lg font-medium text-gray-800">Say Hello!</h3>
            <p className="text-sm text-gray-500 mt-1">Start the conversation with {receiverName || "your contact"}.</p>
          </div>
        ) : (
          <div className="space-y-1">
            {messages.map((msg) => (
              <MessageBubble
                key={msg._id}
                message={msg}
                currentUserId={currentUserId}
                isBrand={isBrand}
                onPay={async () => {
                  const gigData = urlGigId || connection?.gigId;
                  const activeGigId = typeof gigData === 'object' && gigData !== null ? (gigData as { _id: string })._id : gigData;
                  const acceptedProposal = messages.find(m => m.messageType === "PROPOSAL" && m.proposalData?.status === "ACCEPTED");
                  if (!activeGigId) return alert("Gig ID not found");
                  try {
                    const res = await api.post("/payments/checkout", {
                      gigRequestId,
                      dueDate: acceptedProposal?.proposalData?.date
                    });
                    window.location.href = res.data.url;
                  } catch (err: unknown) {
                    const error = err as { response?: { data?: { message?: string } } };
                    alert(error.response?.data?.message || "Failed to initiate payment");
                  }
                }}
                onRespond={async (id, status) => {
                  await handleRespondToProposal(id, status);
                }}
                onRespondDeliverable={handleRespondToDeliverable}
                onTryAgain={handleTryAnotherDay}
              />
            ))}
            <div ref={endOfMessagesRef} />
          </div>
        )}
      </div>

      {/* Premium Proposal Modal */}
      {isProposing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsProposing(false)} />
          <div className="bg-white rounded-[40px] w-full max-w-[440px] shadow-2xl relative z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-black text-gray-900 tracking-tight">Timeline Proposal</h3>
                  <p className="text-[11px] font-bold text-gray-400 mt-1 uppercase tracking-[0.2em]">Select deliverables deadline</p>
                </div>
                <button onClick={() => setIsProposing(false)} className="p-2.5 hover:bg-gray-100 rounded-full transition-colors"><X className="w-5 h-5 text-gray-400" /></button>
              </div>

              {/* Custom Date Picker */}
              <div className="bg-gray-50/50 rounded-[32px] p-6 border border-gray-100 mb-6">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-sm font-black text-gray-900 uppercase tracking-wider">{viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h4>
                  <div className="flex gap-2">
                    <button onClick={() => handleMonthChange(-1)} className="p-1.5 hover:bg-white rounded-lg border border-transparent hover:border-gray-100 transition-all text-gray-400 hover:text-emerald-500"><ChevronLeft className="w-4 h-4" /></button>
                    <button onClick={() => handleMonthChange(1)} className="p-1.5 hover:bg-white rounded-lg border border-transparent hover:border-gray-100 transition-all text-gray-400 hover:text-emerald-500"><ChevronRight className="w-4 h-4" /></button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, idx) => (<div key={idx} className="text-[10px] font-black text-gray-400 uppercase">{d}</div>))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, idx) => {
                    if (!day) return <div key={idx} className="h-9 w-9" />;
                    const isSelected = proposalDate === day.toISOString().split('T')[0];
                    const isToday = new Date().toDateString() === day.toDateString();
                    return (
                      <button
                        key={idx}
                        disabled={day < new Date(new Date().setHours(0, 0, 0, 0))}
                        onClick={() => setProposalDate(day.toISOString().split('T')[0])}
                        className={`h-9 w-9 mx-auto rounded-xl flex items-center justify-center text-[13px] font-bold transition-all relative ${isSelected ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30" : "hover:bg-white text-gray-900 hover:shadow-sm"} ${day < new Date(new Date().setHours(0, 0, 0, 0)) ? "opacity-20 cursor-not-allowed" : ""}`}
                      >
                        {day.getDate()}
                        {isToday && !isSelected && <div className="absolute bottom-1 w-1 h-1 bg-emerald-500 rounded-full" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Time Selector */}
              <div className="mb-10">
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 ml-1">Proposed Time (Optional)</label>
                <div className="flex flex-wrap gap-2">
                  {timeSlots.map(slot => (
                    <button key={slot} onClick={() => setProposalTime(proposalTime === slot ? "" : slot)} className={`px-4 py-2 rounded-xl text-[11px] font-bold transition-all border ${proposalTime === slot ? "bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20" : "bg-white text-gray-600 border-gray-100 hover:border-emerald-200 hover:text-emerald-600"}`}>{slot}</button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => { if (!proposalDate) return alert("Please select a date from the calendar"); handleSendProposal(proposalDate, proposalTime); setIsProposing(false); }}
                className="w-full py-5 bg-emerald-600 text-white rounded-[24px] font-black text-[16px] shadow-xl shadow-emerald-500/20 hover:bg-emerald-700 hover:-translate-y-1 transition-all uppercase tracking-[0.2em]"
              >
                Send Proposal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Input & Actions Area */}
      <div className="bg-white border-t border-gray-100 z-30">
        <div className="relative"><ChatInput onSend={handleSendMessage} disabled={isChatDisabled || connection?.status === "rejected"} /></div>
        <div className="px-6 pb-4 pt-1 flex flex-col sm:flex-row items-center justify-between gap-3">
          {connection?.status === "accepted" && (
            <button onClick={() => setIsProposing(true)} className="w-full sm:w-auto flex items-center justify-center gap-2 text-emerald-600 hover:text-emerald-700 font-bold text-[13px] px-5 py-2.5 rounded-xl border border-emerald-100 hover:bg-emerald-50 transition-all uppercase tracking-wider">
              <Calendar className="w-4 h-4" /> Propose Due Date
            </button>
          )}

          {isInfluencer && activeOrder?.status === "IN_ESCROW" && activeOrder?.workStatus !== "APPROVED" && (
            <button onClick={() => setIsSubmittingDeliverable(true)} className="w-full sm:w-auto flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 font-bold text-[13px] px-5 py-2.5 rounded-xl border border-blue-100 hover:bg-blue-50 transition-all uppercase tracking-wider">
              🎁 { activeOrder?.workStatus === "SUBMITTED" ? "Update Submission" : "Submit Final Work" }
            </button>
          )}

          {isBrand && (!activeOrder || activeOrder.status === "PENDING") && (
            <button
              onClick={async () => {
                if (!connection?._id) return;
                const acceptedProposal = messages.find(m => m.messageType === "PROPOSAL" && m.proposalData?.status === "ACCEPTED");
                try {
                  const res = await api.post("/payments/checkout", {
                    gigRequestId,
                    dueDate: acceptedProposal?.proposalData?.date
                  });
                  window.location.href = res.data.url;
                } catch (err: unknown) {
                  const error = err as { response?: { data?: { message?: string } } };
                  alert(error.response?.data?.message || "Failed to initiate payment");
                }
              }}
              disabled={!messages.some(m => m.messageType === "PROPOSAL" && m.proposalData?.status === "ACCEPTED")}
              className={`w-full sm:w-auto px-8 py-2.5 rounded-xl font-bold shadow-lg transition-all text-sm uppercase tracking-wider ${messages.some(m => m.messageType === "PROPOSAL" && m.proposalData?.status === "ACCEPTED")
                ? "bg-[#059669] text-white shadow-emerald-500/10 hover:bg-[#047857]"
                : "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
                }`}
            >
              {messages.some(m => m.messageType === "PROPOSAL" && m.proposalData?.status === "ACCEPTED") ? "Pay Now & Place Order" : "Agree on Date to Pay"}
            </button>
          )}
        </div>
      </div>
      {/* Deliverable Submission Modal */}
      {isSubmittingDeliverable && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => { setIsSubmittingDeliverable(false); setSelectedFile(null); }} />
          <div className="bg-white rounded-[40px] w-full max-w-[440px] shadow-2xl relative z-10 overflow-hidden p-8 animate-in fade-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-2xl font-black text-gray-900 tracking-tight">Submit Final Work</h3>
              <button onClick={() => { setIsSubmittingDeliverable(false); setSelectedFile(null); }} className="p-2.5 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-8">Upload your deliverable from your device</p>

            <div className="flex flex-col gap-4">
              {/* Drag-and-drop upload zone */}
              <div className="relative">
                <div className={`border-2 border-dashed rounded-[24px] p-8 transition-all flex flex-col items-center justify-center gap-3 ${selectedFile ? "border-emerald-500 bg-emerald-50" : "border-gray-200 hover:border-emerald-400 hover:bg-gray-50/50"}`}>
                  {selectedFile ? (
                    <>
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white mb-1 shadow-lg shadow-emerald-200">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold text-gray-900 truncate max-w-[240px] mb-1">{selectedFile.name}</p>
                        <p className="text-[10px] font-bold text-emerald-600 uppercase">Ready to submit ({Math.round(selectedFile.size / 1024)} KB)</p>
                      </div>
                      <button
                        onClick={() => setSelectedFile(null)}
                        className="absolute top-4 right-4 p-1.5 hover:bg-gray-200 rounded-full transition-all text-gray-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 mb-1">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold text-gray-900 mb-1">Upload Deliverable</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Supports common media types</p>
                      </div>
                      <input
                        type="file"
                        onChange={(e) => e.target.files?.[0] && setSelectedFile(e.target.files[0])}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </>
                  )}
                </div>
              </div>

              <button
                disabled={uploading || !selectedFile}
                onClick={handleSendDeliverable}
                className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold py-5 px-4 rounded-[20px] text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-200/50"
              >
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                {uploading ? "Uploading..." : "Submit Output for Approval"}
              </button>
              <p className="text-[10px] text-gray-400 font-bold text-center uppercase tracking-widest px-4 leading-relaxed">Once submitted, the brand will review and release funds to your account.</p>
            </div>
          </div>
        </div>
      )}
      {/* Reporting Modal */}
      <ReportingModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        entityId={activeOrder?._id as string || gigRequestId}
        entityType={activeOrder?._id ? "ORDER" : "USER"}
      />
    </div>
  );
}