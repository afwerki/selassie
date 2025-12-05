import React, { useState, useEffect } from "react";
import "../styling/sermons.css";
import { client } from "../sanityClient";

const YOUTUBE_SRC = "https://www.youtube.com/embed/xxxxxxxx"; // TODO: replace

// Static fallback questions if CMS fails
const fallbackQuizQuestions = [
  {
    id: "q1",
    question: "What do we confess about the Holy Trinity?",
    difficulty: "Beginner",
    explanation:
      "In Orthodox teaching, we confess one God in three co-equal, co-eternal Persons: the Father, the Son, and the Holy Spirit.",
    options: [
      { id: "q1a", label: "Three gods who work together closely", isCorrect: false },
      { id: "q1b", label: "One God in three co-equal, co-eternal Persons", isCorrect: true },
      { id: "q1c", label: "One God who changes form over time", isCorrect: false },
    ],
  },
];

// Simple GA4 helper – safe if gtag not present yet
const trackEvent = (action, params = {}) => {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", action, params);
  }
};

const videoItems = [
  {
    id: "v1",
    title: "The Mystery of the Holy Trinity",
    meta: "Feast of Selassie · Teaching 1",
    description:
      "A teaching on the Holy Trinity and how this mystery is celebrated in the liturgy and life of the Church.",
  },
  {
    id: "v2",
    title: "Faith in Times of Trial",
    meta: "Sunday Liturgy · Teaching 2",
    description:
      "Reflecting on the lives of the saints and how they held fast to Christ through suffering and hardship.",
  },
  {
    id: "v3",
    title: "The Gift of Repentance",
    meta: "Lenten Series · Teaching 3",
    description:
      "Exploring the meaning of repentance in the Orthodox tradition and how confession heals the soul.",
  },
  {
    id: "v4",
    title: "Living the Gospel Daily",
    meta: "Teaching Series · Lesson 4",
    description:
      "Practical reflections on how we can live out the Gospel in our families, work, and community life.",
  },
];

