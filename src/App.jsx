import "./App.css";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import MembershipForm from "./components/MembershipForm";
import ContributionButton from "./components/ContributionButton"; // ⬅️ NEW

import Home from "./pages/Home";
import Sermons from "./pages/Sermons";
import Events from "./pages/Events";
import Contact from "./pages/Contact";
import About from "./pages/About";

function App() {
  return (
    <>
      <Navbar />
      <Hero />

      <main className="page">
        <Home />
        <Sermons />
        <Events />
        <About />
        <Contact />
      </main>

      {/* floating membership button + modal */}
      <MembershipForm />

      {/* floating contribution button with payment link */}
      <ContributionButton />

      <Footer />
    </>
  );
}

export default App;
