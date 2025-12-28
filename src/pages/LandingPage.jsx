// src/pages/LandingPage.jsx
import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import MembershipForm from "../components/MembershipForm";
import ContributionButton from "../components/ContributionButton";
import PushSubscribe from "../components/PushSubscribe";

import HomeSections from "./HomeSections";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <Hero />

      <div style={{ textAlign: "center", margin: "1rem 0" }}>
        <PushSubscribe />
      </div>

      <HomeSections />

      <MembershipForm />
      <ContributionButton />
      <Footer />
    </>
  );
}
