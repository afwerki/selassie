function Home() {
  return (
    <>
      {/* Welcome + Service Times */}
      <section className="welcome-section" id="Service">
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

      {/* Mission section */}
      <section className="mission-section">
        <div className="mission-image">
          <div className="icon-placeholder">
            <div className="icon-inner-circle" />
          </div>
        </div>

        <div className="mission-text">
          <h2>Our Mission</h2>
          <p>
            Our mission is to uphold and share the teachings of the Ethiopian
            Orthodox Church, to support the spiritual growth of our members, and
            to serve our community with compassion and humility.
          </p>
          <p>
            Through worship, education, pastoral care, and charitable work, we
            seek to reflect the love of Christ in our parish and beyond.
          </p>
        </div>
      </section>
    </>
  );
}

export default Home;
