import { useEffect, useRef, useState } from "react";
import "./MembershipForm.css";
import { useLanguage } from "../contexts/LanguageContext";
import { membershipForm } from "../i18n/membershipForm";

const FORM_URL =
  "https://dght.churchsuite.com/embed/addressbook/form";

function MembershipForm() {
  const { lang } = useLanguage();
  const m = membershipForm[lang] || membershipForm.en;

  const [isOpen, setIsOpen] = useState(false);

  const modalRef = useRef(null);
  const closeBtnRef = useRef(null);
  const lastActiveRef = useRef(null);

  const openModal = () => {
    lastActiveRef.current = document.activeElement;
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  // accessibility
  useEffect(() => {
    if (!isOpen) {
      lastActiveRef.current?.focus?.();
      return;
    }

    setTimeout(() => closeBtnRef.current?.focus?.(), 0);

    const onKeyDown = (e) => {
      if (e.key === "Escape") closeModal();
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      {/* Floating Button */}
      <button
        type="button"
        className="floating-member-btn"
        onClick={openModal}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        {m.floatingButton}
      </button>

      {/* Modal */}
      {isOpen && (
        <div
          className="member-modal-backdrop"
          onClick={closeModal}
        >
          <div
            className="member-modal member-modal-large"
            ref={modalRef}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {/* Header */}
            <div className="member-modal-header">
              <div className="member-title-wrap">
                <div className="member-badge">{m.badge}</div>

                <h2 className="amharic-fix">
                  {m.title}
                </h2>
              </div>

              <button
                ref={closeBtnRef}
                type="button"
                className="member-close-btn"
                onClick={closeModal}
              >
                ×
              </button>
            </div>

            <p className="member-intro amharic-fix">
              {m.intro}
            </p>

            {/* ChurchSuite Form */}
            <div className="churchsuite-form-shell">
  <div className="churchsuite-form-wrapper">
    <iframe
      src={FORM_URL}
      title="Church Membership Form"
      loading="lazy"
      className="churchsuite-form"
      allow="fullscreen"
    />
  </div>
</div>
          </div>
        </div>
      )}
    </>
  );
}

export default MembershipForm;