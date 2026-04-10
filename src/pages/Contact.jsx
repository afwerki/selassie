import React from "react";
import "../styling/contact.css";
import { useLanguage } from "../contexts/LanguageContext";
import { contactTexts } from "../i18n/contact";

const MAP_EMBED_SRC =
  "https://maps.google.com/maps?q=51.55854,-0.22529&z=16&output=embed";

const CHURCHSUITE_CONTACT_FORM_URL =
  "https://dght.churchsuite.com/-/forms/mcpusai7";

function Contact() {
  const { lang } = useLanguage();
  const t = contactTexts[lang];

  return (
    <main className="page page--contact" id="contact">
      <section className="section-header section-header--contact">
        <h2 className="amharic-fix">{t.header.title}</h2>
        <p className="amharic-fix">{t.header.description}</p>
      </section>

      <section className="contact-grid">
        <div className="contact-column contact-column--info">
          <div className="contact-card">
            <h3 className="amharic-fix">{t.details.title}</h3>

            <div className="contact-kv">
              <div className="contact-kv__row">
                <span className="contact-kv__label">{t.details.email}</span>
                <a className="contact-kv__value" href="mailto:office@dght.uk">
                  office@dght.uk
                </a>
              </div>

              <div className="contact-kv__row">
                <span className="contact-kv__label">{t.details.phone}</span>
                <a className="contact-kv__value" href="tel:+447341339751">
                  07341 339 751
                </a>
              </div>
            </div>

            <p className="contact-visit-text amharic-fix">{t.details.note}</p>
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

            <p className="contact-visit-text amharic-fix">{t.visit.note}</p>
          </div>
        </div>

        <div className="contact-column contact-column--form-map">
          <div className="contact-form contact-form--embed">
            <div className="form-header">
              <h3 className="amharic-fix">{t.form.title}</h3>
              <p className="form-subtitle amharic-fix">{t.form.subtitle}</p>
            </div>

            <div className="churchsuite-form-wrap">
              <iframe
                src={CHURCHSUITE_CONTACT_FORM_URL}
                title="Contact us form"
                loading="lazy"
                className="churchsuite-form-frame"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <p className="form-note amharic-fix">{t.form.note}</p>
          </div>

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