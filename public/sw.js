self.addEventListener("push", (event) => {
  event.waitUntil(handlePush());
});

async function handlePush() {
  try {
    // Fetch latest notification data from your Worker
    const res = await fetch(
      "https://selassie-push.afe-programmer.workers.dev/latest"
    );
    const data = await res.json();
    if (!data) return;

    const { title, body, url } = data;

    await self.registration.showNotification(title, {
      body,
      icon: "/icon-192.png", // optional
      data: { url },
    });
  } catch (e) {
    console.error("Push failed", e);
  }
}

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/";
  event.waitUntil(clients.openWindow(url));
});
