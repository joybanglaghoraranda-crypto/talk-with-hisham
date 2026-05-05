import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from './contexts/AuthContext';
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
      </Routes>
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-neutral-950 text-white overflow-x-hidden font-sans">
      {/* Background with Profile Pic & Particles */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center grayscale-[0.1] opacity-35 transition-all duration-1000 bg-[url('/images/hisham-backgroud.png')]"
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
