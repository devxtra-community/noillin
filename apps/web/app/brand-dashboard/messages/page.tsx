"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Search, Loader2, MessageSquare, Sparkles, Filter } from "lucide-react";
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
                        name: otherUser.fullName || otherUser.username || otherUser.name || "Unknown",
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
            const res = await api.get("/chat/conversations?role=brand");
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
        <div className="px-2 sm:px-6 py-6 w-full min-h-[calc(100vh-100px)] flex flex-col max-w-[1600px] mx-auto">
            <div className="flex bg-white rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-100 flex-1 overflow-hidden relative">

                {/* Sidebar */}
                <div className={`w-full lg:w-[380px] border-r border-slate-100 flex-col bg-slate-50/50 shrink-0 ${selectedConvId ? "hidden lg:flex" : "flex"} relative z-10`}>
                    <div className="p-6 pb-4">
                        <div className="flex items-center justify-between mb-6">
                           <h1 className="text-2xl font-black text-slate-900 tracking-tight">Messages</h1>
                           <button className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all">
                               <Filter className="w-5 h-5" />
                           </button>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="w-4 h-4 text-slate-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search conversations..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all shadow-sm"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-1.5 custom-scrollbar" data-lenis-prevent>
                        {loadingConvs ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-4">
                                <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Syncing Messages...</p>
                            </div>
                        ) : filteredConvs.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-4 px-6 text-center">
                                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                                    <MessageSquare className="w-8 h-8 text-slate-300" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-600">No conversations found</p>
                                    <p className="text-xs mt-1 leading-relaxed">When an influencer accepts your gig, the conversation will appear here.</p>
                                </div>
                            </div>
                        ) : filteredConvs.map((conv) => (
                            <button
                                key={conv.gigRequestId}
                                onClick={() => setSelectedConvId(conv.gigRequestId)}
                                className={`w-full p-3.5 rounded-[20px] transition-all flex items-start gap-3 group text-left relative overflow-hidden ${selectedConvId === conv.gigRequestId
                                    ? "bg-white shadow-lg shadow-slate-200/50 border border-emerald-100"
                                    : "hover:bg-white hover:shadow-sm border border-transparent"
                                    }`}
                            >
                                {selectedConvId === conv.gigRequestId && (
                                     <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-emerald-500 rounded-r-full" />
                                )}
                                <div className="w-12 h-12 rounded-[18px] flex items-center justify-center text-sm font-black shrink-0 shadow-sm bg-slate-100 text-slate-600 border border-slate-200 relative ml-1">
                                    {conv.user.name?.charAt(0) || "?"}
                                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-[2.5px] border-white rounded-full" />
                                </div>
                                <div className="flex-1 min-w-0 pt-0.5">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className={`font-bold text-[14px] truncate ${selectedConvId === conv.gigRequestId ? "text-slate-900" : "text-slate-700 group-hover:text-emerald-600 transition-colors"}`}>{conv.user.name || "Unknown"}</span>
                                        <span className={`text-[10px] font-bold shrink-0 ml-2 uppercase tracking-wider ${conv.unreadCount > 0 ? "text-emerald-600" : "text-slate-400"}`}>{formatTime(conv.lastMessageTime)}</span>
                                    </div>
                                    <p className="text-[11px] text-emerald-600 font-bold truncate mb-0.5">{conv.gigTitle}</p>
                                    <p className={`text-[13px] truncate pr-4 ${conv.unreadCount > 0 ? "font-bold text-slate-900" : "text-slate-500"}`}>
                                        {conv.lastMessage}
                                    </p>
                                </div>
                                {conv.unreadCount > 0 && (
                                    <div className="absolute right-4 bottom-4 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center shrink-0 text-white text-[10px] font-black shadow-md shadow-emerald-500/20">
                                        {conv.unreadCount}
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Chat Area */}
                {selectedConvId && activeConv && currentUserId ? (
                    <div className={`flex-1 flex-col min-w-0 bg-white relative z-20 ${selectedConvId ? "flex" : "hidden lg:flex"}`}>
                        <ChatWindow
                            currentUserId={currentUserId}
                            gigRequestId={selectedConvId}
                            receiverId={activeConv.user._id}
                            receiverName={activeConv.user.name}
                            receiverImage={activeConv.user.profileImage || undefined}
                            onBack={() => setSelectedConvId(null)}
                        />
                    </div>
                ) : (
                    <div className={`flex-1 flex-col items-center justify-center text-slate-400 gap-6 hidden lg:flex bg-slate-50/30`}>
                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 relative">
                            <MessageSquare className="w-10 h-10 text-emerald-100" />
                            <Sparkles className="w-6 h-6 text-emerald-400 absolute top-4 right-4" />
                        </div>
                        <div className="text-center">
                            <h2 className="font-black text-xl text-slate-700 mb-2">Your Inbox</h2>
                            <p className="text-sm font-medium text-slate-500 max-w-[280px]">Select a conversation from the sidebar to view messages, proposals, and deliverables.</p>
                        </div>
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