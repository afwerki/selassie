import React, { useEffect, useMemo, useRef, useState } from "react";
import "../styling/sermons.css";
import { client } from "../sanityClient";
import { useLanguage } from "../contexts/LanguageContext";
import { sectionTexts } from "../i18n/sectionTexts";

import VideosTab from "./Sermons/VideosTab";
import TeachingsTab from "./Sermons/TeachingsTab";
import QuizTab from "./Sermons/QuizTab";

// GA4 helper
const trackEvent = (action, params = {}) => {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", action, params);
  }
};

const YT_EMBED = (id) =>
  `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`;

export default function Sermons() {
  const { lang } = useLanguage();
  const tRoot = sectionTexts[lang] || sectionTexts.en;
  const t = tRoot.sermons;

  const [activeTab, setActiveTab] = useState("videos"); // videos | teachings | qa
  const [mobileTabOpen, setMobileTabOpen] = useState(false);
  const mobileMenuRef = useRef(null);

  // content
  const [videos, setVideos] = useState([]);
  const [teachings, setTeachings] = useState([]);
  const [loadingContent, setLoadingContent] = useState(true);

  // quiz sets
  const [quizSets, setQuizSets] = useState([]);
  const [loadingQuizSets, setLoadingQuizSets] = useState(true);

  // search/filter/sort (videos + teachings)
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTag, setActiveTag] = useState("All");
  const [sortMode, setSortMode] = useState("newest"); // newest | oldest

  const DEFAULT_LATEST_VIDEOS = 3;
  const DEFAULT_LATEST_TEACHINGS = 6;

  // video modal
  const [openVideo, setOpenVideo] = useState(null);

  const formatDate = (iso) => {
    if (!iso) return "";
    try {
      return new Date(iso).toLocaleDateString("en-GB", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "";
    }
  };

  // Fetch videos + teachings
  useEffect(() => {
    const query = `
      {
        "videos": *[_type == "sermonVideo"] | order(coalesce(publishedAt, _createdAt) desc) {
          _id, _createdAt, title, description, series, speaker, topicTags, publishedAt, isFeatured, youtubeId,
          "thumbnailUrl": thumbnail.asset->url
        },
        "teachings": *[_type == "writtenTeaching"] | order(coalesce(publishedAt, _createdAt) desc) {
          _id, _createdAt, title, excerpt, series, author, topicTags, publishedAt, isFeatured,
          "pdfUrl": pdfFile.asset->url,
          "heroImageUrl": heroImage.asset->url
        }
      }
    `;
    setLoadingContent(true);
    client
      .fetch(query)
      .then((res) => {
        setVideos(Array.isArray(res?.videos) ? res.videos : []);
        setTeachings(Array.isArray(res?.teachings) ? res.teachings : []);
      })
      .catch((err) => console.error("Error fetching sermons content:", err))
      .finally(() => setLoadingContent(false));
  }, []);

  // Fetch quiz sets
  useEffect(() => {
    const query = `
      *[_type == "quizSet" && isActive == true]
        | order(coalesce(createdAt, _createdAt) desc) {
        _id, title, slug, description, createdAt,
        "heroImageUrl": heroImage.asset->url,
        questions[]{
          _key, questionText, difficulty, explanation,
          options[]{ _key, label, isCorrect }
        }
      }
    `;
    client
      .fetch(query)
      .then((data) => {
        if (!Array.isArray(data)) return setQuizSets([]);

        const mapped = data.map((set, index) => ({
          id: set._id,
          slug: set.slug?.current || `quiz-${index}`,
          title: set.title || "Untitled quiz",
          description: set.description || "",
          createdAt: set.createdAt || new Date().toISOString(),
          heroImageUrl: set.heroImageUrl || "",
          questions:
            set.questions?.map((q, qIndex) => ({
              id: q._key || `${set._id}-q-${qIndex}`,
              question: q.questionText || "Untitled question",
              difficulty: q.difficulty || "Beginner",
              explanation:
                q.explanation ||
                "Explanation not provided yet. Please speak with a priest for more details.",
              options:
                q.options?.map((opt, optIdx) => ({
                  id: opt._key || `${set._id}-q-${qIndex}-opt-${optIdx}`,
                  label: opt.label || "Answer",
                  isCorrect: !!opt.isCorrect,
                })) || [],
            })) || [],
        }));

        setQuizSets(mapped);
      })
      .catch((err) => console.error("Error fetching quiz sets:", err))
      .finally(() => setLoadingQuizSets(false));
  }, [t.quiz.fallbackQuestions, t.quiz.fallbackTitle]);

  // Escape closes modal
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setOpenVideo(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // ✅ Bulletproof outside click for mobile menu
  useEffect(() => {
    const onDown = (e) => {
      if (!mobileTabOpen) return;
      if (!mobileMenuRef.current) return;
      if (!mobileMenuRef.current.contains(e.target)) setMobileTabOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [mobileTabOpen]);

  useEffect(() => setMobileTabOpen(false), [activeTab]);

  // tags
  const allTags = useMemo(() => {
    const tags = new Set();
    (videos || []).forEach((v) => (v.topicTags || []).forEach((x) => tags.add(x)));
    (teachings || []).forEach((d) => (d.topicTags || []).forEach((x) => tags.add(x)));
    return ["All", ...Array.from(tags).sort((a, b) => a.localeCompare(b))];
  }, [videos, teachings]);

  // filter/sort
  const normalize = (s) => (s || "").toString().toLowerCase().trim();

  const matchesQuery = (item) => {
    const q = normalize(searchQuery);
    if (!q) return true;
    const hay = [
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
    return hay.includes(q);
  };

  const matchesTag = (item) => {
    if (!activeTag || activeTag === "All") return true;
    return (item.topicTags || []).includes(activeTag);
  };

  const sortByDate = (a, b) => {
    const da = new Date(a.publishedAt || a._createdAt || 0).getTime();
    const db = new Date(b.publishedAt || b._createdAt || 0).getTime();
    return sortMode === "newest" ? db - da : da - db;
  };

  const searchIsActive =
    normalize(searchQuery).length > 0 || (activeTag && activeTag !== "All");

  const filteredVideos = useMemo(
    () => (videos || []).filter(matchesQuery).filter(matchesTag).slice().sort(sortByDate),
    [videos, searchQuery, activeTag, sortMode]
  );

  const filteredTeachings = useMemo(
    () => (teachings || []).filter(matchesQuery).filter(matchesTag).slice().sort(sortByDate),
    [teachings, searchQuery, activeTag, sortMode]
  );

  const visibleVideos = useMemo(() => {
    if (searchIsActive) return filteredVideos;
    return filteredVideos.slice(0, DEFAULT_LATEST_VIDEOS);
  }, [filteredVideos, searchIsActive]);

  const visibleTeachings = useMemo(() => {
    if (searchIsActive) return filteredTeachings;
    return filteredTeachings.slice(0, DEFAULT_LATEST_TEACHINGS);
  }, [filteredTeachings, searchIsActive]);

  const openVideoModal = (v) => {
    if (!v?.youtubeId) return;
    setOpenVideo({ youtubeId: v.youtubeId, title: v.title || "Sermon video" });
    trackEvent("sermon_video_opened", { youtube_id: v.youtubeId, title: v.title });
  };

  const clearSearch = () => setSearchQuery("");
  const resetFilters = () => {
    setSearchQuery("");
    setActiveTag("All");
    setSortMode("newest");
  };

  const tabVideoCount = videos.length;
  const tabTeachCount = teachings.length;
  const tabQuizCount = quizSets.length;

  const mobileTabLabel =
    activeTab === "videos"
      ? t.tabs.videos
      : activeTab === "teachings"
      ? t.tabs.teachings
      : t.tabs.quiz;

  const changeTab = (tab) => {
    setActiveTab(tab);
    setMobileTabOpen(false);
  };

  return (
    <section className={`sermons-section ${mobileTabOpen ? "is-menu-open" : ""}`} id="sermons">
      <div className="sermons-header">
        <div className="section-header">
          <h2>{t.sectionTitle}</h2>
          <p>{t.sectionIntro}</p>
        </div>
      </div>

      {/* Desktop tabs */}
      <div className="sermons-tabs sermons-tabs--desktop" role="tablist" aria-label="Sermons tabs">
        <button
          type="button"
          className={`sermons-tab ${activeTab === "videos" ? "active" : ""}`}
          onClick={() => changeTab("videos")}
          role="tab"
          aria-selected={activeTab === "videos"}
        >
          {t.tabs.videos} <span className="tab-count">({tabVideoCount})</span>
        </button>

        <button
          type="button"
          className={`sermons-tab ${activeTab === "teachings" ? "active" : ""}`}
          onClick={() => changeTab("teachings")}
          role="tab"
          aria-selected={activeTab === "teachings"}
        >
          {t.tabs.teachings} <span className="tab-count">({tabTeachCount})</span>
        </button>

        <button
          type="button"
          className={`sermons-tab ${activeTab === "qa" ? "active" : ""}`}
          onClick={() => changeTab("qa")}
          role="tab"
          aria-selected={activeTab === "qa"}
        >
          {t.tabs.quiz} <span className="tab-count">({tabQuizCount})</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="sermons-toolbar">
        <div className="sermons-search">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search sermons, teachings, series, tags…"
            aria-label="Search sermons and teachings"
            disabled={activeTab === "qa"}
          />
          {!!searchQuery && activeTab !== "qa" && (
            <button className="sermons-clear" onClick={clearSearch} aria-label="Clear search" type="button">
              ✕
            </button>
          )}
        </div>

        {/* Mobile dropdown */}
        <div className="sermons-mobile-menu-wrap" ref={mobileMenuRef}>
          <button
            type="button"
            className="sermons-burger"
            onClick={() => setMobileTabOpen((s) => !s)}
            aria-expanded={mobileTabOpen}
            aria-controls="sermons-mobile-menu"
          >
            <span className="sermons-burger-icon" aria-hidden="true">☰</span>
            <span className="sermons-burger-label">{mobileTabLabel}</span>
            <span className="sermons-burger-caret" aria-hidden="true">▾</span>
          </button>

          {mobileTabOpen && (
            <div className="sermons-mobile-menu" id="sermons-mobile-menu" role="menu">
              <button
                type="button"
                className={`sermons-mobile-item ${activeTab === "videos" ? "active" : ""}`}
                role="menuitem"
                onClick={() => changeTab("videos")}
              >
                {t.tabs.videos} <span className="tab-count">({tabVideoCount})</span>
              </button>

              <button
                type="button"
                className={`sermons-mobile-item ${activeTab === "teachings" ? "active" : ""}`}
                role="menuitem"
                onClick={() => changeTab("teachings")}
              >
                {t.tabs.teachings} <span className="tab-count">({tabTeachCount})</span>
              </button>

              <button
                type="button"
                className={`sermons-mobile-item ${activeTab === "qa" ? "active" : ""}`}
                role="menuitem"
                onClick={() => changeTab("qa")}
              >
                {t.tabs.quiz} <span className="tab-count">({tabQuizCount})</span>
              </button>
            </div>
          )}
        </div>

        <div className="sermons-sort">
          <select
            value={sortMode}
            onChange={(e) => setSortMode(e.target.value)}
            disabled={activeTab === "qa"}
            aria-label="Sort"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>

        {(searchIsActive || sortMode !== "newest") && activeTab !== "qa" && (
          <button className="sermons-reset" onClick={resetFilters} type="button">
            Reset
          </button>
        )}
      </div>

      {/* Scrim */}
      {mobileTabOpen && (
        <button
          type="button"
          className="sermons-menu-scrim"
          aria-label="Close menu"
          onClick={() => setMobileTabOpen(false)}
        />
      )}

      {/* ✅ content wrapper (important for mobile click issue) */}
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
          />
        )}

        {activeTab === "teachings" && (
          <TeachingsTab
            loading={loadingContent}
            visibleTeachings={visibleTeachings}
            filteredTeachings={filteredTeachings}
            searchIsActive={searchIsActive}
            defaultLatest={DEFAULT_LATEST_TEACHINGS}
            formatDate={formatDate}
          />
        )}

        {activeTab === "qa" && (
          <QuizTab
            t={t}
            quizSets={quizSets}
            loadingQuizSets={loadingQuizSets}
            trackEvent={trackEvent}
          />
        )}
      </div>

      {/* Video modal */}
      {openVideo?.youtubeId && (
        <div className="sermons-modal" role="dialog" aria-modal="true" onMouseDown={() => setOpenVideo(null)}>
          <div className="sermons-modal-card" onMouseDown={(e) => e.stopPropagation()}>
            <div className="sermons-modal-top">
              <h3 className="sermons-modal-title">{openVideo.title}</h3>
              <button className="sermons-modal-close" onClick={() => setOpenVideo(null)} aria-label="Close video" type="button">
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
