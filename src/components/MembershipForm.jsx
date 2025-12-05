import { useState } from "react";
import "./MembershipForm.css";

const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbw11kXjsTOcpAI3HmTh9rLgZ53K_CLPu4658hmI6R4qlBanXC1VdUpyxJbd_Dp4fukp/exec";

const ukPostcodeRegex = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i;

function MembershipForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const openModal = () => {
    setMessage(null);
    setIsOpen(true);
  };

  const closeModal = () => {
    if (!isSubmitting) setIsOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const form = e.target;
    const formData = new FormData(form);

    // ---- UK VALIDATION ----
    const address = form.address.value.trim();
    const postcodeMatch = address.match(/[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}/i);

    if (!postcodeMatch || !ukPostcodeRegex.test(postcodeMatch[0])) {
      setMessage("This registration is only for UK residents. Please enter a valid UK postcode.");
      setIsSubmitting(false);
      return;
    }
    // ------------------------

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
      }, 2000);
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
      <button type="button" className="floating-member-btn" onClick={openModal}>
        Register as a Member
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="member-modal-backdrop" onClick={closeModal}>
          <div className="member-modal" onClick={(e) => e.stopPropagation()}>
            <div className="member-modal-header">
              <h2>Membership Registration</h2>
              <button
                type="button"
                className="member-close-btn"
                onClick={closeModal}
                disabled={isSubmitting}
              >
                ×
              </button>
            </div>

            <p className="member-intro">
              Please fill in the details below to register as a member of
              Selassie Ethiopian Orthodox Church in London.
            </p>

            <form className="member-form" onSubmit={handleSubmit}>
              <div className="member-row">
                <label>
                  Full Name
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Your full name"
                  />
                </label>
              </div>

              <div className="member-row member-row-two">
                <label>
                  Email
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="you@example.com"
                  />
                </label>
                <label>
                  Phone
                  <input type="tel" name="phone" placeholder="+44 ..." />
                </label>
              </div>

              <div className="member-row member-row-two">
                <label>
                  Preferred Language
                  <select name="language">
                    <option value="English">English</option>
                    <option value="Amharic">Amharic</option>
                    <option value="Tigrinya">Tigrinya</option>
                    <option value="Other">Other</option>
                  </select>
                </label>
                <label>
                  Family Members
                  <input type="number" name="familySize" min="1" placeholder="e.g. 4" />
                </label>
              </div>

              <div className="member-row member-row-two">
                <label>
                  Baptised in the Orthodox Church?
                  <select name="baptised">
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                    <option value="Not sure">Not sure</option>
                  </select>
                </label>
                <label>
                  Receive newsletters?
                  <select name="newsletter">
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </label>
              </div>

              <div className="member-row">
                <label>
                  Address (UK only)
                  <input
                    type="text"
                    name="address"
                    required
                    placeholder="House number, street, city, UK postcode"
                  />
                </label>
              </div>

              <div className="member-row">
                <label>
                  How can we support you spiritually?
                  <textarea
                    name="support"
                    rows="3"
                    placeholder="Prayer requests, pastoral support, areas of interest..."
                  ></textarea>
                </label>
              </div>

              <div className="member-footer">
                <button type="submit" className="card-btn" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Registration"}
                </button>

                {message && <span className="member-note member-note-status">{message}</span>}
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default MembershipForm;
