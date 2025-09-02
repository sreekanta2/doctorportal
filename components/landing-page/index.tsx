"use client";
import BestDoctors from "./best-doctors";
import Footer from "./footer";
import Header from "./header";
import { HomeBanner } from "./hero";
import SubscriptionPlans from "./pricing-paln";
import SpecialtiesCarousel from "./Specialites";
import Summary from "./summary";

const LandingPageView = () => {
  return (
    <>
      <Header />

      <main>
        <HomeBanner />
        <SpecialtiesCarousel />
        <BestDoctors />
        <Summary />
        <SubscriptionPlans />

        <Footer />
      </main>
    </>
  );
};

export default LandingPageView;
