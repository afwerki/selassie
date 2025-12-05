import "./App.css";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import MembershipForm from "./components/MembershipForm";
import ContributionButton from "./components/ContributionButton";

import Home from "./pages/Home";
import Sermons from "./pages/Sermons";
import Events from "./pages/Events";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Projects from "./pages/Projects"; // ⬅️ NEW

function App() {
  return (
    <>
      <Navbar />
      <Hero />

      <main className="page">
        <Home />
         <Projects />  {/* ⬅️ NEW projects section/page */}
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
