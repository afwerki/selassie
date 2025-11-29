import { useState } from "react";
import "./MembershipForm.css";

function MembershipForm() {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder – later we can send this to an API or email.
    alert("Membership form submitted (placeholder).");
    closeModal();
  };

  return (
    <>
      {/* Floating Button */}
      <button
        type="button"
        className="floating-member-btn"
        onClick={openModal}
      >
        Register as a Member
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="member-modal-backdrop" onClick={closeModal}>
          <div
            className="member-modal"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
          >
            <div className="member-modal-header">
              <h2>Membership Registration</h2>
              <button
                type="button"
                className="member-close-btn"
                onClick={closeModal}
                aria-label="Close membership form"
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
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+44 ..."
                  />
                </label>
              </div>

              <div className="member-row member-row-two">
                <label>
                  Preferred Language
                  <select name="language">
                    <option value="english">English</option>
                    <option value="amharic">Amharic</option>
                    <option value="tigrinya">Tigrinya</option>
                    <option value="other">Other</option>
                  </select>
                </label>
                <label>
                  Family Members
                  <input
                    type="number"
                    name="familySize"
                    min="1"
                    placeholder="e.g. 4"
                  />
                </label>
              </div>

              <div className="member-row member-row-two">
                <label>
                  Baptised in the Orthodox Church?
                  <select name="baptised">
                    <option value="">Select</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                    <option value="not-sure">Not sure</option>
                  </select>
                </label>
                <label>
                  Would you like to receive newsletters?
                  <select name="newsletter">
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </label>
              </div>

              <div className="member-row">
                <label>
                  Address (optional)
                  <input
                    type="text"
                    name="address"
                    placeholder="House number, street, city, postcode"
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
                  />
                </label>
              </div>

              <div className="member-footer">
                <button type="submit" className="card-btn">
                  Submit Registration
                </button>
                <span className="member-note">
                  This is a template form – details will be confirmed by the
                  church office.
                </span>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default MembershipForm;
