import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "../styling/home.css";

import Theodros from "../assets/images/Theodros.JPG";
import Feseha from "../assets/images/Feseha_updated.JPG";
import kefeyalew from "../assets/images/kefyalew.JPG";
import addis from "../assets/images/addis.JPG";
import yohannes from "../assets/images/yohannes.JPG";
import MissionImage from "../assets/images/womens_side.JPG";
import kaleb from "../assets/images/Kaleb_updated.JPG";
import samuel from "../assets/images/samuel.JPG";
import Kibret from "../assets/images/Kibret.JPG";

import { useLanguage } from "../contexts/LanguageContext";
import { texts } from "../i18n/texts";

const clergyMembers = [
  {
    id: "priest1",
    name: "Melake Genet Kesis Kefyalew",
    title: "Parish Priest",
    roleTag: "Priest in charge",
    image: kefeyalew,
    bioBullets: [
      "Moved to the UK in 2015.",
      "Serves at Debre Genet Kidist Selassie Church, London.",
      "Ordained priest in 2012 in Addis Ababa.",
      "Ordained by His Grace Abune Hezkael.",
      "Blessed with two children.",
      "Abenet Memhir specialising in the New Testament and Divine Liturgy.",
      "Dedicated to theological teaching and liturgical instruction.",
    ],
  },

  // ✅ UPDATED
  {
    id: "priest2",
    name: "Megabi Haddis Kesis Kibret Asnakew",
    title: "Parish Priest",
    roleTag: "Abenet Memhir & liturgical teacher",
    image: Kibret,
    bioBullets: [
      "Moved to the United Kingdom in 2015.",
      "Serves at Debre Genet Kidist Selassie Church, London.",
      "Began his service as a deacon.",
      "Ordained priest in 2012 in Addis Ababa.",
      "Ordained by His Grace Abune Hezkael.",
      "Blessed with two children — one son and one daughter.",
      "Abenet Memhir specialising in the New Testament and Divine Liturgy.",
      "Recognised for dedication to theological teaching and liturgical instruction.",
    ],
  },

  {
    id: "priest3",
    name: "Kesis Addis",
    title: "Parish Priest",
    roleTag: "Shepherd of the parish",
    image: addis,
    bioBullets: [
      "Serves the parish through worship, teaching, and pastoral care.",
      "Supports the spiritual life of the church community.",
      "Guides parishioners in faith, prayer, and service.",
      "Helps strengthen the church family through dedicated ministry.",
    ],
  },

  {
    id: "priest4",
    name: "Kesis Feseha",
    title: "Priest",
    roleTag: "Supporting liturgy & teaching",
    image: Feseha,
    bioBullets: [
      "Supports the parish through liturgical service and teaching.",
      "Serves the church community with humility and dedication.",
      "Helps guide parishioners in Orthodox faith and spiritual growth.",
      "Contributes to the worship and pastoral life of the parish.",
    ],
  },

  // ✅ UPDATED
  {
    id: "priest5",
    name: "Qes Gebez Kaleb Tadesse",
    title: "Priest",
    roleTag: "Liturgical & pastoral ministry",
    image: kaleb,
    bioBullets: [
      "Moved to the United Kingdom in 2012.",
      "Began spiritual journey through Sunday School and church ministry.",
      "Ordained deacon in 2012 by His Grace Abune Entos.",
      "Ordained priest in 2022 by His Grace Abune Yaqob.",
      "Blessed with three daughters.",
      "Serves as Qes Gebez supporting liturgical and pastoral ministry.",
      "Believes service is an expression of love for God and humanity.",
    ],
  },

  // ✅ UPDATED
  {
    id: "priest6",
    name: "Melake Mehiret Kesis Theodros Neguisse",
    title: "Priest",
    roleTag: "Spiritual leader, teacher & mentor",
    image: Theodros,
    bioBullets: [
      "Founding member of Debre Genet Holy Trinity Church, London.",
      "Began serving as a deacon at Debre Amen Tekle Haymanot Church.",
      "Moved to the United Kingdom and pursued engineering studies.",
      "Ordained priest in 2012 in Belgium by His Grace Abune Mussa.",
      "Served as Priest-in-Charge in Sheffield for 8 years.",
      "Married with four children — two sons and two daughters.",
      "Respected spiritual leader known for teaching and mentorship.",
    ],
  },

  {
    id: "priest7",
    name: "Deacon Yohannes",
    title: "Deacon",
    roleTag: "Supporting liturgy & teaching",
    image: yohannes,
    bioBullets: [
      "Supports the clergy during liturgical services.",
      "Serves the parish through prayer, worship, and church ministry.",
      "Helps preserve the order and beauty of Orthodox worship.",
      "Supports the spiritual life of the church community.",
    ],
  },

  {
    id: "priest8",
    name: "Prist Samuel Kassa",
    title: "Priest",
    roleTag: "Parish support",
    image: samuel,
    bioBullets: [
      "Serves the church community with dedication.",
      "Supports liturgical and pastoral activities.",
      "Guides parishioners in faith and prayer.",
      "Committed to spiritual growth and service.",
    ],
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

function ClergyBackFace({ member }) {
  return (
    <div className="home-clergy-premium-face home-clergy-premium-face--back">
      <span className="home-clergy-back-kicker">Biography</span>

      <h3 className="home-clergy-back-name">{member.name}</h3>

      <ul className="home-clergy-bio-list">
        {member.bioBullets?.map((point, index) => (
          <li key={`${member.id}-bio-${index}`}>{point}</li>
        ))}
      </ul>

      <div className="home-clergy-back-meta">
        <strong>{member.name}</strong>
        <span>{member.title}</span>
      </div>

      <span className="home-clergy-tap-hint home-clergy-tap-hint--back">
        Tap to return
      </span>
    </div>
  );
}

export default function Home() {
  const { lang } = useLanguage();
  const t = texts[lang] || texts.en;

  const [flippedId, setFlippedId] = useState(null);
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
  {(t.home?.welcomeTitle || "Welcome")
    .split(" ")
    .map((word, index, arr) => (
      <span
        key={`${word}-${index}`}
        className={`home-hero-word ${
          index === arr.length - 1 ? "home-hero-word--accent" : ""
        }`}
        style={{ "--word-index": index }}
      >
        {word}
      </span>
    ))}
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
                    aria-label={`View biography for ${member.name}`}
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
                            Tap to read bio
                          </span>
                        </div>
                      </div>

                      <ClergyBackFace member={member} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

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
                        aria-label={`View biography for ${member.name}`}
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
                                Tap to read bio
                              </span>
                            </div>
                          </div>

                          <ClergyBackFace member={member} />
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
    </main>
  );
}