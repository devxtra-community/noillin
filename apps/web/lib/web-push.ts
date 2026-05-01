import api from "./axios.client";

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export async function registerServiceWorker() {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    return null;
  }
  try {
    const registration = await navigator.serviceWorker.register("/sw.js");
    return registration;
  } catch (error) {
    console.error("Service Worker registration failed:", error);
    return null;
  }
}

export async function subscribeUser() {
  try {
    const registration = await registerServiceWorker();
    if (!registration) return false;

    // Only subscribe if already granted to avoid spamming
    // Alternatively, request if default
    let permission = Notification.permission;
    if (permission === "default") {
      permission = await Notification.requestPermission();
    }
    
    if (permission !== "granted") {
      return false;
    }

    const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!publicVapidKey) {
      console.error("NEXT_PUBLIC_VAPID_PUBLIC_KEY is missing");
      return false;
    }

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
    });

    console.log("Subscribed:", subscription);

    // Send subscription to backend
    await api.post("/notifications/subscriptions", {
      subscription: subscription.toJSON(),
    });
    return true;
  } catch (error) {
    console.error("Failed to subscribe user to push notifications:", error);
    return false;
  }
}
