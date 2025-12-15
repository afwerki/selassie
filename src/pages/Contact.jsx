import React, { useRef, useState } from "react";
import "../styling/contact.css";

const MAP_EMBED_SRC =
  "https://maps.google.com/maps?q=51.55854,-0.22529&z=16&output=embed";

const GOOGLE_FORM_ACTION =
  "https://docs.google.com/forms/d/e/1FAIpQLSdFG5siwQbBY8rQoKjwN4VJwypDU9upjkUwCAIglmXwcAcHPw/formResponse";

function Contact() {
  const formRef = useRef(null);

  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [messageSentTo, setMessageSentTo] = useState("");

  // These are for UI only (we still submit using entry.* names to Google)
  const [ui, setUi] = useState({
    name: "",
    email: "",
    message: "",
  });

  const onUiChange = (e) => {
    const { name, value } = e.target;
    setUi((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!ui.name.trim()) return "Please enter your name.";
    if (!ui.email.trim()) return "Please enter your email.";
    if (!/^\S+@\S+\.\S+$/.test(ui.email.trim())) return "Please enter a valid email.";
    if (!ui.message.trim()) return "Please type a message.";
    if (ui.message.trim().length < 8) return "Please add a little more detail.";
    return null;
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const err = validate();
    if (err) {
      setStatus("error");
      return;
    }

    setStatus("sending");

    // Keep email to show in thank-you message
    const emailForThankYou = ui.email.trim();
    setMessageSentTo(emailForThankYou);

    try {
      // submit silently via iframe target
      formRef.current?.submit();

      // clear UI fields
      setUi({ name: "", email: "", message: "" });
      setStatus("success");

      // allow a new submission after a short while
      setTimeout(() => setStatus("idle"), 7000);
    } catch (e2) {
      setStatus("error");
    }
  };

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
              Email: <a href="mailto:office@dght.uk">office@dght.uk</a>
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
          {/* Hidden iframe target to prevent redirect/new tab */}
          <iframe
            name="google-form-target"
            title="google-form-target"
            className="hidden-iframe"
          />

          <form
            ref={formRef}
            className="contact-form"
            action={GOOGLE_FORM_ACTION}
            method="POST"
            target="google-form-target"
            onSubmit={onSubmit}
            noValidate
          >
            <div className="form-header">
              <h3>Send Us a Message</h3>
              <p className="form-subtitle">
                We usually respond via email within 24–48 hours.
              </p>
            </div>

            {status === "success" && (
              <div className="form-alert form-alert--success" role="status">
                <div className="form-alert__title">Thank you! 🙏</div>
                <div className="form-alert__text">
                  We’ve received your message. We’ll get back to you at{" "}
                  <strong>{messageSentTo || "your email"}</strong>.
                </div>
              </div>
            )}

            {status === "error" && (
              <div className="form-alert form-alert--error" role="status">
                <div className="form-alert__title">Almost there</div>
                <div className="form-alert__text">
                  Please check your details and try again.
                </div>
              </div>
            )}

            {/* Name */}
            <div className="form-row">
              <label htmlFor="contact-name">Name</label>
              <input
                id="contact-name"
                type="text"
                name="name"
                placeholder="Your full name"
                value={ui.name}
                onChange={onUiChange}
                disabled={status === "sending"}
                autoComplete="name"
              />
              {/* Hidden field to match Google entry */}
              <input type="hidden" name="entry.197787725" value={ui.name} />
            </div>

            {/* Email */}
            <div className="form-row">
              <label htmlFor="contact-email">Email</label>
              <input
                id="contact-email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={ui.email}
                onChange={onUiChange}
                disabled={status === "sending"}
                autoComplete="email"
              />
              <input type="hidden" name="entry.1675574637" value={ui.email} />
            </div>

            {/* Message */}
            <div className="form-row">
              <label htmlFor="contact-message">Message</label>
              <textarea
                id="contact-message"
                name="message"
                rows="5"
                placeholder="How can we help?"
                value={ui.message}
                onChange={onUiChange}
                disabled={status === "sending"}
              />
              <input type="hidden" name="entry.748419976" value={ui.message} />
            </div>

            <button className="card-btn card-btn--primary" type="submit" disabled={status === "sending"}>
              {status === "sending" ? "Sending…" : "Send Message"}
            </button>

            <p className="form-note">
              By submitting, you agree that we may contact you back using the
              email you provided.
            </p>
          </form>

          <div className="map-card">
            <h3>Map &amp; Directions</h3>
            <p className="map-text">
              Find us on the map below. You can zoom and move around, or open the
              location directly in Google Maps.
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
