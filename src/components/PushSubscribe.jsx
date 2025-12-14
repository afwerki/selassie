import { useEffect, useState } from "react";

const WORKER_URL = "https://selassie-push.afe-programmer.workers.dev";

export default function PushSubscribe() {
  const [supported, setSupported] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const isSupported =
      "serviceWorker" in navigator &&
      "PushManager" in window &&
      "Notification" in window;

    setSupported(isSupported);
    if (!isSupported) return;

    checkSubscription();
  }, []);

  async function checkSubscription() {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    setSubscribed(!!sub);
  }

  async function subscribe() {
    setLoading(true);
    try {
      const perm = await Notification.requestPermission();
      if (perm !== "granted") throw new Error("Permission denied");

      const res = await fetch(`${WORKER_URL}/vapidPublicKey`);
      const { publicKey } = await res.json();

      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });

      await fetch(`${WORKER_URL}/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sub),
      });

      setSubscribed(true);
    } catch (e) {
      console.error(e);
      alert("Subscription failed");
    } finally {
      setLoading(false);
    }
  }

  async function unsubscribe() {
    setLoading(true);
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (!sub) return;

      await fetch(`${WORKER_URL}/unsubscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sub),
      });

      await sub.unsubscribe();
      setSubscribed(false);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  if (!supported) return null;

  return (
    <button onClick={subscribed ? unsubscribe : subscribe} disabled={loading}>
      {subscribed ? "Disable Notifications" : "Enable Notifications"}
    </button>
  );
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}
