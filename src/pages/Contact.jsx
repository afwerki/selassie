function Contact() {
  return (
    <main className="page" id="contact">
      <section className="section-header">
        <h2>Contact &amp; Visit Us</h2>
        <p>
          Get in touch with the church office or send us a message. We are
          always happy to hear from you.
        </p>
      </section>

      <section className="contact-grid">
        <div>
          <h3>Contact Details</h3>
          <p>
            Email: <a href="mailto:info@selassiechurch.org">info@selassiechurch.org</a>
            <br />
            Phone: 0200 000 0000
          </p>
          <p>
            Please contact us for baptisms, weddings, house blessings, or if you
            would like to meet with a priest.
          </p>
        </div>

        <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
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
      </section>
    </main>
  );
}

export default Contact;
