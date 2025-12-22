import React, { useState } from "react";

export default function QuizTab({ t, quizSets, loadingQuizSets, trackEvent }) {
  const [activeSetId, setActiveSetId] = useState(null);
  const [quizTitle, setQuizTitle] = useState("");
  const [quizQuestions, setQuizQuestions] = useState(t.quiz.fallbackQuestions);
  const [showAllSets, setShowAllSets] = useState(false);

  const [quizProgress, setQuizProgress] = useState(() => {
    try {
      const stored = localStorage.getItem("selassieQuizProgress");
      return stored ? JSON.parse(stored) : {};
    } catch {
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

  const answeredCount = finished ? totalQuestions : currentIndex + (hasAnswered ? 1 : 0);
  const progressPercent = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

  const saveProgress = (updated) => {
    setQuizProgress(updated);
    try {
      localStorage.setItem("selassieQuizProgress", JSON.stringify(updated));
    } catch {}
  };

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

    trackEvent?.("quiz_set_started", { quiz_set_id: set.id, quiz_set_title: set.title });
  };

  const handleOptionClick = (optionId) => {
    if (hasAnswered || finished || !currentQuestion) return;

    const option = currentQuestion.options.find((o) => o.id === optionId);
    const correct = option?.isCorrect;

    setSelectedOptionId(optionId);
    setHasAnswered(true);
    setIsCorrect(!!correct);
    if (correct) setScore((prev) => prev + 1);

    trackEvent?.("quiz_question_answered", {
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

      trackEvent?.("quiz_set_completed", {
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

  return (
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
                    <article key={set.id} className="quiz-set-card" onClick={() => enterQuizSet(set.id)}>
                      {set.heroImageUrl && (
                        <div className="quiz-set-image">
                          <img src={set.heroImageUrl} alt={set.title} loading="lazy" />
                        </div>
                      )}

                      <div className="quiz-set-body">
                        <div className="quiz-set-topline">
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

              {quizSets.length > 3 && !showAllSets && (
                <div className="quiz-sets-show-more-wrapper">
                  <button type="button" className="quiz-sets-show-more" onClick={() => setShowAllSets(true)}>
                    {t.quiz.showMoreLabel}
                  </button>
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
              <details className="quiz-explain">
                <summary>{t.quiz.explanationLabel}</summary>
                <div className="quiz-explain-body">{currentQuestion.explanation}</div>
              </details>
            )}
          </article>

          <div className="quiz-footer">
            <button type="button" className="quiz-next-btn" onClick={handleNextQuestion} disabled={!hasAnswered}>
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
  );
}
