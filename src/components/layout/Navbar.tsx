import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { MessageSquare, Home, Info, Rss, User, LogIn, LogOut, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from '../auth/AuthModal';

const NAV_ITEMS = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/feed', icon: Rss, label: 'Feed' },
  { to: '/chat', icon: MessageSquare, label: 'Chat' },
  { to: '/about', icon: Info, label: 'About' },
];

const Navbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [authOpen, setAuthOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 h-16 bg-black/30 backdrop-blur-lg border-b border-white/10 flex items-center justify-between px-6 md:px-12"
      >
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-rose-600 flex items-center justify-center font-bold text-white group-hover:scale-110 transition-transform">
            H
          </div>
          <span className="font-bold text-lg text-white hidden sm:inline">Talk with Hisham</span>
        </NavLink>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-2 text-sm font-medium transition-all ${
                  isActive
                    ? 'text-orange-400'
                    : 'text-white/70 hover:text-white'
                }`
              }
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>

        {/* Auth / Profile */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <button
                onClick={() => navigate('/profile')}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors px-4 py-1.5 rounded-full border border-white/20 text-white text-sm"
              >
                <User size={16} />
                <span>Profile</span>
              </button>
              <button
                onClick={() => signOut()}
                className="text-white/40 hover:text-white transition-colors p-2"
                title="Sign Out"
              >
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <button
              onClick={() => setAuthOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-rose-500 hover:opacity-90 transition-opacity px-5 py-1.5 rounded-full text-white text-sm font-bold shadow-lg shadow-orange-500/20"
            >
              <LogIn size={16} />
              <span>Sign In</span>
            </button>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-white/70 hover:text-white transition-colors p-2"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 right-0 z-40 bg-black/90 backdrop-blur-xl border-b border-white/10 p-6 flex flex-col gap-4"
          >
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 text-base font-medium px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? 'text-orange-400 bg-orange-500/10'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <item.icon size={20} />
                {item.label}
              </NavLink>
            ))}

            <div className="border-t border-white/10 pt-4 mt-2">
              {user ? (
                <div className="flex flex-col gap-2">
                  <NavLink
                    to="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 text-base font-medium px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/5"
                  >
                    <User size={20} />
                    Profile
                  </NavLink>
                  <button
                    onClick={() => { signOut(); setMobileOpen(false); }}
                    className="flex items-center gap-3 text-base font-medium px-4 py-3 rounded-xl text-rose-400 hover:bg-rose-500/10"
                  >
                    <LogOut size={20} />
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { setAuthOpen(true); setMobileOpen(false); }}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold py-3 rounded-xl"
                >
                  <LogIn size={18} />
                  Sign In
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
};

export default Navbar;
