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
        <div className="fixed sm:absolute top-20 sm:top-full left-4 sm:left-auto right-4 sm:right-0 mt-2 w-auto sm:w-80 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden z-50 animate-in slide-in-from-top-2 fade-in-0 duration-200">
          <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 className="font-bold text-gray-900 text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <span className="text-xs font-bold bg-green-100 text-[#059669] px-2 py-0.5 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>

          <div className="max-h-[350px] sm:max-h-96 overflow-y-auto">
            {loading && notifications.length === 0 ? (
              <div className="p-6 flex justify-center">
                <div className="w-5 h-5 border-2 border-[#059669] border-t-transparent rounded-full animate-spin"></div>
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
                <p className="text-sm text-gray-500 font-medium">No notifications yet</p>
                <p className="text-xs text-gray-400 mt-1">We&apos;ll let you know when something happens.</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-50">
                {notifications.map((notification) => (
                  <li
                    key={notification._id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`px-5 py-4 transition-colors cursor-pointer group ${!notification.read ? "bg-green-50/30 hover:bg-green-50/50" : "hover:bg-gray-50"
                      }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1.5 shrink-0 w-2 h-2 flex items-center justify-center">
                        {!notification.read && (
                          <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-sm shadow-emerald-200"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-[13px] leading-snug ${!notification.read ? "text-gray-900 font-extrabold" : "text-gray-600 font-medium"}`}>
                          {notification.message}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-1.5 font-bold uppercase tracking-wider">
                          {formatTime(notification.createdAt)}
                        </p>
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
