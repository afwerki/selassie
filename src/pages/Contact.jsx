import React, { useState } from "react";
import "../styling/contact.css";

const MAP_EMBED_SRC =
  "https://maps.google.com/maps?q=51.55854,-0.22529&z=16&output=embed";

// ✅ Web3Forms endpoint
const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

// ✅ Put your Web3Forms access key here
const WEB3FORMS_ACCESS_KEY = "60ec16b5-0196-4db9-92d5-0e515e02c393";

function Contact() {
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [sentTo, setSentTo] = useState("");
  const [values, setValues] = useState({ name: "", email: "", message: "" });

  const isValidEmail = (email) => /^\S+@\S+\.\S+$/.test(email);

  const validate = () => {
    if (!values.name.trim()) return false;
    if (!values.email.trim() || !isValidEmail(values.email.trim())) return false;
    if (!values.message.trim() || values.message.trim().length < 3) return false;
    if (!WEB3FORMS_ACCESS_KEY || WEB3FORMS_ACCESS_KEY.includes("PASTE_"))
      return false;
    return true;
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setValues((p) => ({ ...p, [name]: value }));
    if (status === "error") setStatus("idle");
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      setStatus("error");
      return;
    }

    setStatus("sending");
    setSentTo(values.email.trim());

    try {
      const payload = {
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: "New message from Church Website",
        from_name: "Debre-Genet Holy Trinity Website",
        name: values.name,
        email: values.email,
        message: values.message,

        // Optional extras:
        // replyto: values.email,
        // redirect: "https://yourdomain.com/thank-you",
      };

      const res = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Web3Forms submission failed");
      }

      setStatus("success");
      setValues({ name: "", email: "", message: "" });
      setTimeout(() => setStatus("idle"), 7000);
    } catch (err) {
      console.error(err);
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
        {/* LEFT */}
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

        {/* RIGHT */}
        <div className="contact-column contact-column--form-map">
          <form className="contact-form" onSubmit={onSubmit} noValidate>
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
                  <strong>{sentTo}</strong>.
                </div>
              </div>
            )}

            {status === "error" && (
              <div className="form-alert form-alert--error" role="status">
                <div className="form-alert__title">Please check your details</div>
                <div className="form-alert__text">
                  Make sure your name, email, and message are filled correctly
                  (and that the Web3Forms access key is set). If it still fails,
                  email us directly at{" "}
                  <a href="mailto:office@dght.uk">office@dght.uk</a>.
                </div>
              </div>
            )}

            <div className="form-row">
              <label htmlFor="contact-name">Name</label>
              <input
                id="contact-name"
                type="text"
                name="name"
                placeholder="Your full name"
                value={values.name}
                onChange={onChange}
                disabled={status === "sending"}
                autoComplete="name"
              />
            </div>

            <div className="form-row">
              <label htmlFor="contact-email">Email</label>
              <input
                id="contact-email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={values.email}
                onChange={onChange}
                disabled={status === "sending"}
                autoComplete="email"
              />
            </div>

            <div className="form-row">
              <label htmlFor="contact-message">Message</label>
              <textarea
                id="contact-message"
                name="message"
                rows="5"
                placeholder="How can we help?"
                value={values.message}
                onChange={onChange}
                disabled={status === "sending"}
              />
            </div>

            <button
              className="card-btn card-btn--primary"
              type="submit"
              disabled={status === "sending"}
            >
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
