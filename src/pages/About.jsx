import { useMemo, useEffect, useRef, useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { texts } from "../i18n/aboutText";
import "../styling/about.css";

import selasssie from "../assets/images/selassie.png";
import slide1 from "../assets/images/churchAtendes.JPG";
import slide2 from "../assets/images/Candles_inChurch.jpg";
import slide3 from "../assets/images/church9.JPG";

const IconSpark = () => (
  <svg className="about-ic" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2l1.6 6.1L20 10l-6.4 1.9L12 18l-1.6-6.1L4 10l6.4-1.9L12 2zm8 8l.7 2.7L23 13l-2.3.3L20 16l-.7-2.7L17 13l2.3-.3L20 10z" />
  </svg>
);

const IconCross = () => (
  <svg className="about-ic" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M10 3h4v5h5v4h-5v9h-4v-9H5V8h5V3z" />
  </svg>
);

const IconHeart = () => (
  <svg className="about-ic" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 21s-6.7-4.3-9.3-8C.6 10.5 1.1 6.8 4.2 5c2.1-1.2 4.8-.7 6.3 1 1.5-1.7 4.2-2.2 6.3-1 3.1 1.8 3.6 5.5 1.5 8-2.6 3.7-9.3 8-9.3 8z" />
  </svg>
);

const IconCommunity = () => (
  <svg className="about-ic" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M16 11c1.7 0 3-1.6 3-3.5S17.7 4 16 4s-3 1.6-3 3.5 1.3 3.5 3 3.5zM8 11c1.7 0 3-1.6 3-3.5S9.7 4 8 4 5 5.6 5 7.5 6.3 11 8 11zm0 2c-2.8 0-5 1.8-5 4v1h8v-1c0-1.1.3-2.1.9-3C10.9 13.4 9.5 13 8 13zm8 0c-1.5 0-2.9.4-3.9 1 .6.9.9 1.9.9 3v1h8v-1c0-2.2-2.2-4-5-4z" />
  </svg>
);

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.14 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, visible];
}

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth <= breakpoint : false
  );

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= breakpoint);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [breakpoint]);

  return isMobile;
}

