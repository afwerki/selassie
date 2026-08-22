// src/pages/HomePage.jsx
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import MembershipForm from "../components/MembershipForm";
import ContributionButton from "../components/ContributionButton";
import ChurchGallery from "../components/ChurchGallery";
import SiteMotion from "../components/SiteMotion";

import Home from "./Home";
import Sermons from "./Sermons";
import Contact from "./Contact";
import About from "./About";
import Projects from "./Projects";

export default function HomePage() {
  return (
    <>
      <SiteMotion />
      <Navbar />
      <Hero />

      <main className="page">
        <Home />
        <About />
        <Projects />
        <Sermons />
        <Contact />
      </main>

      <MembershipForm />
      <ContributionButton />

      {/* ✅ Church Gallery before footer */}
      <ChurchGallery />

      <Footer />
    </>
  );
}
