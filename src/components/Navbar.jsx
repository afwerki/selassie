// src/components/Navbar.jsx
import { useState } from "react";
import "./Navbar.css";
import { useLanguage } from "../contexts/LanguageContext";
import { texts } from "../i18n/texts";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { lang, toggleLanguage } = useLanguage();
  const t = texts[lang] || texts.en;

  const closeMenu = () => setIsOpen(false);
  const toggleMenu = () => setIsOpen((prev) => !prev);

  // Fallback labels so items always show even if not in texts
  const projectLabel =
    t.nav.projects || (lang === "am" ? "ፕሮጀክቶች" : "Projects");

  const newsLabel =
    (t.nav && t.nav.news) || (lang === "am" ? "ዜና" : "News");

  return (
    <header className="navbar">
      <nav className="navbar-inner">
        {/* Logo */}
        <div className="navbar-logo">
          <div className="logo-icon" aria-hidden="true">
            <span className="logo-cross-vertical" />
            <span className="logo-cross-horizontal" />
          </div>
          <span className="logo-text">{t.nav.title}</span>
        </div>

        {/* Links */}
        <ul className={`navbar-links ${isOpen ? "is-open" : ""}`}>
          <li>
            <a href="#home" onClick={closeMenu}>
              {t.nav.home}
            </a>
          </li>

          <li>
            <a href="#about" onClick={closeMenu}>
              {t.nav.about}
            </a>
          </li>

          <li>
            <a href="#projects" onClick={closeMenu}>
              {projectLabel}
            </a>
          </li>

          <li>
            <a href="#sermons" onClick={closeMenu}>
              {t.nav.sermons}
            </a>
          </li>

          <li>
            <a href="#events" onClick={closeMenu}>
              {t.nav.events}
            </a>
          </li>

          {/* NEW: News tab */}
          <li>
            <a href="#news" onClick={closeMenu}>
              {newsLabel}
            </a>
          </li>

          <li>
            <a href="#contact" onClick={closeMenu}>
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
