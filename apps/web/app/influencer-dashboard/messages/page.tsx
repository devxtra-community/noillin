"use client";

import React, { useState } from "react";
import { Search, Send, Paperclip, MoreVertical, Globe, User, CheckCheck } from "lucide-react";

interface Message {
    id: number;
    senderId: string;
    text: string;
    timestamp: string;
    isOwn: boolean;
}

interface Chat {
    id: number;
    brand: string;
    avatar: string;
    color: string;
    lastMessage: string;
    timestamp: string;
    status: string;
    unread?: number;
    messages: Message[];
}

export default function MessagesPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedChatId, setSelectedChatId] = useState(1);
    const [messageInput, setMessageInput] = useState("");

    const [chats] = useState<Chat[]>([
        {
            id: 1,
            brand: "Lumina Skincare",
            avatar: "L",
            color: "bg-[#0A192F] text-white",
            lastMessage: "Looking forward to the IG Reel promotion!",
            timestamp: "10:30 AM",
            status: "Booking Pending",
            unread: 1,
            messages: [
                { id: 1, senderId: "lumina", text: "Hi! We'd love to collaborate on an IG Reel for our new vitamin C serum.", timestamp: "10:15 AM", isOwn: false },
                { id: 2, senderId: "me", text: "Sounds great! I've checked the brief. What's the timeline for the first draft?", timestamp: "10:20 AM", isOwn: true },
                { id: 3, senderId: "lumina", text: "Looking forward to the IG Reel promotion!", timestamp: "10:30 AM", isOwn: false },
            ]
        },
        {
            id: 2,
            brand: "Urban Coffee",
            avatar: "U",
            color: "bg-orange-100 text-orange-900",
            lastMessage: "Can we adjust the TikTok campaign dates?",
            timestamp: "Yesterday",
            status: "Active Collaboration",
            messages: [
                { id: 1, senderId: "urban", text: "Hey! Just saw the draft. Can we adjust the TikTok campaign dates for next week?", timestamp: "Yesterday", isOwn: false },
            ]
        },
        {
            id: 3,
            brand: "TechNova",
            avatar: "T",
            color: "bg-teal-50 text-teal-700",
            lastMessage: "Payment secured for the YouTube review.",
            timestamp: "Tue",
            status: "Completed",
            messages: [
                { id: 1, senderId: "technova", text: "Payment secured for the YouTube review. Thanks for the quick turnaround!", timestamp: "Tue", isOwn: false },
            ]
        },
        {
            id: 4,
            brand: "Aura Fashion",
            avatar: "A",
            color: "bg-emerald-50 text-emerald-800",
            lastMessage: "The package has been dispatched.",
            timestamp: "Mon",
            status: "Shipping",
            messages: [
                { id: 1, senderId: "aura", text: "The package has been dispatched. You should receive it by Wednesday.", timestamp: "Mon", isOwn: false },
            ]
        }
    ]);

    const filteredChats = chats.filter(chat =>
        chat.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const activeChat = chats.find(c => c.id === selectedChatId) || chats[0];

    return (
        <div className="px-2 sm:px-4 py-4 w-full h-[calc(100vh-80px)] lg:h-[calc(100vh-100px)] flex flex-col overflow-hidden">
            <div className="flex bg-white rounded-[24px] lg:rounded-[32px] shadow-xl shadow-gray-100/50 border border-gray-100 flex-1 overflow-hidden">

                {/* Sidebar - Message List */}
                <div className="w-[380px] border-r border-gray-100 flex flex-col bg-gray-50/30">
                    <div className="p-6">
                        <h1 className="text-2xl font-black text-gray-900 mb-6">Messages</h1>

                        {/* Search */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="w-4 h-4 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search messages..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-medium placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-2">
                        {filteredChats.map((chat) => (
                            <button
                                key={chat.id}
                                onClick={() => setSelectedChatId(chat.id)}
                                className={`w-full p-4 rounded-[24px] transition-all flex items-start gap-4 group ${selectedChatId === chat.id
                                    ? "bg-white shadow-lg shadow-gray-200/50 border border-emerald-100"
                                    : "hover:bg-white hover:shadow-md border border-transparent"
                                    }`}
                            >
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-black shrink-0 shadow-sm relative ${chat.color}`}>
                                    {chat.avatar}
                                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
                                </div>
                                <div className="flex-1 text-left min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-bold text-[15px] text-gray-900 truncate">{chat.brand}</span>
                                        <span className="text-[11px] font-bold text-gray-400">{chat.timestamp}</span>
                                    </div>
                                    <p className={`text-[13px] truncate ${chat.unread ? "font-bold text-gray-900" : "text-gray-500"}`}>
                                        {chat.lastMessage}
                                    </p>
                                </div>
                                {chat.unread && (
                                    <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full mt-2 shrink-0 animate-pulse"></div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Chat Interface */}
                <div className="flex-1 flex flex-col bg-white">
                    {/* Chat Header */}
                    <div className="px-8 py-5 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-sm font-black shadow-sm ${activeChat.color}`}>
                                {activeChat.avatar}
                            </div>
                            <div>
                                <h3 className="font-bold text-[16px] text-gray-900 leading-none">{activeChat.brand}</h3>
                                <div className="flex items-center gap-2 mt-1.5">
                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{activeChat.status}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="p-2.5 hover:bg-gray-50 rounded-xl text-gray-400 transition-colors">
                                <Globe className="w-5 h-5" />
                            </button>
                            <button className="p-2.5 hover:bg-gray-50 rounded-xl text-gray-400 transition-colors">
                                <MoreVertical className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto px-8 py-8 space-y-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed opacity-95">
                        {activeChat.messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}>
                                <div className={`max-w-[70%] flex flex-col ${msg.isOwn ? "items-end" : "items-start"}`}>
                                    <div className={`px-5 py-3.5 rounded-[24px] text-sm font-medium shadow-sm transition-all hover:shadow-md ${msg.isOwn
                                        ? "bg-emerald-500 text-white rounded-tr-none"
                                        : "bg-gray-100 text-gray-900 rounded-tl-none"
                                        }`}>
                                        {msg.text}
                                    </div>
                                    <div className="flex items-center gap-1.5 mt-1.5 px-1">
                                        <span className="text-[10px] font-bold text-gray-400">{msg.timestamp}</span>
                                        {msg.isOwn && <CheckCheck className="w-3.5 h-3.5 text-emerald-500" />}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Chat Footer / Input */}
                    <div className="px-8 py-6 border-t border-gray-100">
                        <div className="bg-gray-50 p-2 rounded-[28px] border border-gray-100 flex items-center gap-2 focus-within:ring-2 focus-within:ring-emerald-500/10 focus-within:border-emerald-500/30 transition-all">
                            <button className="p-3 hover:bg-white hover:shadow-sm rounded-full text-gray-400 transition-all">
                                <Paperclip className="w-5 h-5" />
                            </button>
                            <input
                                type="text"
                                placeholder="Type a message..."
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium text-gray-900 placeholder:text-gray-400 px-2"
                            />
                            <button
                                className={`p-3 rounded-full transition-all flex items-center justify-center ${messageInput.trim()
                                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200 scale-100"
                                    : "bg-gray-200 text-gray-400 scale-95"
                                    }`}
                            >
                                <Send className="w-5 h-5 ml-0.5" />
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
