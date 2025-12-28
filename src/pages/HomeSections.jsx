// src/pages/HomeSections.jsx
import React from "react";

import Home from "./Home";
import Sermons from "./Sermons";
import Events from "./Events";
import News from "./News";
import About from "./About";
import Projects from "./Projects";
import Contact from "./Contact";

export default function HomeSections({ hideEvents = false, hideHeroAnchor = false }) {
  return (
    <main className="page">
      <Home />
      <Sermons />

      {/* On event details page we usually hide the Events section to avoid “double events”
          but if you want it visible, set hideEvents={false} */}
      {!hideEvents && <Events />}

      <News />
      <About />
      <Projects />
      <Contact />
    </main>
  );
}
