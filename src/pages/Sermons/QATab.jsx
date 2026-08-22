import { useEffect, useMemo, useState } from "react";

export default function QATab({ t, items = [], loading = false, trackEvent }) {
  const allLabel = t?.qa?.allCategoriesLabel || "All";
  const [openId, setOpenId] = useState(null);
  const [activeCategory, setActiveCategory] = useState(allLabel);
  const [query, setQuery] = useState("");

  const sourceItems = items.length > 0 ? items : t?.qa?.items || [];

  const safeItems = useMemo(() => {
    return sourceItems
      .map((item, index) => ({
        id: item.id || item._id || `qa-${index}`,
        question: item.question || "",
        answer:
          item.answer ||
          "Please contact the church office for more information.",
        category: item.category || (t?.qa?.defaultCategoryLabel || "General"),
      }))
      .filter((item) => item.question && item.answer);
  }, [sourceItems, t]);

  useEffect(() => {
    setActiveCategory(allLabel);
    setOpenId(null);
    setQuery("");
  }, [allLabel]);

  const categories = useMemo(() => {
    const set = new Set();

    safeItems.forEach((item) => {
      if (item.category) set.add(item.category);
    });

    return [allLabel, ...Array.from(set)];
  }, [safeItems, allLabel]);

  const visibleItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return safeItems.filter((item) => {
      const matchesCategory =
        activeCategory === allLabel || item.category === activeCategory;

      const matchesQuery =
        !normalizedQuery ||
        `${item.question} ${item.answer} ${item.category}`
          .toLowerCase()
          .includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [safeItems, activeCategory, allLabel, query]);

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
    <div className="qa-shell">
      <div className="qa-toolbar">
        <div className="qa-search">
          <span className="qa-search-icon" aria-hidden="true">
            ⌕
          </span>

          <input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setOpenId(null);
            }}
            placeholder={t?.qa?.searchPlaceholder || "Search common questions…"}
            aria-label={t?.qa?.searchPlaceholder || "Search common questions"}
          />

          {query && (
            <button
              type="button"
              className="qa-search-clear"
              onClick={() => {
                setQuery("");
                setOpenId(null);
              }}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>

        {!loading && categories.length > 1 && (
          <div
            className="qa-categories"
            aria-label={t?.qa?.title || "Questions & Answers"}
          >
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
      </div>

      {loading && (
        <div className="qa-loading-card">
          <span className="qa-loading-orbit" aria-hidden="true" />
          <span>{t?.qa?.loadingLabel || "Loading questions…"}</span>
        </div>
      )}

      {!loading && visibleItems.length === 0 && (
        <div className="qa-empty">
          <strong>No matching questions found.</strong>
          <span>Try another search or choose a different category.</span>
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
                  <span className="qa-number" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div className="qa-question-main">
                    <span className="qa-badge">{item.category}</span>
                    <h3>{item.question}</h3>
                  </div>

                  <span className="qa-toggle" aria-hidden="true">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                <div
                  id={`qa-answer-${item.id}`}
                  className={`qa-answer-wrap ${isOpen ? "open" : ""}`}
                >
                  <div className="qa-answer">
                    <div className="qa-answer-inner">
                      <span className="qa-answer-label">
                        {t?.qa?.answerLabel || "Answer"}
                      </span>
                      <p>{item.answer}</p>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
