"use client";

import React, { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { MoreVertical } from "lucide-react";

import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";

import { useAuthStore } from "@/store/auth.store";

export interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  conversationId: string;
  status: "SENT" | "DELIVERED" | "READ";
}

interface ChatWindowProps {
  currentUserId: string;
  receiverId: string;
  receiverName?: string;
  receiverImage?: string; // ✅ ADD THIS

}

export function ChatWindow({
  currentUserId,
  receiverId,
  receiverName,
  receiverImage
}: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const { accessToken } = useAuthStore();

  // ✅ helper
  const getConversationId = (a: string, b: string) =>
    [a, b].sort().join("_");

  // ✅ load messages
  useEffect(() => {
    const fetchMessages = async () => {
      const res = await fetch(
        `http://localhost:5000/api/chat/${receiverId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = await res.json();

      setMessages(data.messages || []);
    };

    if (receiverId) fetchMessages();
  }, [receiverId, accessToken]);

  // ✅ socket
  useEffect(() => {
    const socketInstance = io("http://localhost:6001", {
      auth: { userId: currentUserId },
    });

    socketInstance.on("receive_message", (message: Message) => {
      setMessages((prev) => {
        const exists = prev.find((m) => m._id === message._id);
        if (exists) return prev;

        return [...prev, message];
      });
    });

    // ✅ READ UPDATE (ONLY MY SENT MESSAGES)
    socketInstance.on("messages_read", ({ conversationId }) => {
      setMessages((prev) =>
        prev.map((m) =>
          m.conversationId === conversationId &&
          m.senderId === currentUserId // ✅ IMPORTANT FIX
            ? { ...m, status: "READ" }
            : m
        )
      );
    });

    socketRef.current = socketInstance;

    return () => {socketInstance.disconnect()};
  }, [currentUserId]);

  // ✅ auto scroll
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ send message
  const handleSendMessage = (content: string) => {
    if (!socketRef.current || !content.trim()) return;

    const conversationId = getConversationId(
      currentUserId,
      receiverId
    );

    // ✅ optimistic message (FIXED)
    const tempMessage: Message = {
      _id: "temp-" + Date.now(),
      senderId: currentUserId,
      receiverId,
      content,
      createdAt: new Date().toISOString(),
      conversationId,
      status: "SENT"
    };

    setMessages((prev) => [...prev, tempMessage]);

    socketRef.current.emit("send_message", {
      receiverId,
      content,
    });
  };

  // ✅ mark as read
  useEffect(() => {
    if (!receiverId) return;

    fetch(`http://localhost:5000/api/chat/read/${receiverId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }, [receiverId, accessToken]);

  return (
    <div className="flex flex-col h-full bg-[#f8f9fa] shadow-2xl relative w-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white/95 backdrop-blur-xl sticky top-0 z-20">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-gray-100 to-gray-200 overflow-hidden flex items-center justify-center ring-2 ring-white shadow-sm">
              {receiverImage ? (
                <img
                  src={receiverImage}
                  alt="profile"
                  className="w-full h-full object-cover"
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
      <div className="relative bg-[#f8f9fa] z-20">
        <ChatInput onSend={handleSendMessage} />
      </div>
    </div>
  );
}