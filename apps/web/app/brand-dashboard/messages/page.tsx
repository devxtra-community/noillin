"use client";

import React, { useState } from "react";
import { Search, Paperclip, Send, MoreHorizontal, Circle } from "lucide-react";

const conversations = [
    {
        id: 1,
        name: "Sarah Jenkins",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
        lastMessage: "Looking forward to the IG Reel collabor.",
        time: "10:30 AM",
        status: "Booking Pending",
        unread: false,
        online: false,
    },
    {
        id: 2,
        name: "Marcus Chen",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
        lastMessage: "Can we adjust the TikTok campaign tim",
        time: "Yesterday",
        status: "Active",
        unread: false,
        online: false,
    },
    {
        id: 3,
        name: "Elena",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
        lastMessage: "Content draft ready for review.",
        time: "2m ago",
        status: "Active",
        unread: false,
        online: true,
    },
];

const chatMessages = [
    { id: 1, type: "system", text: "Booking request sent" },
    {
        id: 2,
        type: "received",
        text: "Hi! I saw your request for the IG Reel. I'd love to work with you on this campaign. Do you have a specific deadline in mind?",
    },
    { id: 3, type: "system", text: "Payment secured in escrow" },
    {
        id: 4,
        type: "sent",
        text: "That sounds great! We are looking to go live by next Friday. Does that timeline work for your content creation process?",
    },
    {
        id: 5,
        type: "received",
        text: "Perfect, that's definitely doable. I'll start working on the draft concepts today!",
    },
];

export default function BrandMessagesPage() {
    const [selectedId, setSelectedId] = useState(1);
    const [message, setMessage] = useState("");

    const selectedConversation = conversations.find(c => c.id === selectedId) || conversations[0];

    return (
        <div className="h-full flex flex-col min-h-0 bg-[#f8fafc]">
            <div className="flex flex-1 overflow-hidden">
                {/* Left Column: Conversation List */}
                <div className="w-full lg:w-[400px] border-r border-gray-100 bg-white flex flex-col">
                    <div className="p-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-6">Messages</h1>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search conversations..."
                                className="w-full pl-9 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto px-4 pb-4">
                        <div className="space-y-2">
                            {conversations.map((conv) => (
                                <div
                                    key={conv.id}
                                    onClick={() => setSelectedId(conv.id)}
                                    className={`flex items-center gap-4 p-4 rounded-[2rem] cursor-pointer transition-all ${selectedId === conv.id
                                            ? "bg-emerald-50 shadow-sm"
                                            : "hover:bg-gray-50"
                                        }`}
                                >
                                    <div className="relative shrink-0">
                                        <img src={conv.image} alt="" className="w-12 h-12 rounded-full object-cover shadow-sm" />
                                        {conv.online && (
                                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-0.5">
                                            <h3 className="text-sm font-bold text-gray-900 truncate">{conv.name}</h3>
                                            <span className="text-[10px] font-medium text-gray-400 whitespace-nowrap">{conv.time}</span>
                                        </div>
                                        <p className="text-xs text-gray-400 truncate leading-relaxed">
                                            {conv.lastMessage}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Chat View */}
                <div className="flex-1 flex flex-col bg-[#f8fafc]">
                    {/* Chat Header */}
                    <div className="px-8 py-4 bg-white border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <img src={selectedConversation.image} alt="" className="w-10 h-10 rounded-full object-cover" />
                            <div>
                                <h3 className="text-sm font-bold text-gray-900">{selectedConversation.name}</h3>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{selectedConversation.status}</p>
                            </div>
                        </div>
                        <button className="p-2 hover:bg-gray-50 rounded-xl transition-colors">
                            <MoreHorizontal className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-8 space-y-8">
                        {chatMessages.map((msg) => (
                            <div key={msg.id} className="flex flex-col">
                                {msg.type === "system" ? (
                                    <div className="flex justify-center">
                                        <span className="px-4 py-1.5 bg-gray-100 text-gray-400 text-[10px] font-bold rounded-full uppercase tracking-widest shadow-sm">
                                            {msg.text}
                                        </span>
                                    </div>
                                ) : (
                                    <div className={`flex ${msg.type === "sent" ? "justify-end" : "justify-start"}`}>
                                        <div className={`max-w-[80%] px-6 py-4 rounded-[2rem] text-sm leading-relaxed shadow-sm ${msg.type === "sent"
                                                ? "bg-[#1CD36B] text-white rounded-tr-none"
                                                : "bg-white text-gray-700 border border-gray-50 rounded-tl-none"
                                            }`}>
                                            {msg.text}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Input Area */}
                    <div className="p-8 pb-10 bg-white lg:bg-transparent">
                        <div className="max-w-4xl mx-auto flex items-center gap-4 p-2 bg-white border border-gray-100 rounded-3xl shadow-sm">
                            <button className="p-3 hover:bg-gray-50 rounded-2xl transition-colors shrink-0">
                                <Paperclip className="w-5 h-5 text-gray-400" />
                            </button>
                            <input
                                type="text"
                                placeholder="Type a message..."
                                className="flex-1 px-4 py-2 text-sm bg-gray-50/50 border-none rounded-2xl outline-none focus:ring-0"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                            <button className="p-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl transition-all shadow-lg shadow-emerald-100 active:scale-95 shrink-0">
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
