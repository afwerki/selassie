import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { LanguageProvider } from "./contexts/LanguageContext.jsx";

// 👉 Register Service Worker (for Web Push)
async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;

  try {
    const registration = await navigator.serviceWorker.register("/sw.js");
    console.log("✅ Service Worker registered:", registration);
  } catch (err) {
    console.error("❌ Service Worker registration failed:", err);
  }
}

// 👉 Request notification permission
async function requestNotificationPermission() {
  if (!("Notification" in window)) return;

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    console.warn("🔕 Notifications not granted");
  }
}

// 👉 Init on page load
registerServiceWorker();
requestNotificationPermission();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </React.StrictMode>
);
