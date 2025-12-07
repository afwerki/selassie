import React, { useState, useEffect } from "react";
import "../styling/home.css";

import PriestImage from "../assets/images/prist.jpeg";
import MissionImage from "../assets/images/eotc.jpg";
import { client } from "../sanityClient";
import { useLanguage } from "../contexts/LanguageContext";
import { texts } from "../i18n/texts";

const clergyMembers = [
  {
    id: "priest1",
    name: "Kesis Fesha",
    title: "Parish Priest",
    roleTag: "Shepherd of the parish",
    image: PriestImage,
    verse: "“The Lord is my shepherd; I shall not want.”",
    reference: "Psalm 23:1",
  },
  {
    id: "priest2",
    name: "Kesis Damit",
    title: "Assistant Priest",
    roleTag: "Supporting liturgy & teaching",
    image: PriestImage,
    verse: "“Let all that you do be done in love.”",
    reference: "1 Corinthians 16:14",
  },
  {
    id: "priest3",
    name: "Kesis Abayneh",
    title: "Senior Priest",
    roleTag: "Wisdom & spiritual counsel",
    image: PriestImage,
    verse: "“Stand firm in the faith; be courageous; be strong.”",
    reference: "1 Corinthians 16:13",
  },
  {
    id: "deacon1",
    name: "Kesis Tesfahun",
    title: "Deacon",
    roleTag: "Serving at the Holy Altar",
    image: PriestImage,
    verse:
      "“Serve the Lord with gladness; come before His presence with singing.”",
    reference: "Psalm 100:2",
  },
  {
    id: "leader1",
    name: "Kesis Dagim",
    title: "Sunday School Leader",
    roleTag: "Guiding our children in faith",
    image: PriestImage,
    verse:
      "“Let the little children come to Me… for of such is the kingdom of heaven.”",
    reference: "Matthew 19:14",
  },
];

const defaultServiceItems = [
  {
    id: "default-1",
    label: "Sunday Liturgy",
    subLabel: "Main service",
    time: "8:00 AM",
    description: "Our main weekly Divine Liturgy, starting with Matins.",
    location: "Church building",
    notes: "",
  },
  {
    id: "default-2",
    label: "Vespers",
    subLabel: "Saturday evening",
    time: "6:00 PM",
    description:
      "Evening prayer service in preparation for Sunday Liturgy.",
    location: "Church building",
    notes: "",
  },
  {
    id: "default-3",
    label: "Feast Days",
    subLabel: "Times announced before each feast",
    time: "",
    description:
      "Special services on feast days. Please check announcements for exact times.",
    location: "Church building",
    notes: "",
  },
];

