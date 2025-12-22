import React, { useState } from "react";
import "../styling/contact.css";
import { useLanguage } from "../contexts/LanguageContext";
import { contactTexts } from "../i18n/contact";

const MAP_EMBED_SRC =
  "https://maps.google.com/maps?q=51.55854,-0.22529&z=16&output=embed";

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
const WEB3FORMS_ACCESS_KEY = "60ec16b5-0196-4db9-92d5-0e515e02c393";

function Contact() {
  const { lang } = useLanguage();
  const t = contactTexts[lang];

  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [sentTo, setSentTo] = useState("");
  const [values, setValues] = useState({
    name: "",
    email: "",
    message: "",
  });

  const isValidEmail = (email) => /^\S+@\S+\.\S+$/.test(email);

  const validate = () => {
    if (!values.name.trim()) return false;
    if (!values.email.trim() || !isValidEmail(values.email.trim()))
      return false;
    if (!values.message.trim() || values.message.trim().length < 3)
      return false;
    if (!WEB3FORMS_ACCESS_KEY) return false;
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
        subject: "ከደብረስላሴ Website የተላከ መልእክት",
        from_name: "Debre-Genet Holy Trinity Church Website",
        name: values.name,
        email: values.email,
        message: values.message,
        replyto: values.email,
      };

      const res = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Submission failed");
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
      {/* HEADER */}
      <section className="section-header section-header--contact">
        <h2 className="amharic-fix">{t.header.title}</h2>
        <p className="amharic-fix">{t.header.description}</p>
      </section>

      <section className="contact-grid">
        {/* LEFT COLUMN */}
        <div className="contact-column contact-column--info">
          <div className="contact-card">
            <h3 className="amharic-fix">{t.details.title}</h3>

            <div className="contact-kv">
              <div className="contact-kv__row">
                <span className="contact-kv__label">
                  {t.details.email}
                </span>
                <a
                  className="contact-kv__value"
                  href="mailto:office@dght.uk"
                >
                  office@dght.uk
                </a>
              </div>

              <div className="contact-kv__row">
                <span className="contact-kv__label">
                  {t.details.phone}
                </span>
                <a
                  className="contact-kv__value"
                  href="tel:+447341339751"
                >
                  07341 339 751
                </a>
              </div>
            </div>

            <p className="contact-visit-text amharic-fix">
              {t.details.note}
            </p>
          </div>

          <div className="contact-card">
            <h3 className="amharic-fix">{t.visit.title}</h3>

            <p className="contact-address amharic-fix">
              <span className="contact-address__title">
                {t.visit.churchName}
              </span>
              <span className="contact-address__line">
                {t.visit.address1}
              </span>
              <span className="contact-address__line">
                {t.visit.address2}
              </span>
            </p>

            <p className="contact-visit-text amharic-fix">
              {t.visit.note}
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="contact-column contact-column--form-map">
          <form className="contact-form" onSubmit={onSubmit} noValidate>
            <div className="form-header">
              <h3 className="amharic-fix">{t.form.title}</h3>
              <p className="form-subtitle amharic-fix">
                {t.form.subtitle}
              </p>
            </div>

            {status === "success" && (
              <div
                className="form-alert form-alert--success"
                role="status"
              >
                <div className="form-alert__title">
                  {t.form.success.title}
                </div>
                <div className="form-alert__text">
                  {t.form.success.message}{" "}
                  <strong>{sentTo}</strong>
                </div>
              </div>
            )}

            {status === "error" && (
              <div
                className="form-alert form-alert--error"
                role="status"
              >
                <div className="form-alert__title">
                  {t.form.error.title}
                </div>
                <div className="form-alert__text">
                  {t.form.error.message}{" "}
                  <a href="mailto:office@dght.uk">
                    office@dght.uk
                  </a>
                </div>
              </div>
            )}

            <div className="form-row-grid">
              <div className="form-row">
                <label htmlFor="contact-name">
                  {t.form.fields.name.label}
                </label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  placeholder={t.form.fields.name.placeholder}
                  value={values.name}
                  onChange={onChange}
                  disabled={status === "sending"}
                  autoComplete="name"
                />
              </div>

              <div className="form-row">
                <label htmlFor="contact-email">
                  {t.form.fields.email.label}
                </label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  placeholder={t.form.fields.email.placeholder}
                  value={values.email}
                  onChange={onChange}
                  disabled={status === "sending"}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-row">
              <label htmlFor="contact-message">
                {t.form.fields.message.label}
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows="5"
                placeholder={t.form.fields.message.placeholder}
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
              {status === "sending"
                ? t.form.submit.sending
                : t.form.submit.idle}
            </button>

            <p className="form-note amharic-fix">
              {t.form.note}
            </p>
          </form>

          <div className="map-card">
            <h3 className="amharic-fix">{t.map.title}</h3>
            <p className="map-text amharic-fix">{t.map.text}</p>

            <div className="map-embed-wrapper">
              <iframe
                src={MAP_EMBED_SRC}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                title="Church location map"
              />
            </div>

            <a
              className="map-link"
              href="https://www.google.com/maps/place/St+Michael's+Rd,+London+NW2+6XG"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.map.open}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Contact;
