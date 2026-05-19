'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Loader2, ImagePlus, X, Search, Reply, Smile,
  Users, MessageSquare, ArrowDown,
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { getSupabaseClient } from '@/lib/supabase/client';
import { CHAT_EMOJIS } from '@/lib/constants';
import { formatTimestamp, getDateLabel, uploadFile, getInitials } from '@/lib/utils';
import { toast } from 'sonner';
import type { ChatMessage } from '@/lib/types';

export default function LiveChatRoom() {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);
  const [activeEmoji, setActiveEmoji] = useState<string | null>(null);
  const [onlineCount, setOnlineCount] = useState(0);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const supabase = getSupabaseClient();

  const scrollToBottom = useCallback((smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'instant' });
  }, []);

  // Fetch messages
  const fetchMessages = useCallback(async () => {
    try {
      const { data } = await supabase
        .from('messages')
        .select('*, profiles(username, avatar_url)')
        .order('created_at', { ascending: true })
        .limit(200);
      setMessages(data || []);
    } catch (err) {
      console.error('Error loading messages:', err);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Realtime + Presence
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('chat_room')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        const newMsg = payload.new as ChatMessage;
        setMessages((prev) => {
          if (prev.some((m) => m.id === newMsg.id)) return prev;
          return [...prev, newMsg];
        });
        // Fetch profile info for the new message
        supabase
          .from('profiles')
          .select('username, avatar_url')
          .eq('id', newMsg.sender_id)
          .single()
          .then(({ data }) => {
            if (data) {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === newMsg.id ? { ...m, profiles: data } : m
                )
              );
            }
          });
        setTimeout(() => scrollToBottom(), 100);
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'messages' }, (payload) => {
        setMessages((prev) => prev.map((m) => (m.id === payload.new.id ? { ...m, ...payload.new } : m)));
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'messages' }, (payload) => {
        setMessages((prev) => prev.filter((m) => m.id !== payload.old.id));
      })
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        setOnlineCount(Object.keys(state).length);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ user_id: user.id, online_at: new Date().toISOString() });
        }
      });

    return () => { supabase.removeChannel(channel); };
  }, [user, supabase, scrollToBottom]);

  // Auto-scroll on first load
  useEffect(() => {
    if (!loading && messages.length > 0) {
      setTimeout(() => scrollToBottom(false), 50);
    }
  }, [loading, scrollToBottom]);

  // Scroll detection
  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    setShowScrollDown(scrollHeight - scrollTop - clientHeight > 150);
  };

  const handleSend = async () => {
    if ((!input.trim() && !imageFile) || !user) return;
    setSending(true);

    try {
      let imageUrl: string | undefined;
      if (imageFile) {
        const path = `chat/${Date.now()}_${imageFile.name}`;
        imageUrl = await uploadFile(supabase as any, 'media', path, imageFile);
      }

      // Optimistic message
      const optimistic: ChatMessage = {
        id: 'temp-' + Date.now(),
        sender_id: user.id,
        content: input.trim(),
        image_url: imageUrl,
        reply_to: replyTo?.id || null,
        reactions: {},
        created_at: new Date().toISOString(),
        profiles: { username: user.email?.split('@')[0] || 'user', avatar_url: '' },
      };

      setMessages((prev) => [...prev, optimistic]);
      setInput('');
      setReplyTo(null);
      setImageFile(null);
      setImagePreview(null);
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
      inputRef.current?.focus();
    }
  };

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
      reactions[emoji] = [...current, user.id];
    }

    setMessages((prev) => prev.map((m) => (m.id === msgId ? { ...m, reactions } : m)));
    setActiveEmoji(null);
    await supabase.from('messages').update({ reactions }).eq('id', msgId);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return; }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const filteredMessages = searchQuery
    ? messages.filter((m) => m.content.toLowerCase().includes(searchQuery.toLowerCase()))
    : messages;

  const findReplyMessage = (id: string | null | undefined) => messages.find((m) => m.id === id);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <MessageSquare className="text-white/10 mb-4" size={48} />
        <h2 className="text-xl font-heading font-bold text-white mb-2">Chat Access Required</h2>
        <p className="text-white/35 text-sm">Sign in to join the live conversation.</p>
      </div>
    );
  }

  // Group messages by date
  let lastDate = '';

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
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-3"
          >
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
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="glass-card p-0 overflow-hidden relative"
      >
        <div className="h-[calc(100vh-320px)] overflow-y-auto custom-scrollbar px-4 py-3 space-y-0.5">
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

                  <motion.div
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="group flex gap-2.5 py-1.5 hover:bg-white/[0.02] rounded-lg px-2 -mx-2 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-surface-300 flex items-center justify-center text-[10px] font-bold text-white/40 flex-shrink-0 mt-0.5">
                      {getInitials(msg.profiles?.username)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white/80">
                          {msg.profiles?.username || 'user'}
                        </span>
                        <span className="text-[10px] text-white/15">{formatTimestamp(msg.created_at)}</span>

                        {/* Hover actions */}
                        <div className="ml-auto flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => setReplyTo(msg)} className="p-1 rounded hover:bg-white/10 text-white/20 hover:text-white transition-colors" title="Reply">
                            <Reply size={12} />
                          </button>
                          <button onClick={() => setActiveEmoji(activeEmoji === msg.id ? null : msg.id)} className="p-1 rounded hover:bg-white/10 text-white/20 hover:text-white transition-colors" title="React">
                            <Smile size={12} />
                          </button>
                        </div>
                      </div>

                      {/* Reply reference */}
                      {replyMsg && (
                        <div className="flex items-center gap-1.5 text-[10px] text-white/25 mt-0.5 mb-1">
                          <Reply size={10} className="text-brand-400/50" />
                          <span className="font-medium text-brand-400/60">@{replyMsg.profiles?.username}</span>
                          <span className="truncate max-w-[200px]">{replyMsg.content}</span>
                        </div>
                      )}

                      <p className="text-[13px] text-white/65 leading-relaxed break-words">{msg.content}</p>

                      {msg.image_url && (
                        <img src={msg.image_url} alt="Attachment" className="mt-2 max-h-60 rounded-xl border border-white/5" loading="lazy" />
                      )}

                      {/* Reactions */}
                      {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {Object.entries(msg.reactions).map(([emoji, users]) => (
                            <button
                              key={emoji}
                              onClick={() => handleReaction(msg.id, emoji)}
                              className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] transition-all ${
                                (users as string[]).includes(user!.id)
                                  ? 'bg-brand-500/15 border border-brand-500/30 text-brand-300'
                                  : 'bg-white/3 border border-white/5 text-white/30 hover:bg-white/5'
                              }`}
                            >
                              {emoji} {(users as string[]).length}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Emoji picker */}
                      <AnimatePresence>
                        {activeEmoji === msg.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="flex gap-1 mt-1.5 bg-surface-200 border border-white/8 rounded-lg p-1.5 w-fit"
                          >
                            {CHAT_EMOJIS.map((emoji) => (
                              <button key={emoji} onClick={() => handleReaction(msg.id, emoji)} className="text-lg hover:scale-130 transition-transform p-0.5">
                                {emoji}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Scroll to bottom button */}
        <AnimatePresence>
          {showScrollDown && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => scrollToBottom()}
              className="absolute bottom-20 right-4 w-9 h-9 bg-brand-500/90 rounded-full flex items-center justify-center shadow-lg shadow-brand-500/30 hover:scale-110 transition-transform"
            >
              <ArrowDown size={16} className="text-white" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Reply Bar */}
      <AnimatePresence>
        {replyTo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
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
          <img src={imagePreview} alt="Preview" className="max-h-24 rounded-lg border border-white/8" />
          <button onClick={() => { setImageFile(null); setImagePreview(null); }} className="absolute -top-1.5 -right-1.5 bg-surface-200 border border-white/8 p-1 rounded-full text-white/40 hover:text-white" title="Remove image">
            <X size={10} />
          </button>
        </div>
      )}

      {/* Input */}
      <div className={`flex items-center gap-2 mt-3 glass-card p-2 ${replyTo && !imagePreview ? 'rounded-t-none' : ''}`}>
        <label className="p-2 text-white/25 hover:text-white/50 cursor-pointer transition-colors">
          <ImagePlus size={18} />
          <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" aria-label="Upload image" />
        </label>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
          placeholder="Type your message..."
          className="flex-1 bg-transparent outline-none text-sm text-white placeholder:text-white/20 px-1"
        />
        <button
          onClick={handleSend}
          disabled={sending || (!input.trim() && !imageFile)}
          className="p-2.5 bg-gradient-to-r from-brand-500 to-accent-500 rounded-lg text-white disabled:opacity-20 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-brand-500/15"
        >
          {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
        </button>
      </div>
    </div>
  );
}
