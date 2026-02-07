// src/pages/News.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "../styling/news.css";
import { client } from "../sanityClient";
import { useLanguage } from "../contexts/LanguageContext";
import { sectionTexts } from "../i18n/sectionTexts";

const PAGE_SIZE = 6;

function estimateReadingTime(text) {
  const clean = (text || "").trim();
  if (!clean) return null;
  const words = clean.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200)); // ~200 wpm
  return `${minutes} min read`;
}

function News() {
  const { lang } = useLanguage();
  const tRoot = sectionTexts[lang] || sectionTexts.en;
  const t = tRoot.news;

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Paging
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  // UI controls
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeLang, setActiveLang] = useState("All"); // All | en | am etc.

  const formatDateTime = (iso) => {
    if (!iso) return "";
    try {
      const d = new Date(iso);
      const locale = lang === "am" ? "am-ET" : "en-GB";

      return d.toLocaleDateString(locale, {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return iso;
    }
  };

  // ✅ IMPORTANT: slug { current } (not just slug)
  const query = `
    *[_type == "newsArticle" && isPublished == true]
      | order(publishedAt desc)[$start...$end] {
        _id,
        title,
        slug { current },
        publishedAt,
        category,
        summary,
        language,
        "imageUrl": heroImage.asset->url,
        "bodyText": coalesce(pt::text(body), summary)
      }
  `;

  const countQuery = `
    count(*[_type == "newsArticle" && isPublished == true])
  `;

  useEffect(() => {
    let cancelled = false;

    async function loadFirstPage() {
      setLoading(true);
      setPage(0);

      try {
        const start = 0;
        const end = PAGE_SIZE;

        const [data, total] = await Promise.all([
          client.fetch(query, { start, end }),
          client.fetch(countQuery),
        ]);

        if (cancelled) return;

        const safe = Array.isArray(data) ? data : [];
        setArticles(safe);
        setHasMore(safe.length < (total || 0));
      } catch (err) {
        console.error("Sanity news fetch error:", err);
        if (!cancelled) {
          setArticles([]);
          setHasMore(false);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadFirstPage();
    return () => {
      cancelled = true;
    };
  }, [lang]); // reload for locale strings

  const loadMore = async () => {
    const nextPage = page + 1;
    const start = nextPage * PAGE_SIZE;
    const end = start + PAGE_SIZE;

    try {
      const [data, total] = await Promise.all([
        client.fetch(query, { start, end }),
        client.fetch(countQuery),
      ]);

      const safe = Array.isArray(data) ? data : [];
      setArticles((prev) => [...prev, ...safe]);
      setPage(nextPage);
      setHasMore(start + safe.length < (total || 0));
    } catch (err) {
      console.error("Sanity load more error:", err);
      setHasMore(false);
    }
  };

  const categories = useMemo(() => {
    const set = new Set();
    articles.forEach((a) => a?.category && set.add(a.category));
    return ["All", ...Array.from(set)];
  }, [articles]);

  const languages = useMemo(() => {
    const set = new Set();
    articles.forEach((a) => a?.language && set.add(a.language));
    return ["All", ...Array.from(set)];
  }, [articles]);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return articles.filter((a) => {
      const matchesCategory = activeCategory === "All" || a.category === activeCategory;
      const matchesLang = activeLang === "All" || a.language === activeLang;

      if (!s) return matchesCategory && matchesLang;

      const hay = `${a.title || ""}\n${a.summary || ""}\n${a.bodyText || ""}`.toLowerCase();
      return matchesCategory && matchesLang && hay.includes(s);
    });
  }, [articles, search, activeCategory, activeLang]);

  const featured = filtered[0];
  const rest = filtered.slice(1);

  const getSlugPath = (item) => {
    const s = item?.slug?.current;
    return s ? `/news/${s}` : null;
  };

  return (
    <main className="news-page" id="news">
      {/* Header */}
      <section className="news-header animate-fade-up">
        <span className="news-header-badge">{t.sectionBadge}</span>
        <h2 className="news-header-title">{t.sectionTitle}</h2>
        <p className="news-header-intro">{t.sectionIntro}</p>
      </section>

      {/* Controls */}
      <section className="news-controls animate-fade-up">
        <div className="news-search">
          <span className="news-search-icon" aria-hidden="true">
            ⌕
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.searchPlaceholder || "Search announcements…"}
            aria-label="Search news"
          />
          {search && (
            <button className="news-clear" onClick={() => setSearch("")} aria-label="Clear search">
              ✕
            </button>
          )}
        </div>

        <div className="news-filters">
          <div className="news-filter-row">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                className={"news-chip" + (activeCategory === c ? " is-active" : "")}
                onClick={() => setActiveCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>

          {languages.length > 1 && (
            <div className="news-filter-row">
              {languages.map((l) => (
                <button
                  key={l}
                  type="button"
                  className={"news-chip news-chip--soft" + (activeLang === l ? " is-active" : "")}
                  onClick={() => setActiveLang(l)}
                >
                  {l === "All" ? t.allLanguagesLabel || "All languages" : l.toUpperCase()}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Loading */}
      {loading && (
        <section className="news-grid">
          <div className="news-skeleton featured" />
          <div className="news-skeleton" />
          <div className="news-skeleton" />
          <div className="news-skeleton" />
        </section>
      )}

      {/* Empty */}
      {!loading && filtered.length === 0 && <p className="news-info-message">{t.noArticles}</p>}

      {!loading && filtered.length > 0 && (
        <>
          {/* Featured */}
          {featured && (
            <section className="news-featured animate-fade-up">
              <div className="news-featured-card">
                <div className="news-featured-media">
                  {featured.imageUrl ? (
                    <img src={featured.imageUrl} alt={featured.title} />
                  ) : (
                    <div className="news-featured-placeholder" />
                  )}
                  <div className="news-featured-gradient" />
                  <div className="news-featured-meta">
                    {featured.category && <span className="news-tag">{featured.category}</span>}
                    {featured.publishedAt && <span className="news-date">{formatDateTime(featured.publishedAt)}</span>}
                    {estimateReadingTime(featured.bodyText) && (
                      <span className="news-readtime">{estimateReadingTime(featured.bodyText)}</span>
                    )}
                  </div>
                </div>

                <div className="news-featured-content">
                  <h3 className="news-featured-title">{featured.title}</h3>
                  <p className="news-featured-summary">
                    {featured.summary || (featured.bodyText || "").slice(0, 220)}
                    {(featured.summary || (featured.bodyText || "")).length > 220 ? "…" : ""}
                  </p>

                  {getSlugPath(featured) ? (
                    <Link className="news-cta" to={getSlugPath(featured)}>
                      {t.readArticleLabel || "Read article"} <span aria-hidden="true">→</span>
                    </Link>
                  ) : (
                    <button className="news-cta" type="button" disabled title="Missing slug in Sanity">
                      {t.readArticleLabel || "Read article"} <span aria-hidden="true">→</span>
                    </button>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Feed */}
          <section className="news-grid">
            {rest.map((article) => {
              const fullText = article.bodyText || article.summary || article.title || "";
              const readTime = estimateReadingTime(fullText);

              let day = "";
              let month = "";
              if (article.publishedAt) {
                const d = new Date(article.publishedAt);
                day = d.getDate().toString().padStart(2, "0");
                month = d.toLocaleDateString(lang === "am" ? "am-ET" : "en-GB", { month: "short" });
              }

              return (
                <article key={article._id} className="news-card">
                  <div className="news-inner">
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

                    <div className="news-body">
                      <div className="news-meta-row">
                        <div className="news-meta-left">
                          {article.category && <span className="news-tag">{article.category}</span>}
                          {readTime && <span className="news-mini">{readTime}</span>}
                        </div>

                        {article.publishedAt && (
                          <div className="news-meta-right">
                            <span className="news-date-label">{formatDateTime(article.publishedAt)}</span>
                          </div>
                        )}
                      </div>

                      <h3 className="news-title">{article.title}</h3>

                      <p className="news-body-text no-scroll">{article.summary || fullText}</p>

                      {getSlugPath(article) ? (
                        <Link className="news-link" to={getSlugPath(article)}>
                          {t.readMoreLabel || "Read more"} <span aria-hidden="true">→</span>
                        </Link>
                      ) : (
                        <span className="news-link" style={{ opacity: 0.6 }}>
                          Missing slug
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </section>

          {/* Load more */}
          <div className="news-loadmore-wrap">
            {hasMore && (
              <button className="news-loadmore" type="button" onClick={loadMore}>
                {t.loadMoreLabel || "Load more"}
              </button>
            )}
          </div>
        </>
      )}
    </main>
  );
}

export default News;
