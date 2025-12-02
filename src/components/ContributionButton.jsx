import "../styling/contribution.css";

function ContributionButton() {
  const paymentLink = "https://donate.mydona.com/debre-genet-church-london"; // <-- replace

  return (
    <a
      href={paymentLink}
      target="_blank"
      rel="noopener noreferrer"
      className="floating-contribution-btn"
    >
      💒 Contribute
    </a>
  );
}

export default ContributionButton;
