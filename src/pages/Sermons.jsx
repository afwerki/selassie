import React, { useEffect, useMemo, useRef, useState } from "react";
import "../styling/sermons.css";
import { client } from "../sanityClient";
import { useLanguage } from "../contexts/LanguageContext";
import { sectionTexts } from "../i18n/sectionTexts";

// Simple GA4 helper – safe if gtag not present yet
const trackEvent = (action, params = {}) => {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", action, params);
  }
};

const YT_THUMB = (id) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
const YT_EMBED = (id) =>
  `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`;

function Sermons() {
  const { lang } = useLanguage();
  const tRoot = sectionTexts[lang] || sectionTexts.en;
  const t = tRoot.sermons;

  const [activeTab, setActiveTab] = useState("videos"); // videos | teachings | qa

  // unified content
  const [videos, setVideos] = useState([]);
  const [teachings, setTeachings] = useState([]);
  const [loadingContent, setLoadingContent] = useState(true);

  // search + filters
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTag, setActiveTag] = useState("All");
  const [sortMode, setSortMode] = useState("newest"); // newest | oldest

  // show-latest behavior
  const DEFAULT_LATEST_VIDEOS = 3;
  const DEFAULT_LATEST_TEACHINGS = 6;

  // modal
  const [openVideo, setOpenVideo] = useState(null);

  // mobile menu
  const [mobileTabOpen, setMobileTabOpen] = useState(false);
  const mobileMenuRef = useRef(null);

  // ===== QUIZ SETS STATE =====
  const [quizSets, setQuizSets] = useState([]);
  const [loadingQuizSets, setLoadingQuizSets] = useState(true);
  const [activeSetId, setActiveSetId] = useState(null);
  const [quizTitle, setQuizTitle] = useState("");
  const [quizQuestions, setQuizQuestions] = useState(t.quiz.fallbackQuestions);
  const [showAllSets, setShowAllSets] = useState(false);

  const [quizProgress, setQuizProgress] = useState(() => {
    try {
      if (typeof window === "undefined") return {};
      const stored = window.localStorage.getItem("selassieQuizProgress");
      return stored ? JSON.parse(stored) : {};
    } catch (err) {
      console.warn("Could not read quiz progress from localStorage:", err);
      return {};
    }
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [cardAnimationKey, setCardAnimationKey] = useState(0);

  const totalQuestions = quizQuestions.length;
  const currentQuestion = quizQuestions[currentIndex];

  const answeredCount = finished
    ? totalQuestions
    : currentIndex + (hasAnswered ? 1 : 0);
  const progressPercent =
    totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

  const saveProgress = (updated) => {
    setQuizProgress(updated);
    try {
      localStorage.setItem("selassieQuizProgress", JSON.stringify(updated));
    } catch (err) {
      console.warn("Could not save quiz progress:", err);
    }
  };

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

  // ==============================
  // Fetch Sermon Videos + Teachings
  // ==============================
  useEffect(() => {
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
        "teachings": *[_type == "writtenTeaching"]
  | order(coalesce(publishedAt, _createdAt) desc) {
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

  // ==============================
  // Fetch quiz sets
  // ==============================
  useEffect(() => {
    const query = `
      *[_type == "quizSet" && isActive == true]
        | order(coalesce(createdAt, _createdAt) desc) {
        _id,
        title,
        slug,
        description,
        createdAt,
        "heroImageUrl": heroImage.asset->url,
        questions[]{
          _key,
          questionText,
          difficulty,
          explanation,
          options[]{ _key, label, isCorrect }
        }
      }
    `;

    client
      .fetch(query)
      .then((data) => {
        if (!Array.isArray(data) || data.length === 0) {
          setQuizSets([]);
          setQuizTitle(t.quiz.fallbackTitle);
          setQuizQuestions(t.quiz.fallbackQuestions);
          return;
        }

        const mappedSets = data.map((set, index) => ({
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

        setQuizSets(mappedSets);
      })
      .catch((err) => console.error("Error fetching quiz sets from Sanity:", err))
      .finally(() => setLoadingQuizSets(false));
  }, [t.quiz.fallbackQuestions, t.quiz.fallbackTitle]);

  // close mobile menu on outside click
  useEffect(() => {
    const onDown = (e) => {
      if (!mobileTabOpen) return;
      if (!mobileMenuRef.current) return;
      if (!mobileMenuRef.current.contains(e.target)) {
        setMobileTabOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [mobileTabOpen]);

  // close mobile menu when tab changes
  useEffect(() => {
    setMobileTabOpen(false);
  }, [activeTab]);

  // close video modal with escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setOpenVideo(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // ==============================
  // Tags
  // ==============================
  const allTags = useMemo(() => {
    const tags = new Set();
    (videos || []).forEach((v) => (v.topicTags || []).forEach((x) => tags.add(x)));
    (teachings || []).forEach((d) => (d.topicTags || []).forEach((x) => tags.add(x)));
    return ["All", ...Array.from(tags).sort((a, b) => a.localeCompare(b))];
  }, [videos, teachings]);

  // ==============================
  // Search + Filter + Sort
  // ==============================
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

  const filteredVideos = useMemo(() => {
    return (videos || []).filter(matchesQuery).filter(matchesTag).slice().sort(sortByDate);
  }, [videos, searchQuery, activeTag, sortMode]);

  const filteredTeachings = useMemo(() => {
    return (teachings || []).filter(matchesQuery).filter(matchesTag).slice().sort(sortByDate);
  }, [teachings, searchQuery, activeTag, sortMode]);

  const visibleVideos = useMemo(() => {
    if (searchIsActive) return filteredVideos;
    return filteredVideos.slice(0, DEFAULT_LATEST_VIDEOS);
  }, [filteredVideos, searchIsActive]);

  const visibleTeachings = useMemo(() => {
    if (searchIsActive) return filteredTeachings;
    return filteredTeachings.slice(0, DEFAULT_LATEST_TEACHINGS);
  }, [filteredTeachings, searchIsActive]);

  // ==============================
  // Quiz logic
  // ==============================
  const enterQuizSet = (setId) => {
    const set = quizSets.find((s) => s.id === setId);
    if (!set) return;

    setActiveSetId(setId);
    setQuizTitle(set.title);
    setQuizQuestions(set.questions.length > 0 ? set.questions : t.quiz.fallbackQuestions);

    setCurrentIndex(0);
    setSelectedOptionId(null);
    setHasAnswered(false);
    setIsCorrect(null);
    setScore(0);
    setFinished(false);
    setCardAnimationKey((k) => k + 1);

    trackEvent("quiz_set_started", { quiz_set_id: set.id, quiz_set_title: set.title });
  };

  const handleOptionClick = (optionId) => {
    if (hasAnswered || finished || !currentQuestion) return;

    const option = currentQuestion.options.find((o) => o.id === optionId);
    const correct = option?.isCorrect;

    setSelectedOptionId(optionId);
    setHasAnswered(true);
    setIsCorrect(!!correct);
    if (correct) setScore((prev) => prev + 1);

    trackEvent("quiz_question_answered", {
      quiz_set_id: activeSetId,
      question_id: currentQuestion.id,
      correct: !!correct,
    });
  };

  const handleNextQuestion = () => {
    if (!hasAnswered) return;

    const nextIndex = currentIndex + 1;
    if (nextIndex < quizQuestions.length) {
      setCurrentIndex(nextIndex);
      setSelectedOptionId(null);
      setHasAnswered(false);
      setIsCorrect(null);
      setCardAnimationKey((k) => k + 1);
    } else {
      setFinished(true);

      const updated = {
        ...quizProgress,
        [activeSetId]: {
          completed: true,
          bestScore: Math.max(quizProgress[activeSetId]?.bestScore || 0, score),
          totalQuestions: quizQuestions.length,
          lastCompletedAt: new Date().toISOString(),
        },
      };
      saveProgress(updated);

      trackEvent("quiz_set_completed", {
        quiz_set_id: activeSetId,
        score,
        totalQuestions: quizQuestions.length,
      });
    }
  };

  const handleQuizRestart = () => {
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setHasAnswered(false);
    setIsCorrect(null);
    setScore(0);
    setFinished(false);
    setCardAnimationKey((k) => k + 1);
  };

  const handleBackToSets = () => {
    setActiveSetId(null);
    setFinished(false);
    setHasAnswered(false);
    setSelectedOptionId(null);
    setScore(0);
    setCurrentIndex(0);
  };

  const visibleSets = showAllSets ? quizSets : quizSets.slice(0, 3);

  // ==============================
  // UI handlers
  // ==============================
  const clearSearch = () => setSearchQuery("");
  const resetFilters = () => {
    setSearchQuery("");
    setActiveTag("All");
    setSortMode("newest");
  };

  const openVideoModal = (v) => {
    if (!v?.youtubeId) return;
    setOpenVideo({ youtubeId: v.youtubeId, title: v.title || "Sermon video" });
    trackEvent("sermon_video_opened", { youtube_id: v.youtubeId, title: v.title });
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

  return (
    <section className="sermons-section" id="sermons">
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
          onClick={() => setActiveTab("videos")}
          role="tab"
          aria-selected={activeTab === "videos"}
        >
          {t.tabs.videos} <span className="tab-count">({tabVideoCount})</span>
        </button>

        <button
          type="button"
          className={`sermons-tab ${activeTab === "teachings" ? "active" : ""}`}
          onClick={() => setActiveTab("teachings")}
          role="tab"
          aria-selected={activeTab === "teachings"}
        >
          {t.tabs.teachings} <span className="tab-count">({tabTeachCount})</span>
        </button>

        <button
          type="button"
          className={`sermons-tab ${activeTab === "qa" ? "active" : ""}`}
          onClick={() => setActiveTab("qa")}
          role="tab"
          aria-selected={activeTab === "qa"}
        >
          {t.tabs.quiz} <span className="tab-count">({tabQuizCount})</span>
        </button>
      </div>

      {/* Toolbar (always visible) */}
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

        {/* Mobile burger (ONLY mobile) */}
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
                onClick={() => setActiveTab("videos")}
              >
                {t.tabs.videos} <span className="tab-count">({tabVideoCount})</span>
              </button>

              <button
                type="button"
                className={`sermons-mobile-item ${activeTab === "teachings" ? "active" : ""}`}
                role="menuitem"
                onClick={() => setActiveTab("teachings")}
              >
                {t.tabs.teachings} <span className="tab-count">({tabTeachCount})</span>
              </button>

              <button
                type="button"
                className={`sermons-mobile-item ${activeTab === "qa" ? "active" : ""}`}
                role="menuitem"
                onClick={() => setActiveTab("qa")}
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

      {/* Tags (videos + teachings only) */}
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

      {/* ================== VIDEOS TAB ================== */}
      {activeTab === "videos" && (
        <div className="tab-panel active">
          {loadingContent && (
            <div className="sermons-skeleton-grid">
              <div className="sermons-skeleton-card" />
              <div className="sermons-skeleton-card" />
            </div>
          )}

          {!loadingContent && visibleVideos.length === 0 && (
            <div className="sermons-empty">No videos found. Try a different search or tag.</div>
          )}

          {!loadingContent && visibleVideos.length > 0 && (
            <div className="video-grid">
              {visibleVideos.map((v) => {
                const thumb = v.thumbnailUrl || (v.youtubeId ? YT_THUMB(v.youtubeId) : "");
                return (
                  <article key={v._id} className="video-card video-card--thumb">
                    <button
                      type="button"
                      className="video-thumb"
                      onClick={() => openVideoModal(v)}
                      aria-label={`Play: ${v.title}`}
                    >
                      {thumb ? <img src={thumb} alt={v.title} loading="lazy" /> : <div className="video-thumb-fallback" />}
                      <div className="video-thumb-overlay" />
                      <div className="video-play">
                        <span className="video-play-icon">▶</span>
                        <span className="video-play-label">Play</span>
                      </div>
                      {v.isFeatured && <span className="featured-pill">Featured</span>}
                    </button>

                    <div className="video-info">
                      <p className="sermons-meta">
                        {(v.series || "Sermon")}
                        {v.speaker ? ` • ${v.speaker}` : ""}
                        {v.publishedAt ? ` • ${formatDate(v.publishedAt)}` : ""}
                      </p>
                      <h3>{v.title}</h3>
                      {v.description && <p>{v.description}</p>}

                      {(v.topicTags?.length || 0) > 0 && (
                        <div className="mini-tags">
                          {v.topicTags.slice(0, 4).map((tag) => (
                            <span key={tag} className="mini-tag">{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {!loadingContent && !searchIsActive && filteredVideos.length > DEFAULT_LATEST_VIDEOS && (
            <div className="sermons-more-note">
              More videos are available — use the search box to find them.
            </div>
          )}
        </div>
      )}

      {/* ================== WRITTEN TEACHINGS TAB ================== */}
      {activeTab === "teachings" && (
        <div className="tab-panel active">
          {loadingContent && (
            <div className="sermons-skeleton-grid sermons-skeleton-grid--teachings">
              <div className="sermons-skeleton-card sermons-skeleton-card--t" />
              <div className="sermons-skeleton-card sermons-skeleton-card--t" />
              <div className="sermons-skeleton-card sermons-skeleton-card--t" />
            </div>
          )}

          {!loadingContent && visibleTeachings.length === 0 && (
            <div className="sermons-empty">No teachings found. Try a different search or tag.</div>
          )}

          {!loadingContent && visibleTeachings.length > 0 && (
            <div className="teaching-grid">
   {visibleTeachings.map((d) => (
  <article key={d._id} className="teaching-card">
    {d.heroImageUrl && (
      <div className="teaching-media">
        <img src={d.heroImageUrl} alt={d.title} loading="lazy" />
      </div>
    )}

    <div className="teaching-top">
      <span className="tag-pill">{d.series || "Written Teaching"}</span>
      {d.isFeatured && <span className="featured-pill featured-pill--soft">Featured</span>}
    </div>

    <h3>{d.title}</h3>

    <p className="card-meta">
      {(d.author || "Selassie Church")}{d.publishedAt ? ` • ${formatDate(d.publishedAt)}` : ""}
    </p>

    <p>{d.excerpt || "A written teaching from our church — open to read more."}</p>

    <div className="teaching-actions">
      {d.pdfUrl ? (
        <a className="teaching-btn" href={d.pdfUrl} target="_blank" rel="noreferrer">Open PDF</a>
      ) : (
        <span className="teaching-btn teaching-btn--disabled">PDF coming soon</span>
      )}
    </div>

    {(d.topicTags?.length || 0) > 0 && (
      <div className="mini-tags">
        {d.topicTags.slice(0, 5).map((tag) => (
          <span key={tag} className="mini-tag">{tag}</span>
        ))}
      </div>
    )}
  </article>
))}


            </div>
          )}

          {!loadingContent && !searchIsActive && filteredTeachings.length > DEFAULT_LATEST_TEACHINGS && (
            <div className="sermons-more-note">
              More teachings are available — use the search box to find them.
            </div>
          )}
        </div>
      )}

      {/* ================== Q & A QUIZ TAB ================== */}
      {activeTab === "qa" && (
        <div className="tab-panel active">
          {!activeSetId && (
            <>
              <div className="quiz-sets-header">
                <h3>{t.quiz.setsTitle}</h3>
                <p>{t.quiz.setsIntro}</p>
              </div>

              {loadingQuizSets && <p className="quiz-loading">{t.quiz.loadingLabel}</p>}
              {!loadingQuizSets && quizSets.length === 0 && <p className="quiz-loading">{t.quiz.emptyLabel}</p>}

              {!loadingQuizSets && quizSets.length > 0 && (
                <>
                  <div className="quiz-sets-grid">
                    {visibleSets.map((set) => {
                      const progress = quizProgress[set.id];
                      const completed = progress?.completed;
                      const badgeLabel = completed
                        ? `Completed (${progress.bestScore}/${progress.totalQuestions})`
                        : "Not answered yet";

                      return (
                        <article
                          key={set.id}
                          className="quiz-set-card"
                          onClick={() => enterQuizSet(set.id)}
                        >
                          {set.heroImageUrl && (
                            <div className="quiz-set-image">
                              <img src={set.heroImageUrl} alt={set.title} loading="lazy" />
                            </div>
                          )}

                          <div className="quiz-set-body">
                            <div className="quiz-set-topline">
                              <span className="quiz-set-date">{formatDate(set.createdAt)}</span>
                              <span className={`quiz-set-status ${completed ? "quiz-set-status--done" : "quiz-set-status--pending"}`}>
                                {badgeLabel}
                              </span>
                            </div>
                            <h4 className="quiz-set-title">{set.title}</h4>
                            <p className="quiz-set-description">{set.description}</p>
                            <p className="quiz-set-meta">
                              {set.questions.length} question{set.questions.length !== 1 ? "s" : ""}
                            </p>
                          </div>
                        </article>
                      );
                    })}
                  </div>

                  {quizSets.length > 3 && (
                    <div className="quiz-sets-show-more-wrapper">
                      {!showAllSets && (
                        <button
                          type="button"
                          className="quiz-sets-show-more"
                          onClick={() => setShowAllSets(true)}
                        >
                          {t.quiz.showMoreLabel}
                        </button>
                      )}
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {activeSetId && !finished && currentQuestion && (
            <>
              <button type="button" className="quiz-back-link" onClick={handleBackToSets}>
                {t.quiz.backToSetsLabel}
              </button>

              <div className="quiz-header">
                <div className="quiz-header-top">
                  <h3>{quizTitle}</h3>
                  <span className="quiz-progress-label">
                    {answeredCount} / {totalQuestions}
                  </span>
                </div>
                <p>{t.quiz.headerIntro}</p>
                <div className="quiz-progress">
                  <div className="quiz-progress-bar" style={{ width: `${progressPercent}%` }} />
                </div>
              </div>

              <article
                key={`${currentQuestion.id}-${cardAnimationKey}`}
                className={`quiz-card ${
                  isCorrect === true
                    ? "quiz-card--correct-animate"
                    : isCorrect === false
                    ? "quiz-card--incorrect-animate"
                    : "quiz-card--enter"
                }`}
              >
                <div className="quiz-card-header">
                  <span className="tag-pill">Quiz</span>
                  <span className="quiz-difficulty">{currentQuestion.difficulty}</span>
                </div>

                <h3 className="quiz-question">{currentQuestion.question}</h3>

                <div className="quiz-options">
                  {currentQuestion.options.map((opt) => {
                    const isSelected = selectedOptionId === opt.id;

                    let optionClass = "quiz-option";
                    if (isSelected) optionClass += " quiz-option--selected";

                    if (hasAnswered) {
                      if (opt.isCorrect) optionClass += " quiz-option--correct";
                      else if (isSelected && !opt.isCorrect) optionClass += " quiz-option--incorrect";
                    }

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        className={optionClass}
                        onClick={() => handleOptionClick(opt.id)}
                        disabled={hasAnswered}
                      >
                        <span className="quiz-option-bullet" />
                        <span className="quiz-option-label">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>

                {hasAnswered && (
                  <p className={`quiz-reaction ${isCorrect ? "quiz-reaction--correct" : "quiz-reaction--incorrect"}`}>
                    {isCorrect ? t.quiz.reactionCorrect : t.quiz.reactionIncorrect}
                  </p>
                )}

                {hasAnswered && (
                  <p className="quiz-explanation">
                    <strong>{t.quiz.explanationLabel}</strong> {currentQuestion.explanation}
                  </p>
                )}
              </article>

              <div className="quiz-footer">
                <button
                  type="button"
                  className="quiz-next-btn"
                  onClick={handleNextQuestion}
                  disabled={!hasAnswered}
                >
                  {currentIndex + 1 === totalQuestions ? t.quiz.seeResultsLabel : t.quiz.nextQuestionLabel}
                </button>
              </div>
            </>
          )}

          {activeSetId && finished && (
            <div className="quiz-result-card">
              <button type="button" className="quiz-back-link quiz-back-link--top" onClick={handleBackToSets}>
                {t.quiz.backToSetsLabel}
              </button>
              <h3>{t.quiz.resultTitle}</h3>
              <p className="quiz-score">
                {t.quiz.resultScorePrefix} <strong>{score} / {totalQuestions}</strong>
              </p>
              <p>{t.quiz.resultBody}</p>
              <button type="button" className="quiz-reset-btn" onClick={handleQuizRestart}>
                {t.quiz.restartLabel}
              </button>
            </div>
          )}
        </div>
      )}

      {/* ================== VIDEO MODAL ================== */}
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

export default Sermons;
