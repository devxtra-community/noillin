"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { MessageSquare, Search } from "lucide-react";

import { ChatWindow } from "@/components/chat/ChatWindow";
import { useAuthStore } from "@/store/auth.store";
import { cn } from "@/lib/utils";

interface Conversation {
  _id: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  user: {
  _id: string;
  name: string;
  role: string;
  profileImage?: string; // ✅ ADD
};
}

export default function ChatPage() {
  const params = useSearchParams();
  const { user, accessToken } = useAuthStore();

  const [conversations, setConversations] = useState<Conversation[]>([]);

  // ✅ Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/chat/conversations",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const data = await res.json();
        console.log("CONVERSATIONS API:", data);

        setConversations(data.conversations || []);
      } catch (err) {
        console.error("Error fetching conversations", err);
      }
    };

    if (accessToken) fetchConversations();
  }, [accessToken]);

  if (!user) return <div>Loading...</div>;

  const currentUserId = user.id;
  const receiverId = params.get("to");

  if (!receiverId) return <div>No receiver selected</div>;

  // ✅ FIX: move outside JSX
  const activeConv = conversations.find(
    (c) => c.user._id === receiverId
  );

  return (
    <div className="flex h-[100dvh] w-full bg-[#f8f9fa] overflow-hidden font-sans">
      {/* 🔵 Sidebar */}
      <aside className="hidden md:flex flex-col w-80 lg:w-[380px] bg-white border-r border-gray-200 shadow-[2px_0_15px_rgba(0,0,0,0.03)] z-30 transition-all">
        <div className="p-6 border-b border-gray-100 shrink-0 bg-white">
          <h1 className="text-[22px] font-bold flex items-center text-gray-900 tracking-tight">
            <div className="bg-[#20B271] p-2 rounded-xl mr-3 shadow-sm">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            Messages
          </h1>
          <div className="mt-6 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search messages..." 
              className="w-full bg-gray-50 border border-gray-200 text-sm rounded-full pl-10 pr-4 py-2.5 focus:outline-none focus:ring-4 focus:ring-[#20B271]/10 focus:border-[#20B271]/30 transition-all placeholder:text-gray-400 text-gray-800" 
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1 bg-white">
          {conversations.length === 0 && (
            <div className="flex flex-col items-center justify-center h-40 text-center px-4">
              <MessageSquare className="w-10 h-10 text-gray-200 mb-3" />
              <p className="text-sm font-medium text-gray-500">No conversations yet</p>
              <p className="text-xs text-gray-400 mt-1">Start chatting to see them here.</p>
            </div>
          )}

          {conversations.map((conv) => {
            const isActive = receiverId === conv.user._id;
            return (
              <div
                key={conv._id}
                className={cn(
                  "p-3 rounded-2xl cursor-pointer transition-all duration-200 group flex items-center justify-between",
                  isActive
                    ? "bg-[#20B271]/10 shadow-[inner_0_0_0_1px_rgba(32,178,113,0.2)]"
                    : "hover:bg-gray-50"
                )}
                onClick={() => {
                  window.location.href = `/chat?to=${conv.user._id}`;
                }}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  
                  {/* PROFILE IMAGE */}
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-gray-100 to-gray-200 overflow-hidden flex items-center justify-center ring-2 ring-white shadow-sm">
                      {conv.user.profileImage ? (
                        <img
                          src={conv.user.profileImage}
                          alt="profile"
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                      ) : (
                        <span className="text-[15px] font-semibold text-gray-500">
                          {conv.user.name?.substring(0, 2).toUpperCase()}
                        </span>
                      )}
                    </div>
                    {/* Simulated online status for active users, otherwise just a style */}
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#20B271] text-white flex items-center justify-center rounded-full border-2 border-white shadow-sm"></div>
                  </div>

                  {/* NAME + LAST MESSAGE */}
                  <div className="min-w-0 pr-2">
                    <p className={cn(
                      "font-semibold text-[15px] truncate",
                      isActive ? "text-[#18965f]" : "text-gray-900"
                    )}>
                      {conv.user.name || "Unknown"}
                    </p>
                    <p className={cn(
                      "text-[13px] truncate mt-0.5",
                      isActive ? "text-[#20B271]/80 font-medium" : "text-gray-500"
                    )}>
                      {conv.lastMessage}
                    </p>
                  </div>
                </div>

                {/* TIME + UNREAD */}
                <div className="flex flex-col items-end shrink-0 pl-2">
                  <span className={cn(
                    "text-[11px] font-medium",
                    isActive ? "text-[#20B271]/70" : "text-gray-400"
                  )}>
                    {new Date(conv.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>

                  {conv.unreadCount > 0 && (
                    <span className="bg-[#20B271] text-white min-w-[20px] h-[20px] rounded-full text-[11px] font-bold flex items-center justify-center px-1.5 mt-1.5 shadow-sm">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </aside>

      {/* 🟢 Chat Window */}
      <main className="flex-1 flex flex-col bg-[#f8f9fa] shadow-inner relative z-0">
        <ChatWindow
          currentUserId={currentUserId}
          receiverId={receiverId}
          receiverName={activeConv?.user?.name}
            receiverImage={activeConv?.user?.profileImage} // ✅ ADD THIS

        />
      </main>
    </div>
  );
}