export default function About() {
  const { lang } = useLanguage();
  const t = useMemo(() => texts[lang]?.about || texts.en?.about || {}, [lang]);

  const isMobile = useIsMobile(768);
  const isSmallMobile = useIsMobile(420);

  const [heroRef, heroVisible] = useReveal();
  const [storyRef, storyVisible] = useReveal();
  const [valuesRef, valuesVisible] = useReveal();
  const [missionRef, missionVisible] = useReveal();

  const [activeImage, setActiveImage] = useState(0);
  const [expandedMobileText, setExpandedMobileText] = useState(false);

  const galleryImages = useMemo(
    () => [
      { src: slide1, alt: "Church community gathering" },
      { src: slide2, alt: "Church worship moment" },
      { src: slide3, alt: "Church interior and community life" },
      { src: selasssie, alt: "Church faith heritage symbol" },
    ],
    []
  );

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveImage((prev) => (prev + 1) % galleryImages.length);
    }, 4200);

    return () => window.clearInterval(timer);
  }, [galleryImages.length]);

  useEffect(() => {
    setExpandedMobileText(false);
  }, [lang, isMobile, isSmallMobile]);

  const content = useMemo(() => {
    const fallback = {
      badge: "Ethiopian Orthodox Tewahedo Church",
      title: "About Debre Genet Holy Trinity Church",
      subtitle:
        "A spiritual home in London rooted in ancient Orthodox faith, loving community, and living heritage.",
      mobileSubtitle:
        "An Ethiopian Orthodox parish in London preserving ancient faith and serving a living community.",
      eyebrow: "About Our Church",
      sectionTitle: "Who We Are",
      sectionLead:
        "A welcoming church family where faith, prayer, tradition, and community grow together.",
      paragraphs: [
        "Debre Genet Holy Trinity Church is a parish of the Ethiopian Orthodox Tewahedo Church, one of the world's most ancient Christian traditions. Its faith, liturgy, sacred music, language, and spiritual customs have been preserved with reverence across generations.",
        "Established in London in 2006, the Church serves as a spiritual home for the Ethiopian Orthodox Christian community in the United Kingdom and welcomes all who wish to worship, learn, and take part in community life.",
        "Our worship continues through the ancient rites of the Church, especially in Ge'ez and Amharic, maintaining a living connection to the historic expressions of Orthodox Christian faith.",
        "The Church is also committed to pastoral care, youth formation, community support, and the preservation of Ethiopia's rich spiritual and cultural heritage.",
      ],
      missionTitle: "Our Mission",
      missionText:
        "To uphold the teachings of the Ethiopian Orthodox Tewahedo Church, nurture spiritual growth, support families and young people, and serve the wider community with humility, compassion, and faith.",
      values: [
        {
          title: "Faithful Worship",
          text: "We honour God through reverent liturgy, prayer, sacred music, and the sacramental life of the Church.",
        },
        {
          title: "Loving Community",
          text: "We seek to be a warm spiritual family where all are welcomed with dignity, care, and love.",
        },
        {
          title: "Living Tradition",
          text: "We preserve and share the rich heritage of the Ethiopian Orthodox faith for future generations.",
        },
      ],
      highlightLabel: "What shapes our church",
      stat1: "Faith-centred",
      stat2: "Community-led",
      stat3: "Heritage-rooted",
      valuesEyebrow: "What we stand for",
      valuesTitle: "Our Core Values",
      valuesIntro:
        "The principles that guide our worship, our relationships, and our service to the wider community.",
      missionEyebrow: "Purpose and direction",
      mediaCard: {
        title: "Orthodox Heritage",
        text: "Faith, reverence, and living tradition at the heart of our church life.",
      },
    };

    const paragraphs = [
      t.aboutUs?.p1,
      t.aboutUs?.p2,
      t.aboutUs?.p3,
      t.aboutUs?.p4,
    ].filter(Boolean);

    return {
      badge: t.hero?.badge || fallback.badge,
      title: t.header?.title || fallback.title,
      subtitle: t.header?.subtitle || fallback.subtitle,
      mobileSubtitle:
        t.header?.mobileSubtitle || t.hero?.mobileSubtitle || fallback.mobileSubtitle,
      eyebrow: t.hero?.heading || fallback.eyebrow,
      sectionTitle: t.aboutUs?.title || fallback.sectionTitle,
      sectionLead: t.hero?.lead || fallback.sectionLead,
      paragraphs: paragraphs.length ? paragraphs : fallback.paragraphs,
      missionTitle: t.mission?.title || fallback.missionTitle,
      missionText: t.mission?.text || fallback.missionText,
      missionEyebrow: t.mission?.eyebrow || fallback.missionEyebrow,
      values: t.values?.items?.length ? t.values.items : fallback.values,
      valuesEyebrow: t.values?.eyebrow || fallback.valuesEyebrow,
      valuesTitle: t.values?.title || fallback.valuesTitle,
      valuesIntro: t.values?.intro || fallback.valuesIntro,
      highlightLabel: t.highlightLabel || fallback.highlightLabel,
      stats: [
        t.stat1 || fallback.stat1,
        t.stat2 || fallback.stat2,
        t.stat3 || fallback.stat3,
      ].filter(Boolean),
      mediaCard: {
        title: t.mediaCard?.title || fallback.mediaCard.title,
        text: t.mediaCard?.text || fallback.mediaCard.text,
      },
    };
  }, [t]);

  const heroSubtitle = useMemo(() => {
    if (isSmallMobile) return content.mobileSubtitle || content.subtitle;
    if (isMobile && content.mobileSubtitle) return content.mobileSubtitle;
    return content.subtitle;
  }, [content.mobileSubtitle, content.subtitle, isMobile, isSmallMobile]);

  const visibleStats = useMemo(() => {
    if (isSmallMobile) return content.stats.slice(0, 2);
    return content.stats;
  }, [content.stats, isSmallMobile]);

  const mobilePreviewParagraphs = useMemo(() => {
    if (!isMobile || expandedMobileText) return content.paragraphs;
    return content.paragraphs.slice(0, isSmallMobile ? 1 : 2);
  }, [content.paragraphs, expandedMobileText, isMobile, isSmallMobile]);

  return (
    <main className="page about-page" id="about">
      <section className="about-hero">
        <div className="about-videoWrap" aria-hidden="true">
          <video
            className="about-video"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={slide2}
          >
            <source src="/videos/selassie-bg.webm" type="video/webm" />
            <source src="/videos/selassie-bg.mp4" type="video/mp4" />
          </video>

          <div className="about-videoOverlay" />
          <div className="about-videoNoise" />
          <div className="about-orb about-orbA" />
          <div className="about-orb about-orbB" />
        </div>

        <div
          ref={heroRef}
          className={`about-heroInner reveal-up ${heroVisible ? "is-visible" : ""}`}
        >
          <div className="about-heroBadge">
            <span className="about-heroBadgeIcon" aria-hidden="true">
              <IconSpark />
            </span>
            <span className="about-heroBadgeText">{content.badge}</span>
          </div>

          <h1 className="about-heroTitle">{content.title}</h1>
          <p className="about-heroLead">{heroSubtitle}</p>

          <div className="about-heroStats" aria-label={content.highlightLabel}>
            {visibleStats.map((item) => (
              <div key={item} className="about-statChip">
                <span className="about-statDot" aria-hidden="true" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="about-stage">
        <div
          ref={storyRef}
          className={`about-storyGrid reveal-up ${storyVisible ? "is-visible" : ""}`}
        >
          <article className="about-glassCard about-storyCard" aria-label={content.sectionTitle}>
            <div className="about-cardTopLine" />
            <div className="about-glassTop">
              <div className="about-glassKicker">{content.eyebrow}</div>
              <h2 className="about-glassTitle">{content.sectionTitle}</h2>
              <p className="about-glassSub">{content.sectionLead}</p>
            </div>

            <div className="about-storyBody">
              <div
                className={`about-prose ${isMobile && !expandedMobileText ? "is-collapsed" : ""}`}
              >
                {mobilePreviewParagraphs.map((paragraph, index) => (
                  <p key={`${index}-${paragraph.slice(0, 24)}`}>{paragraph}</p>
                ))}

                {isMobile && !expandedMobileText && content.paragraphs.length > mobilePreviewParagraphs.length && (
                  <div className="about-proseMore">...</div>
                )}
              </div>

              {isMobile && content.paragraphs.length > mobilePreviewParagraphs.length && (
                <button
                  type="button"
                  className="about-readToggle"
                  onClick={() => setExpandedMobileText((prev) => !prev)}
                  aria-expanded={expandedMobileText}
                >
                  {expandedMobileText ? "Show less" : "Continue reading"}
                </button>
              )}
            </div>
          </article>

          <aside className="about-mediaCard" aria-label="Church gallery">
            <div className="about-mediaGlow" aria-hidden="true" />

            <div className="about-stackWrap">
              {galleryImages.map((image, index) => {
                const offset = (index - activeImage + galleryImages.length) % galleryImages.length;
                const isActive = index === activeImage;

                return (
                  <button
                    key={`${image.alt}-${index}`}
                    type="button"
                    className={[
                      "about-stackCard",
                      isActive ? "is-active" : "",
                      offset === 1 ? "is-next" : "",
                      offset === 2 ? "is-third" : "",
                      offset > 2 ? "is-hidden" : "",
                    ].join(" ")}
                    onClick={() => setActiveImage(index)}
                    aria-label={`Show image ${index + 1}`}
                  >
                    <img src={image.src} alt={image.alt} className="about-stackImage" />
                  </button>
                );
              })}

              <div className="about-stackControls">
                <button
                  type="button"
                  className="about-stackNav"
                  onClick={() =>
                    setActiveImage(
                      (prev) => (prev - 1 + galleryImages.length) % galleryImages.length
                    )
                  }
                  aria-label="Previous image"
                >
                  ‹
                </button>

                <div className="about-stackDots" aria-label="Gallery navigation">
                  {galleryImages.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      className={`about-stackDot ${index === activeImage ? "is-active" : ""}`}
                      onClick={() => setActiveImage(index)}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  className="about-stackNav"
                  onClick={() => setActiveImage((prev) => (prev + 1) % galleryImages.length)}
                  aria-label="Next image"
                >
                  ›
                </button>
              </div>
            </div>

            <div className="about-mediaBadge">
              <span className="about-mediaBadgeIcon" aria-hidden="true">
                <IconCross />
              </span>
              <div>
                <strong>{content.mediaCard.title}</strong>
                <p>{content.mediaCard.text}</p>
              </div>
            </div>
          </aside>
        </div>

        <section
          ref={valuesRef}
          className={`about-valuesSection reveal-up ${valuesVisible ? "is-visible" : ""}`}
          aria-labelledby="about-values-title"
        >
          <div className="about-sectionHeading">
            <span className="about-sectionEyebrow">{content.valuesEyebrow}</span>
            <h2 id="about-values-title">{content.valuesTitle}</h2>
            <p>{content.valuesIntro}</p>
          </div>

          <div className="about-valuesGrid">
            <article className="about-valueCard">
              <div className="about-valueIconWrap" aria-hidden="true">
                <IconCross />
              </div>
              <h3>{content.values[0]?.title}</h3>
              <p>{content.values[0]?.text}</p>
            </article>

            <article className="about-valueCard">
              <div className="about-valueIconWrap" aria-hidden="true">
                <IconHeart />
              </div>
              <h3>{content.values[1]?.title}</h3>
              <p>{content.values[1]?.text}</p>
            </article>

            <article className="about-valueCard">
              <div className="about-valueIconWrap" aria-hidden="true">
                <IconCommunity />
              </div>
              <h3>{content.values[2]?.title}</h3>
              <p>{content.values[2]?.text}</p>
            </article>
          </div>
        </section>

        <section
          ref={missionRef}
          className={`about-missionBand reveal-up ${missionVisible ? "is-visible" : ""}`}
          aria-labelledby="about-mission-title"
        >
          <div className="about-missionContent">
            <span className="about-sectionEyebrow">{content.missionEyebrow}</span>
            <h2 id="about-mission-title">{content.missionTitle}</h2>
            <p>{content.missionText}</p>
          </div>
        </section>
      </section>
    </main>
  );
}