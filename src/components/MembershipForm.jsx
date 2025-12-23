// MembershipForm.jsx
import { useEffect, useRef, useState } from "react";
import "./MembershipForm.css";
import { useLanguage } from "../contexts/LanguageContext";
import { membershipForm } from "../i18n/membershipForm";

const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbw11kXjsTOcpAI3HmTh9rLgZ53K_CLPu4658hmI6R4qlBanXC1VdUpyxJbd_Dp4fukp/exec";

const ukPostcodeRegex = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i;

function MembershipForm() {
  const { lang } = useLanguage();

  // ✅ IMPORTANT: membershipForm already contains the language object
  // so do NOT do t.membershipForm
  const m = membershipForm[lang] || membershipForm.en;

  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null); // { type: "success"|"error", text: string } | null

  const modalRef = useRef(null);
  const closeBtnRef = useRef(null);
  const lastActiveRef = useRef(null);

  const openModal = () => {
    setMessage(null);
    lastActiveRef.current = document.activeElement;
    setIsOpen(true);
  };

  const closeModal = () => {
    if (!isSubmitting) setIsOpen(false);
  };

  // Accessibility: focus management + Escape to close
  useEffect(() => {
    if (!isOpen) {
      lastActiveRef.current?.focus?.();
      return;
    }

    const tt = setTimeout(() => closeBtnRef.current?.focus?.(), 0);

    const onKeyDown = (e) => {
      if (e.key === "Escape") closeModal();

      // basic focus trap
      if (e.key === "Tab" && modalRef.current) {
        const focusables = modalRef.current.querySelectorAll(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusables.length) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      clearTimeout(tt);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, isSubmitting]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const form = e.target;
    const formData = new FormData(form);

    // ---- UK VALIDATION (postcode in separate field) ----
    const postcode = (form.postcode?.value || "").trim();

    if (!postcode || !ukPostcodeRegex.test(postcode)) {
      setMessage({ type: "error", text: m.messages.ukOnly });
      setIsSubmitting(false);
      return;
    }

    // ---- ENSURE CLEAN VALUES ARE SUBMITTED ----
    const address1 = (form.address1?.value || "").trim();
    const address2 = (form.address2?.value || "").trim();
    const city = (form.city?.value || "").trim();
    const county = (form.county?.value || "").trim();
    const country = (form.country?.value || "United Kingdom").trim();

    formData.set("postcode", postcode);
    formData.set("address1", address1);
    formData.set("address2", address2);
    formData.set("city", city);
    formData.set("county", county);
    formData.set("country", country);

    // ✅ IMPORTANT: also send a single combined address field (fallback)
    const combinedAddress = [address1, address2, city, county, postcode, country]
      .filter(Boolean)
      .join(", ");

    formData.set("address", combinedAddress);

    try {
      await fetch(SCRIPT_URL, {
        method: "POST",
        body: formData,
        mode: "no-cors",
      });

      setMessage({ type: "success", text: m.messages.success });
      form.reset();

      setTimeout(() => {
        setIsOpen(false);
        setMessage(null);
      }, 1800);
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: m.messages.error });
    } finally {
      setIsSubmitting(false);
    }
  };

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
          role="presentation"
        >
          <div
            className="member-modal"
            ref={modalRef}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="member-modal-title"
          >
            <div className="member-modal-header">
              <div className="member-title-wrap">
                <div className="member-badge">{m.badge}</div>
                <h2 id="member-modal-title" className="amharic-fix">
                  {m.title}
                </h2>
              </div>

              <button
                ref={closeBtnRef}
                type="button"
                className="member-close-btn"
                onClick={closeModal}
                disabled={isSubmitting}
                aria-label={m.closeAria}
                title={m.closeTitle}
              >
                <span className="member-close-icon" aria-hidden="true" />
              </button>
            </div>

            <p className="member-intro amharic-fix">{m.intro}</p>

            <form className="member-form" onSubmit={handleSubmit} noValidate>
              {/* Personal */}
              <div className="member-section">
                <div className="member-section__title amharic-fix">
                  {m.sections.personal}
                </div>

                <div className="member-row">
                  <label className="amharic-fix">
                    {m.fields.fullName}{" "}
                    <span className="req">{m.requiredMark}</span>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder={m.fields.fullNamePh}
                      autoComplete="name"
                    />
                  </label>
                </div>

                <div className="member-row member-row-two">
                  <label className="amharic-fix">
                    {m.fields.email}{" "}
                    <span className="req">{m.requiredMark}</span>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder={m.fields.emailPh}
                      autoComplete="email"
                      inputMode="email"
                    />
                  </label>

                  <label className="amharic-fix">
                    {m.fields.phone}
                    <input
                      type="tel"
                      name="phone"
                      placeholder={m.fields.phonePh}
                      autoComplete="tel"
                      inputMode="tel"
                    />
                  </label>
                </div>
              </div>

              {/* Preferences */}
              <div className="member-section">
                <div className="member-section__title amharic-fix">
                  {m.sections.preferences}
                </div>

                <div className="member-row member-row-two">
                  <label className="amharic-fix">
                    {m.fields.preferredLanguage}
                    <select name="language" defaultValue="English">
                      <option value="English">{m.options.english}</option>
                      <option value="Amharic">{m.options.amharic}</option>
                      <option value="Tigrinya">{m.options.tigrinya}</option>
                      <option value="Other">{m.options.other}</option>
                    </select>
                  </label>

                  <label className="amharic-fix">
                    {m.fields.familyMembers}
                    <input
                      type="number"
                      name="familySize"
                      min="1"
                      placeholder={m.fields.familyMembersPh}
                      inputMode="numeric"
                    />
                  </label>
                </div>

                <div className="member-row member-row-two">
                  <label className="amharic-fix">
                    {m.fields.baptised}
                    <select name="baptised" defaultValue="">
                      <option value="">{m.options.select}</option>
                      <option value="Yes">{m.options.yes}</option>
                      <option value="No">{m.options.no}</option>
                      <option value="Not sure">{m.options.notSure}</option>
                    </select>
                  </label>

                  <label className="amharic-fix">
                    {m.fields.newsletters}
                    <select name="newsletter" defaultValue="Yes">
                      <option value="Yes">{m.options.yes}</option>
                      <option value="No">{m.options.no}</option>
                    </select>
                  </label>
                </div>
              </div>

              {/* Address (separate fields) */}
              <div className="member-section">
                <div className="member-section__title amharic-fix">
                  {m.sections.address}
                </div>

                <div className="member-row member-row-two">
                  <label className="amharic-fix">
                    {m.fields.address1}{" "}
                    <span className="req">{m.requiredMark}</span>
                    <input
                      type="text"
                      name="address1"
                      required
                      placeholder={m.fields.address1Ph}
                      autoComplete="address-line1"
                    />
                  </label>

                  <label className="amharic-fix">
                    {m.fields.address2}
                    <input
                      type="text"
                      name="address2"
                      placeholder={m.fields.address2Ph}
                      autoComplete="address-line2"
                    />
                  </label>
                </div>

                <div className="member-row member-row-two">
                  <label className="amharic-fix">
                    {m.fields.city}{" "}
                    <span className="req">{m.requiredMark}</span>
                    <input
                      type="text"
                      name="city"
                      required
                      placeholder={m.fields.cityPh}
                      autoComplete="address-level2"
                    />
                  </label>

                  <label className="amharic-fix">
                    {m.fields.county}
                    <input
                      type="text"
                      name="county"
                      placeholder={m.fields.countyPh}
                      autoComplete="address-level1"
                    />
                  </label>
                </div>

                <div className="member-row member-row-two">
                  <label className="amharic-fix">
                    {m.fields.postcode}{" "}
                    <span className="req">{m.requiredMark}</span>
                    <input
                      type="text"
                      name="postcode"
                      required
                      placeholder={m.fields.postcodePh}
                      autoComplete="postal-code"
                      inputMode="text"
                    />
                  </label>

                  <label className="amharic-fix">
                    {m.fields.country}
                    <input
                      type="text"
                      name="country"
                      defaultValue="United Kingdom"
                      readOnly
                    />
                  </label>
                </div>
              </div>

              {/* Support */}
              <div className="member-section">
                <div className="member-section__title amharic-fix">
                  {m.sections.support}
                </div>

                <div className="member-row">
                  <label className="amharic-fix">
                    {m.fields.support}
                    <textarea
                      name="support"
                      rows="3"
                      placeholder={m.fields.supportPh}
                    />
                  </label>
                </div>
              </div>

              {/* Footer */}
              <div className="member-footer">
                <button
                  type="submit"
                  className="member-submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? m.submit.loading : m.submit.idle}
                </button>

                {message && (
                  <span
                    className={`member-note member-note-status ${
                      message.type === "success" ? "is-success" : "is-error"
                    }`}
                    role="status"
                    aria-live="polite"
                  >
                    {message.text}
                  </span>
                )}
              </div>

              <p className="member-legal amharic-fix">{m.legal}</p>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default MembershipForm;
