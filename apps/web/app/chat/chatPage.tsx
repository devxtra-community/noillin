"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { MessageSquare } from "lucide-react";

import api from "@/lib/axios.client";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { useAuthStore } from "@/store/auth.store";

interface Conversation {
  _id: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  user: {
    _id: string;
    name: string;
    profileImage?: string;
  };
}

export default function ChatPage() {
  const params = useSearchParams();
  const { user, accessToken } = useAuthStore();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const receiverId = params.get("to");

  // ✅ Conversations (Sidebar)
  useEffect(() => {
    if (!accessToken) return;
    api.get("/chat/conversations")
      .then((res) => setConversations(res.data.conversations || []))
      .catch(console.error);
  }, [accessToken]);

  if (!user) return <div className="p-8">Loading profile...</div>;
  if (!receiverId) return <div className="p-8">No receiver selected</div>;

  const currentUserId = user.id;
  const activeConv = conversations.find((c) => c.user._id === receiverId);

  return (
    <div className="flex h-screen bg-gray-50">

      {/* Sidebar */}
      <aside className="w-80 border-r bg-white p-4 shadow-sm z-10">
        <h2 className="font-bold mb-6 flex items-center text-gray-900">
          <MessageSquare className="mr-2 text-emerald-600" /> Messages
        </h2>

        <div className="space-y-2">
            {conversations.map((conv) => (
            <div
                key={conv._id}
                className={`p-3 rounded-xl cursor-pointer transition-all ${conv.user._id === receiverId ? 'bg-emerald-50 border-emerald-100 border' : 'hover:bg-gray-50'}`}
                onClick={() => (window.location.href = `/chat?to=${conv.user._id}`)}
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full shrink-0 overflow-hidden">
                        {conv.user.profileImage && <img src={conv.user.profileImage} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <div className="min-w-0">
                        <p className="font-bold text-sm text-gray-900 truncate">{conv.user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{conv.lastMessage}</p>
                    </div>
                </div>
            </div>
            ))}
        </div>
      </aside>

      {/* Chat Area */}
      <main className="flex-1 flex flex-col relative bg-white">
        <ChatWindow
          currentUserId={currentUserId}
          receiverId={receiverId}
          receiverName={activeConv?.user?.name}
          receiverImage={activeConv?.user?.profileImage}
        />
      </main>
    </div>
  );
}