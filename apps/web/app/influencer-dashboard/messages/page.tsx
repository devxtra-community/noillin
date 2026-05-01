"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Search, Loader2, MessageSquare } from "lucide-react";
import { useSearchParams } from "next/navigation";

import api from "@/lib/axios.client";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { useAuthStore } from "@/store/auth.store";

interface Conversation {
    gigRequestId: string;
    lastMessage: string;
    lastMessageTime: string;
    unreadCount: number;
    gigTitle: string;
    user: {
        _id: string;
        name: string;
        role: string;
        profileImage: string | null;
    };
}



function MessagesContent() {
    const searchParams = useSearchParams();
    const initialGigRequestId = searchParams.get("gigRequestId");

    const [searchQuery, setSearchQuery] = useState("");
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConvId, setSelectedConvId] = useState<string | null>(initialGigRequestId);
    const [loadingConvs, setLoadingConvs] = useState(true);
    const [fetchedConv, setFetchedConv] = useState<Conversation | null>(null);
    const { user } = useAuthStore();
    const currentUserId = user?.id;

    // Fallback for historical gig requests with no existing messages
    useEffect(() => {
        if (!selectedConvId || !currentUserId) return;
        const exists = conversations.find(c => c.gigRequestId === selectedConvId);
        if (exists) {
            setFetchedConv(exists);
            return;
        }

        api.get(`/connections/details/${selectedConvId}`).then(res => {
            const gr = res.data?.connection || res.data?.gigRequest;
            if (gr) {
                const brand = gr.brandId;
                const influencer = gr.influencerId;

                const isBrand = currentUserId === (brand?._id || brand?.id);
                const otherUser = isBrand ? influencer : brand;

                if (!otherUser) return;

                setFetchedConv({
                    gigRequestId: gr._id,
                    lastMessage: "No messages yet",
                    lastMessageTime: gr.updatedAt || gr.createdAt,
                    unreadCount: 0,
                    gigTitle: gr.gigId?.title || "Gig Collaboration",
                    user: {
                        _id: otherUser._id || otherUser.id,
                        name: otherUser.companyName || otherUser.contactPersonName || otherUser.name || "Unknown",
                        role: isBrand ? "INFLUENCER" : "BRAND",
                        profileImage: otherUser.profileImageUrl || otherUser.profileImage || null
                    }
                });
            }
        }).catch(err => console.error("Failed to fetch legacy connection:", err));
    }, [selectedConvId, conversations, currentUserId]);

    const fetchConversations = async () => {
        try {
            setLoadingConvs(true);
            const res = await api.get("/chat/conversations?role=influencer");
            setConversations(res.data.conversations || []);
        } catch (err) {
            console.error("Failed to fetch conversations:", err);
        } finally {
            setLoadingConvs(false);
        }
    };

    useEffect(() => {
        fetchConversations();
    }, []);

    // Removed legacy fetchMessages and handleSend because ChatWindow handles it

    const filteredConvs = conversations.filter(c =>
        (c.user?.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.gigTitle || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    const activeConv = fetchedConv;

    const formatTime = (iso: string) => {
        if (!iso) return "";
        const date = new Date(iso);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        if (diff < 86400000) return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        if (diff < 604800000) return date.toLocaleDateString([], { weekday: "short" });
        return date.toLocaleDateString([], { month: "short", day: "numeric" });
    };

    return (
        <div className="px-2 sm:px-4 py-4 w-full h-[calc(100vh-80px)] lg:h-[calc(100vh-100px)] flex flex-col overflow-hidden">
            <div className="flex bg-white rounded-[24px] lg:rounded-[32px] shadow-xl shadow-gray-100/50 border border-gray-100 flex-1 overflow-hidden">

                {/* Sidebar */}
                <div className="w-[340px] border-r border-gray-100 flex flex-col bg-gray-50/30 shrink-0">
                    <div className="p-6">
                        <h1 className="text-2xl font-black text-gray-900 mb-6">Messages</h1>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="w-4 h-4 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-medium placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-2">
                        {loadingConvs ? (
                            <div className="flex items-center justify-center py-20">
                                <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
                            </div>
                        ) : filteredConvs.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
                                <MessageSquare className="w-10 h-10" />
                                <p className="text-sm font-medium">No conversations yet</p>
                                <p className="text-xs text-center">Accepted gig collaborations will appear here</p>
                            </div>
                        ) : filteredConvs.map((conv) => (
                            <button
                                key={conv.gigRequestId}
                                onClick={() => setSelectedConvId(conv.gigRequestId)}
                                className={`w-full p-4 rounded-[20px] transition-all flex items-start gap-3 group text-left ${selectedConvId === conv.gigRequestId
                                    ? "bg-white shadow-lg shadow-gray-200/50 border border-emerald-100"
                                    : "hover:bg-white hover:shadow-md border border-transparent"
                                    }`}
                            >
                                <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-sm font-black shrink-0 shadow-sm bg-emerald-50 text-emerald-700 relative">
                                    {conv.user.name?.charAt(0) || "?"}
                                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-0.5">
                                        <span className="font-bold text-[14px] text-gray-900 truncate">{conv.user.name || "Unknown"}</span>
                                        <span className="text-[11px] font-bold text-gray-400 shrink-0 ml-2">{formatTime(conv.lastMessageTime)}</span>
                                    </div>
                                    <p className="text-[11px] text-emerald-600 font-bold truncate mb-0.5">{conv.gigTitle}</p>
                                    <p className={`text-[13px] truncate ${conv.unreadCount > 0 ? "font-bold text-gray-900" : "text-gray-500"}`}>
                                        {conv.lastMessage}
                                    </p>
                                </div>
                                {conv.unreadCount > 0 && (
                                    <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center shrink-0 text-white text-[10px] font-black">
                                        {conv.unreadCount}
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Chat Area */}
                {selectedConvId && activeConv && currentUserId ? (
                    <div className="flex-1 flex flex-col min-w-0 border-l border-gray-100">
                        <ChatWindow
                            currentUserId={currentUserId}
                            gigRequestId={selectedConvId}
                            receiverId={activeConv.user._id}
                            receiverName={activeConv.user.name}
                            receiverImage={activeConv.user.profileImage || undefined}
                        />
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-4">
                        <MessageSquare className="w-14 h-14 opacity-30" />
                        <p className="font-medium text-sm">Select a conversation to start chatting</p>
                        <p className="text-xs text-center max-w-[240px]">Conversations appear here once a brand&apos;s gig request is accepted</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function MessagesPage() {
    return (
        <Suspense fallback={<div className="h-full flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div>}>
            <MessagesContent />
        </Suspense>
    );
}
