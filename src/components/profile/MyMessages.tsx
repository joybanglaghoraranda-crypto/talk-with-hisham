import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Clock, Shield, Loader2, Inbox, ArrowLeft, CheckCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import GlassWrapper from '../layout/GlassWrapper';

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

      {messages.length === 0 ? (
        <GlassWrapper className="text-center py-16 border-white/5">
          <Inbox className="mx-auto text-white/10 mb-4" size={48} />
          <p className="text-white/30 text-sm mb-1">No messages yet</p>
          <p className="text-white/20 text-xs">Send a private message using the form in the footer.</p>
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
