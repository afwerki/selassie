import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "../styling/home.css";

import Theodros from "../assets/images/Theodros.JPG";
import Feseha from "../assets/images/Feseha_updated.JPG";
import kefeyalew from "../assets/images/kefyalew.JPG";
import addis from "../assets/images/addis.JPG";
import yohannes from "../assets/images/yohannes.JPG";
import MissionImage from "../assets/images/eotc.jpg";
import kaleb from "../assets/images/Kaleb_updated.JPG";

import { useLanguage } from "../contexts/LanguageContext";
import { texts } from "../i18n/texts";

const clergyMembers = [
  {
    id: "priest1",
    name: "Kesis Kefyalew",
    title: "Parish Priest",
    roleTag: "Shepherd of the parish",
    image: kefeyalew,
    verse: "“The Lord is my shepherd; I shall not want.”",
    reference: "Psalm 23:1",
  },
  {
    id: "priest2",
    name: "Kesis Addis",
    title: "Parish Priest",
    roleTag: "Shepherd of the parish",
    image: addis,
    verse: "“The Lord is my shepherd; I shall not want.”",
    reference: "Psalm 23:1",
  },
  {
    id: "priest3",
    name: "Kesis Feseha",
    title: "Priest",
    roleTag: "Supporting liturgy & teaching",
    image: Feseha,
    verse: "“Let all that you do be done in love.”",
    reference: "1 Corinthians 16:14",
  },
  {
    id: "priest4",
    name: "Kesis Kaleb",
    title: "Priest",
    roleTag: "Supporting liturgy & teaching",
    image: kaleb,
    verse: "“Let all that you do be done in love.”",
    reference: "1 Corinthians 16:14",
  },
  {
    id: "priest5",
    name: "Kesis Theodros",
    title: "Priest",
    roleTag: "Supporting liturgy & teaching",
    image: Theodros,
    verse: "“Let all that you do be done in love.”",
    reference: "1 Corinthians 16:14",
  },
  {
    id: "priest6",
    name: "Deacon Yohannes",
    title: "Deacon",
    roleTag: "Supporting liturgy & teaching",
    image: yohannes,
    verse: "“Let all that you do be done in love.”",
    reference: "1 Corinthians 16:14",
  },
];

const stats = [
  { id: "stat-1", value: "2006", label: "Established in London" },
  { id: "stat-2", value: "Orthodox", label: "Ancient Christian tradition" },
  { id: "stat-3", value: "Community", label: "Faith, care, and belonging" },
];

function IconCross() {
  return (
    <svg className="home-ic" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M10 3h4v5h5v4h-5v9h-4v-9H5V8h5V3z" />
    </svg>
  );
}

function IconArrow() {
  return (
    <svg
      className="home-ic home-ic-arrow"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M13 5l7 7-7 7-2.2-2.2 3.2-3.3H4v-3h10l-3.2-3.3L13 5z" />
    </svg>
  );
}

