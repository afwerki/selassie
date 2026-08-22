import { useEffect, useState } from "react";
import "../styling/sermons.css";
import { client } from "../sanityClient";
import { useLanguage } from "../contexts/LanguageContext";
import { sectionTexts } from "../i18n/sectionTexts";
import QATab from "./Sermons/QATab";

const trackEvent = (action, params = {}) => {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", action, params);
  }
};

export default function Sermons() {
  const { lang } = useLanguage();
  const tRoot = sectionTexts[lang] || sectionTexts.en;
  const t = tRoot.sermons || {};

  const [qaItems, setQaItems] = useState([]);
  const [loadingQa, setLoadingQa] = useState(true);

  const copy =
    lang === "am"
      ? {
          eyebrow: "የፓሪሽ መመሪያ",
          title: "የተለመዱ ጥያቄዎችና መልሶች",
          intro:
            "ስለ ጥምቀት፣ ጋብቻ፣ ንስሐ፣ አባልነት እና ሌሎች የቤተክርስቲያን ጉዳዮች ፈጣንና ጠቃሚ መረጃ ያግኙ።",
          noteTitle: "ተጨማሪ መመሪያ ይፈልጋሉ?",
          noteText:
            "እያንዳንዱ ሁኔታ የተለየ ሊሆን ይችላል። ለግል መንፈሳዊ ምክር ወይም ለሥርዓተ ቤተክርስቲያን ዝግጅት ከካህን ወይም ከቤተክርስቲያን ቢሮ ጋር ይነጋገሩ።",
        }
      : {
          eyebrow: "Parish guidance",
          title: "Common Questions & Answers",
          intro:
            "Helpful, straightforward guidance for common questions about baptism, weddings, confession, membership, pastoral care, and parish life.",
          noteTitle: "Need more personal guidance?",
          noteText:
            "Every situation can be different. For personal spiritual guidance, sacramental preparation, or anything not covered here, please speak with one of our priests or contact the church office.",
        };

  useEffect(() => {
    let mounted = true;

    const sanityQuery = `
      *[_type == "sermonQa" || _type == "churchQa"]
        | order(coalesce(orderRank, _createdAt) asc) {
          _id,
          question,
          answer,
          category,
          topicTags
        }
    `;

    async function loadQuestions() {
      setLoadingQa(true);

      try {
        const result = await client.fetch(sanityQuery);

        if (!mounted) return;

        const safeItems = Array.isArray(result)
          ? result
              .filter((item) => item?.question && item?.answer)
              .map((item, index) => ({
                id: item._id || `qa-${index}`,
                question: item.question,
                answer: item.answer,
                category: item.category || "",
                topicTags: Array.isArray(item.topicTags) ? item.topicTags : [],
              }))
          : [];

        setQaItems(safeItems);
      } catch (error) {
        console.warn(
          "Q&A content could not be loaded from Sanity; using built-in questions.",
          error
        );

        if (mounted) {
          setQaItems([]);
        }
      } finally {
        if (mounted) {
          setLoadingQa(false);
        }
      }
    }

    loadQuestions();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="sermons-section sermons-section--qa-only" id="sermons">
      <div className="qa-page-intro">
        <div className="qa-page-copy">
          <span className="qa-page-eyebrow">{copy.eyebrow}</span>

          <h2>{copy.title}</h2>

          <p>{copy.intro}</p>
        </div>

        <div className="qa-page-symbol" aria-hidden="true">
          <span>✣</span>
        </div>
      </div>

      <QATab
        t={t}
        items={qaItems}
        loading={loadingQa}
        trackEvent={trackEvent}
      />

      <aside className="qa-pastoral-note">
        <div className="qa-pastoral-icon" aria-hidden="true">
          ✦
        </div>

        <div>
          <h3>{copy.noteTitle}</h3>
          <p>{copy.noteText}</p>
        </div>

        <a className="qa-contact-link" href="#contact">
          {lang === "am" ? "ያግኙን" : "Contact the church"}
          <span aria-hidden="true">→</span>
        </a>
      </aside>
    </section>
  );
}
