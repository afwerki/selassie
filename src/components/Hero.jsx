import "./Hero.css";

function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-content">
        <div className="hero-text fade-in-up">
          <h1>Selassie Ethiopian Orthodox Church in London</h1>
          <p>
            A spiritual home for the Ethiopian Orthodox community in London. Join
            us in worship, prayer, and fellowship as we walk together in faith and
            love.
          </p>
          <div className="hero-actions">
            <a href="#services" className="hero-btn hero-btn-primary">
              View Service Times
            </a>
            <a href="#visit" className="hero-btn hero-btn-ghost">
              Plan Your Visit
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
