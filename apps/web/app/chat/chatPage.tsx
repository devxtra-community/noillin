"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { MessageSquare } from "lucide-react";
import Image from "next/image";

import api from "@/lib/axios.client";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { useAuthStore } from "@/store/auth.store";

interface Conversation {
  _id: string;
  gigRequestId: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  gigTitle?: string;
  user: {
    _id: string;
    name: string;
    profileImage?: string;
  };
}

export default function ChatPage() {
  const params = useSearchParams();
  const router = useRouter();
  const { user, accessToken } = useAuthStore();


  const [conversations, setConversations] = useState<Conversation[]>([]);
  const gigRequestId = params.get("gigRequestId");

  // ✅ Conversations (Sidebar)
  useEffect(() => {
    if (!accessToken) return;
    api.get("/chat/conversations")
      .then((res) => setConversations(res.data.conversations || []))
      .catch(console.error);
  }, [accessToken]);

  if (!user) return <div className="p-8">Loading profile...</div>;

  const currentUserId = user.id;
  const activeConv = conversations.find((c) => c.gigRequestId === gigRequestId);

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
              className={`p-3 rounded-xl cursor-pointer transition-all ${conv.gigRequestId === gigRequestId ? 'bg-emerald-50 border-emerald-100 border' : 'hover:bg-gray-50'}`}
              onClick={() => router.push(`/chat?gigRequestId=${conv.gigRequestId}`)}

            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full shrink-0 overflow-hidden relative">
                  {conv.user.profileImage && (
                    <Image
                      src={conv.user.profileImage}
                      alt={conv.user.name}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-sm text-gray-900 truncate">{conv.user.name}</p>
                  <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-tight truncate">{conv.gigTitle}</p>
                  <p className="text-xs text-gray-500 truncate">{conv.lastMessage}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Chat Area */}
      <main className="flex-1 flex flex-col relative bg-white">
        {gigRequestId ? (
          <ChatWindow
            currentUserId={currentUserId}
            gigRequestId={gigRequestId}
            receiverId={activeConv?.user?._id || ""}
            receiverName={activeConv?.user?.name}
            receiverImage={activeConv?.user?.profileImage}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
            <MessageSquare className="w-12 h-12 mb-4 opacity-20" />
            <p className="font-medium">Select a conversation to start chatting</p>
          </div>
        )}
      </main>
    </div>
  );
}