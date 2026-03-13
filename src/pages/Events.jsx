import React from "react";
import "../styling/events.css";
import { useLanguage } from "../contexts/LanguageContext";
import { sectionTexts } from "../i18n/sectionTexts";

function Events() {
  const { lang } = useLanguage();
  const tRoot = sectionTexts[lang] || sectionTexts.en;
  const t = tRoot.events || {};

  return (
    <main className="page events-page" id="events">
      <section className="section-header events-header animate-fade-up">
        <div className="events-header-badge">
          {t.badge || "Church Calendar"}
        </div>
        <h2>{t.sectionTitle || "Church Services & Events"}</h2>
        <p>
          {t.sectionIntro ||
            "Stay up to date with our latest church services, worship times, and upcoming events."}
        </p>
      </section>

      <section className="events-embed-wrap animate-fade-up">
        <div className="events-embed-card">
          <div className="events-embed-topbar">
            <div className="events-embed-topbar-badge">
              Live ChurchSuite Calendar
            </div>
            <p className="events-embed-topbar-text">
              Service times and events shown below update automatically from the
              church calendar.
            </p>
          </div>

          <div className="events-embed-frame-wrap">
            <iframe
              title="Debre-Genet Holy Trinity Church Calendar"
              frameBorder="0"
              allowTransparency="true"
              scrolling="yes"
              src="https://dght.churchsuite.com/-/calendar/4b62ba5d-f1b0-45e3-86bc-7ac1e497980b"
              className="events-embed-frame"
            />
          </div>
        </div>
      </section>
    </main>
  );
}

export default Events;