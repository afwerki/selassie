// src/components/Navbar.jsx
import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import "./Navbar.css";
import { useLanguage } from "../contexts/LanguageContext";
import { texts } from "../i18n/texts";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const { lang, toggleLanguage } = useLanguage();
  const t = texts[lang] || texts.en;

  const closeMenu = () => setIsOpen(false);
  const toggleMenu = () => setIsOpen((prev) => !prev);

  const onHome = location.pathname === "/";

  // ✅ When on homepage => "#events" (smooth scroll)
  // ✅ When on event details or any other route => "/#events" (navigate then scroll via HashScroll)
  const sectionHref = (id) => (onHome ? `#${id}` : `/#${id}`);

  // Fallback labels so items always show even if not in texts
  const projectLabel =
    t.nav.projects || (lang === "am" ? "ፕሮጀክቶች" : "Projects");

  const newsLabel =
    (t.nav && t.nav.news) || (lang === "am" ? "ዜና" : "News");

  return (
    <header className="navbar">
      <nav className="navbar-inner">
        {/* Logo (go home) */}
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <div className="logo-icon" aria-hidden="true">
            <span className="logo-cross-vertical" />
            <span className="logo-cross-horizontal" />
          </div>
          <span className="logo-text">{t.nav.title}</span>
        </Link>

        {/* Links */}
        <ul className={`navbar-links ${isOpen ? "is-open" : ""}`}>
          <li>
            <a href={sectionHref("home")} onClick={closeMenu}>
              {t.nav.home}
            </a>
          </li>

          <li>
            <a href={sectionHref("about")} onClick={closeMenu}>
              {t.nav.about}
            </a>
          </li>

          <li>
            <a href={sectionHref("projects")} onClick={closeMenu}>
              {projectLabel}
            </a>
          </li>

          <li>
            <a href={sectionHref("sermons")} onClick={closeMenu}>
              {t.nav.sermons}
            </a>
          </li>

          <li>
            <a href={sectionHref("events")} onClick={closeMenu}>
              {t.nav.events}
            </a>
          </li>

          {/* News tab */}
          <li>
            <a href={sectionHref("news")} onClick={closeMenu}>
              {newsLabel}
            </a>
          </li>

          <li>
            <a href={sectionHref("contact")} onClick={closeMenu}>
              {t.nav.contact}
            </a>
          </li>

          <li>
            <button
              className={`language-btn ${
                lang === "am" ? "language-btn-active" : ""
              }`}
              onClick={() => {
                toggleLanguage();
                closeMenu();
              }}
              type="button"
            >
              {lang === "en" ? t.nav.amharicToggle : t.nav.englishToggle}
            </button>
          </li>
        </ul>

        {/* Burger button (mobile) */}
        <button
          className="navbar-toggle"
          type="button"
          onClick={toggleMenu}
          aria-label="Toggle navigation"
        >
          <span className={`bar ${isOpen ? "open" : ""}`} />
          <span className={`bar ${isOpen ? "open" : ""}`} />
          <span className={`bar ${isOpen ? "open" : ""}`} />
        </button>
      </nav>
    </header>
  );
}

export default Navbar;