export default function Home() {
  const { lang } = useLanguage();
  const t = texts[lang] || texts.en;

  const [flippedId, setFlippedId] = useState(null);

  // Mobile carousel state
  const [mobileClergyIndex, setMobileClergyIndex] = useState(0);
  const [mobileClergyFlippedId, setMobileClergyFlippedId] = useState(null);

  const carouselMembers = useMemo(
    () => [...clergyMembers, ...clergyMembers],
    []
  );

  const handleCardClick = (id) => {
    setFlippedId((current) => (current === id ? null : id));
  };

  const handleMobileClergyFlip = (id) => {
    setMobileClergyFlippedId((current) => (current === id ? null : id));
  };

  const goToPrevClergy = () => {
    setMobileClergyFlippedId(null);
    setMobileClergyIndex((prev) =>
      prev === 0 ? clergyMembers.length - 1 : prev - 1
    );
  };

  const goToNextClergy = () => {
    setMobileClergyFlippedId(null);
    setMobileClergyIndex((prev) =>
      prev === clergyMembers.length - 1 ? 0 : prev + 1
    );
  };

  const goToMobileClergy = (index) => {
    setMobileClergyFlippedId(null);
    setMobileClergyIndex(index);
  };

  // Slower auto-slide and do not advance while reading back side
  useEffect(() => {
    if (mobileClergyFlippedId) return;

    const timer = setInterval(() => {
      setMobileClergyIndex((prev) =>
        prev === clergyMembers.length - 1 ? 0 : prev + 1
      );
    }, 9000);

    return () => clearInterval(timer);
  }, [mobileClergyFlippedId]);

  const scrollToSection = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (!el) return;

    el.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <main className="home-page">
      <div className="home-page-glow home-page-glow-a" aria-hidden="true" />
      <div className="home-page-glow home-page-glow-b" aria-hidden="true" />

      {/* HERO */}
      <section className="home-hero home-load home-load-delay-1">
        <div className="home-hero-grid">
          <div className="home-hero-copy">
            <div className="home-kicker">
              <span className="home-kicker-icon" aria-hidden="true">
                <IconCross />
              </span>
              <span>Ethiopian Orthodox Tewahedo Church</span>
            </div>

            <h1 className="home-hero-title">
              {t.home?.welcomeTitle || "Welcome"}
            </h1>

            <p className="home-hero-lead">
              {t.home?.welcomeP1 ||
                "Welcome to Debre-Genet Holy Trinity Church in London, a spiritual home for worship, prayer, and community."}
            </p>

            <div className="home-hero-actions">
              <Link to="/contact" className="home-btn home-btn-primary">
                <span>Plan Your Visit</span>
                <IconArrow />
              </Link>

              <button
                type="button"
                className="home-btn home-btn-secondary"
                onClick={() => scrollToSection("clergy")}
              >
                Meet Our Clergy
              </button>
            </div>

            <div
              className="home-hero-stats home-hero-stats--desktop"
              aria-label="Church highlights"
            >
              {stats.map((item) => (
                <article key={item.id} className="home-stat-card">
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </article>
              ))}
            </div>
          </div>

          <div className="home-hero-visual">
            <div className="home-hero-image-card">
              <div className="home-hero-image-wrap">
                <img
                  src={MissionImage}
                  alt="Debre-Genet Holy Trinity Church"
                  className="home-hero-image"
                />
                <div className="home-hero-image-overlay" />
              </div>

              <div className="home-hero-image-content">
                <span className="home-hero-image-chip">
                  Faith • Prayer • Community
                </span>
                <h2>A spiritual home for worship and belonging</h2>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CLERGY */}
      <section
        className="home-clergy-feature home-load home-load-delay-2"
        id="clergy"
      >
        <div className="home-clergy-feature-shell">
          <div className="section-heading section-heading--center">
            <span className="section-chip">Clergy & service</span>
            <h2>Meet Our Clergy</h2>
            <p>
              Dedicated servants supporting worship, teaching, pastoral care,
              and the spiritual life of the parish.
            </p>
          </div>

          {/* DESKTOP / TABLET MARQUEE */}
          <div className="home-clergy-scroller home-clergy-scroller--desktop">
            <div className="home-clergy-track">
              {carouselMembers.map((member, index) => {
                const uniqueId = `${member.id}-${index}`;
                const isFlipped = flippedId === uniqueId;

                return (
                  <button
                    key={uniqueId}
                    type="button"
                    className={`home-clergy-premium-card ${
                      member.id === "priest1"
                        ? "home-clergy-premium-card--lead"
                        : ""
                    } ${isFlipped ? "is-card-flipped" : ""}`}
                    onClick={() => handleCardClick(uniqueId)}
                    aria-pressed={isFlipped}
                    aria-label={`View details for ${member.name}`}
                  >
                    <div
                      className={`home-clergy-premium-inner ${
                        isFlipped ? "is-flipped" : ""
                      }`}
                    >
                      <div className="home-clergy-premium-face home-clergy-premium-face--front">
                        <div className="home-clergy-image-wrap-card">
                          <img src={member.image} alt={member.name} />
                        </div>

                        <div className="home-clergy-premium-content">
                          <span className="home-clergy-mini-chip">
                            {member.title}
                          </span>
                          <h3>{member.name}</h3>
                          <p className="home-clergy-role">{member.roleTag}</p>
                          <span className="home-clergy-tap-hint">
                            Tap to read more
                          </span>
                        </div>
                      </div>

                      <div className="home-clergy-premium-face home-clergy-premium-face--back">
                        <span className="home-clergy-back-kicker">
                          Favourite Scripture
                        </span>
                        <p className="home-clergy-back-verse">{member.verse}</p>
                        <p className="home-clergy-back-ref">{member.reference}</p>

                        <div className="home-clergy-back-meta">
                          <strong>{member.name}</strong>
                          <span>{member.title}</span>
                        </div>

                        <span className="home-clergy-tap-hint home-clergy-tap-hint--back">
                          Tap to return
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* MOBILE SLIDER */}
          <div className="home-mobile-clergy-carousel">
            <div className="home-mobile-clergy-viewport">
              <div
                className="home-mobile-clergy-track"
                style={{
                  transform: `translateX(-${mobileClergyIndex * 100}%)`,
                }}
              >
                {clergyMembers.map((member) => {
                  const isFlipped = mobileClergyFlippedId === member.id;

                  return (
                    <div className="home-mobile-clergy-slide" key={member.id}>
                      <button
                        type="button"
                        className={`home-mobile-clergy-card ${
                          isFlipped ? "is-card-flipped" : ""
                        }`}
                        onClick={() => handleMobileClergyFlip(member.id)}
                        aria-pressed={isFlipped}
                        aria-label={`View details for ${member.name}`}
                      >
                        <div
                          className={`home-clergy-premium-inner ${
                            isFlipped ? "is-flipped" : ""
                          }`}
                        >
                          <div className="home-clergy-premium-face home-clergy-premium-face--front">
                            <div className="home-clergy-image-wrap-card home-clergy-image-wrap-card--mobile">
                              <img src={member.image} alt={member.name} />
                            </div>

                            <div className="home-clergy-premium-content home-clergy-premium-content--mobile">
                              <span className="home-clergy-mini-chip">
                                {member.title}
                              </span>
                              <h3>{member.name}</h3>
                              <p className="home-clergy-role">
                                {member.roleTag}
                              </p>
                              <span className="home-clergy-tap-hint">
                                Tap to read more
                              </span>
                            </div>
                          </div>

                          <div className="home-clergy-premium-face home-clergy-premium-face--back">
                            <span className="home-clergy-back-kicker">
                              Favourite Scripture
                            </span>
                            <p className="home-clergy-back-verse">
                              {member.verse}
                            </p>
                            <p className="home-clergy-back-ref">
                              {member.reference}
                            </p>

                            <div className="home-clergy-back-meta">
                              <strong>{member.name}</strong>
                              <span>{member.title}</span>
                            </div>

                            <span className="home-clergy-tap-hint home-clergy-tap-hint--back">
                              Tap to return
                            </span>
                          </div>
                        </div>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="home-mobile-clergy-controls">
              <button
                type="button"
                className="home-mobile-clergy-nav"
                onClick={goToPrevClergy}
                aria-label="Previous clergy member"
              >
                ‹
              </button>

              <div
                className="home-mobile-clergy-dots"
                aria-label="Clergy carousel navigation"
              >
                {clergyMembers.map((member, index) => (
                  <button
                    key={member.id}
                    type="button"
                    className={`home-mobile-clergy-dot ${
                      index === mobileClergyIndex ? "is-active" : ""
                    }`}
                    onClick={() => goToMobileClergy(index)}
                    aria-label={`Show ${member.name}`}
                  />
                ))}
              </div>

              <button
                type="button"
                className="home-mobile-clergy-nav"
                onClick={goToNextClergy}
                aria-label="Next clergy member"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="home-cta home-load home-load-delay-4">
        <div className="home-cta-card">
          <div className="home-cta-copy">
            <span className="section-chip section-chip--light">
              Join our church family
            </span>
            <h2>Come worship, connect, and grow with us</h2>
            <p>
              We would be glad to welcome you whether you are visiting for the
              first time or looking for a spiritual home.
            </p>
          </div>

          <div className="home-cta-actions">
            <Link to="/contact" className="home-btn home-btn-primary">
              <span>Plan Your Visit</span>
              <IconArrow />
            </Link>

            <Link to="/about" className="home-btn home-btn-ghost">
              Explore More
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}