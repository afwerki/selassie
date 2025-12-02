import React, { useState } from "react";
import "../styling/home.css";

import PriestImage from "../assets/images/prist.jpeg";
import MissionImage from "../assets/images/eotc.jpg";

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

function Home() {
  const [flippedId, setFlippedId] = useState(null);
  const [missionExpanded, setMissionExpanded] = useState(false);

  const handleCardClick = (id) => {
    setFlippedId((current) => (current === id ? null : id));
  };

  const toggleMission = () => {
    setMissionExpanded((prev) => !prev);
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
                  {/* FRONT */}
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

                  {/* BACK */}
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
          <h2>Welcome</h2>
          <p>
            Welcome to Selassie Ethiopian Orthodox Church in London, a spiritual
            home for the Ethiopian Orthodox community. We invite you to join us
            in worship, prayer, and fellowship as we strive to grow in faith and
            love through the timeless traditions of the Ethiopian Orthodox
            Tewahedo Church.
          </p>
          <p>
            Whether you are a lifelong member of the Church or visiting for the
            first time, you are warmly welcomed.
          </p>
        </div>

        <aside className="service-times">
          <div className="service-header">
            <span className="service-icon">✝️</span>
            <div>
              <h3>Service Times</h3>
              <p>Join us for worship</p>
            </div>
          </div>

          <div className="service-card">
            <div className="service-row">
              <div>
                <span className="service-label">Sunday Liturgy</span>
                <span className="service-sub">Main service</span>
              </div>
              <span className="service-time">8:00 AM</span>
            </div>

            <div className="service-row">
              <div>
                <span className="service-label">Vespers</span>
                <span className="service-sub">Saturday evening</span>
              </div>
              <span className="service-time">6:00 PM</span>
            </div>

            <div className="service-row">
              <div>
                <span className="service-label">Feast Days</span>
                <span className="service-sub">
                  Times announced before each feast
                </span>
              </div>
            </div>
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
          <h2>Our Mission</h2>

          <div
            className={`mission-text-body ${
              missionExpanded ? "is-expanded" : "is-collapsed"
            }`}
          >
            <p>
              Our mission is to uphold and share the teachings of the Ethiopian
              Orthodox Church, to support the spiritual growth of our members,
              and to serve our community with compassion and humility.
              Our mission is to uphold and share the teachings of the Ethiopian
              Orthodox Church, to support the spiritual growth of our members,
              and to serve our community with compassion and humility.
            </p>
            <p>
              Through worship, education, pastoral care, and charitable work, we
              seek to reflect the love of Christ in our parish and beyond.
            </p>
          </div>

          <button
            type="button"
            className="mission-read-more"
            onClick={toggleMission}
          >
            {missionExpanded ? "Show less" : "Read more"}
          </button>
        </div>
      </section>
    </>
  );
}

export default Home;
