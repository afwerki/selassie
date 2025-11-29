function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-column">
          <h3>Selassie Church</h3>
          <p>
            A spiritual home for the Ethiopian Orthodox community in London.
            Worship, fellowship, and service in the love of Christ.
          </p>
        </div>

        <div className="footer-column">
          <h4>Contact</h4>
          <p>
            Email: <a href="mailto:info@selassiechurch.org">info@selassiechurch.org</a>
            <br />
            Phone: 0200 000 0000
          </p>
        </div>

        <div className="footer-column">
          <h4>Service Times</h4>
          <p>
            Sunday Liturgy · 8:00 AM
            <br />
            Vespers · Saturday 6:00 PM
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {year} Selassie Ethiopian Orthodox Church in London</span>
      </div>
    </footer>
  );
}

export default Footer;
