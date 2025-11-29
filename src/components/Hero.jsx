import "./Hero.css";
import { useLanguage } from "../contexts/LanguageContext";
import { texts } from "../i18n/texts";
import heroImage from "../assets/images/selassie.png";

function Hero() {
  const { lang } = useLanguage();
  const t = texts[lang];

  return (
    <section
      className="hero fade-in-up"
      id="home"
      style={{
        backgroundImage: `url(${heroImage})`,
      }}
    >
      <div className="hero-content">
        <div className="hero-text">
          <h1>{t.hero.title}</h1>
          <p>{t.hero.subtitle}</p>
          <div className="hero-actions">
            <a href="#sermons" className="hero-btn hero-btn-primary">
              {t.hero.btnPrimary}
            </a>
            <a href="#contact" className="hero-btn hero-btn-ghost">
              {t.hero.btnSecondary}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
