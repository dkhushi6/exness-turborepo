import React from "react";
import { Banner } from "./banner";
import { Hero } from "./hero-section";
import { TradingAdvantages } from "./trading-advantage";
import { SecurityTrust } from "./trust";
import { Footer } from "./footer";

const LandingPage = () => {
  return (
    <div>
      <Hero />
      <TradingAdvantages />
      <SecurityTrust />
      <Banner />
      <Footer />
    </div>
  );
};

export default LandingPage;
