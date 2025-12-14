// src/pages/About.jsx
import { useMemo, useState, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { texts } from "../i18n/aboutText";
import "../styling/about.css";

// Real images
import Abune_Matthias from "../assets/images/Abune_Matthias.jpg";
import eotc from "../assets/images/eotc.jpg";
import selasssie from "../assets/images/selassie.png";
import prist from "../assets/images/prist.jpeg";

// Icons
const IconChevron = ({ open }) => (
  <svg
    className={`about-chev ${open ? "open" : ""}`}
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path d="M7 10l5 5 5-5" />
  </svg>
);

// Spark icon — FIXED by CSS sizing + display:block in .about-heroBadgeIcon svg
const IconSpark = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2l1.6 6.1L20 10l-6.4 1.9L12 18l-1.6-6.1L4 10l6.4-1.9L12 2zm8 8l.7 2.7L23 13l-2.3.3L20 16l-.7-2.7L17 13l2.3-.3L20 10z" />
  </svg>
);

const UNSPLASH = {
  hero:
    "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=2400&q=80",
  candle:
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=80",
  stone:
    "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=1600&q=80",
  churchBg:
    "https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?auto=format&fit=crop&w=2400&q=80",
};

function Card({ title, children, className = "" }) {
  return (
    <div className={`about-card ${className}`}>
      <div className="about-cardTop">
        <h3 className="about-cardTitle">{title}</h3>
      </div>
      <div className="about-cardBody">{children}</div>
    </div>
  );
}

