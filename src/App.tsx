import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import FloatingCTA from './components/layout/FloatingCTA';
import BackgroundParticles from './components/effects/BackgroundParticles';
import Hero from './components/home/Hero';
import About from './components/home/About';
import LiveChatRoom from './components/chat/LiveChatRoom';
import PublicFeed from './components/feed/PublicFeed';
import ProfilePage from './components/profile/ProfilePage';
import ProfileSettings from './components/profile/ProfileSettings';

const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -15 }}
    transition={{ duration: 0.3, ease: 'easeInOut' }}
  >
    {children}
  </motion.div>
);

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Hero /></PageTransition>} />
        <Route path="/about" element={<PageTransition><About /></PageTransition>} />
        <Route path="/feed" element={<PageTransition><PublicFeed /></PageTransition>} />
        <Route path="/chat" element={<PageTransition><LiveChatRoom /></PageTransition>} />
        <Route path="/profile" element={<PageTransition><ProfilePage /></PageTransition>} />
        <Route path="/settings" element={<PageTransition><ProfileSettings /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-neutral-950 text-white overflow-x-hidden font-sans">
      {/* Background with Profile Pic & Particles */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center grayscale-[0.2] opacity-40 transition-all duration-1000"
        style={{
          backgroundImage: `url('/images/hisham.png')`,
        }}
      />
      <BackgroundParticles />
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />

      <Navbar />

      <main className="relative z-10 pt-24 pb-12 px-4 md:px-12 max-w-7xl mx-auto min-h-[80vh]">
        <AnimatedRoutes />
      </main>

      <FloatingCTA />
      <Footer />
    </div>
  );
};

export default App;
