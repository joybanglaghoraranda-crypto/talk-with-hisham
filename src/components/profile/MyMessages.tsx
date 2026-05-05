import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Clock, Loader2, Inbox, ArrowLeft, CheckCheck, Send, PenLine, X, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import GlassWrapper from '../layout/GlassWrapper';
import { toast } from 'sonner';

interface MyMessage {
  id: string;
  message: string;
  admin_reply: string | null;
  admin_reply_at: string | null;
  created_at: string;
}

const MyMessages: React.FC = () => {
  const { user, isConfigured } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<MyMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [composeOpen, setComposeOpen] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchMyMessages();
  }, [user, isConfigured]);

  const fetchMyMessages = async () => {
    if (!isConfigured || !user) {
      setLoading(false);
      return;
    }
    try {
      const { data, error } = await supabase
        .from('private_messages')
        .select('id, message, admin_reply, admin_reply_at, created_at')
        .eq('sender_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setMessages(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    if (!isConfigured) {
      toast.error('Demo mode: Message cannot be sent.');
      return;
    }

    setSending(true);
    try {
      const { error } = await supabase.from('private_messages').insert([{
        sender_id: user.id,
        sender_name: user.user_metadata?.display_name || user.email?.split('@')[0] || 'User',
        sender_contact: user.email || '',
        message: newMessage.trim()
      }]);

      if (error) throw error;

      toast.success('Message sent to Hisham!');
      setNewMessage('');
      setComposeOpen(false);
      fetchMyMessages();
    } catch (err) {
      console.error(err);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) +
      ' · ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <MessageSquare className="text-white/10 mb-4" size={48} />
        <p className="text-white/40 mb-4">Please sign in to view your messages.</p>
        <Button onClick={() => navigate('/')} className="bg-white/10 hover:bg-white/20 rounded-full px-6">
          <ArrowLeft size={16} className="mr-2" /> Go Home
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="animate-spin text-orange-500" size={28} />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-rose-500/20 border border-orange-500/20 flex items-center justify-center">
            <MessageSquare className="text-orange-400" size={18} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">My Messages</h2>
            <p className="text-white/40 text-xs">Your private conversations with Hisham</p>
          </div>
        </div>
        <Button
          onClick={() => navigate('/profile')}
          variant="ghost"
          className="text-white/50 hover:text-white"
        >
          <ArrowLeft size={16} className="mr-2" /> Back
        </Button>
      </div>

      {/* Compose New Message CTA */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <AnimatePresence mode="wait">
          {composeOpen ? (
            <motion.div
              key="compose-form"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
            >
              <GlassWrapper className="p-5 border-orange-500/20 bg-orange-500/5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Lock size={14} className="text-orange-400" />
                    <span className="text-sm font-semibold text-white">New Private Message</span>
                  </div>
                  <button
                    onClick={() => { setComposeOpen(false); setNewMessage(''); }}
                    className="text-white/30 hover:text-white transition-colors p-1"
                    aria-label="Close compose"
                  >
                    <X size={16} />
                  </button>
                </div>
                <p className="text-xs text-white/30 mb-3">
                  This message goes directly to Hisham's private inbox. Only he can read it.
                </p>
                <form onSubmit={handleSendMessage} className="space-y-3">
                  <textarea
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    placeholder="Write your private message to Hisham..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm min-h-[120px] focus:border-orange-500 outline-none resize-none text-white placeholder:text-white/20"
                    required
                    autoFocus
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => { setComposeOpen(false); setNewMessage(''); }}
                      className="text-white/40 hover:text-white"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={!newMessage.trim() || sending}
                      className="bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 rounded-xl font-bold px-6 shadow-lg shadow-orange-500/20 disabled:opacity-30"
                    >
                      {sending ? <Loader2 className="animate-spin mr-2" size={16} /> : <Send size={16} className="mr-2" />}
                      Send Message
                    </Button>
                  </div>
                </form>
              </GlassWrapper>
            </motion.div>
          ) : (
            <motion.button
              key="compose-cta"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setComposeOpen(true)}
              className="w-full group"
            >
              <div className="flex items-center gap-4 bg-gradient-to-r from-orange-500/10 to-rose-500/10 hover:from-orange-500/20 hover:to-rose-500/20 border border-orange-500/20 hover:border-orange-500/40 rounded-2xl p-4 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-lg shadow-orange-500/30">
                  <PenLine size={20} className="text-white" />
                </div>
                <div className="text-left">
                  <span className="text-sm font-bold text-white block">Send a Private Message</span>
                  <span className="text-xs text-white/40">Write directly to Hisham — only he can read it</span>
                </div>
                <Send size={18} className="text-orange-400/60 ml-auto group-hover:text-orange-400 group-hover:translate-x-1 transition-all" />
              </div>
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Messages List */}
      {messages.length === 0 ? (
        <GlassWrapper className="text-center py-16 border-white/5">
          <Inbox className="mx-auto text-white/10 mb-4" size={48} />
          <p className="text-white/30 text-sm mb-1">No messages yet</p>
          <p className="text-white/20 text-xs">Tap the button above to send your first message to Hisham.</p>
        </GlassWrapper>
      ) : (
        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {messages.map(msg => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <GlassWrapper className="p-5 space-y-4 border-white/5">
                  {/* Your message */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold text-white/50">You</span>
                      <span className="text-[10px] text-white/20 flex items-center gap-1">
                        <Clock size={9} /> {formatDate(msg.created_at)}
                      </span>
                    </div>
                    <div className="bg-orange-500/10 rounded-xl rounded-tl-sm p-3.5 border border-orange-500/10">
                      <p className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                    </div>
                  </div>

                  {/* Admin Reply */}
                  {msg.admin_reply ? (
                    <div className="ml-6">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center text-[10px] font-bold text-white">H</div>
                        <span className="text-xs font-semibold text-orange-400/70">Hisham</span>
                        <CheckCheck size={12} className="text-green-500" />
                        <span className="text-[10px] text-white/20 flex items-center gap-1">
                          <Clock size={9} /> {msg.admin_reply_at ? formatDate(msg.admin_reply_at) : ''}
                        </span>
                      </div>
                      <div className="bg-white/5 rounded-xl rounded-tl-sm p-3.5 border border-white/5">
                        <p className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap">{msg.admin_reply}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="ml-6 flex items-center gap-2 text-white/20 text-xs">
                      <Clock size={12} />
                      <span className="italic">Awaiting reply...</span>
                    </div>
                  )}
                </GlassWrapper>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

export default MyMessages;
