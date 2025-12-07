// src/pages/News.jsx
import React, { useEffect, useState } from "react";
import "../styling/news.css";
import { client } from "../sanityClient";
import { useLanguage } from "../contexts/LanguageContext";
import { sectionTexts } from "../i18n/sectionTexts";

function News() {
  const { lang } = useLanguage();
  const tRoot = sectionTexts[lang] || sectionTexts.en;
  const t = tRoot.news;

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Each card acts independently
  const [openMap, setOpenMap] = useState({});

  useEffect(() => {
    const query = `
      *[_type == "newsArticle" && isPublished == true]
        | order(publishedAt desc) {
          _id,
          title,
          slug,
          publishedAt,
          category,
          summary,
          language,
          "imageUrl": heroImage.asset->url,
          // flatten PortableText body into plain text, fall back to summary
          "bodyText": coalesce(pt::text(body), summary)
        }
    `;

    setLoading(true);

    client
      .fetch(query)
      .then((data) => {
        if (!Array.isArray(data)) {
          setArticles([]);
          return;
        }

        // Show ALL languages (so Amharic shows even when site is English)
        const limited = data
          .slice(0, 4) // max 4 articles
          .map((item, index) => ({
            ...item,
            _animationIndex: index,
          }));

        setArticles(limited);
      })
      .catch((err) => {
        console.error("Sanity news fetch error:", err);
        setArticles([]);
      })
      .finally(() => setLoading(false));
  }, [lang]);

  const toggleExpanded = (id) => {
    setOpenMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const formatDateTime = (iso) => {
    if (!iso) return "";
    try {
      const d = new Date(iso);
      const locale = lang === "am" ? "am-ET" : "en-GB";

      const datePart = d.toLocaleDateString(locale, {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      });

      const timePart = d.toLocaleTimeString(locale, {
        hour: "2-digit",
        minute: "2-digit",
      });

      return `${datePart} · ${timePart}`;
    } catch {
      return iso;
    }
  };

  return (
    <main className="news-page" id="news">
      {/* Header */}
      <section className="news-header animate-fade-up">
        <span className="news-header-badge">{t.sectionBadge}</span>
        <h2 className="news-header-title">{t.sectionTitle}</h2>
        <p className="news-header-intro">{t.sectionIntro}</p>
      </section>

      {/* Grid */}
      <section className="news-grid">
        {loading && (
          <p className="news-info-message">
            Loading the latest news from the parish…
          </p>
        )}

        {!loading && articles.length === 0 && (
          <p className="news-info-message">{t.noArticles}</p>
        )}

        {!loading &&
          articles.map((article) => {
            const isExpanded = !!openMap[article._id];
            const delay = `${article._animationIndex * 70}ms`;

            const fullText =
              article.bodyText || article.summary || article.title || "";

            let day = "";
            let month = "";
            if (article.publishedAt) {
              const d = new Date(article.publishedAt);
              day = d.getDate().toString().padStart(2, "0");
              month = d.toLocaleDateString(
                lang === "am" ? "am-ET" : "en-GB",
                { month: "short" }
              );
            }

            return (
              <article
                key={article._id}
                className={
                  "news-card animate-news-card" +
                  (isExpanded ? " news-card--expanded" : "")
                }
                style={{ animationDelay: delay }}
              >
                <div className="news-inner">
                  {/* Image on the left */}
                  <div className="news-thumb">
                    {article.imageUrl ? (
                      <img src={article.imageUrl} alt={article.title} />
                    ) : (
                      <div className="news-thumb-placeholder" />
                    )}

                    {day && month && (
                      <div className="news-pill-date">
                        <span className="news-pill-day">{day}</span>
                        <span className="news-pill-month">{month}</span>
                      </div>
                    )}
                  </div>

                  {/* Text on the right */}
                  <div className="news-body">
                    <div className="news-meta-row">
                      <div className="news-meta-left">
                        {article.category && (
                          <span className="news-tag">{article.category}</span>
                        )}
                      </div>

                      {article.publishedAt && (
                        <div className="news-meta-right">
                          <span className="news-meta-dot">•</span>
                          <span className="news-date-label">
                            {formatDateTime(article.publishedAt)}
                          </span>
                        </div>
                      )}
                    </div>

                    <h3 className="news-title">{article.title}</h3>

                    {/* Body text with internal scroll on expand */}
                    <p
                      className={
                        "news-body-text" +
                        (isExpanded ? " news-body-text--expanded" : "")
                      }
                    >
                      {fullText}
                    </p>

                    <button
                      type="button"
                      className="news-toggle-btn"
                      onClick={() => toggleExpanded(article._id)}
                    >
                      {isExpanded ? t.readLessLabel : t.readMoreLabel}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
      </section>
    </main>
  );
}

export default News;