function Home() {
  const { lang } = useLanguage();
  const t = texts[lang] || texts.en;

  const [flippedId, setFlippedId] = useState(null);
  const [missionExpanded, setMissionExpanded] = useState(false);

  const [serviceBox, setServiceBox] = useState({
    title: "Service Times",
    subtitle: "Join us for worship",
  });
  const [serviceItems, setServiceItems] = useState(defaultServiceItems);
  const [openServiceId, setOpenServiceId] = useState(null);

  // ======== FETCH SERVICE TIMES FROM SANITY ========
  useEffect(() => {
    client
      .fetch(
        `*[_type == "homepage"][0]{
          serviceBoxTitle,
          serviceBoxSubtitle,
          serviceItems[]{
            _key,
            label,
            subLabel,
            time,
            description,
            address,
            mapLink,
            location,
            notes,
            isActive
          }
        }`
      )
      .then((data) => {
        if (!data) return;

        setServiceBox({
          title: data.serviceBoxTitle || "Service Times",
          subtitle: data.serviceBoxSubtitle || "Join us for worship",
        });

        if (Array.isArray(data.serviceItems) && data.serviceItems.length > 0) {
          const mapped = data.serviceItems
            .filter((item) => item?.isActive !== false)
            .map((item, index) => ({
              id: item._key || `srv-${index}`,
              label: item.label || "Unnamed service",
              subLabel: item.subLabel || "",
              time: item.time || "",
              description: item.description || "",
              address: item.address || item.location || "",
              mapLink: item.mapLink || "",
              location: item.location || "",
              notes: item.notes || "",
            }));

          setServiceItems(mapped);
        }
      })
      .catch((err) => {
        console.error("Sanity service times error:", err);
      });
  }, []);

  const handleCardClick = (id) => {
    setFlippedId((current) => (current === id ? null : id));
  };

  const toggleMission = () => {
    setMissionExpanded((prev) => !prev);
  };

  const handleServiceClick = (id) => {
    setOpenServiceId((current) => (current === id ? null : id));
  };

  return (
    <>
      {/* ==================== CLERGY CAROUSEL ==================== */}
      <section className="clergy-strip animate-fade-up" id="clergy">
        <div className="fade-left" />
        <div className="fade-right" />

        <div className="clergy-strip-scroller">
          <div className="clergy-strip-inner">
            {[...clergyMembers, ...clergyMembers].map((member, index) => (
              <div
                key={member.id + "-" + index}
                className={`clergy-card ${
                  member.id === "priest1" ? "clergy-card--leader" : ""
                }`}
                onClick={() => handleCardClick(member.id)}
              >
                <div
                  className={`clergy-card-inner ${
                    flippedId === member.id ? "is-flipped" : ""
                  }`}
                >
                  <div className="clergy-face clergy-face--front">
                    <div className="clergy-avatar">
                      <img src={member.image} alt={member.name} />
                    </div>

                    <div className="clergy-text">
                      <h3>{member.name}</h3>
                      <p className="clergy-title">{member.title}</p>
                      <p className="clergy-role-tag">{member.roleTag}</p>
                    </div>

                    <div className="clergy-verse-preview">
                      <span className="clergy-verse-line">{member.verse}</span>
                      <span className="clergy-verse-ref">
                        {member.reference}
                      </span>
                    </div>
                  </div>

                  <div className="clergy-face clergy-face--back">
                    <p className="clergy-back-label">Favourite Scripture</p>
                    <p className="clergy-back-verse">{member.verse}</p>
                    <p className="clergy-back-ref">{member.reference}</p>
                    <p className="clergy-back-name">{member.name}</p>
                    <p className="clergy-back-title">{member.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== WELCOME ==================== */}
      <section className="welcome-section animate-fade-up" id="Service">
        <div className="welcome-text">
          <h2>{t.home.welcomeTitle}</h2>
          <p>{t.home.welcomeP1}</p>
          <p>{t.home.welcomeP2}</p>
        </div>

        {/* ==================== SERVICE TIMES (DYNAMIC) ==================== */}
        <aside className="service-times">
          <div className="service-header">
            <span className="service-icon">✝️</span>
            <div>
              <h3>{serviceBox.title}</h3>
              <p>{serviceBox.subtitle}</p>
            </div>
          </div>

          <div className="service-card">
            {serviceItems.map((service) => {
              const isOpen = openServiceId === service.id;
              const address = service.address || service.location;
              const mapLink = service.mapLink || service.mapUrl;

              return (
                <div
                  key={service.id}
                  className={`service-row-wrapper ${
                    isOpen ? "service-row-wrapper--open" : ""
                  }`}
                >
                  <button
                    type="button"
                    className="service-row"
                    onClick={() => handleServiceClick(service.id)}
                  >
                    <div>
                      <span className="service-label">{service.label}</span>
                      {service.subLabel && (
                        <span className="service-sub">{service.subLabel}</span>
                      )}
                    </div>
                    <div className="service-time-and-toggle">
                      {service.time && (
                        <span className="service-time">{service.time}</span>
                      )}
                      <span className="service-toggle">
                        {isOpen ? "▴" : "▾"}
                      </span>
                    </div>
                  </button>

                  {isOpen && (
                    <div className="service-details">
                      {service.description && (
                        <p className="service-details-text">
                          {service.description}
                        </p>
                      )}

                      {address && (
                        <div className="service-details-meta">
                          <strong>Location:</strong>
                          <div className="service-details-address">
                            {address.split("\n").map((line, idx) => (
                              <span key={idx}>
                                {line}
                                <br />
                              </span>
                            ))}
                          </div>

                          {mapLink && (
                            <a
                              href={mapLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="service-location-link"
                            >
                              View on Google Maps
                            </a>
                          )}
                        </div>
                      )}

                      {service.notes && (
                        <p className="service-details-meta">
                          <strong>Notes:</strong> {service.notes}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </aside>
      </section>

      {/* ==================== MISSION ==================== */}
      <section
        className={`mission-section animate-fade-up ${
          missionExpanded ? "mission-section--expanded" : ""
        }`}
      >
        <div className="mission-image">
          <img src={MissionImage} alt="Our Mission" />
        </div>

        <div className="mission-text">
          <h2>{t.home.missionTitle}</h2>

          <div
            className={`mission-text-body ${
              missionExpanded ? "is-expanded" : "is-collapsed"
            }`}
          >
            <p>{t.home.missionP1}</p>
            <p>{t.home.missionP2}</p>
          </div>

          <button
            type="button"
            className="mission-read-more"
            onClick={toggleMission}
          >
            {missionExpanded ? t.home.missionReadLess : t.home.missionReadMore}
          </button>
        </div>
      </section>
    </>
  );
}

export default Home;
