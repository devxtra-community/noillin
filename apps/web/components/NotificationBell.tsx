"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, X } from "lucide-react";
import { useRouter } from "next/navigation";

import { useNotificationStore, Notification } from "@/store/notification.store";
import { useAuthStore } from "@/store/auth.store";

export default function NotificationBell() {
  const { notifications, unreadCount, loading, fetchNotifications, markAsRead } = useNotificationStore();
  const { accessToken, user } = useAuthStore();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const mountedRef = useRef(false);

useEffect(() => {
  mountedRef.current = true;
}, []);

  // Fetch notifications on mount if user is logged in
  useEffect(() => {
    if (mountedRef && accessToken) {
      fetchNotifications();
    }
  }, [mountedRef, accessToken, fetchNotifications]);

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Don't render the bell if the user is not authenticated or component is not mounted
  if (!mountedRef || !accessToken) return null;

  const handleNotificationClick = (notification: Notification) => {
    console.log("🔥 CLICKED NOTIFICATION FULL:", JSON.stringify(notification, null, 2));
    console.log("🔥 TYPE VALUE:", notification?.type);
    console.log("🔥 METADATA VALUE:", notification?.metadata);
    console.log("🔥 CONNECTION ID:", notification?.metadata?.connectionId);
    console.log("🔥 CONVERSATION ID:", notification?.metadata?.conversationId);

    if (!notification.read) {
      markAsRead(notification._id);
    }

    // TEST ROUTER PUSH (Uncomment if needed)
    // console.log("🔥 TEST ROUTER PUSH");
    // router.push("/influencer-dashboard");
    // return;

    const type = notification?.type?.toUpperCase();

    if (type === "GIG_REQUEST") {
      console.log("✅ Navigating to gig request");
      if (user?.role === "BRAND") {
        const id = notification?.metadata?.connectionId || notification?.metadata?.gigRequestId || "";
        router.push(id ? `/brand-dashboard/requests/${id}` : `/brand-dashboard/requests`);
      } else {
        router.push(`/influencer-dashboard/requests`);
      }
      setIsOpen(false);

    } else if (type === "NEW_MESSAGE") {
      const targetId = notification?.metadata?.connectionId || notification?.metadata?.conversationId;
      if (targetId) {
        router.push(`/chat/${targetId}`);
        setIsOpen(false);
      } else {
        console.warn("❌ Missing metadata for NEW_MESSAGE", notification);
        setIsOpen(false);
      }

    } else {
      console.warn("❌ Unknown navigation type", notification);
      // Fallback
      setIsOpen(false);
    }
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-[#059669] hover:bg-green-50 rounded-full transition-colors focus:outline-none"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
        )}
      </button>

      {isOpen && (
        <>
          {/* Mobile backdrop */}
          <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[90] sm:hidden" onClick={() => setIsOpen(false)} />
          
          <div className="fixed sm:absolute inset-0 sm:inset-auto sm:right-0 sm:mt-3 sm:w-[400px] bg-white sm:rounded-[24px] shadow-2xl sm:border border-slate-100 overflow-hidden z-[100] animate-in slide-in-from-bottom-4 sm:slide-in-from-top-2 fade-in-0 duration-300 flex flex-col h-[100dvh] sm:h-auto sm:max-h-[85vh]">
            <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
              <h3 className="font-black text-slate-900 text-lg sm:text-base tracking-tight">Notifications</h3>
              <div className="flex items-center gap-3">
                {unreadCount > 0 && (
                  <span className="text-[10px] font-black bg-emerald-500 text-white px-2.5 py-1 rounded-full uppercase tracking-widest shadow-sm shadow-emerald-500/20">
                    {unreadCount} new
                  </span>
                )}
                <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-full bg-slate-50 text-slate-400 sm:hidden hover:bg-slate-100">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div 
              className="flex-1 overflow-y-auto sm:max-h-[420px] custom-scrollbar bg-slate-50/50"
              data-lenis-prevent
            >
              {loading && notifications.length === 0 ? (
                <div className="p-10 flex justify-center">
                  <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-10 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-white shadow-sm border border-slate-100 rounded-full flex items-center justify-center mb-4">
                    <Bell className="w-6 h-6 text-slate-300" />
                  </div>
                  <p className="text-sm text-slate-900 font-bold mb-1">No notifications yet</p>
                  <p className="text-xs text-slate-400">We&apos;ll let you know when something happens.</p>
                </div>
              ) : (
                <ul className="divide-y divide-slate-100/50">
                  {notifications.map((notification) => (
                    <li
                      key={notification._id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`p-5 transition-all cursor-pointer group ${!notification.read ? "bg-white hover:bg-emerald-50/30" : "bg-transparent hover:bg-white"
                        }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="mt-1.5 shrink-0">
                          {notification.read ? (
                            <div className="w-2 h-2 bg-slate-200 rounded-full"></div>
                          ) : (
                            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-sm shadow-emerald-500/50 ring-4 ring-emerald-50"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className={`text-[13px] leading-relaxed ${!notification.read ? "text-slate-900 font-bold" : "text-slate-600 font-medium"}`}>
                            {notification.message}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-widest">
                            {formatTime(notification.createdAt)}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
