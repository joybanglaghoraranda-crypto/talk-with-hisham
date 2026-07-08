'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import {
  Send, Loader2, ImagePlus, X, Search, Reply, Smile,
  MessageSquare, ArrowDown, User, Copy, Trash2,
  Check, CheckCheck, Share2, Info,
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { getSupabaseClient } from '@/lib/supabase/client';
import { CHAT_EMOJIS } from '@/lib/constants';
import { formatTimestamp, getDateLabel, uploadFile, sanitizeUrl } from '@/lib/utils';
import { toast } from 'sonner';
import type { ChatMessage } from '@/lib/types';

interface ChatPresence {
  user_id: string;
  online_at: string;
  is_typing: boolean;
  display_name: string;
}

/* ═══════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════ */
export default function LiveChatRoom() {
  const { user } = useAuthStore();

  /* ── State ── */
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);
  const [activeEmoji, setActiveEmoji] = useState<string | null>(null);
  const [activeMenuMessage, setActiveMenuMessage] = useState<ChatMessage | null>(null);
  const [onlineCount, setOnlineCount] = useState(0);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  // Telegram-style states
  const [typingUsers, setTypingUsers] = useState<Map<string, string>>(new Map());
  const [infoMessage, setInfoMessage] = useState<ChatMessage | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  /* ── Refs ── */
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const channelRef = useRef<any>(null);
  const markedReadRef = useRef<Set<string>>(new Set());
  const supabase = getSupabaseClient();

  /* ── Scroll ── */
  const scrollToBottom = useCallback((smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'instant' });
  }, []);

  /* ── Fetch Messages ── */
  const fetchMessages = useCallback(async () => {
    try {
      const { data } = await supabase
        .from('messages')
        .select('*, profiles(username, full_name, avatar_url)')
        .order('created_at', { ascending: true })
        .limit(200);
      setMessages(data || []);
    } catch (err) {
      console.error('Error loading messages:', err);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  /* ── Realtime + Presence + Typing ── */
  useEffect(() => {
    if (!user) return;
    const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'user';

    const channel = supabase
      .channel('chat_room')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        const newMsg = payload.new as ChatMessage;
        setMessages((prev) => {
          if (prev.some((m) => m.id === newMsg.id)) return prev;
          return [...prev, newMsg];
        });
        // Fetch profile for new message
        supabase.from('profiles').select('username, full_name, avatar_url')
          .eq('id', newMsg.sender_id).single()
          .then(({ data }) => {
            if (data) {
              setMessages((prev) => prev.map((m) => m.id === newMsg.id ? { ...m, profiles: data } : m));
            }
          });
        // Mark as read if from someone else
        if (newMsg.sender_id !== user.id && !markedReadRef.current.has(newMsg.id)) {
          markedReadRef.current.add(newMsg.id);
          const newReadBy = [...new Set([...(newMsg.read_by || []), user.id])];
          supabase.from('messages').update({ read_by: newReadBy }).eq('id', newMsg.id);
          setMessages(prev => prev.map(m => m.id === newMsg.id ? { ...m, read_by: newReadBy } : m));
        }
        setTimeout(() => scrollToBottom(), 100);
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'messages' }, (payload) => {
        setMessages((prev) => prev.map((m) => (m.id === payload.new.id ? { ...m, ...payload.new } : m)));
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'messages' }, (payload) => {
        setMessages((prev) => prev.filter((m) => m.id !== payload.old.id));
      })
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState<ChatPresence>();
        setOnlineCount(Object.keys(state).length);
        // Extract typing users
        const typing = new Map<string, string>();
        Object.values(state).forEach((presences) => {
          presences.forEach((p) => {
            if (p.is_typing && p.user_id !== user.id) {
              typing.set(p.user_id, p.display_name || 'Someone');
            }
          });
        });
        setTypingUsers(typing);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            user_id: user.id,
            online_at: new Date().toISOString(),
            is_typing: false,
            display_name: displayName,
          });
        }
      });

    channelRef.current = channel;
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      supabase.removeChannel(channel);
    };
  }, [user, supabase, scrollToBottom]);

  /* ── Mark messages as read on initial load ── */
  useEffect(() => {
    if (loading || !user || messages.length === 0) return;
    const unread = messages.filter(
      m => m.sender_id !== user.id && !m.id.startsWith('temp-') &&
        !(m.read_by || []).includes(user.id) && !markedReadRef.current.has(m.id)
    );
    if (unread.length === 0) return;
    unread.forEach(m => markedReadRef.current.add(m.id));
    setMessages(prev => prev.map(m => {
      if (unread.some(u => u.id === m.id)) {
        return { ...m, read_by: [...new Set([...(m.read_by || []), user.id])] };
      }
      return m;
    }));
    // DB updates (fire-and-forget)
    unread.forEach(m => {
      const newReadBy = [...new Set([...(m.read_by || []), user.id])];
      supabase.from('messages').update({ read_by: newReadBy }).eq('id', m.id);
    });

  }, [loading, messages, supabase, user]);

  /* ── Auto-scroll on first load ── */
  useEffect(() => {
    if (!loading && messages.length > 0) {
      setTimeout(() => scrollToBottom(false), 50);
    }
  }, [loading, scrollToBottom]);

  /* ── Scroll detection ── */
  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    setShowScrollDown(scrollHeight - scrollTop - clientHeight > 150);
  };

  /* ── Typing broadcast ── */
  const broadcastTyping = useCallback((isTyping: boolean) => {
    if (!channelRef.current || !user) return;
    const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'user';
    channelRef.current.track({
      user_id: user.id,
      online_at: new Date().toISOString(),
      is_typing: isTyping,
      display_name: displayName,
    });
  }, [user]);

  /* ── Input change handler ── */
  const handleInputChange = (value: string) => {
    setInput(value);
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
    // Broadcast typing
    broadcastTyping(true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => broadcastTyping(false), 2500);
  };

  /* ── Send ── */
  const handleSend = async () => {
    if ((!input.trim() && !imageFile) || !user) return;
    setSending(true);
    broadcastTyping(false);

    try {
      let imageUrl: string | undefined;
      if (imageFile) {
        const path = `chat/${Date.now()}_${imageFile.name}`;
        // supabase client has differing generic types in some contexts; cast to any to satisfy uploadFile signature
        imageUrl = await uploadFile(supabase as any, 'media', path, imageFile);
      }

      const optimistic: ChatMessage = {
        id: 'temp-' + Date.now(),
        sender_id: user.id,
        content: input.trim(),
        image_url: imageUrl,
        reply_to: replyTo?.id || null,
        reactions: {},
        read_by: [],
        created_at: new Date().toISOString(),
        profiles: { username: user.email?.split('@')[0] || 'user', full_name: '', avatar_url: '' },
      };

      setMessages((prev) => [...prev, optimistic]);
      setInput('');
      setReplyTo(null);
      setImageFile(null);
      setImagePreview(null);
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
      scrollToBottom();

      const { error } = await supabase.from('messages').insert({
        sender_id: user.id,
        content: optimistic.content,
        image_url: imageUrl || null,
        reply_to: replyTo?.id || null,
        reactions: {},
      });

      if (error) {
        setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
        throw error;
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to send');
    } finally {
      setSending(false);
      textareaRef.current?.focus();
    }
  };

  /* ── Reaction (single per user) ── */
  const handleReaction = async (msgId: string, emoji: string) => {
    if (!user) return;
    const msg = messages.find((m) => m.id === msgId);
    if (!msg) return;

    const reactions = { ...(msg.reactions || {}) };
    const current = reactions[emoji] || [];
    const already = current.includes(user.id);

    if (already) {
      reactions[emoji] = current.filter((id: string) => id !== user.id);
      if (reactions[emoji].length === 0) delete reactions[emoji];
    } else {
      Object.keys(reactions).forEach((key) => {
        reactions[key] = (reactions[key] || []).filter((id: string) => id !== user.id);
        if (reactions[key].length === 0) delete reactions[key];
      });
      reactions[emoji] = [...(reactions[emoji] || []), user.id];
    }

    setMessages((prev) => prev.map((m) => (m.id === msgId ? { ...m, reactions } : m)));
    setActiveEmoji(null);
    await supabase.from('messages').update({ reactions }).eq('id', msgId);
  };

  /* ── Delete ── */
  const handleDeleteMessage = async (msgId: string) => {
    try {
      const { error } = await supabase.from('messages').delete().eq('id', msgId);
      if (error) throw error;
      setMessages((prev) => prev.filter((m) => m.id !== msgId));
      toast.success('Message deleted');
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete');
    }
  };

  /* ── Share ── */
  const handleShare = async (msg: ChatMessage) => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Chat Message', text: msg.content });
      } catch { /* user cancelled */ }
    } else {
      navigator.clipboard.writeText(msg.content);
      toast.success('Copied to clipboard');
    }
    setActiveMenuMessage(null);
  };

  /* ── Image select ── */
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return; }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  /* ── Computed ── */
  const filteredMessages = searchQuery
    ? messages.filter((m) => m.content.toLowerCase().includes(searchQuery.toLowerCase()))
    : messages;

  const findReplyMessage = (id: string | null | undefined) => messages.find((m) => m.id === id);
  const typingDisplay = Array.from(typingUsers.values());

  /* ── Not logged in ── */
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <MessageSquare className="text-white/10 mb-4" size={48} />
        <h2 className="text-xl font-heading font-bold text-white mb-2">Chat Access Required</h2>
        <p className="text-white/35 text-sm">Sign in to join the live conversation.</p>
      </div>
    );
  }

  let lastDate = '';

  /* ═══════════════════════════════════════════
     JSX Render
     ═══════════════════════════════════════════ */
  return (
    <div className="max-w-3xl mx-auto py-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-heading font-bold text-white tracking-tight flex items-center gap-2">
            <MessageSquare size={20} className="text-brand-400" />
            General Debate
          </h1>
          <p className="text-white/25 text-xs mt-0.5 flex items-center gap-2">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-soft-pulse" />
              {onlineCount} online
            </span>
            · {messages.length} messages
          </p>
        </div>
        <button
          onClick={() => setShowSearch(!showSearch)}
          className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-colors"
          title="Search messages"
        >
          <Search size={18} />
        </button>
      </div>

      {/* Search */}
      <AnimatePresence>
        {showSearch && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-3">
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="w-full bg-white/3 border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-brand-500/30"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages Area */}
      <div ref={containerRef} onScroll={handleScroll} className="glass-card p-0 overflow-hidden relative">
        <div className="h-[calc(100vh-400px)] md:h-[calc(100vh-320px)] overflow-y-auto custom-scrollbar px-3 py-3 space-y-0.5">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 size={24} className="animate-spin text-brand-400" />
            </div>
          ) : (
            filteredMessages.map((msg) => {
              const msgDate = new Date(msg.created_at).toDateString();
              const showDate = msgDate !== lastDate;
              lastDate = msgDate;
              const replyMsg = findReplyMessage(msg.reply_to);

              return (
                <div key={msg.id}>
                  {showDate && (
                    <div className="flex items-center gap-3 py-3">
                      <div className="flex-1 h-px bg-white/5" />
                      <span className="text-[10px] text-white/20 uppercase tracking-widest font-medium">
                        {getDateLabel(msg.created_at)}
                      </span>
                      <div className="flex-1 h-px bg-white/5" />
                    </div>
                  )}
                  <ChatMessageItem
                    msg={msg}
                    currentUserId={user.id}
                    activeEmoji={activeEmoji}
                    setActiveEmoji={setActiveEmoji}
                    setReplyTo={setReplyTo}
                    handleReaction={handleReaction}
                    replyMsg={replyMsg}
                    onOpenMenu={setActiveMenuMessage}
                    onImageTap={setLightboxImage}
                  />
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Scroll to bottom */}
        <AnimatePresence>
          {showScrollDown && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => scrollToBottom()}
              className="absolute bottom-4 right-4 w-9 h-9 bg-brand-500/90 rounded-full flex items-center justify-center shadow-lg shadow-brand-500/30 hover:scale-110 transition-transform"
            >
              <ArrowDown size={16} className="text-white" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Typing Indicator */}
      <AnimatePresence>
        {typingDisplay.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-2 px-3 py-1.5 text-xs text-white/40">
              <span className="flex gap-0.5">
                <span className="typing-dot w-1.5 h-1.5 bg-brand-400 rounded-full" style={{ animationDelay: '0ms' }} />
                <span className="typing-dot w-1.5 h-1.5 bg-brand-400 rounded-full" style={{ animationDelay: '150ms' }} />
                <span className="typing-dot w-1.5 h-1.5 bg-brand-400 rounded-full" style={{ animationDelay: '300ms' }} />
              </span>
              <span className="italic">
                {typingDisplay.length === 1
                  ? `${typingDisplay[0]} is typing...`
                  : `${typingDisplay.length} people typing...`}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reply Bar */}
      <AnimatePresence>
        {replyTo && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2 bg-brand-500/5 border-l-2 border-brand-500 rounded-t-lg mt-3">
              <Reply size={13} className="text-brand-400" />
              <span className="text-xs text-white/40 truncate flex-1">
                Replying to <span className="text-brand-400">@{replyTo.profiles?.username}</span>: {replyTo.content.slice(0, 60)}
              </span>
              <button onClick={() => setReplyTo(null)} className="text-white/20 hover:text-white transition-colors" title="Close reply">
                <X size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Preview */}
      {imagePreview && (
        <div className="relative inline-block mt-2">
          <img src={sanitizeUrl(imagePreview)} alt="Preview" className="max-h-24 rounded-lg border border-white/8" />
          <button onClick={() => { setImageFile(null); setImagePreview(null); }} className="absolute -top-1.5 -right-1.5 bg-surface-200 border border-white/8 p-1 rounded-full text-white/40 hover:text-white" title="Remove image">
            <X size={10} />
          </button>
        </div>
      )}

      {/* Input Area (auto-growing textarea) */}
      <div className={`flex items-end gap-2 mt-3 glass-card p-2 ${replyTo && !imagePreview ? 'rounded-t-none' : ''}`}>
        <label className="p-2 text-white/25 hover:text-white/50 cursor-pointer transition-colors self-end">
          <ImagePlus size={18} />
          <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" aria-label="Upload image" />
        </label>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
          }}
          placeholder="Type your message..."
          rows={1}
          className="flex-1 bg-transparent outline-none text-sm text-white placeholder:text-white/20 px-1 resize-none max-h-[120px] custom-scrollbar leading-relaxed py-1.5"
        />
        <button
          onClick={handleSend}
          disabled={sending || (!input.trim() && !imageFile)}
          className="p-2.5 bg-gradient-to-r from-brand-500 to-accent-500 rounded-lg text-white disabled:opacity-20 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-brand-500/15 self-end"
        >
          {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
        </button>
      </div>

      {/* ═══ Action Menu Drawer ═══ */}
      <AnimatePresence>
        {activeMenuMessage && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setActiveMenuMessage(null)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-end md:items-center justify-center"
          >
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%', scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full md:max-w-md bg-surface-200/95 backdrop-blur-xl border-t md:border border-white/10 rounded-t-2xl md:rounded-2xl p-4 shadow-2xl z-50 max-h-[85vh] overflow-y-auto"
            >
              <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-4 md:hidden" />

              {/* Sender Header */}
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/5">
                <div className="w-9 h-9 rounded-full bg-surface-300 flex items-center justify-center text-xs font-bold text-white/40 overflow-hidden">
                  {activeMenuMessage.profiles?.avatar_url ? (
                    <img src={sanitizeUrl(activeMenuMessage.profiles.avatar_url)} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <User size={18} className="text-white/40" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-white/80 truncate">
                    {activeMenuMessage.profiles?.full_name || activeMenuMessage.profiles?.username || 'user'}
                  </div>
                  <div className="text-[10px] text-white/35 truncate mt-0.5">{activeMenuMessage.content}</div>
                </div>
                <button onClick={() => setActiveMenuMessage(null)} className="p-1.5 rounded-full hover:bg-white/5 text-white/40 hover:text-white transition-colors">
                  <X size={16} />
                </button>
              </div>

              {/* Quick Reactions */}
              <div className="mb-4">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-white/30 block mb-2 px-1">Reactions</span>
                <div className="flex items-center justify-between bg-white/3 border border-white/5 rounded-xl p-2 overflow-x-auto gap-2 scrollbar-none">
                  {CHAT_EMOJIS.map((emoji) => {
                    const isReacted = ((activeMenuMessage.reactions?.[emoji] || []) as string[]).includes(user.id);
                    return (
                      <button
                        key={emoji}
                        onClick={() => { handleReaction(activeMenuMessage.id, emoji); setActiveMenuMessage(null); }}
                        className={`text-2xl p-2 rounded-lg hover:bg-white/5 active:scale-125 transition-all flex-1 min-w-[40px] flex justify-center items-center ${isReacted ? 'bg-brand-500/20 border border-brand-500/30' : 'border border-transparent'}`}
                      >
                        {emoji}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-white/30 block mb-2 px-1">Actions</span>

                <button onClick={() => { setReplyTo(activeMenuMessage); setActiveMenuMessage(null); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-all text-sm font-medium">
                  <Reply size={16} className="text-brand-400" /> Reply
                </button>

                <button onClick={() => { navigator.clipboard.writeText(activeMenuMessage.content); toast.success('Copied!'); setActiveMenuMessage(null); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-all text-sm font-medium">
                  <Copy size={16} className="text-blue-400" /> Copy Text
                </button>

                <button onClick={() => handleShare(activeMenuMessage)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-all text-sm font-medium">
                  <Share2 size={16} className="text-green-400" /> Share
                </button>

                <button onClick={() => { setInfoMessage(activeMenuMessage); setActiveMenuMessage(null); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-all text-sm font-medium">
                  <Info size={16} className="text-purple-400" /> Message Info
                </button>

                {activeMenuMessage.sender_id === user.id && (
                  <button onClick={() => { handleDeleteMessage(activeMenuMessage.id); setActiveMenuMessage(null); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all text-sm font-medium">
                    <Trash2 size={16} /> Delete Message
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ Message Info Panel ═══ */}
      <AnimatePresence>
        {infoMessage && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setInfoMessage(null)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-end md:items-center justify-center"
          >
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full md:max-w-md bg-surface-200/95 backdrop-blur-xl border-t md:border border-white/10 rounded-t-2xl md:rounded-2xl p-5 shadow-2xl z-50 max-h-[85vh] overflow-y-auto"
            >
              <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-4 md:hidden" />

              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-heading font-bold text-white flex items-center gap-2">
                  <Info size={16} className="text-purple-400" /> Message Info
                </h3>
                <button onClick={() => setInfoMessage(null)} className="p-1.5 rounded-full hover:bg-white/5 text-white/40 hover:text-white transition-colors">
                  <X size={16} />
                </button>
              </div>

              {/* Sender */}
              <div className="flex items-center gap-3 p-3 bg-white/3 rounded-xl mb-3">
                <div className="w-10 h-10 rounded-full bg-surface-300 flex items-center justify-center overflow-hidden">
                  {infoMessage.profiles?.avatar_url ? (
                    <img src={sanitizeUrl(infoMessage.profiles.avatar_url)} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <User size={20} className="text-white/40" />
                  )}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white/90">{infoMessage.profiles?.full_name || 'Unknown'}</div>
                  <div className="text-xs text-white/40">@{infoMessage.profiles?.username || 'user'}</div>
                </div>
              </div>

              {/* Content Preview */}
              {infoMessage.content && (
                <div className="p-3 bg-white/3 rounded-xl mb-3">
                  <p className="text-xs text-white/60 leading-relaxed">{infoMessage.content}</p>
                </div>
              )}

              {/* Timestamp */}
              <div className="p-3 bg-white/3 rounded-xl mb-3">
                <div className="text-[10px] uppercase tracking-wider font-semibold text-white/30 mb-1">Sent</div>
                <div className="text-xs text-white/70">
                  {new Date(infoMessage.created_at).toLocaleString([], {
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                    hour: 'numeric', minute: '2-digit', second: '2-digit',
                  })}
                </div>
              </div>

              {/* Read By */}
              <div className="p-3 bg-white/3 rounded-xl mb-3">
                <div className="text-[10px] uppercase tracking-wider font-semibold text-white/30 mb-1 flex items-center gap-1">
                  <CheckCheck size={12} className="text-sky-400" />
                  Read by {(infoMessage.read_by || []).length} {(infoMessage.read_by || []).length === 1 ? 'person' : 'people'}
                </div>
                {(infoMessage.read_by || []).length === 0 && (
                  <div className="text-xs text-white/30 italic">No read receipts yet</div>
                )}
              </div>

              {/* Reactions Summary */}
              {infoMessage.reactions && Object.keys(infoMessage.reactions).length > 0 && (
                <div className="p-3 bg-white/3 rounded-xl">
                  <div className="text-[10px] uppercase tracking-wider font-semibold text-white/30 mb-2">Reactions</div>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(infoMessage.reactions).map(([emoji, users]) => (
                      <div key={emoji} className="flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-lg text-sm">
                        {emoji} <span className="text-xs text-white/50">{(users as string[]).length}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ Image Lightbox ═══ */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
            className="fixed inset-0 bg-black/95 z-[60] flex items-center justify-center p-4"
          >
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-white/10 text-white/70 hover:text-white hover:bg-white/20 transition-colors z-10"
            >
              <X size={22} />
            </button>
            <motion.img
              initial={{ scale: 0.85 }} animate={{ scale: 1 }} exit={{ scale: 0.85 }}
              src={lightboxImage}
              alt="Full preview"
              className="max-w-full max-h-full object-contain rounded-xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════
   ChatMessageItem — Telegram-style bubble
   ═══════════════════════════════════════════ */
interface ChatMessageItemProps {
  msg: ChatMessage;
  currentUserId: string;
  activeEmoji: string | null;
  setActiveEmoji: (id: string | null) => void;
  setReplyTo: (msg: ChatMessage) => void;
  handleReaction: (msgId: string, emoji: string) => Promise<void>;
  replyMsg: ChatMessage | undefined;
  onOpenMenu: (msg: ChatMessage) => void;
  onImageTap: (url: string) => void;
}

function ChatMessageItem({
  msg, currentUserId, activeEmoji, setActiveEmoji,
  setReplyTo, handleReaction, replyMsg, onOpenMenu, onImageTap,
}: ChatMessageItemProps) {
  const isOwn = msg.sender_id === currentUserId;
  const x = useMotionValue(0);
  const replyOpacity = useTransform(x, isOwn ? [0, -60] : [0, 60], [0, 1]);
  const replyScale = useTransform(x, isOwn ? [0, -60] : [0, 60], [0.6, 1.1]);

  const readCount = (msg.read_by || []).length;
  const isRead = readCount > 0;

  const handleDragEnd = (_: any, info: any) => {
    if (isOwn) {
      if (info.offset.x < -40) setReplyTo(msg);
    } else {
      if (info.offset.x > 40) setReplyTo(msg);
    }
  };

  return (
    <div className={`relative group/item flex items-end gap-1 ${isOwn ? 'justify-end' : 'justify-start'} mb-0.5`}>

      {/* Swipe reply indicator */}
      <div className={`absolute ${isOwn ? 'right-2' : 'left-9'} top-1/2 -translate-y-1/2 pointer-events-none z-0`}>
        <motion.div
          style={{ opacity: replyOpacity, scale: replyScale }}
          className="w-7 h-7 rounded-full bg-brand-500/20 text-brand-400 border border-brand-500/30 flex items-center justify-center"
        >
          <Reply size={14} />
        </motion.div>
      </div>

      {/* Desktop hover actions — before bubble for own messages */}
      {isOwn && (
        <div className="hidden md:flex items-center gap-0.5 opacity-0 group-hover/item:opacity-100 transition-opacity order-first"
          onClick={(e) => e.stopPropagation()} onPointerDown={(e) => e.stopPropagation()}>
          <button onClick={() => setReplyTo(msg)} className="p-1 rounded-md hover:bg-white/10 text-white/15 hover:text-white/60 transition-colors" title="Reply">
            <Reply size={12} />
          </button>
          <button onClick={() => setActiveEmoji(activeEmoji === msg.id ? null : msg.id)} className="p-1 rounded-md hover:bg-white/10 text-white/15 hover:text-white/60 transition-colors" title="React">
            <Smile size={12} />
          </button>
        </div>
      )}

      {/* Avatar (others only) */}
      {!isOwn && (
        <div className="w-7 h-7 rounded-full bg-surface-300 flex items-center justify-center flex-shrink-0 mb-0.5 overflow-hidden"
          onClick={(e) => e.stopPropagation()}>
          {msg.profiles?.avatar_url ? (
            <img src={sanitizeUrl(msg.profiles.avatar_url)} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <User size={12} className="text-white/40" />
          )}
        </div>
      )}

      {/* Draggable Bubble */}
      <div className="relative max-w-[78%] md:max-w-[60%]">
        <motion.div
          drag="x"
          dragConstraints={isOwn ? { left: -80, right: 0 } : { left: 0, right: 80 }}
          dragElastic={isOwn ? { left: 0.5, right: 0.1 } : { left: 0.1, right: 0.5 }}
          dragSnapToOrigin
          style={{ x }}
          onDragEnd={handleDragEnd}
          onClick={() => onOpenMenu(msg)}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className={`relative z-10 px-3 py-1.5 cursor-pointer select-none
            ${isOwn
              ? 'bg-gradient-to-br from-brand-500/90 to-accent-500/75 rounded-2xl rounded-br-[4px] text-white shadow-md shadow-brand-500/10'
              : 'bg-white/[0.05] border border-white/[0.08] rounded-2xl rounded-bl-[4px] text-white/85'
            }`}
        >
          {/* Sender name (others only) */}
          {!isOwn && (
            <div className="text-[10px] font-semibold text-brand-400 mb-0.5 truncate">
              {msg.profiles?.full_name || msg.profiles?.username || 'user'}
            </div>
          )}

          {/* Reply reference */}
          {replyMsg && (
            <div
              className={`flex items-center gap-1 text-[10px] mb-1 px-2 py-1 rounded-lg border-l-2 truncate
                ${isOwn ? 'bg-white/10 border-white/40 text-white/70' : 'bg-white/[0.04] border-brand-400/50 text-white/40'}`}
              onClick={(e) => e.stopPropagation()}
            >
              <Reply size={9} />
              <span className="font-medium">@{replyMsg.profiles?.username}</span>
              <span className="truncate">{replyMsg.content}</span>
            </div>
          )}

          {/* Content */}
          {msg.content && (
            <p className="text-[13px] leading-relaxed break-words whitespace-pre-wrap">{msg.content}</p>
          )}

          {/* Image */}
          {msg.image_url && (
            <img
              src={sanitizeUrl(msg.image_url)} alt="Attachment"
              className="mt-1.5 max-h-48 rounded-xl cursor-pointer"
              loading="lazy"
              onClick={(e) => { e.stopPropagation(); onImageTap(sanitizeUrl(msg.image_url!)); }}
            />
          )}

          {/* Timestamp + Read status */}
          <div className="flex items-center gap-1 justify-end mt-0.5">
            <span className={`text-[9px] ${isOwn ? 'text-white/50' : 'text-white/25'}`}>
              {formatTimestamp(msg.created_at)}
            </span>
            {isOwn && (
              isRead
                ? <CheckCheck size={13} className="text-sky-300" />
                : <Check size={13} className="text-white/40" />
            )}
          </div>

          {/* Reactions (inside bubble) */}
          {msg.reactions && Object.keys(msg.reactions).length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1 -mb-0.5" onClick={(e) => e.stopPropagation()} onPointerDown={(e) => e.stopPropagation()}>
              {Object.entries(msg.reactions).map(([emoji, users]) => (
                <button key={emoji} onClick={() => handleReaction(msg.id, emoji)}
                  className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] transition-all
                    ${(users as string[]).includes(currentUserId)
                      ? 'bg-brand-500/25 border border-brand-500/40'
                      : isOwn ? 'bg-black/15 border border-white/15' : 'bg-white/5 border border-white/8'
                    }`}>
                  {emoji} {(users as string[]).length}
                </button>
              ))}
            </div>
          )}

          {/* Inline Emoji picker (inside bubble flow) */}
          <AnimatePresence>
            {activeEmoji === msg.id && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex gap-1 mt-1.5 bg-surface-200 border border-white/8 rounded-lg p-1.5 w-fit"
                onClick={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
              >
                {CHAT_EMOJIS.map((emoji) => (
                  <button key={emoji} onClick={() => handleReaction(msg.id, emoji)} className="text-lg hover:scale-130 transition-transform p-0.5">
                    {emoji}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Desktop hover actions — after bubble for others' messages */}
      {!isOwn && (
        <div className="hidden md:flex items-center gap-0.5 opacity-0 group-hover/item:opacity-100 transition-opacity"
          onClick={(e) => e.stopPropagation()} onPointerDown={(e) => e.stopPropagation()}>
          <button onClick={() => setReplyTo(msg)} className="p-1 rounded-md hover:bg-white/10 text-white/15 hover:text-white/60 transition-colors" title="Reply">
            <Reply size={12} />
          </button>
          <button onClick={() => setActiveEmoji(activeEmoji === msg.id ? null : msg.id)} className="p-1 rounded-md hover:bg-white/10 text-white/15 hover:text-white/60 transition-colors" title="React">
            <Smile size={12} />
          </button>
        </div>
      )}
    </div>
  );
}
