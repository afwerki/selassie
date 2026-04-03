// src/App.jsx
import "./App.css";
import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";

function App() {
  return (
    <Routes>
      {/* Your normal site */}
      <Route path="/" element={<HomePage />} />

      {/* Optional fallback */}
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
}

export default App;
