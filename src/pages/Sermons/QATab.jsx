import React, { useMemo, useState, useEffect } from "react";

export default function QATab({ t, items = [], loading = false, trackEvent }) {
  const allLabel = t?.qa?.allCategoriesLabel || "All";
  const [openId, setOpenId] = useState(null);
  const [activeCategory, setActiveCategory] = useState(allLabel);

  const sourceItems = items.length > 0 ? items : t?.qa?.items || [];

  const safeItems = useMemo(() => {
    return sourceItems.map((item, index) => ({
      id: item.id || item._id || `qa-${index}`,
      question: item.question || "",
      answer:
        item.answer || "Please contact the church office for more information.",
      category: item.category || (t?.qa?.defaultCategoryLabel || "General"),
    }));
  }, [sourceItems, t]);

  useEffect(() => {
    setActiveCategory(allLabel);
    setOpenId(null);
  }, [allLabel]);

  const categories = useMemo(() => {
    const set = new Set();

    safeItems.forEach((item) => {
      if (item.category) set.add(item.category);
    });

    return [allLabel, ...Array.from(set)];
  }, [safeItems, allLabel]);

  const visibleItems = useMemo(() => {
    if (activeCategory === allLabel) return safeItems;
    return safeItems.filter((item) => item.category === activeCategory);
  }, [safeItems, activeCategory, allLabel]);

  const handleToggle = (item) => {
    const nextId = openId === item.id ? null : item.id;
    setOpenId(nextId);

    if (nextId) {
      trackEvent?.("qa_opened", {
        qa_id: item.id,
        question: item.question,
        category: item.category,
      });
    }
  };

  return (
    <div className="tab-panel active">
      <div className="qa-shell">
        <div className="qa-header">
          <h3>{t?.qa?.title || "Questions & Answers"}</h3>
          <p>
            {t?.qa?.intro ||
              "Find quick answers to common church questions."}
          </p>
        </div>

        {!loading && categories.length > 1 && (
          <div className="qa-categories" role="tablist" aria-label={t?.qa?.title || "Questions & Answers"}>
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={`qa-category-pill ${
                  activeCategory === category ? "active" : ""
                }`}
                onClick={() => {
                  setActiveCategory(category);
                  setOpenId(null);
                }}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {loading && (
          <p className="qa-loading">
            {t?.qa?.loadingLabel || "Loading questions…"}
          </p>
        )}

        {!loading && visibleItems.length === 0 && (
          <div className="qa-empty">
            {t?.qa?.emptyLabel || "No questions available yet."}
          </div>
        )}

        {!loading && visibleItems.length > 0 && (
          <div className="qa-list">
            {visibleItems.map((item, index) => {
              const isOpen = openId === item.id;

              return (
                <article
                  key={item.id}
                  className={`qa-card wow-stagger ${isOpen ? "is-open" : ""}`}
                  style={{ "--stagger": index }}
                >
                  <button
                    type="button"
                    className="qa-question"
                    onClick={() => handleToggle(item)}
                    aria-expanded={isOpen}
                    aria-controls={`qa-answer-${item.id}`}
                  >
                    <div className="qa-question-main">
                      <span className="qa-badge">{item.category}</span>
                      <h4>{item.question}</h4>
                    </div>

                    <span
                      className={`qa-caret ${isOpen ? "is-open" : ""}`}
                      aria-hidden="true"
                    >
                      ▾
                    </span>
                  </button>

                  <div
                    id={`qa-answer-${item.id}`}
                    className={`qa-answer-wrap ${isOpen ? "open" : ""}`}
                  >
                    <div className="qa-answer">
                      <p>{item.answer}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}