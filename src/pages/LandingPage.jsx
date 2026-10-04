import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import About from '../components/About';
import HowItWorks from '../components/HowItWorks';
import CallToAction from '../components/CallToAction';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import { useApp } from '../context/AppContext';

const LandingPage = () => {
  const { navigateTo } = useApp();

  const handleAuthAction = (mode) => {
    if (mode === 'login') {
      navigateTo('login');
    } else {
      navigateTo('register');
    }
  };

  return (
    <div className="landing-page-wrapper">
      {/* 1. Navbar */}
      <Navbar onOpenAuth={handleAuthAction} />

      <main>
        {/* 2. Hero Section (#home) */}
        <Hero onOpenAuth={handleAuthAction} />

        {/* 3. Features Section (#features) */}
        <Features />

        {/* 4. About Section (#about) */}
        <About onOpenAuth={handleAuthAction} />

        {/* 5. How It Works (#how-it-works) */}
        <HowItWorks onOpenAuth={handleAuthAction} />

        {/* 6. Call-to-Action section (#cta) */}
        <CallToAction onOpenAuth={handleAuthAction} />

        {/* 7. Contact Section (#contact) */}
        <Contact />
      </main>

      {/* 8. Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