function Sermons() {
  const [activeTab, setActiveTab] = useState("videos");

  // ===== QUIZ SETS STATE =====
  const [quizSets, setQuizSets] = useState([]);
  const [loadingQuizSets, setLoadingQuizSets] = useState(true);
  const [activeSetId, setActiveSetId] = useState(null); // which set is currently open
  const [quizTitle, setQuizTitle] = useState("");
  const [quizQuestions, setQuizQuestions] = useState(fallbackQuizQuestions);
  const [showAllSets, setShowAllSets] = useState(false);

  // User progress: { [setId]: { completed: bool, bestScore, totalQuestions, lastCompletedAt } }
 // User progress: { [setId]: { completed: bool, bestScore, totalQuestions, lastCompletedAt } }
// Initialise from localStorage once (lazy initializer)
// User progress: { [setId]: { completed: bool, bestScore, totalQuestions, lastCompletedAt } }
// Initialise from localStorage once (lazy initializer)
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


  // ===== PER-QUIZ STATE =====
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [cardAnimationKey, setCardAnimationKey] = useState(0);

  // derived
  const totalQuestions = quizQuestions.length;
  const currentQuestion = quizQuestions[currentIndex];

  const answeredCount = finished
    ? totalQuestions
    : currentIndex + (hasAnswered ? 1 : 0);
  const progressPercent =
    totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

  // ===== Load per-user progress from localStorage =====


  const saveProgress = (updated) => {
    setQuizProgress(updated);
    try {
      localStorage.setItem("selassieQuizProgress", JSON.stringify(updated));
    } catch (err) {
      console.warn("Could not save quiz progress:", err);
    }
  };

  // ===== Fetch all quiz sets from Sanity =====
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
          options[]{
            _key,
            label,
            isCorrect
          }
        }
      }
    `;

    client
      .fetch(query)
      .then((data) => {
        if (!Array.isArray(data) || data.length === 0) {
          console.warn("No active quizSets found in Sanity – using fallback.");
          setQuizSets([]);
          setQuizTitle("Faith basics quiz");
          setQuizQuestions(fallbackQuizQuestions);
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

        // If we don't have an active set yet, just default to first one (but only after user clicks)
      })
      .catch((err) => {
        console.error("Error fetching quiz sets from Sanity:", err);
      })
      .finally(() => {
        setLoadingQuizSets(false);
      });
  }, []);

  // ===== Quiz logic =====
  const enterQuizSet = (setId) => {
    const set = quizSets.find((s) => s.id === setId);
    if (!set) return;

    setActiveSetId(setId);
    setQuizTitle(set.title);
    setQuizQuestions(set.questions.length > 0 ? set.questions : fallbackQuizQuestions);
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setHasAnswered(false);
    setIsCorrect(null);
    setScore(0);
    setFinished(false);
    setCardAnimationKey((k) => k + 1);

    trackEvent("quiz_set_started", {
      quiz_set_id: set.id,
      quiz_set_title: set.title,
    });
  };

  const handleOptionClick = (optionId) => {
    if (hasAnswered || finished || !currentQuestion) return;

    const option = currentQuestion.options.find((o) => o.id === optionId);
    const correct = option?.isCorrect;

    setSelectedOptionId(optionId);
    setHasAnswered(true);
    setIsCorrect(!!correct);

    if (correct) {
      setScore((prev) => prev + 1);
    }

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
      // finished this quiz set
      setFinished(true);

      const updated = {
        ...quizProgress,
        [activeSetId]: {
          completed: true,
          bestScore: Math.max(
            quizProgress[activeSetId]?.bestScore || 0,
            score
          ),
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

  const visibleSets = showAllSets ? quizSets : quizSets.slice(0, 2);

  // helper: format date
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

  return (
    <section className="sermons-section" id="sermons">
      <div className="section-header">
        <h2>Teachings &amp; Sermons</h2>
        <p>
          Grow deeper in faith through sermons, written teachings, and
          reflections from Selassie Ethiopian Orthodox Church.
        </p>
      </div>

      {/* Tabs */}
      <div className="sermons-tabs">
        <button
          type="button"
          className={`sermons-tab ${activeTab === "videos" ? "active" : ""}`}
          onClick={() => setActiveTab("videos")}
        >
          Videos
        </button>
        <button
          type="button"
          className={`sermons-tab ${
            activeTab === "teachings" ? "active" : ""
          }`}
          onClick={() => setActiveTab("teachings")}
        >
          Written Teachings
        </button>
        <button
          type="button"
          className={`sermons-tab ${activeTab === "qa" ? "active" : ""}`}
          onClick={() => setActiveTab("qa")}
        >
          Q &amp; A Quiz
        </button>
      </div>

      {/* ================== VIDEOS TAB ================== */}
      {activeTab === "videos" && (
        <div className="tab-panel active">
          <div className="video-grid">
            {videoItems.map((item) => (
              <article key={item.id} className="video-card">
                <div className="video-frame">
                  <div className="video-responsive">
                    <iframe
                      src={YOUTUBE_SRC}
                      title={item.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                </div>
                <div className="video-info">
                  <p className="card-meta">{item.meta}</p>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* ================== WRITTEN TEACHINGS TAB ================== */}
      {activeTab === "teachings" && (
        <div className="tab-panel active">
          <div className="teaching-grid">
            <article className="teaching-card">
              <span className="tag-pill">Doctrine</span>
              <h3>The Incarnation of Christ</h3>
              <p className="card-meta">Study Note · 8 min read</p>
              <p>
                How the Word of God became flesh for our salvation, and why the
                Incarnation is at the heart of our faith and worship.
              </p>
            </article>

            <article className="teaching-card">
              <span className="tag-pill">Liturgy</span>
              <h3>Understanding the Divine Liturgy</h3>
              <p className="card-meta">Guided Walkthrough · 10 min read</p>
              <p>
                A step-by-step guide through the Divine Liturgy of the Ethiopian
                Orthodox Church with short explanations.
              </p>
            </article>

            <article className="teaching-card">
              <span className="tag-pill">Spiritual Life</span>
              <h3>Prayer in the Orthodox Tradition</h3>
              <p className="card-meta">Reflection · 6 min read</p>
              <p>
                Simple practices to deepen our daily prayer life, rooted in the
                Psalms and the prayers of the saints.
              </p>
            </article>
          </div>
        </div>
      )}

      {/* ================== Q & A QUIZ TAB ================== */}
      {activeTab === "qa" && (
        <div className="tab-panel active">
          {/* If no set selected yet, show the list of sets */}
          {!activeSetId && (
            <>
              <div className="quiz-sets-header">
                <h3>Quiz sets</h3>
                <p>
                  Choose a quiz set to begin. Newest quizzes appear first. On
                  mobile, you&apos;ll see two at a time with &quot;Show more&quot;.
                </p>
              </div>

              {loadingQuizSets && (
                <p className="quiz-loading">
                  Loading quiz sets from the church CMS…
                </p>
              )}

              {!loadingQuizSets && quizSets.length === 0 && (
                <p className="quiz-loading">
                  No quiz sets have been published yet. Please check back soon.
                </p>
              )}

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
                              <img src={set.heroImageUrl} alt={set.title} />
                            </div>
                          )}
                          <div className="quiz-set-body">
                            <div className="quiz-set-topline">
                              <span className="quiz-set-date">
                                {formatDate(set.createdAt)}
                              </span>
                              <span
                                className={`quiz-set-status ${
                                  completed
                                    ? "quiz-set-status--done"
                                    : "quiz-set-status--pending"
                                }`}
                              >
                                {badgeLabel}
                              </span>
                            </div>
                            <h4 className="quiz-set-title">{set.title}</h4>
                            <p className="quiz-set-description">
                              {set.description}
                            </p>
                            <p className="quiz-set-meta">
                              {set.questions.length} question
                              {set.questions.length !== 1 ? "s" : ""}
                            </p>
                          </div>
                        </article>
                      );
                    })}
                  </div>

                  {quizSets.length > 2 && (
                    <div className="quiz-sets-show-more-wrapper">
                      {!showAllSets && (
                        <button
                          type="button"
                          className="quiz-sets-show-more"
                          onClick={() => setShowAllSets(true)}
                        >
                          Show more quiz sets
                        </button>
                      )}
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {/* If a set is selected, show quiz UI */}
          {activeSetId && !finished && currentQuestion && (
            <>
              <button
                type="button"
                className="quiz-back-link"
                onClick={handleBackToSets}
              >
                ← Back to quiz sets
              </button>

              <div className="quiz-header">
                <div className="quiz-header-top">
                  <h3>{quizTitle}</h3>
                  <span className="quiz-progress-label">
                    {answeredCount} / {totalQuestions}
                  </span>
                </div>
                <p>
                  Take your time. Choose an answer, see the explanation, then
                  move on when you&apos;re ready.
                </p>
                <div className="quiz-progress">
                  <div
                    className="quiz-progress-bar"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              <article
                key={`${currentQuestion.id}-${cardAnimationKey}`}
                className={`qa-card quiz-card ${
                  isCorrect === true
                    ? "quiz-card--correct-animate"
                    : isCorrect === false
                    ? "quiz-card--incorrect-animate"
                    : "quiz-card--enter"
                }`}
              >
                <div className="quiz-card-header">
                  <span className="tag-pill">Quiz</span>
                  <span className="quiz-difficulty">
                    {currentQuestion.difficulty}
                  </span>
                </div>

                <h3 className="quiz-question">{currentQuestion.question}</h3>

                <div className="quiz-options">
                  {currentQuestion.options.map((opt) => {
                    const isSelected = selectedOptionId === opt.id;

                    let optionClass = "quiz-option";
                    if (isSelected) optionClass += " quiz-option--selected";

                    if (hasAnswered) {
                      if (opt.isCorrect) {
                        optionClass += " quiz-option--correct";
                      } else if (isSelected && !opt.isCorrect) {
                        optionClass += " quiz-option--incorrect";
                      }
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
                        <span className="quiz-option-label">
                          {opt.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
{hasAnswered && (
  <p
    className={`quiz-reaction ${
      isCorrect ? "quiz-reaction--correct" : "quiz-reaction--incorrect"
    }`}
  >
    {isCorrect
      ? "Correct! Beautiful answer."
      : "Not quite this time — keep going, you’re learning."}
  </p>
)}


                {hasAnswered && (
                  <p className="quiz-explanation">
                    <strong>Explanation:</strong>{" "}
                    {currentQuestion.explanation}
                  </p>
                )}
              </article>

              <div className="quiz-footer">
                <button
                  type="button"
                  className="card-btn quiz-next-btn"
                  onClick={handleNextQuestion}
                  disabled={!hasAnswered}
                >
                  {currentIndex + 1 === totalQuestions
                    ? "See my results"
                    : "Next question"}
                </button>
              </div>
            </>
          )}

          {activeSetId && finished && (
            <div className="quiz-result-card">
              <button
                type="button"
                className="quiz-back-link quiz-back-link--top"
                onClick={handleBackToSets}
              >
                ← Back to quiz sets
              </button>
              <h3>Well done!</h3>
              <p className="quiz-score">
                You scored{" "}
                <strong>
                  {score} / {totalQuestions}
                </strong>
              </p>
              <p>
                Keep exploring the teachings and feel free to try the quiz again
                or watch the sermons above.
              </p>
              <button
                type="button"
                className="card-btn quiz-reset-btn"
                onClick={handleQuizRestart}
              >
                Restart this quiz
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default Sermons;
