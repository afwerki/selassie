import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PortableText } from "@portabletext/react";
import { client } from "../sanityClient";
import "../styling/newsArticle.css";
import { useLanguage } from "../contexts/LanguageContext";

function estimateReadingTimeFromBlocks(blocks) {
  if (!Array.isArray(blocks) || blocks.length === 0) return null;
  const text = blocks
    .map((b) => (b?.children ? b.children.map((c) => c?.text || "").join(" ") : ""))
    .join(" ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

export default function NewsArticle() {
  const { slug } = useParams();
  const { lang } = useLanguage();

  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  const locale = lang === "am" ? "am-ET" : "en-GB";

  const formatDate = (iso) => {
    if (!iso) return "";
    try {
      const d = new Date(iso);
      return d.toLocaleDateString(locale, {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return iso;
    }
  };

  const canonicalUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/news/${slug}`;
  }, [slug]);

  const shareText = useMemo(() => {
    const title = article?.title || "Selassie Church News";
    return encodeURIComponent(title);
  }, [article]);

  const shareUrlEncoded = useMemo(() => encodeURIComponent(canonicalUrl), [canonicalUrl]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(canonicalUrl);
      alert("✅ Link copied!");
    } catch {
      // fallback
      const ta = document.createElement("textarea");
      ta.value = canonicalUrl;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      alert("✅ Link copied!");
    }
  };

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setArticle(null);
      setRelated([]);

      try {
        const q = `
          *[_type == "newsArticle" && isPublished == true && slug.current == $slug][0]{
            _id,
            title,
            slug { current },
            publishedAt,
            category,
            summary,
            language,
            "imageUrl": heroImage.asset->url,
            body
          }
        `;

        const a = await client.fetch(q, { slug });
        if (cancelled) return;

        setArticle(a || null);

        // Related (same category, exclude current)
        if (a?._id && a?.category) {
          const rq = `
            *[_type == "newsArticle" && isPublished == true && category == $cat && _id != $id]
              | order(publishedAt desc)[0...4]{
                _id,
                title,
                slug { current },
                publishedAt,
                category,
                summary,
                "imageUrl": heroImage.asset->url
              }
          `;
          const r = await client.fetch(rq, { cat: a.category, id: a._id });
          if (!cancelled) setRelated(Array.isArray(r) ? r : []);
        }
      } catch (err) {
        console.error("❌ NewsArticle fetch error:", err);
        if (!cancelled) {
          setArticle(null);
          setRelated([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  // Set page title for nicer UX/SEO-lite (real SEO would use react-helmet)
  useEffect(() => {
    if (!article?.title) return;
    const prev = document.title;
    document.title = `${article.title} | Selassie Church`;
    return () => {
      document.title = prev;
    };
  }, [article?.title]);

  const readingTime = useMemo(
    () => estimateReadingTimeFromBlocks(article?.body) || (article?.summary ? "1 min read" : null),
    [article?.body, article?.summary]
  );

  const portableComponents = {
    block: {
      h2: ({ children }) => <h2 className="na-h2">{children}</h2>,
      h3: ({ children }) => <h3 className="na-h3">{children}</h3>,
      normal: ({ children }) => <p className="na-p">{children}</p>,
      blockquote: ({ children }) => <blockquote className="na-quote">{children}</blockquote>,
    },
    list: {
      bullet: ({ children }) => <ul className="na-ul">{children}</ul>,
      number: ({ children }) => <ol className="na-ol">{children}</ol>,
    },
    listItem: {
      bullet: ({ children }) => <li className="na-li">{children}</li>,
      number: ({ children }) => <li className="na-li">{children}</li>,
    },
    marks: {
      link: ({ value, children }) => {
        const href = value?.href || "#";
        const isExternal = href.startsWith("http");
        return (
          <a
            className="na-link"
            href={href}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noreferrer noopener" : undefined}
          >
            {children}
          </a>
        );
      },
      strong: ({ children }) => <strong className="na-strong">{children}</strong>,
      em: ({ children }) => <em className="na-em">{children}</em>,
    },
  };

  if (loading) {
    return (
      <main className="news-article-page">
        <div className="news-article-wrap">
          <div className="na-stickybar">
            <Link className="na-back" to="/">
              ← Back
            </Link>
          </div>

          <div className="na-skel-hero" />
          <div className="na-skel-card" />
          <div className="na-skel-body" />
        </div>
      </main>
    );
  }

  if (!article) {
    return (
      <main className="news-article-page">
        <div className="news-article-wrap">
          <div className="na-stickybar">
            <Link className="na-back" to="/">
              ← Back
            </Link>
          </div>

          <div className="na-empty">
            <h1>Article not found</h1>
            <p>This news post may have been unpublished or the link is incorrect.</p>
            <Link className="na-btn" to="/">
              Go home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="news-article-page">
      <div className="news-article-wrap">
        {/* Sticky top bar */}
        <div className="na-stickybar">
          <Link className="na-back" to="/">
            ← Back
          </Link>

          <div className="na-share">
            <button className="na-share-btn" type="button" onClick={copyLink} title="Copy link">
              Copy link
            </button>

            <a
              className="na-share-btn soft"
              href={`https://wa.me/?text=${shareText}%20${shareUrlEncoded}`}
              target="_blank"
              rel="noreferrer noopener"
              title="Share on WhatsApp"
            >
              WhatsApp
            </a>

            <a
              className="na-share-btn soft"
              href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrlEncoded}`}
              target="_blank"
              rel="noreferrer noopener"
              title="Share on Facebook"
            >
              Facebook
            </a>

            <a
              className="na-share-btn soft"
              href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrlEncoded}`}
              target="_blank"
              rel="noreferrer noopener"
              title="Share on X"
            >
              X
            </a>
          </div>
        </div>

        {/* Header */}
        <header className="na-header">
          <div className="na-meta">
            {article.category && <span className="na-tag">{article.category}</span>}
            {article.publishedAt && <span className="na-date">{formatDate(article.publishedAt)}</span>}
            {readingTime && <span className="na-read">{readingTime}</span>}
            {article.language && (
              <span className="na-lang">{article.language.toUpperCase()}</span>
            )}
          </div>

          <h1 className="na-title">{article.title}</h1>

          {article.summary && <p className="na-summary">{article.summary}</p>}
        </header>

        {/* Hero */}
        {article.imageUrl && (
          <div className="na-hero">
            <img src={article.imageUrl} alt={article.title} />
          </div>
        )}

        {/* Body */}
        <article className="na-body">
          {Array.isArray(article.body) && article.body.length > 0 ? (
            <PortableText value={article.body} components={portableComponents} />
          ) : (
            <p className="na-p">{article.summary || "No content yet."}</p>
          )}
        </article>

        {/* Related */}
        {related.length > 0 && (
          <section className="na-related">
            <h2 className="na-related-title">Related</h2>

            <div className="na-related-grid">
              {related.map((r) => (
                <Link key={r._id} className="na-related-card" to={`/news/${r.slug?.current}`}>
                  <div className="na-related-thumb">
                    {r.imageUrl ? <img src={r.imageUrl} alt={r.title} /> : <div className="na-related-ph" />}
                  </div>
                  <div className="na-related-body">
                    <div className="na-related-meta">
                      {r.category && <span className="na-related-tag">{r.category}</span>}
                      {r.publishedAt && <span className="na-related-date">{formatDate(r.publishedAt)}</span>}
                    </div>
                    <div className="na-related-ttl">{r.title}</div>
                    {r.summary && <div className="na-related-sum">{r.summary}</div>}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Bottom nav */}
        <div className="na-bottom">
          <Link className="na-btn" to="/">
            Back to Home
          </Link>
          <a className="na-btn soft" href={canonicalUrl} onClick={(e) => e.preventDefault()}>
            {canonicalUrl}
          </a>
        </div>
      </div>
    </main>
  );
}
