import { useEffect, useMemo, useRef, useState } from "react";
import "./Hero.css";
import { useLanguage } from "../contexts/LanguageContext";
import { texts } from "../i18n/texts";

import slide1 from "../assets/images/church_inside.png";
import slide2 from "../assets/images/jesus.png";
import slide3 from "../assets/images/mission.jpg";

// ✅ TEMP: duplicate the same mp4 4 times for now (replace later)
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

  // ✅ Video crossfade system (2 video elements only — best for mobile autoplay)
  const [videoIndex, setVideoIndex] = useState(0); // which video in heroVideos should be loaded next
  const [videoSlot, setVideoSlot] = useState(0);   // 0 or 1 (which <video> is visible)

  const videoARef = useRef(null);
  const videoBRef = useRef(null);

  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState(null);

  const goTo = (idx) => setActive((idx + slides.length) % slides.length);
  const goNext = () => goTo(active + 1);
  const goPrev = () => goTo(active - 1);

  // ✅ SINGLE timer to rotate BOTH slide text + background video together
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setActive((a) => (a + 1) % slides.length);
      setVideoIndex((v) => (v + 1) % heroVideos.length);
    }, 7000);

    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  // ✅ Load the next video into the hidden slot, then swap slots for crossfade
  useEffect(() => {
    const incomingRef = videoSlot === 0 ? videoBRef : videoARef;
    const incoming = incomingRef.current;
    if (!incoming) return;

    // Set source
    incoming.src = heroVideos[videoIndex];
    incoming.load();

    // Try to play as soon as it can (iOS safe)
    const tryPlay = async () => {
      try {
        await incoming.play();
      } catch {
        // ignore autoplay failures; user gesture will fix it
      }
    };

    const onCanPlay = () => {
      tryPlay();
      // swap visible slot -> triggers CSS crossfade
      setVideoSlot((s) => (s === 0 ? 1 : 0));
    };

    incoming.addEventListener("canplay", onCanPlay, { once: true });

    // fallback (some browsers won’t fire canplay reliably)
    const fallback = setTimeout(() => {
      tryPlay();
      setVideoSlot((s) => (s === 0 ? 1 : 0));
    }, 900);

    return () => clearTimeout(fallback);
  }, [videoIndex]); // eslint-disable-line react-hooks/exhaustive-deps

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
      {/* ✅ Background video crossfade (2 videos only) */}
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
        />
        <video
          ref={videoBRef}
          className={`hero__video ${videoSlot === 1 ? "is-on" : "is-off"}`}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={activeSlide?.image}
        />
      </div>

      {/* ✅ super subtle photo wash (keeps vibe but doesn’t hide video) */}
      <div
        className="hero__photoWash"
        style={{ backgroundImage: `url(${activeSlide?.image})` }}
        aria-hidden="true"
      />

      {/* overlays */}
      <div className="hero__overlay" aria-hidden="true" />
      <div className="hero__noise" aria-hidden="true" />

      {/* floating accents */}
      <div className="hero__shape hero__shape--cross" aria-hidden="true" />
      <div className="hero__shape hero__shape--orb" aria-hidden="true" />

      {/* content */}
      <div className="hero__content">
        {/* ✅ key remount => animations replay when slide/lang changes */}
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
