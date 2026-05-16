import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from './contexts/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/layout/ScrollToTop';
import InstallPrompt from './components/layout/InstallPrompt';
import FloatingCTA from './components/layout/FloatingCTA';
import BackgroundParticles from './components/effects/BackgroundParticles';
import Hero from './components/home/Hero';
import About from './components/home/About';
import LiveChatRoom from './components/chat/LiveChatRoom';
import PublicFeed from './components/feed/PublicFeed';
import ProfilePage from './components/profile/ProfilePage';
import ProfileSettings from './components/profile/ProfileSettings';
import MyMessages from './components/profile/MyMessages';
import AdminDashboard from './components/admin/AdminDashboard';

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

// Auth guard component
const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Hero /></PageTransition>} />
        <Route path="/about" element={<PageTransition><About /></PageTransition>} />
        <Route path="/feed" element={
          <RequireAuth>
            <PageTransition><PublicFeed /></PageTransition>
          </RequireAuth>
        } />
        <Route path="/chat" element={
          <RequireAuth>
            <PageTransition><LiveChatRoom /></PageTransition>
          </RequireAuth>
        } />
        <Route path="/profile" element={
          <RequireAuth>
            <PageTransition><ProfilePage /></PageTransition>
          </RequireAuth>
        } />
        <Route path="/settings" element={
          <RequireAuth>
            <PageTransition><ProfileSettings /></PageTransition>
          </RequireAuth>
        } />
        <Route path="/my-messages" element={
          <RequireAuth>
            <PageTransition><MyMessages /></PageTransition>
          </RequireAuth>
        } />
        <Route path="/admin" element={
          <RequireAuth>
            <PageTransition><AdminDashboard /></PageTransition>
          </RequireAuth>
        } />
        {/* 404 Fallback */}
        <Route path="*" element={
          <PageTransition>
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring' }}
                className="text-8xl font-bold bg-gradient-to-r from-orange-400 to-rose-500 bg-clip-text text-transparent mb-4"
              >
                404
              </motion.div>
              <p className="text-white/40 text-lg mb-6">Page not found</p>
              <a href="/" className="bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all">
                Go Home
              </a>
            </div>
          </PageTransition>
        } />
      </Routes>
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  const location = useLocation();
  const isFeedOrChat = location.pathname === '/feed' || location.pathname === '/chat';

  // Keep Tawk.to hidden — it's triggered from FloatingCTA only
  useEffect(() => {
    const hideTawk = () => {
      const tawk = (window as any).Tawk_API;
      if (tawk && typeof tawk.hideWidget === 'function') {
        tawk.hideWidget();
      }
    };
    hideTawk();
    const timer = setTimeout(hideTawk, 2000);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen bg-neutral-950 text-white overflow-x-hidden font-sans">
      {/* Background with Profile Pic & Particles */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center grayscale-[0.1] opacity-35 transition-all duration-1000 bg-[url('/images/hisham-backgroud.png')]"
      />
      <BackgroundParticles />
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />

      <Navbar />

      <main className={`relative z-10 pt-24 ${isFeedOrChat ? 'pb-4' : 'pb-12'} px-4 md:px-12 max-w-7xl mx-auto min-h-[80vh]`}>
        <AnimatedRoutes />
      </main>

      {!isFeedOrChat && <Footer />}

      {/* Global UI Elements */}
      <FloatingCTA />
      <ScrollToTop />
      <InstallPrompt />
    </div>
  );
};

export default App;
