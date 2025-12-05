import React from "react";
import "../styling/contact.css";

const MAP_EMBED_SRC =
  "https://maps.google.com/maps?q=51.55854,-0.22529&z=16&output=embed";

function Contact() {
  return (
    <main className="page page--contact" id="contact">
      <section className="section-header section-header--contact">
        <h2>Contact &amp; Visit Us</h2>
        <p>
          Get in touch with the church office, send us a message, or plan your
          visit. We are always happy to hear from you.
        </p>
      </section>

      <section className="contact-grid">
        {/* LEFT COLUMN – DETAILS / VISIT INFO */}
        <div className="contact-column contact-column--info">
          <div className="contact-card">
            <h3>Contact Details</h3>
            <p>
              Email:{" "}
              <a href="mailto:office@dght.uk">office@dght.uk</a>
              <br />
              Phone: <a href="tel:+447341339751">07341 339 751</a>
            </p>
            <p>
              Please contact us for baptisms, weddings, house blessings, or if
              you would like to meet with a priest.
            </p>
          </div>

          <div className="contact-card">
            <h3>Visit Us</h3>
            <p className="contact-address">
              Debre-Genet Holy Trinity Church
              <br />
              St Michael&apos;s Road
              <br />
              London NW2 6XG
            </p>
            <p className="contact-visit-text">
              Sunday liturgy and main services are held at the address above.
              Please check our service times for the latest schedule.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN – FORM + MAP */}
        <div className="contact-column contact-column--form-map">
          <form
            className="contact-form"
            onSubmit={(e) => e.preventDefault()}
            noValidate
          >
            <h3>Send Us a Message</h3>

            <div className="form-row">
              <label>
                Name
                <input type="text" placeholder="Your full name" />
              </label>
            </div>

            <div className="form-row">
              <label>
                Email
                <input type="email" placeholder="you@example.com" />
              </label>
            </div>

            <div className="form-row">
              <label>
                Message
                <textarea rows="4" placeholder="How can we help?" />
              </label>
            </div>

            <button className="card-btn" type="submit">
              Send Message (placeholder)
            </button>
          </form>

          <div className="map-card">
            <h3>Map &amp; Directions</h3>
            <p className="map-text">
              Find us on the map below. You can zoom and move around, or open
              the location directly in Google Maps.
            </p>

            <div className="map-embed-wrapper">
              <iframe
                src={MAP_EMBED_SRC}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                title="Debre-Genet Holy Trinity Church map"
              />
            </div>

            <a
              className="map-link"
              href="https://www.google.com/maps/place/St+Michael's+Rd,+London+NW2+6XG"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open in Google Maps
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Contact;
