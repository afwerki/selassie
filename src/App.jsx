import "./App.css";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import MembershipForm from "./components/MembershipForm";


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

      <Footer />
    </>
  );
}


export default App;