export default function About() {
  const { lang } = useLanguage();
  const t = useMemo(() => texts[lang]?.about || texts.en.about, [lang]);

  const [depth, setDepth] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isMobile = window.matchMedia("(max-width: 900px)").matches;
    setDepth(isMobile ? 0 : 1);
  }, []);

  const toggleTo = (level) => setDepth((d) => (d >= level ? level - 1 : level));

  return (
    <main className="page about-page about-glassRoot" id="about">
      {/* Background layers */}
      <div
        className="about-bgPhoto"
        style={{ backgroundImage: `url(${UNSPLASH.churchBg})` }}
        aria-hidden="true"
      />
      <div className="about-bgOverlay" aria-hidden="true" />

      {/* HERO */}
      <section className="about-hero">
        <div
          className="about-heroBg"
          style={{ backgroundImage: `url(${UNSPLASH.hero})` }}
        />
        <div className="about-heroOverlay" />

        <div className="about-heroInner">
          <div className="about-heroBadge">
            <span className="about-heroBadgeIcon" aria-hidden="true">
              <IconSpark />
            </span>
            <span className="about-heroBadgeText">{t.hero.badge}</span>
          </div>

          <h1 className="about-heroTitle">{t.hero.heading}</h1>
          <p className="about-heroLead">{t.hero.lead}</p>

          <div className="about-heroChips">
            <div
              className="about-chipImg"
              style={{ backgroundImage: `url(${UNSPLASH.candle})` }}
              aria-hidden="true"
            />
            <div
              className="about-chipImg"
              style={{ backgroundImage: `url(${UNSPLASH.stone})` }}
              aria-hidden="true"
            />
            <div className="about-chipText">
              Ancient rites • Living worship • Community care
            </div>
          </div>
        </div>
      </section>

      {/* HEADER */}
      <section className="section-header about-header">
        <h2>{t.header.title}</h2>
        <p>{t.header.subtitle}</p>
      </section>

      {/* CONTENT */}
      <section className="about-stage">
        <div className="about-stageScroll">
          {/* TOP TREE */}
          <div className="about-treeCard about-glassPanel">
            <div className="about-treeHeader">
              <div>
                <div className="about-treeTitle">Church Hierarchy</div>
                <div className="about-treeSub">
                  Tap each level to expand — clean and simple.
                </div>
              </div>

              <div className="about-treeActions">
                <button
                  type="button"
                  className="about-miniBtn"
                  onClick={() => setDepth(0)}
                  disabled={depth === 0}
                >
                  Collapse
                </button>
                <button
                  type="button"
                  className="about-miniBtn about-miniBtnPrimary"
                  onClick={() => setDepth(3)}
                >
                  Expand all
                </button>
              </div>
            </div>

            {/* Level 0 */}
            <button
              type="button"
              className="about-node about-nodeBtn"
              onClick={() => toggleTo(1)}
              aria-expanded={depth >= 1}
            >
              <div className="about-nodeAvatar">
                <img src={eotc} alt="Ethiopian Orthodox Tewahedo Church" />
              </div>
              <div className="about-nodeText">
                <div className="about-nodeName">
                  Ethiopian Orthodox Tewahedo Church
                </div>
                <div className="about-nodeRole">Mother Church</div>
                <div className="about-nodeDesc">
                  Rooted in the apostolic faith of the early Church.
                </div>
              </div>
              <IconChevron open={depth >= 1} />
            </button>

            <div className={`about-linkLine ${depth >= 1 ? "show" : ""}`} />

            {/* Level 1 */}
            <div className={`about-reveal ${depth >= 1 ? "open" : ""}`}>
              <div className="about-revealInner">
                <button
                  type="button"
                  className="about-node about-nodeBtn"
                  onClick={() => toggleTo(2)}
                  aria-expanded={depth >= 2}
                >
                  <div className="about-nodeAvatar">
                    <img src={Abune_Matthias} alt="Patriarch of the EOTC" />
                  </div>
                  <div className="about-nodeText">
                    <div className="about-nodeName">Patriarch of the EOTC</div>
                    <div className="about-nodeRole">Spiritual Head</div>
                    <div className="about-nodeDesc">
                      Shepherding the Church throughout the world.
                    </div>
                  </div>
                  <IconChevron open={depth >= 2} />
                </button>

                <div className={`about-linkLine ${depth >= 2 ? "show" : ""}`} />

                {/* Level 2 */}
                <div className={`about-reveal ${depth >= 2 ? "open" : ""}`}>
                  <div className="about-revealInner">
                    <button
                      type="button"
                      className="about-node about-nodeBtn about-nodeHighlight"
                      onClick={() => toggleTo(3)}
                      aria-expanded={depth >= 3}
                    >
                      <div className="about-nodeAvatar">
                        <img src={selasssie} alt="Debre Genet Holy Trinity Church" />
                      </div>
                      <div className="about-nodeText">
                        <div className="about-nodeName">
                          Debre Genet Holy Trinity Church
                        </div>
                        <div className="about-nodeRole">London Parish</div>
                        <div className="about-nodeDesc">
                          Worship, prayer, and community life in London.
                        </div>
                      </div>
                      <IconChevron open={depth >= 3} />
                    </button>

                    <div
                      className={`about-linkLine about-linkLineBlue ${
                        depth >= 3 ? "show" : ""
                      }`}
                    />

                    {/* Level 3 */}
                    <div className={`about-reveal ${depth >= 3 ? "open" : ""}`}>
                      <div className="about-revealInner">
                        <div className="about-priestGrid">
                          {(t.leadership?.clergy || []).map((p) => (
                            <div key={p.name} className="about-priestCard">
                              <div className="about-priestAvatar">
                                <img src={prist} alt={p.name} />
                              </div>
                              <div className="about-priestName">{p.name}</div>
                              <div className="about-priestRole">{p.role}</div>
                              <div className="about-priestDesc">
                                Serving the London parish.
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    {/* end level 3 */}
                  </div>
                </div>
              </div>
            </div>
            {/* end tree */}
          </div>

          {/* CONTENT BELOW */}
          <div className="about-contentStack">
            <Card title={t.aboutUs.title} className="about-readingCard about-glassPanel">
              <div className="about-prose">
                <p>{t.aboutUs.p1}</p>
                <p>{t.aboutUs.p2}</p>
                <p>{t.aboutUs.p3}</p>
                <p>{t.aboutUs.p4}</p>
              </div>

              <div className="about-note">
                <div className="about-noteTitle">{t.aboutUs.notesTitle}</div>
                <ul>
                  {t.aboutUs.notes.map((x, i) => (
                    <li key={i}>{x}</li>
                  ))}
                </ul>
              </div>
            </Card>

            <div className="about-twoCards">
              <Card title={t.youth.title} className="about-glassPanel">
                <div className="about-prose">
                  <p>{t.youth.p1}</p>
                  <p>{t.youth.p2}</p>
                  <p>{t.youth.p3}</p>
                </div>
                <div className="about-callout">{t.youth.extras}</div>
              </Card>

              <Card title={t.safeguarding.title} className="about-glassPanel">
                <div className="about-prose">
                  <p>{t.safeguarding.p1}</p>
                  <p>{t.safeguarding.p2}</p>
                </div>
                <div className="about-callout">{t.safeguarding.note}</div>
              </Card>
            </div>

            <section className="about-restoration about-glassPanel" id="restoration">
              <div className="about-restorationHeader">
                <h3>{t.restoration.title}</h3>
                <p className="about-muted">{t.restoration.subtitle}</p>
              </div>

              <div className="about-accordion">
                <details open>
                  <summary>Overview</summary>
                  {t.restoration.body.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </details>

                <details>
                  <summary>{t.restoration.scopeTitle}</summary>
                  <div className="about-scopeGrid">
                    {t.restoration.scope.map((item, i) => (
                      <div key={i} className="about-scopeCard">
                        <div className="about-scopeTitle">{item.title}</div>
                        <div className="about-scopeText">{item.text}</div>
                      </div>
                    ))}
                  </div>
                </details>

                <details>
                  <summary>{t.restoration.supportTitle}</summary>
                  <ul className="about-list">
                    {t.restoration.supportBullets.map((x, i) => (
                      <li key={i}>{x}</li>
                    ))}
                  </ul>

                  <div className="about-donate">
                    <div className="about-donateTitle">{t.restoration.donateTitle}</div>
                    <a
                      className="about-btn about-btnPrimary"
                      href={t.restoration.donateLink}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Donate Now
                    </a>
                    <div className="about-muted about-donateNote">{t.restoration.closing}</div>
                  </div>
                </details>
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
