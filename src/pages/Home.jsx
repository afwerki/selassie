import React, { useEffect, useState } from "react";
import "../styling/home.css";

import Theodros from "../assets/images/Theodros.JPG";
import Feseha from "../assets/images/feseha.JPG";
import kefeyalew from "../assets/images/kefeyalew.JPG";
import yohannes from "../assets/images/yohannes.JPG";
import MissionImage from "../assets/images/eotc.jpg";
import kaleb from "../assets/images/kaleb.JPG";

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
    name: "Kesis Feseha",
    title: "Priest",
    roleTag: "Supporting liturgy & teaching",
    image: Feseha,
    verse: "“Let all that you do be done in love.”",
    reference: "1 Corinthians 16:14",
  },
   {
    id: "priest3",
    name: "Kesis Kaleb",
    title: "Priest",
    roleTag: "Supporting liturgy & teaching",
    image: kaleb,
    verse: "“Let all that you do be done in love.”",
    reference: "1 Corinthians 16:14",
  },
  {
    id: "priest3",
    name: "Kesis Theodros",
    title: "Priest",
    roleTag: "Supporting liturgy & teaching",
    image: Theodros,
    verse: "“Let all that you do be done in love.”",
    reference: "1 Corinthians 16:14",
  },
  {
    id: "priest4",
    name: "Deacon Yohannes",
    title: "Deacon",
    roleTag: "Supporting liturgy & teaching",
    image: yohannes,
    verse: "“Let all that you do be done in love.”",
    reference: "1 Corinthians 16:14",
  },
];

const heroSlides = [
  {
    id: "slide-1",
    title: "Faith",
    subtitle: "Rooted in Orthodox worship and prayer",
  },
  {
    id: "slide-2",
    title: "Hope",
    subtitle: "Growing together in grace and service",
  },
  {
    id: "slide-3",
    title: "Community",
    subtitle: "A spiritual home for all generations",
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
    <svg className="home-ic home-ic-arrow" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M13 5l7 7-7 7-2.2-2.2 3.2-3.3H4v-3h10l-3.2-3.3L13 5z" />
    </svg>
  );
}

export default function Home() {
  const { lang } = useLanguage();
  const t = texts[lang] || texts.en;

  const [flippedId, setFlippedId] = useState(null);
  const [missionExpanded, setMissionExpanded] = useState(false);
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveHeroSlide((prev) => (prev + 1) % heroSlides.length);
    }, 3400);

    return () => clearInterval(timer);
  }, []);

  const handleCardClick = (id) => {
    setFlippedId((current) => (current === id ? null : id));
  };

  const toggleMission = () => {
    setMissionExpanded((prev) => !prev);
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
                "Welcome to Debre-Genet Holy Trinity Church in London, a spiritual home for the Ethiopian Orthodox community."}
            </p>

            <p className="home-hero-sublead">
              {t.home?.welcomeP2 ||
                "Whether you are a lifelong member of the Church or visiting for the first time, you are warmly welcomed and we are glad you are here."}
            </p>

            <div className="home-hero-actions">
              <a href="/about" className="home-btn home-btn-primary">
                <span>Learn More</span>
                <IconArrow />
              </a>

              <a href="/contact" className="home-btn home-btn-secondary">
                Contact Us
              </a>
            </div>

            <div className="home-hero-stats" aria-label="Church highlights">
              {stats.map((item) => (
                <article key={item.id} className="home-stat-card">
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </article>
              ))}
            </div>
          </div>

          <div className="home-hero-visual">
            <div className="home-hero-card">
              <div className="home-hero-card-top">
                <span className="home-hero-badge">Faith • Hope • Community</span>
              </div>

              <div className="home-hero-slider">
                {heroSlides.map((slide, index) => (
                  <div
                    key={slide.id}
                    className={`home-hero-slide ${
                      index === activeHeroSlide ? "is-active" : ""
                    }`}
                  >
                    <div className="home-hero-slide-title">{slide.title}</div>
                    <p>{slide.subtitle}</p>
                  </div>
                ))}
              </div>

              <div className="home-hero-indicators">
                {heroSlides.map((slide, index) => (
                  <button
                    key={slide.id}
                    type="button"
                    className={`home-hero-dot ${
                      index === activeHeroSlide ? "is-active" : ""
                    }`}
                    onClick={() => setActiveHeroSlide(index)}
                    aria-label={`Show ${slide.title}`}
                  />
                ))}
              </div>

              <div className="home-hero-image-wrap">
                <img
                  src={MissionImage}
                  alt="Church mission"
                  className="home-hero-image"
                />
                <div className="home-hero-image-overlay" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MOVING CLERGY */}
      <section className="home-clergy-feature home-load home-load-delay-2" id="clergy">
        <div className="home-clergy-feature-shell">
          <div className="section-heading section-heading--center">
            <span className="section-chip">Clergy & service</span>
            <h2>Meet Our Clergy</h2>
            <p>
              Dedicated servants supporting worship, teaching, pastoral care,
              and the spiritual life of the parish.
            </p>
          </div>

          <div className="home-clergy-scroller">
            <div className="home-clergy-track">
              {[...clergyMembers, ...clergyMembers].map((member, index) => {
                const uniqueId = `${member.id}-${index}`;
                return (
                  <button
                    key={uniqueId}
                    type="button"
                    className={`home-clergy-premium-card ${
                      member.id === "priest1" ? "home-clergy-premium-card--lead" : ""
                    }`}
                    onClick={() => handleCardClick(uniqueId)}
                  >
                    <div
                      className={`home-clergy-premium-inner ${
                        flippedId === uniqueId ? "is-flipped" : ""
                      }`}
                    >
                      <div className="home-clergy-premium-face home-clergy-premium-face--front">
                        <div className="home-clergy-image-wrap">
                          <img src={member.image} alt={member.name} />
                        </div>

                        <div className="home-clergy-premium-content">
                          <span className="home-clergy-mini-chip">{member.title}</span>
                          <h3>{member.name}</h3>
                          <p className="home-clergy-role">{member.roleTag}</p>
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
                      </div>
                    </div>
                  </button>
                );
              })}
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
              Whether you are visiting for the first time or looking for a
              spiritual home, we would be glad to welcome you.
            </p>
          </div>

          <div className="home-cta-actions">
            <a href="/contact" className="home-btn home-btn-primary">
              <span>Plan Your Visit</span>
              <IconArrow />
            </a>
            <a href="/about" className="home-btn home-btn-ghost">
              Explore More
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}