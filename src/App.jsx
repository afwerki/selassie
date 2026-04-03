// src/App.jsx
import "./App.css";
import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import NewsArticle from "./pages/NewsArticle"; // you said you created it

function App() {
  return (
    <Routes>
      {/* Your normal site */}
      <Route path="/" element={<HomePage />} />

      {/* Optional: if someone goes /news, just show homepage and scroll to news */}
      <Route path="/news" element={<HomePage />} />

      {/* Optional fallback */}
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
}

export default App;
