// MembershipForm.jsx
import { useEffect, useRef, useState } from "react";
import "./MembershipForm.css";

const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbw11kXjsTOcpAI3HmTh9rLgZ53K_CLPu4658hmI6R4qlBanXC1VdUpyxJbd_Dp4fukp/exec";

const ukPostcodeRegex = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i;

function MembershipForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

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

    const t = setTimeout(() => closeBtnRef.current?.focus?.(), 0);

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
      clearTimeout(t);
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
    setMessage(
      "This registration is only for UK residents. Please enter a valid UK postcode."
    );
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

    setMessage("Thank you! Your membership request has been received.");
    form.reset();

    setTimeout(() => {
      setIsOpen(false);
      setMessage(null);
    }, 1800);
  } catch (err) {
    console.error(err);
    setMessage("Sorry, something went wrong. Please try again.");
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
        Register as a Member
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
                <div className="member-badge">Membership</div>
                <h2 id="member-modal-title">Registration</h2>
              </div>

              <button
                ref={closeBtnRef}
                type="button"
                className="member-close-btn"
                onClick={closeModal}
                disabled={isSubmitting}
                aria-label="Close membership form"
                title="Close"
              >
                <span className="member-close-icon" aria-hidden="true" />
              </button>
            </div>

            <p className="member-intro">
              Please fill in the details below to register as a member of
              Selassie Ethiopian Orthodox Church in London.
            </p>

            <form className="member-form" onSubmit={handleSubmit} noValidate>
              {/* Personal */}
              <div className="member-section">
                <div className="member-section__title">Personal details</div>

                <div className="member-row">
                  <label>
                    Full Name <span className="req">*</span>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="Your full name"
                      autoComplete="name"
                    />
                  </label>
                </div>

                <div className="member-row member-row-two">
                  <label>
                    Email <span className="req">*</span>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="you@example.com"
                      autoComplete="email"
                      inputMode="email"
                    />
                  </label>

                  <label>
                    Phone
                    <input
                      type="tel"
                      name="phone"
                      placeholder="+44 ..."
                      autoComplete="tel"
                      inputMode="tel"
                    />
                  </label>
                </div>
              </div>

              {/* Preferences */}
              <div className="member-section">
                <div className="member-section__title">Preferences</div>

                <div className="member-row member-row-two">
                  <label>
                    Preferred Language
                    <select name="language" defaultValue="English">
                      <option value="English">English</option>
                      <option value="Amharic">Amharic</option>
                      <option value="Tigrinya">Tigrinya</option>
                      <option value="Other">Other</option>
                    </select>
                  </label>

                  <label>
                    Family Members
                    <input
                      type="number"
                      name="familySize"
                      min="1"
                      placeholder="e.g. 4"
                      inputMode="numeric"
                    />
                  </label>
                </div>

                <div className="member-row member-row-two">
                  <label>
                    Baptised in the Orthodox Church?
                    <select name="baptised" defaultValue="">
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                      <option value="Not sure">Not sure</option>
                    </select>
                  </label>

                  <label>
                    Receive newsletters?
                    <select name="newsletter" defaultValue="Yes">
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </label>
                </div>
              </div>

              {/* Address (separate fields) */}
              <div className="member-section">
                <div className="member-section__title">Address (UK only)</div>

                <div className="member-row member-row-two">
                  <label>
                    Address Line 1 <span className="req">*</span>
                    <input
                      type="text"
                      name="address1"
                      required
                      placeholder="House number and street"
                      autoComplete="address-line1"
                    />
                  </label>

                  <label>
                    Address Line 2
                    <input
                      type="text"
                      name="address2"
                      placeholder="Apartment, suite, etc. (optional)"
                      autoComplete="address-line2"
                    />
                  </label>
                </div>

                <div className="member-row member-row-two">
                  <label>
                    City / Town <span className="req">*</span>
                    <input
                      type="text"
                      name="city"
                      required
                      placeholder="e.g. London"
                      autoComplete="address-level2"
                    />
                  </label>

                  <label>
                    County
                    <input
                      type="text"
                      name="county"
                      placeholder="e.g. Greater London"
                      autoComplete="address-level1"
                    />
                  </label>
                </div>

                <div className="member-row member-row-two">
                  <label>
                    Postcode <span className="req">*</span>
                    <input
                      type="text"
                      name="postcode"
                      required
                      placeholder="e.g. NW2 6XG"
                      autoComplete="postal-code"
                      inputMode="text"
                    />
                  </label>

                  <label>
                    Country
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
                <div className="member-section__title">Spiritual support</div>

                <div className="member-row">
                  <label>
                    How can we support you spiritually?
                    <textarea
                      name="support"
                      rows="3"
                      placeholder="Prayer requests, pastoral support, areas of interest..."
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
                  {isSubmitting ? "Submitting..." : "Submit Registration"}
                </button>

                {message && (
                  <span
                    className={`member-note member-note-status ${
                      message.toLowerCase().includes("thank")
                        ? "is-success"
                        : "is-error"
                    }`}
                    role="status"
                    aria-live="polite"
                  >
                    {message}
                  </span>
                )}
              </div>

              <p className="member-legal">
                By submitting, you agree that the church may contact you using
                the details provided.
              </p>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default MembershipForm;
