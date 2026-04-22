"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { io, Socket } from "socket.io-client";
import { MoreVertical, Info, Check, X, MessageSquare } from "lucide-react";
import Image from "next/image";

import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";

import api from "@/lib/axios.client";
import { useAuthStore } from "@/store/auth.store";

export interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  connectionId: string;
  status: "SENT" | "DELIVERED" | "READ";
}

interface ChatWindowProps {
  currentUserId: string;
  connectionId: string;
  receiverId: string;
  receiverName?: string;
  receiverImage?: string;
  disabled?: boolean;
}

export function ChatWindow({
  currentUserId,
  connectionId,
  receiverId,
  receiverName,
  receiverImage,
}: ChatWindowProps) {
  const searchParams = useSearchParams();
  const urlGigId = searchParams.get("gigId") || searchParams.get("gig");

  const [messages, setMessages] = useState<Message[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const { accessToken, user } = useAuthStore();
  const [connection, setConnection] = useState<{ _id: string; status: string; gigId?: string } | null>(null);



  // ✅ load messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await api.get(`/chat/${connectionId}`);
        setMessages(res.data.messages || []);
      } catch (err) {
        console.error(err);
      }
    };

    if (connectionId) {
      setTimeout(() => {
        fetchMessages();
      }, 0);
    }
  }, [connectionId, accessToken]);

  // ✅ load connection
  const fetchConnection = useCallback(async () => {
    try {
      const res = await api.get(`/connections/details/${connectionId}`);
      if (res.data && res.data.connection) {
        setConnection(res.data.connection);
      }
    } catch (err) {
      console.error(err);
    }
  }, [connectionId]);

  useEffect(() => {
    if (connectionId && accessToken) {
      setTimeout(() => {
        fetchConnection();
      }, 0);
    }
  }, [connectionId, accessToken, fetchConnection]);

  // ✅ socket
  useEffect(() => {
    if (!currentUserId) return;

    const socketInstance = io("http://localhost:6001", {
      auth: { userId: currentUserId },
      transports: ["websocket"], // Force websocket for faster/more stable connection
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    socketInstance.on("connect", () => {
      console.log("Chat socket connected ✅");
    });

    socketInstance.on("receive_message", (message: Message) => {
      console.log("New message received via socket:", message);
      setMessages((prev) => {
        // Remove matching optimistic message if any
        const withoutTemp = prev.filter(m => 
          !(m._id.startsWith("temp-") && m.content === message.content && m.senderId === message.senderId)
        );
        
        // Final check against IDs to avoid any duplication
        const exists = withoutTemp.some((m) => m._id === message._id);
        if (exists) return prev;

        return [...withoutTemp, message];
      });

      // Refresh connection data if it's a status update
      if (message.content.includes("accepted") || message.content.includes("rejected")) {
        fetchConnection();
      }
    });

    socketInstance.on("messages_read", ({ connectionId: readConnectionId }) => {
      setMessages((prev) =>
        prev.map((m) =>
          m.connectionId === readConnectionId && m.senderId === currentUserId
            ? { ...m, status: "READ" }
            : m
        )
      );
    });

    socketRef.current = socketInstance;

    return () => {
      console.log("Disconnecting chat socket...");
      socketInstance.disconnect();
    };
  }, [currentUserId, connectionId]); // Reconnect when connectionId changes to be safe, but keep it stable


  // ✅ auto scroll
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ send message
  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    // ✅ Optimistic update
    const tempId = "temp-" + Date.now();
    const tempMessage: Message = {
      _id: tempId,
      senderId: currentUserId,
      receiverId,
      content,
      createdAt: new Date().toISOString(),
      connectionId,
      status: "SENT"
    };

    setMessages((prev) => [...prev, tempMessage]);

    try {
      // 🔥 1. Save to DB via API (Guaranteed Persistence)
      const res = await api.post("/chat/send", {
        connectionId,
        content
      });

      const savedMessage = res.data.message;

      // 🔥 2. Emit via socket (Real-time Feel)
      if (socketRef.current) {
        socketRef.current.emit("send_message", {
          message: savedMessage
        });
      }

      // Update the optimistic message with the real one from DB
      setMessages((prev) => 
        prev.map(m => m._id === tempId ? savedMessage : m)
      );

    } catch (err) {
      console.error("Failed to send message:", err);
      // Remove optimistic message on failure
      setMessages((prev) => prev.filter(m => m._id !== tempId));
    }
  };



  const handleUpdateConnection = async (status: "accepted" | "rejected") => {
    try {
      if (!connection?._id) return;
      
      const action = status === "accepted" ? "accept" : "reject";
      await api.patch(`/connections/${connection._id}/${action}`);
      await fetchConnection();
      
      // ✅ Optional: Send a system message via socket if possible, 
      // or just refresh messages
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

  // ✅ mark as read
  useEffect(() => {
    if (!connectionId) return;

    api.post(`/chat/read/${connectionId}`).catch(console.error);
  }, [connectionId, accessToken]);

  return (
    <div className="flex flex-col h-full bg-[#f8f9fa] shadow-2xl relative w-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white/95 backdrop-blur-xl sticky top-0 z-20">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-gray-100 to-gray-200 overflow-hidden flex items-center justify-center ring-2 ring-white shadow-sm relative">
              {receiverImage ? (
                <Image
                  src={receiverImage}
                  alt={receiverName || "profile"}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <span className="text-[16px] font-semibold text-gray-500">
                  {receiverName?.substring(0, 2).toUpperCase()}
                </span>
              )}
            </div>
            {/* Online Indicator */}
            <div className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-[#20B271] rounded-full border-2 border-white"></div>
          </div>
          <div>
            <h2 className="text-[17px] font-bold text-gray-900 tracking-tight leading-tight">
              {receiverName || "Loading..."}
            </h2>
            <p className="text-[13px] text-[#20B271] font-medium mt-0.5">Online</p>
          </div>
        </div>

        <button className="p-2.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100/80 rounded-full transition-all">
          <MoreVertical className="w-5 h-5" />
        </button>
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
                <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                   <p className="text-sm font-bold text-emerald-900 leading-none">New Booking Request</p>
                   <p className="text-xs text-emerald-600 mt-1 font-medium">Review to enable chat</p>
                </div>
            </div>
            <div className="flex gap-2">
                <button onClick={() => handleUpdateConnection("rejected")} className="bg-white border border-red-100 text-red-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-50 transition-colors">Reject</button>
                <button onClick={() => handleUpdateConnection("accepted")} className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-700 transition-shadow shadow-md">Accept Request</button>
            </div>
        </div>
      )}

      {connection?.status === "accepted" && (
        <div className="bg-emerald-50/50 border-b border-emerald-100/50 p-2 flex items-center justify-center gap-2">
            <Check className="w-3.5 h-3.5 text-emerald-500" />
            <p className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Request Accepted · Chat Enabled</p>
        </div>
      )}

      {connection?.status === "rejected" && (
        <div className="bg-red-50 border-b border-red-100 p-2 flex items-center justify-center gap-2">
            <X className="w-3.5 h-3.5 text-red-500" />
            <p className="text-[11px] font-bold text-red-700 uppercase tracking-wider">Request Rejected</p>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 pb-2">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">👋</span>
            </div>
            <h3 className="text-lg font-medium text-gray-800">Say Hello!</h3>
            <p className="text-sm text-gray-500 mt-1 max-w-[250px]">
              Start the conversation with {receiverName || "your contact"}.
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {messages.map((msg) => (
              <MessageBubble
                key={msg._id}
                message={msg}
                currentUserId={currentUserId}
              />
            ))}
            <div ref={endOfMessagesRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="relative bg-[#f8f9fa] z-20 border-t">
        <ChatInput onSend={handleSendMessage} disabled={isChatDisabled || connection?.status === "rejected"} />
        
        {/* Footer Actions (Brand Only) */}
        {isBrand && (
            <div className="p-3 px-6 flex justify-end bg-white">
                <button
                    onClick={async () => {
                        if (!connection?._id) return;
                        
                        // 🔥 Use Gig from URL if available, otherwise fallback to connection's default gig
                        const activeGigId = urlGigId || connection.gigId;

                        try {
                            const res = await api.post("/orders", {
                                gigId: activeGigId,
                                buyerId: user?.id,
                                influencerId: receiverId,
                                connectionId: connection._id,
                            });
                            window.location.href = `/payment?orderId=${res.data.orderId}`;
                        } catch (err: unknown) {
                            const errorResponse = err as { response?: { data?: { message?: string } } };
                            alert(errorResponse.response?.data?.message || "Failed to create order");
                        }
                    }}
                    disabled={connection?.status !== "accepted"}
                    className="bg-[#059669] text-white px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-emerald-500/20 hover:bg-[#047857] transition-all disabled:opacity-50 disabled:grayscale text-sm"
                >
                    {connection?.status === "accepted" 
                        ? (urlGigId ? "Confirm & Place Order" : "Place Order Now") 
                        : "Waiting for Acceptance..."}
                </button>
            </div>
        )}
      </div>
    </div>
  );
}