import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

import { LanguageProvider } from "./contexts/LanguageContext.jsx";
import HashScroll from "./components/HashScroll"; // ✅ your component

// Service Worker + Notification permission (keep your existing code)
async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  try {
    const registration = await navigator.serviceWorker.register("/sw.js");
    console.log("✅ Service Worker registered:", registration);
  } catch (err) {
    console.error("❌ Service Worker registration failed:", err);
  }
}

async function requestNotificationPermission() {
  if (!("Notification" in window)) return;
  const permission = await Notification.requestPermission();
  if (permission !== "granted") console.warn("🔕 Notifications not granted");
}

registerServiceWorker();
requestNotificationPermission();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <HashScroll />
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>
);
