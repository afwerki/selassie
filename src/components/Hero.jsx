import { useEffect, useMemo, useRef, useState } from "react";
import "./Hero.css";
import { useLanguage } from "../contexts/LanguageContext";
import { texts } from "../i18n/texts";

import slide1 from "../assets/images/church_inside.png";
import slide2 from "../assets/images/jesus.png";
import slide3 from "../assets/images/mission.jpg";

// ✅ TEMP: duplicate same mp4 4 times for now (replace later)
import heroVideo1 from "../assets/videos/church-hero.mp4";
import heroVideo2 from "../assets/videos/church-hero.mp4";
import heroVideo3 from "../assets/videos/church-hero.mp4";
import heroVideo4 from "../assets/videos/church-hero.mp4";

const heroImages = [slide1, slide2, slide3];
const heroVideos = [heroVideo1, heroVideo2, heroVideo3, heroVideo4];

function Hero() {
  const { lang } = useLanguage();
  const t = texts[lang];

  const slides = useMemo(() => {
    const fromI18n = t.heroSlides || [];
    return fromI18n.map((s, i) => ({
      ...s,
      image: heroImages[i] || heroImages[0],
    }));
  }, [t]);

  const [active, setActive] = useState(0);

  // ✅ Crossfade system: only 2 video tags
  const [videoIndex, setVideoIndex] = useState(0);
  const [videoSlot, setVideoSlot] = useState(0); // 0 or 1 (which is visible)

  const videoARef = useRef(null);
  const videoBRef = useRef(null);

  // ✅ Use explicit <source> for desktop reliability
  const [srcA, setSrcA] = useState(heroVideos[0]);
  const [srcB, setSrcB] = useState(heroVideos[1] || heroVideos[0]);

  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState(null);

  const goTo = (idx) => setActive((idx + slides.length) % slides.length);
  const goNext = () => goTo(active + 1);
  const goPrev = () => goTo(active - 1);

  // ✅ single timer for both slide text + video
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setActive((a) => (a + 1) % slides.length);
      setVideoIndex((v) => (v + 1) % heroVideos.length);
    }, 7000);

    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  // ✅ Load next src into hidden slot, swap only when "playing"
  useEffect(() => {
    const nextSrc = heroVideos[videoIndex];

    // hidden/incoming slot = opposite of current visible slot
    const incomingIsB = videoSlot === 0;

    // Set incoming source
    if (incomingIsB) setSrcB(nextSrc);
    else setSrcA(nextSrc);

    const incomingRef = incomingIsB ? videoBRef : videoARef;
    const incoming = incomingRef.current;
    if (!incoming) return;

    const tryPlay = async () => {
      try {
        await incoming.play();
      } catch {
        // ignore autoplay failures (muted should allow it)
      }
    };

    const onPlaying = () => {
      // ✅ swap only when video is truly playing (prevents blink on desktop)
      setVideoSlot((s) => (s === 0 ? 1 : 0));
    };

    incoming.addEventListener("playing", onPlaying, { once: true });
    tryPlay();

    // fallback if playing doesn't fire
    const fallback = setTimeout(() => {
      setVideoSlot((s) => (s === 0 ? 1 : 0));
    }, 1200);

    return () => {
      clearTimeout(fallback);
    };
  }, [videoIndex]); // keep minimal deps on purpose

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === "ArrowRight") goNext();
    if (e.key === "ArrowLeft") goPrev();
  };

  // Touch swipe
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
    setIsPaused(true);
  };

  const handleTouchEnd = (e) => {
    if (touchStartX == null) return setIsPaused(false);

    const diff = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(diff) > 50) (diff < 0 ? goNext() : goPrev());

    setTouchStartX(null);
    setIsPaused(false);
  };

  const activeSlide = slides[active] || slides[0];

  return (
    <section
      className="hero hero--video"
      id="home"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ✅ Background video crossfade */}
      <div className="hero__videoWrap" aria-hidden="true">
        <video
          ref={videoARef}
          className={`hero__video ${videoSlot === 0 ? "is-on" : "is-off"}`}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={activeSlide?.image}
        >
          <source src={srcA} type="video/mp4" />
        </video>

        <video
          ref={videoBRef}
          className={`hero__video ${videoSlot === 1 ? "is-on" : "is-off"}`}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={activeSlide?.image}
        >
          <source src={srcB} type="video/mp4" />
        </video>
      </div>

      {/* ✅ subtle photo wash */}
      <div
        className="hero__photoWash"
        style={{ backgroundImage: `url(${activeSlide?.image})` }}
        aria-hidden="true"
      />

      {/* overlays */}
      <div className="hero__overlay" aria-hidden="true" />
      <div className="hero__noise" aria-hidden="true" />

      {/* accents */}
      <div className="hero__shape hero__shape--cross" aria-hidden="true" />
      <div className="hero__shape hero__shape--orb" aria-hidden="true" />

      {/* content */}
      <div className="hero__content">
        <div className="heroCard" key={`heroCard-${lang}-${active}`}>
          <h1 className="heroCard__title heroAnim heroAnim--1 amharic-fix">
            {activeSlide?.title}
          </h1>

          <p className="heroCard__subtitle heroAnim heroAnim--2 amharic-fix">
            {activeSlide?.subtitle}
          </p>

          <div className="heroCard__actions heroAnim heroAnim--3">
            <a href={activeSlide?.href} className="heroBtn heroBtn--primary">
              {activeSlide?.cta} <span aria-hidden="true">→</span>
            </a>
            <a href="#contact" className="heroBtn heroBtn--ghost">
              {t.hero?.btnSecondary}
            </a>
          </div>

          <div className="heroCard__counter" aria-label="Slide counter">
            <span>{String(active + 1).padStart(2, "0")}</span>
            <span className="heroCard__sep">/</span>
            <span>{String(slides.length).padStart(2, "0")}</span>
          </div>
        </div>
      </div>

      {/* dots */}
      <div className="heroDots" aria-label="Hero slide navigation">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`heroDot ${i === active ? "is-active" : ""}`}
            onClick={() => {
              setIsPaused(true);
              setVideoIndex(i % heroVideos.length);
              goTo(i);
            }}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

export default Hero;
