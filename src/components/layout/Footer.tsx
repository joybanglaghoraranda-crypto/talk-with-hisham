import React, { useState } from 'react';
import { SOCIAL_LINKS } from '@/lib/constants';
import { Mail, Phone, Lock, Send, Loader2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const Footer: React.FC = () => {
  const [isMessageOpen, setIsMessageOpen] = useState(false);

  return (
    <footer className="relative z-10 border-t border-white/10 bg-black/40 backdrop-blur-md mt-16">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
          {/* Brand */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <img src="/icon.png" alt="Talk with Hisham" className="w-8 h-8 rounded-full object-cover border border-white/10" />
              <span className="font-bold text-lg text-white">Talk with Hisham</span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed max-w-sm">
              A space for deep conversations, real-time opinions, and cross-platform connection.
            </p>
            
            <div className="pt-4 space-y-2">
              <a href="mailto:ibnenurakondo@gmail.com" className="flex items-center gap-2 text-white/50 hover:text-orange-400 transition-colors text-sm w-fit">
                <Mail size={14} /> ibnenurakondo@gmail.com
              </a>
              <a href="https://wa.me/8801898529450" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white/50 hover:text-orange-400 transition-colors text-sm w-fit">
                <Phone size={14} /> +88 01898529450
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/50">Navigate</h4>
            <div className="flex flex-col gap-2">
              {[
                { label: 'Home', href: '/' },
                { label: 'About', href: '/about' },
                { label: 'Feed', href: '/feed' },
                { label: 'Chat', href: '/chat' },
              ].map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-white/50 hover:text-white transition-colors text-sm w-fit"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Connect & Private Message */}
          <div className="space-y-4">
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-white/50">Connect</h4>
              <div className="flex gap-2 flex-wrap">
                {SOCIAL_LINKS.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={social.label}
                    className="w-9 h-9 rounded-full border border-white/10 bg-white/5 hover:bg-white/15 flex items-center justify-center text-white/50 hover:text-white transition-all hover:scale-110 hover:border-orange-500/30"
                  >
                    <social.icon size={16} />
                  </a>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setIsMessageOpen(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-orange-500/10 to-rose-500/10 hover:from-orange-500/20 hover:to-rose-500/20 border border-orange-500/20 text-orange-400 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105"
              >
                <Lock size={14} />
                Message Privately
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/30 text-xs">
            © {new Date().getFullYear()} Talk with Hisham. All rights reserved.
          </p>
          <p className="text-white/20 text-[10px] tracking-widest uppercase">
            Built with purpose & passion
          </p>
        </div>
      </div>

      <PrivateMessageModal isOpen={isMessageOpen} onClose={() => setIsMessageOpen(false)} />
    </footer>
  );
};

const PrivateMessageModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { user, isConfigured } = useAuth();
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    if (!isConfigured) {
      toast.error('Demo mode: Message cannot be sent.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from('private_messages').insert([{
        sender_id: user?.id || null,
        sender_name: name || user?.email?.split('@')[0] || 'Anonymous',
        sender_contact: contact || user?.email || '',
        message: message
      }]);

      if (error) throw error;
      toast.success('Your private message has been sent directly to Hisham.');
      setMessage('');
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Failed to send message. Please try WhatsApp instead.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-neutral-950 border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={onClose} aria-label="Close modal" className="absolute top-4 right-4 text-white/30 hover:text-white">
              <X size={20} />
            </button>

            <div className="mb-6">
              <div className="w-12 h-12 bg-orange-500/10 text-orange-400 rounded-full flex items-center justify-center mb-4 border border-orange-500/20">
                <Lock size={20} />
              </div>
              <h3 className="text-xl font-bold text-white mb-1">Direct Message</h3>
              <p className="text-sm text-white/40">This message goes straight to Hisham's private dashboard. Only he can read it.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!user && (
                <>
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-orange-500 outline-none text-white"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Email or WhatsApp Number"
                    value={contact}
                    onChange={e => setContact(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-orange-500 outline-none text-white"
                    required
                  />
                </>
              )}
              
              <textarea
                placeholder="Write your private message here..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm min-h-[120px] focus:border-orange-500 outline-none resize-none text-white"
                required
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold py-3 rounded-xl hover:opacity-90 transition-opacity"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                Send Privately
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Footer;
