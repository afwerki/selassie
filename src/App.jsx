import "./App.css";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <Navbar />
      <Hero />

      <main className="page">
        {/* Welcome + Service Times */}
        <section className="welcome-section" id="about">
          <div className="welcome-text">
            <h2>Welcome</h2>
            <p>
              Welcome to Selassie Ethiopian Orthodox Church in London, a
              spiritual home for the Ethiopian Orthodox community. We invite you
              to join us in worship, prayer, and fellowship as we strive to grow
              in faith and love through the timeless traditions of the Ethiopian
              Orthodox Tewahedo Church.
            </p>
            <p>
              Whether you are a lifelong member of the Church or visiting for
              the first time, you are warmly welcomed.
            </p>
          </div>

          <aside className="service-times" id="services">
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
        <section className="mission-section" id="sermons">
          <div className="mission-image">
            {/* Placeholder icon-style image */}
            <div className="icon-placeholder">
              <div className="icon-inner-circle" />
            </div>
          </div>

          <div className="mission-text">
            <h2>Our Mission</h2>
            <p>
              Our mission is to uphold and share the teachings of the Ethiopian
              Orthodox Church, to support the spiritual growth of our members,
              and to serve our community with compassion and humility.
            </p>
            <p>
              Through worship, education, pastoral care, and charitable work, we
              seek to reflect the love of Christ in our parish and beyond.
            </p>
          </div>
        </section>

        {/* Latest Sermons */}
        <section className="sermons-section">
          <div className="section-header">
            <h2>Latest Sermons</h2>
            <p>
              Listen back to recent teachings and reflections from our clergy.
            </p>
          </div>

          <div className="sermon-grid">
            <article className="card sermon-card">
              <span className="tag-pill">Sunday Liturgy</span>
              <h3>The Power of Forgiveness</h3>
              <p className="card-meta">Father Tesfaye · 10 November 2025</p>
              <p>
                Exploring the call to forgive as Christ forgave us, and how this
                transforms our families and community.
              </p>
              <button className="card-btn">Watch Recording</button>
            </article>

            <article className="card sermon-card">
              <span className="tag-pill">Feast of Selassie</span>
              <h3>Living the Mystery of the Trinity</h3>
              <p className="card-meta">Father Yohannes · 2 November 2025</p>
              <p>
                A reflection on the Holy Trinity and how this mystery shapes our
                worship and daily life.
              </p>
              <button className="card-btn">Listen Audio</button>
            </article>

            <article className="card sermon-card">
              <span className="tag-pill">Bible Study</span>
              <h3>Faith in Difficult Times</h3>
              <p className="card-meta">Deacon Samuel · 27 October 2025</p>
              <p>
                Looking at the lives of the saints and how they remained
                steadfast in faith through trials.
              </p>
              <button className="card-btn">Read Notes</button>
            </article>
          </div>
        </section>

        {/* Upcoming Events */}
        <section className="events-section" id="events">
          <div className="section-header">
            <h2>Upcoming Events</h2>
            <p>
              Stay connected with feast days, special services, and community
              gatherings.
            </p>
          </div>

          <div className="event-list">
            <article className="card event-card">
              <div className="event-date">
                <span className="event-day">14</span>
                <span className="event-month">DEC</span>
              </div>
              <div className="event-content">
                <h3>Christmas Vigil & Liturgy</h3>
                <p className="card-meta">From 10:00 PM · Church Sanctuary</p>
                <p>
                  Join us for the all-night vigil and celebration of our
                  Saviour&apos;s Nativity with hymns and liturgy.
                </p>
              </div>
            </article>

            <article className="card event-card">
              <div className="event-date">
                <span className="event-day">05</span>
                <span className="event-month">JAN</span>
              </div>
              <div className="event-content">
                <h3>Youth Fellowship Evening</h3>
                <p className="card-meta">6:30 PM · Community Hall</p>
                <p>
                  A time for young people to gather for teaching, worship, and
                  friendship.
                </p>
              </div>
            </article>

            <article className="card event-card">
              <div className="event-date">
                <span className="event-day">19</span>
                <span className="event-month">JAN</span>
              </div>
              <div className="event-content">
                <h3>Charity Food Drive</h3>
                <p className="card-meta">After Sunday Liturgy</p>
                <p>
                  Help us support those in need by bringing non-perishable food
                  and essentials.
                </p>
              </div>
            </article>
          </div>
        </section>

        {/* Plan Your Visit */}
        <section className="visit-section" id="visit">
          <div className="visit-text">
            <h2>Plan Your Visit</h2>
            <p>
              We would love to welcome you in person. Here is how to find us and
              what to expect when you arrive.
            </p>

            <div className="visit-grid">
              <div>
                <h3>Address</h3>
                <p>
                  Selassie Ethiopian Orthodox Church
                  <br />
                  [Street name]
                  <br />
                  London, [Postcode]
                </p>
              </div>
              <div>
                <h3>What to Expect</h3>
                <p>
                  Services are mostly in Ge&apos;ez and Amharic with English
                  explanations. Our ushers are happy to help you find your way
                  around and answer any questions.
                </p>
              </div>
            </div>
          </div>

          <div className="visit-map-placeholder">
            <span className="map-label">Map &amp; Directions</span>
            <p>Google Maps embed will go here.</p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default App;
