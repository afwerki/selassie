import { useState } from "react";
import "./Navbar.css";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState("EN"); // EN or AM

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "EN" ? "AM" : "EN"));
  };

  return (
    <header className="navbar">
      <nav className="navbar-inner">
        {/* Logo */}
        <div className="navbar-logo">
          <div className="logo-icon" aria-hidden="true">
            <span className="logo-cross-vertical" />
            <span className="logo-cross-horizontal" />
          </div>
          <span className="logo-text">SELASSIE</span>
        </div>

        {/* Links */}
        <ul className={`navbar-links ${isOpen ? "is-open" : ""}`}>
          <li>
            <a href="#home">Home</a>
          </li>
          <li>
            <a href="#about">About</a>
          </li>
          <li>
            <a href="#services">Services</a>
          </li>
          <li>
            <a href="#sermons">Sermons</a>
          </li>
          <li>
            <a href="#events">Events</a>
          </li>
          <li>
            <button
              className={`language-btn ${
                language === "AM" ? "language-btn-active" : ""
              }`}
              onClick={toggleLanguage}
            >
              {language === "EN" ? "Amharic" : "English"}
            </button>
          </li>
        </ul>

        {/* Mobile burger */}
        <button
          className="navbar-toggle"
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
