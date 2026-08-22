import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import "./Navbar.css";
import { useLanguage } from "../contexts/LanguageContext";
import { texts } from "../i18n/texts";
import logo from "../assets/images/logo.png";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const { lang, toggleLanguage } = useLanguage();
  const t = texts[lang] || texts.en;

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 14);
    };

    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const closeOnResize = () => {
      if (window.innerWidth > 1024) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", closeOnResize);
    return () => window.removeEventListener("resize", closeOnResize);
  }, []);

  const closeMenu = () => setIsOpen(false);
  const toggleMenu = () => setIsOpen((prev) => !prev);

  const onHome = location.pathname === "/";
  const sectionHref = (id) => (onHome ? `#${id}` : `/#${id}`);
  const isHashActive = (id) => location.hash === `#${id}`;

  const projectLabel =
    t.nav.projects || (lang === "am" ? "ፕሮጀክቶች" : "Projects");



  return (
    <header className={`navbar ${isScrolled ? "navbar-scrolled" : ""}`}>
      <nav className="navbar-inner" aria-label="Primary navigation">
        <Link
          to="/"
          className="navbar-logo"
          onClick={closeMenu}
          aria-label="Go to homepage"
        >
          <div className="logo-shell">
            <img
              src={logo}
              alt="Debre-Genet Holy Trinity logo"
              className="logo-image"
            />
          </div>

          <div className="logo-copy">
            <span className="logo-text">
              {lang === "am" ? "ደብረ-ገነት ቅድስት ሥላሴ" : t.nav.title}
            </span>
            <span className="logo-subtext">
              {lang === "am"
                ? "እምነት • ተስፋ • ማህበራዊ ህይዎት"
                : "Faith • Hope • Community"}
            </span>
          </div>
        </Link>

        <ul className={`navbar-links ${isOpen ? "is-open" : ""}`}>
          <li>
            <a
              href={sectionHref("home")}
              onClick={closeMenu}
              className={isHashActive("home") ? "active" : ""}
            >
              {t.nav.home}
            </a>
          </li>

          <li>
            <a
              href={sectionHref("about")}
              onClick={closeMenu}
              className={isHashActive("about") ? "active" : ""}
            >
              {t.nav.about}
            </a>
          </li>

          <li>
            <a
              href={sectionHref("projects")}
              onClick={closeMenu}
              className={isHashActive("projects") ? "active" : ""}
            >
              {projectLabel}
            </a>
          </li>

          <li>
            <a
              href={sectionHref("sermons")}
              onClick={closeMenu}
              className={isHashActive("sermons") ? "active" : ""}
            >
              {t.nav.sermons}
            </a>
          </li>

          <li>
            <a
              href={sectionHref("contact")}
              onClick={closeMenu}
              className={isHashActive("contact") ? "active" : ""}
            >
              {t.nav.contact}
            </a>
          </li>

          <li className="nav-actions">
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

        <button
          className={`navbar-toggle ${isOpen ? "open" : ""}`}
          type="button"
          onClick={toggleMenu}
          aria-label="Toggle navigation"
          aria-expanded={isOpen}
        >
          <span className="bar" />
          <span className="bar" />
          <span className="bar" />
        </button>
      </nav>
    </header>
  );
}

export default Navbar;