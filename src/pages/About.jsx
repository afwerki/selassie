// src/pages/About.jsx
import { useMemo, useRef, useState, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { texts } from "../i18n/aboutText";
import "../styling/about.css";

import selasssie from "../assets/images/selassie.png";

const IconSpark = () => (
  <svg className="about-ic" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2l1.6 6.1L20 10l-6.4 1.9L12 18l-1.6-6.1L4 10l6.4-1.9L12 2zm8 8l.7 2.7L23 13l-2.3.3L20 16l-.7-2.7L17 13l2.3-.3L20 10z" />
  </svg>
);

export default function About() {
  const { lang } = useLanguage();
  const t = useMemo(() => texts[lang]?.about || texts.en.about, [lang]);

  const scrollerRef = useRef(null);
  const [fadeTop, setFadeTop] = useState(false);
  const [fadeBottom, setFadeBottom] = useState(true);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const updateFades = () => {
      const st = el.scrollTop;
      const max = el.scrollHeight - el.clientHeight;

      setFadeTop(st > 2);
      setFadeBottom(st < max - 2);
    };

    updateFades();
    el.addEventListener("scroll", updateFades, { passive: true });
    window.addEventListener("resize", updateFades);

    return () => {
      el.removeEventListener("scroll", updateFades);
      window.removeEventListener("resize", updateFades);
    };
  }, []);

  return (
    <main className="page about-page" id="about">
      {/* Background Video (placeholder) */}
      <section className="about-hero">
        <div className="about-videoWrap" aria-hidden="true">
          <video
            className="about-video"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={selasssie}
          >
            <source src="/videos/selassie-bg.webm" type="video/webm" />
            <source src="/videos/selassie-bg.mp4" type="video/mp4" />
          </video>
          <div className="about-videoOverlay" />
          <div className="about-videoNoise" />
        </div>

        <div className="about-heroInner">
          <div className="about-heroBadge">
            <span className="about-heroBadgeIcon" aria-hidden="true">
              <IconSpark />
            </span>
            <span className="about-heroBadgeText">{t.hero.badge}</span>
          </div>

          <h1 className="about-heroTitle">{t.header.title}</h1>
          <p className="about-heroLead">{t.header.subtitle}</p>
        </div>
      </section>

      {/* Glass card */}
      <section className="about-stage">
        <article className="about-glassCard" aria-label={t.aboutUs.title}>
          <div className="about-glassTop">
            <div className="about-glassKicker">{t.hero.heading}</div>
            <h2 className="about-glassTitle">{t.aboutUs.title}</h2>
            <p className="about-glassSub">{t.hero.lead}</p>
          </div>

          {/* ✅ Scrollable text area */}
          <div
            className={[
              "about-scrollShell",
              fadeTop ? "fadeTop" : "",
              fadeBottom ? "fadeBottom" : "",
            ].join(" ")}
          >
            <div
              ref={scrollerRef}
              className="about-scrollArea"
              role="region"
              aria-label="About text"
              tabIndex={0}
            >
              <div className="about-prose">
                <p>{t.aboutUs.p1}</p>
                <p>{t.aboutUs.p2}</p>
                <p>{t.aboutUs.p3}</p>
                <p>{t.aboutUs.p4}</p>
              </div>
            </div>
          </div>
        </article>
      </section>
    </main>
  );
}
