import React, { useEffect, useMemo, useRef, useState } from "react";
import "../styling/sermons.css";
import { client } from "../sanityClient";
import { useLanguage } from "../contexts/LanguageContext";
import { sectionTexts } from "../i18n/sectionTexts";

import VideosTab from "./Sermons/VideosTab";
import TeachingsTab from "./Sermons/TeachingsTab";
import QATab from "./Sermons/QATab";

const trackEvent = (action, params = {}) => {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", action, params);
  }
};

const YT_EMBED = (id) =>
  `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`;

const DEFAULT_LATEST_VIDEOS = 6;
const DEFAULT_LATEST_READING = 6;

export default function Sermons() {
  const { lang } = useLanguage();
  const tRoot = sectionTexts[lang] || sectionTexts.en;
  const t = tRoot.sermons || {};

  const [activeTab, setActiveTab] = useState("videos");
  const [mobileTabOpen, setMobileTabOpen] = useState(false);
  const mobileMenuRef = useRef(null);

  const [videos, setVideos] = useState([]);
  const [teachings, setTeachings] = useState([]);
  const [qaItems, setQaItems] = useState([]);
  const [loadingContent, setLoadingContent] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTag, setActiveTag] = useState("All");
  const [sortMode, setSortMode] = useState("newest");

  const [openVideo, setOpenVideo] = useState(null);

  const formatDate = (iso) => {
    if (!iso) return "";
    try {
      return new Date(iso).toLocaleDateString(lang === "am" ? "am-ET" : "en-GB", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "";
    }
  };

  useEffect(() => {
    let isMounted = true;

    const query = `
      {
        "videos": *[_type == "sermonVideo"] | order(coalesce(publishedAt, _createdAt) desc) {
          _id,
          _createdAt,
          title,
          description,
          series,
          speaker,
          topicTags,
          publishedAt,
          isFeatured,
          youtubeId,
          "thumbnailUrl": thumbnail.asset->url
        },
        "teachings": *[_type == "writtenTeaching"] | order(coalesce(publishedAt, _createdAt) desc) {
          _id,
          _createdAt,
          title,
          excerpt,
          series,
          author,
          topicTags,
          publishedAt,
          isFeatured,
          "pdfUrl": pdfFile.asset->url,
          "heroImageUrl": heroImage.asset->url
        },
        "qaItems": *[_type == "sermonQa" || _type == "churchQa"] | order(coalesce(orderRank, _createdAt) asc) {
          _id,
          question,
          answer,
          category,
          topicTags
        }
      }
    `;

    setLoadingContent(true);

    client
      .fetch(query)
      .then((res) => {
        if (!isMounted) return;

        const safeVideos = Array.isArray(res?.videos) ? res.videos : [];
        const safeTeachings = Array.isArray(res?.teachings) ? res.teachings : [];

        const safeQa =
          Array.isArray(res?.qaItems) && res.qaItems.length > 0
            ? res.qaItems.map((item, index) => ({
                id: item._id || `qa-${index}`,
                question: item.question || "",
                answer: item.answer || "",
                category: item.category || "",
                topicTags: Array.isArray(item.topicTags) ? item.topicTags : [],
              }))
            : [];

        setVideos(safeVideos);
        setTeachings(safeTeachings);
        setQaItems(safeQa);
      })
      .catch((err) => {
        console.error("Error fetching sermons content:", err);
        if (!isMounted) return;
        setVideos([]);
        setTeachings([]);
        setQaItems([]);
      })
      .finally(() => {
        if (isMounted) setLoadingContent(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpenVideo(null);
        setMobileTabOpen(false);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const onDown = (e) => {
      if (!mobileTabOpen) return;
      if (!mobileMenuRef.current) return;
      if (!mobileMenuRef.current.contains(e.target)) {
        setMobileTabOpen(false);
      }
    };

    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [mobileTabOpen]);

  useEffect(() => {
    setMobileTabOpen(false);
  }, [activeTab, lang]);

  const normalize = (value) => (value || "").toString().toLowerCase().trim();

  const allLabel = lang === "am" ? "ሁሉም" : "All";

  const allTags = useMemo(() => {
    const tags = new Set();

    (videos || []).forEach((v) => {
      (v.topicTags || []).forEach((tag) => {
        if (tag) tags.add(tag);
      });
    });

    (teachings || []).forEach((d) => {
      (d.topicTags || []).forEach((tag) => {
        if (tag) tags.add(tag);
      });
    });

    return [allLabel, ...Array.from(tags).sort((a, b) => a.localeCompare(b))];
  }, [videos, teachings, allLabel]);

  useEffect(() => {
    setActiveTag(allLabel);
  }, [allLabel]);

  const matchesQuery = (item) => {
    const q = normalize(searchQuery);
    if (!q) return true;

    const haystack = [
      item.title,
      item.description,
      item.excerpt,
      item.series,
      item.speaker,
      item.author,
      ...(item.topicTags || []),
    ]
      .filter(Boolean)
      .map(normalize)
      .join(" ");

    return haystack.includes(q);
  };

  const matchesTag = (item) => {
    if (!activeTag || activeTag === allLabel) return true;
    return (item.topicTags || []).includes(activeTag);
  };

  const sortByDate = (a, b) => {
    const da = new Date(a.publishedAt || a._createdAt || 0).getTime();
    const db = new Date(b.publishedAt || b._createdAt || 0).getTime();
    return sortMode === "newest" ? db - da : da - db;
  };

  const searchIsActive =
    normalize(searchQuery).length > 0 || (activeTag && activeTag !== allLabel);

  const filteredVideos = useMemo(() => {
    return (videos || []).filter(matchesQuery).filter(matchesTag).slice().sort(sortByDate);
  }, [videos, searchQuery, activeTag, sortMode, allLabel]);

  const filteredTeachings = useMemo(() => {
    return (teachings || []).filter(matchesQuery).filter(matchesTag).slice().sort(sortByDate);
  }, [teachings, searchQuery, activeTag, sortMode, allLabel]);

  const visibleVideos = useMemo(() => {
    if (searchIsActive) return filteredVideos;
    return filteredVideos.slice(0, DEFAULT_LATEST_VIDEOS);
  }, [filteredVideos, searchIsActive]);

  const visibleTeachings = useMemo(() => {
    if (searchIsActive) return filteredTeachings;
    return filteredTeachings.slice(0, DEFAULT_LATEST_READING);
  }, [filteredTeachings, searchIsActive]);

  const fallbackQaItems = Array.isArray(t?.qa?.items) ? t.qa.items : [];
  const displayedQaItems = qaItems.length > 0 ? qaItems : fallbackQaItems;

  const openVideoModal = (video) => {
    if (!video?.youtubeId) return;

    setOpenVideo({
      youtubeId: video.youtubeId,
      title: video.title || (lang === "am" ? "የቤተክርስቲያን ቪዲዮ" : "Church video"),
    });

    trackEvent("sermon_video_opened", {
      youtube_id: video.youtubeId,
      title: video.title,
      language: lang,
    });
  };

  const clearSearch = () => setSearchQuery("");

  const resetFilters = () => {
    setSearchQuery("");
    setActiveTag(allLabel);
    setSortMode("newest");
  };

  const tabVideoCount = videos.length;
  const tabTeachCount = teachings.length;
  const tabQaCount = displayedQaItems.length;

  const desktopLabels = {
    videos: t?.tabs?.videos || "Videos",
    teachings: t?.tabs?.teachings || "Reading Materials",
    qa: t?.tabs?.qa || "Q&A",
  };

  const mobileTabLabel = desktopLabels[activeTab] || desktopLabels.videos;

  const searchPlaceholder =
    activeTab === "teachings"
      ? lang === "am"
        ? "የንባብ ትምህርቶችን፣ ደራሲዎችን፣ ተከታታዮችን፣ መለያዎችን ይፈልጉ…"
        : "Search reading materials, authors, series, tags…"
      : lang === "am"
      ? "ስብከቶችን፣ አስተማሪዎችን፣ ተከታታዮችን፣ መለያዎችን ይፈልጉ…"
      : "Search sermons, speakers, series, tags…";

  const sortNewestLabel = lang === "am" ? "አዲስ በፊት" : "Newest";
  const sortOldestLabel = lang === "am" ? "አሮጌ በፊት" : "Oldest";
  const resetLabel = lang === "am" ? "እንደገና አስጀምር" : "Reset";
  const clearLabel = lang === "am" ? "ፈልግን አጥፋ" : "Clear search";
  const sortAria = lang === "am" ? "መደርደሪያ" : "Sort";
  const searchAria =
    lang === "am" ? "ስብከቶችን እና የንባብ ትምህርቶችን ፈልግ" : "Search sermons and reading materials";
  const tabsAria = lang === "am" ? "የስብከት ታቦች" : "Sermons tabs";
  const closeMenuLabel = lang === "am" ? "ሜኑን ዝጋ" : "Close menu";

  const changeTab = (tab) => {
    setActiveTab(tab);
    setMobileTabOpen(false);
  };

  return (
    <section
      className={`sermons-section ${mobileTabOpen ? "is-menu-open" : ""}`}
      id="sermons"
    >
      <div className="sermons-header">
        <div className="section-header">
          <h2>{t.sectionTitle || "Teachings & Sermons"}</h2>
          <p>
            {t.sectionIntro ||
              "Watch sermons, explore reading materials, and find helpful answers to common church questions."}
          </p>
        </div>
      </div>

      <div
        className="sermons-tabs sermons-tabs--desktop"
        role="tablist"
        aria-label={tabsAria}
      >
        <button
          type="button"
          className={`sermons-tab ${activeTab === "videos" ? "active" : ""}`}
          onClick={() => changeTab("videos")}
          role="tab"
          aria-selected={activeTab === "videos"}
        >
          {desktopLabels.videos} <span className="tab-count">({tabVideoCount})</span>
        </button>

        <button
          type="button"
          className={`sermons-tab ${activeTab === "teachings" ? "active" : ""}`}
          onClick={() => changeTab("teachings")}
          role="tab"
          aria-selected={activeTab === "teachings"}
        >
          {desktopLabels.teachings} <span className="tab-count">({tabTeachCount})</span>
        </button>

        <button
          type="button"
          className={`sermons-tab ${activeTab === "qa" ? "active" : ""}`}
          onClick={() => changeTab("qa")}
          role="tab"
          aria-selected={activeTab === "qa"}
        >
          {desktopLabels.qa} <span className="tab-count">({tabQaCount})</span>
        </button>
      </div>

      <div className="sermons-toolbar">
        <div className="sermons-search">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={searchPlaceholder}
            aria-label={searchAria}
            disabled={activeTab === "qa"}
          />

          {!!searchQuery && activeTab !== "qa" && (
            <button
              className="sermons-clear"
              onClick={clearSearch}
              aria-label={clearLabel}
              type="button"
            >
              ✕
            </button>
          )}
        </div>

        <div className="sermons-mobile-menu-wrap" ref={mobileMenuRef}>
          <button
            type="button"
            className="sermons-burger"
            onClick={() => setMobileTabOpen((prev) => !prev)}
            aria-expanded={mobileTabOpen}
            aria-controls="sermons-mobile-menu"
          >
            <span className="sermons-burger-icon" aria-hidden="true">
              ☰
            </span>
            <span className="sermons-burger-label">{mobileTabLabel}</span>
            <span className="sermons-burger-caret" aria-hidden="true">
              ▾
            </span>
          </button>

          {mobileTabOpen && (
            <div className="sermons-mobile-menu" id="sermons-mobile-menu" role="menu">
              <button
                type="button"
                className={`sermons-mobile-item ${activeTab === "videos" ? "active" : ""}`}
                role="menuitem"
                onClick={() => changeTab("videos")}
              >
                {desktopLabels.videos} <span className="tab-count">({tabVideoCount})</span>
              </button>

              <button
                type="button"
                className={`sermons-mobile-item ${activeTab === "teachings" ? "active" : ""}`}
                role="menuitem"
                onClick={() => changeTab("teachings")}
              >
                {desktopLabels.teachings} <span className="tab-count">({tabTeachCount})</span>
              </button>

              <button
                type="button"
                className={`sermons-mobile-item ${activeTab === "qa" ? "active" : ""}`}
                role="menuitem"
                onClick={() => changeTab("qa")}
              >
                {desktopLabels.qa} <span className="tab-count">({tabQaCount})</span>
              </button>
            </div>
          )}
        </div>

        <div className="sermons-sort">
          <select
            value={sortMode}
            onChange={(e) => setSortMode(e.target.value)}
            disabled={activeTab === "qa"}
            aria-label={sortAria}
          >
            <option value="newest">{sortNewestLabel}</option>
            <option value="oldest">{sortOldestLabel}</option>
          </select>
        </div>

        {(searchIsActive || sortMode !== "newest") && activeTab !== "qa" && (
          <button className="sermons-reset" onClick={resetFilters} type="button">
            {resetLabel}
          </button>
        )}
      </div>

      {mobileTabOpen && (
        <button
          type="button"
          className="sermons-menu-scrim"
          aria-label={closeMenuLabel}
          onClick={() => setMobileTabOpen(false)}
        />
      )}

      <div className="sermons-content">
        {activeTab !== "qa" && (
          <div className="sermons-tags">
            {allTags.map((tag) => (
              <button
                key={tag}
                type="button"
                className={`sermons-tag ${activeTag === tag ? "active" : ""}`}
                onClick={() => setActiveTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {activeTab === "videos" && (
          <VideosTab
            t={t}
            loading={loadingContent}
            visibleVideos={visibleVideos}
            filteredVideos={filteredVideos}
            searchIsActive={searchIsActive}
            defaultLatest={DEFAULT_LATEST_VIDEOS}
            formatDate={formatDate}
            onOpenVideo={openVideoModal}
            trackEvent={trackEvent}
          />
        )}

        {activeTab === "teachings" && (
          <TeachingsTab
            t={t}
            loading={loadingContent}
            visibleTeachings={visibleTeachings}
            filteredTeachings={filteredTeachings}
            searchIsActive={searchIsActive}
            defaultLatest={DEFAULT_LATEST_READING}
            formatDate={formatDate}
          />
        )}

        {activeTab === "qa" && (
          <QATab
            t={t}
            items={qaItems}
            loading={loadingContent}
            trackEvent={trackEvent}
          />
        )}
      </div>

      {openVideo?.youtubeId && (
        <div
          className="sermons-modal"
          role="dialog"
          aria-modal="true"
          onMouseDown={() => setOpenVideo(null)}
        >
          <div
            className="sermons-modal-card"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="sermons-modal-top">
              <h3 className="sermons-modal-title">{openVideo.title}</h3>
              <button
                className="sermons-modal-close"
                onClick={() => setOpenVideo(null)}
                aria-label={lang === "am" ? "ቪዲዮን ዝጋ" : "Close video"}
                type="button"
              >
                ✕
              </button>
            </div>

            <div className="sermons-modal-video">
              <iframe
                src={YT_EMBED(openVideo.youtubeId)}
                title={openVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}