/* global self, clients, console */
self.addEventListener("push", (event) => {
  console.log("Push event received:", event);
  const data = event.data?.json() || {};

  const title = data.title || "New Notification";
  const options = {
    body: data.body || "",
    icon: "/icon.png",
    data: data.url || "/"
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  event.waitUntil(
    clients.openWindow(event.notification.data || "/")
  );
});
