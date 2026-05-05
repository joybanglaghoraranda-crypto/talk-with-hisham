import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, Clock, User, Mail, Check, CheckCheck, Loader2, ChevronDown, ChevronUp, Inbox } from 'lucide-react';
import { Button } from '../ui/button';
import GlassWrapper from '../layout/GlassWrapper';

interface PrivateMessage {
  id: string;
  sender_id: string | null;
  sender_name: string;
  sender_contact: string;
  message: string;
  admin_reply: string | null;
  admin_reply_at: string | null;
  read: boolean;
  created_at: string;
}

const AdminMessages: React.FC = () => {
  const { isConfigured } = useAuth();
  const [messages, setMessages] = useState<PrivateMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});
  const [replying, setReplying] = useState<string | null>(null);
  const [expandedMsg, setExpandedMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchMessages();
  }, [isConfigured]);

  const fetchMessages = async () => {
    if (!isConfigured) { setLoading(false); return; }
    try {
      const { data, error } = await supabase
        .from('private_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setMessages(data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await supabase.from('private_messages').update({ read: true }).eq('id', id);
      setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
    } catch (err) {
      console.error(err);
    }
  };

  const sendReply = async (id: string) => {
    const text = replyTexts[id]?.trim();
    if (!text) return;

    setReplying(id);
    try {
      // First verify we can select this message (RLS check)
      const { data: existing, error: selectError } = await supabase
        .from('private_messages')
        .select('id')
        .eq('id', id)
        .single();

      if (selectError) {
        console.error('SELECT check failed:', selectError);
        toast.error('Cannot access this message. Check RLS policies.');
        return;
      }

      const { data, error } = await supabase
        .from('private_messages')
        .update({
          admin_reply: text,
          admin_reply_at: new Date().toISOString(),
          read: true
        })
        .eq('id', id)
        .select();

      if (error) {
        console.error('UPDATE error details:', error.message, error.details, error.hint, error.code);
        if (error.message?.includes('column')) {
          toast.error('Database columns missing. Run schema_update.sql in Supabase.');
        } else if (error.code === '42501') {
          toast.error('Permission denied. Check UPDATE RLS policy.');
        } else {
          toast.error(`Failed: ${error.message}`);
        }
        return;
      }

      if (!data || data.length === 0) {
        console.warn('Update returned no rows — RLS may be blocking the UPDATE');
        toast.error('Reply not saved. Ensure UPDATE policy exists for admin on private_messages.');
        return;
      }

      setMessages(prev => prev.map(m =>
        m.id === id
          ? { ...m, admin_reply: text, admin_reply_at: new Date().toISOString(), read: true }
          : m
      ));
      setReplyTexts(prev => ({ ...prev, [id]: '' }));
      toast.success('Reply sent!');
    } catch (err: any) {
      console.error('Unexpected error sending reply:', err);
      toast.error(err?.message || 'Failed to send reply');
    } finally {
      setReplying(null);
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
      ' at ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const unreadCount = messages.filter(m => !m.read).length;

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="animate-spin text-orange-500" size={28} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Stats Bar */}
      <div className="flex gap-4 mb-6">
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5">
          <Inbox size={16} className="text-white/40" />
          <span className="text-sm text-white/60">{messages.length} total</span>
        </div>
        {unreadCount > 0 && (
          <div className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-xl px-4 py-2.5">
            <MessageSquare size={16} className="text-orange-400" />
            <span className="text-sm text-orange-400 font-semibold">{unreadCount} unread</span>
          </div>
        )}
      </div>

      {messages.length === 0 && (
        <GlassWrapper className="text-center py-12">
          <Inbox className="mx-auto text-white/10 mb-3" size={48} />
          <p className="text-white/30">No private messages yet.</p>
        </GlassWrapper>
      )}

      <AnimatePresence initial={false}>
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="group"
          >
            <GlassWrapper className={`p-0 overflow-hidden transition-all ${
              !msg.read ? 'border-orange-500/30 bg-orange-500/5' : 'border-white/5'
            }`}>
              {/* Message Header */}
              <button
                onClick={() => {
                  setExpandedMsg(expandedMsg === msg.id ? null : msg.id);
                  if (!msg.read) markAsRead(msg.id);
                }}
                className="w-full px-5 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3 text-left">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    !msg.read
                      ? 'bg-gradient-to-br from-orange-500/30 to-rose-500/30 text-orange-400'
                      : 'bg-white/10 text-white/40'
                  }`}>
                    <User size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white text-sm">{msg.sender_name}</span>
                      {!msg.read && (
                        <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                      )}
                      {msg.admin_reply && (
                        <CheckCheck size={14} className="text-green-500" />
                      )}
                    </div>
                    <p className="text-[11px] text-white/30 flex items-center gap-1.5">
                      <Clock size={10} /> {formatDate(msg.created_at)}
                    </p>
                  </div>
                </div>
                {expandedMsg === msg.id ? <ChevronUp size={16} className="text-white/30" /> : <ChevronDown size={16} className="text-white/30" />}
              </button>

              {/* Expanded Content */}
              <AnimatePresence>
                {expandedMsg === msg.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 space-y-4 border-t border-white/5">
                      {/* Contact Info */}
                      <div className="flex items-center gap-2 pt-3">
                        <Mail size={12} className="text-white/30" />
                        <span className="text-xs text-white/50">{msg.sender_contact}</span>
                      </div>

                      {/* User's Message */}
                      <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                        <p className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                      </div>

                      {/* Admin Reply (if exists) */}
                      {msg.admin_reply && (
                        <div className="ml-6 bg-orange-500/10 rounded-xl p-4 border border-orange-500/15">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center text-[10px] font-bold text-white">H</div>
                            <span className="text-[10px] text-orange-400/60 font-semibold uppercase tracking-wider">Your Reply</span>
                            <span className="text-[10px] text-white/20">{msg.admin_reply_at ? formatDate(msg.admin_reply_at) : ''}</span>
                          </div>
                          <p className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap">{msg.admin_reply}</p>
                        </div>
                      )}

                      {/* Reply Input */}
                      <div className="flex gap-2">
                        <textarea
                          value={replyTexts[msg.id] || ''}
                          onChange={e => setReplyTexts(prev => ({ ...prev, [msg.id]: e.target.value }))}
                          placeholder={msg.admin_reply ? 'Update your reply...' : 'Write your reply...'}
                          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 resize-none min-h-[80px] focus:border-orange-500 outline-none"
                        />
                      </div>
                      <Button
                        onClick={() => sendReply(msg.id)}
                        disabled={!replyTexts[msg.id]?.trim() || replying === msg.id}
                        className="bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 rounded-xl font-bold px-6 shadow-lg shadow-orange-500/20 disabled:opacity-30"
                      >
                        {replying === msg.id ? <Loader2 className="animate-spin mr-2" size={16} /> : <Send size={16} className="mr-2" />}
                        {msg.admin_reply ? 'Update Reply' : 'Send Reply'}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </GlassWrapper>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default AdminMessages;
