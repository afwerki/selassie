import "./App.css";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import MembershipForm from "./components/MembershipForm";
import ContributionButton from "./components/ContributionButton";
import PushSubscribe from "./components/PushSubscribe";

import Home from "./pages/Home";
import Sermons from "./pages/Sermons";
import Events from "./pages/Events";
import News from "./pages/News";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Projects from "./pages/Projects";

function App() {
  return (
    <>
      <Navbar />
      <Hero />

      <div style={{ textAlign: "center", margin: "1rem 0" }}>
        <PushSubscribe />
      </div>

      <main className="page">
        <Home />
        <Sermons />
        <Events />
        <News />
        <About />
        <Projects />
        <Contact />
      </main>

      <MembershipForm />
      <ContributionButton />
      <Footer />
    </>
  );
}

export default App;
