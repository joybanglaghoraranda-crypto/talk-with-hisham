import React, { useState, useEffect, useRef, useCallback } from 'react';
import { supabase, uploadFile } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Send, Hash, Users, Shield, Image as ImageIcon, X, Smile, Reply, CornerDownRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface Message {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
  image_url?: string;
  reactions?: Record<string, string[]>;
  reply_to?: string | null;
  profiles?: {
    username: string;
    avatar_url: string;
  };
}

const REACTION_EMOJIS = ['👍', '❤️', '😂', '😮', '😢'];

const LiveChatRoom: React.FC = () => {
  const { user, isConfigured } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [showReactionsFor, setShowReactionsFor] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isConfigured) return;

    const channel = supabase
      .channel('public_chat')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'messages' },
        async (payload) => {
          if (payload.eventType === 'INSERT') {
            const newMsg = payload.new as Message;
            const { data: profile } = await supabase
              .from('profiles')
              .select('username, avatar_url')
              .eq('id', newMsg.sender_id)
              .single();

            newMsg.profiles = profile || { username: 'Anonymous', avatar_url: '' };
            setMessages((prev) => {
              if (prev.find(m => m.id === newMsg.id)) return prev;
              return [...prev, newMsg];
            });
          } else if (payload.eventType === 'UPDATE') {
            const updatedMsg = payload.new as Message;
            setMessages(prev => prev.map(m => m.id === updatedMsg.id ? { ...m, reactions: updatedMsg.reactions } : m));
          }
        }
      )
      .subscribe();

    fetchMessages();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isConfigured]);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*, profiles(username, avatar_url)')
        .order('created_at', { ascending: true })
        .limit(200);

      if (error) {
        console.error('Fetch error:', error);
        return;
      }
      if (data) setMessages(data as any);
    } catch (err) {
      console.error('Fetch messages failed:', err);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be under 5MB');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleReact = async (messageId: string, emoji: string) => {
    if (!user) {
      toast.error('Please sign in to react');
      return;
    }

    const msg = messages.find(m => m.id === messageId);
    if (!msg) return;

    const currentReactions = msg.reactions || {};
    const hasReacted = currentReactions[emoji]?.includes(user.id);
    const newReactions = { ...currentReactions };

    // Remove user's reaction from all emojis
    Object.keys(newReactions).forEach(key => {
      newReactions[key] = newReactions[key].filter(id => id !== user.id);
      if (newReactions[key].length === 0) delete newReactions[key];
    });

    if (!hasReacted) {
      newReactions[emoji] = [...(newReactions[emoji] || []), user.id];
    }

    // Optimistic UI
    setMessages(prev => prev.map(m => m.id === messageId ? { ...m, reactions: newReactions } : m));
    setShowReactionsFor(null);

    if (isConfigured) {
      try {
        await supabase.from('messages').update({ reactions: newReactions }).eq('id', messageId);
      } catch (err) {
        console.error('Reaction failed:', err);
      }
    }
  };

  const handleReply = useCallback((msg: Message) => {
    setReplyTo(msg);
    inputRef.current?.focus();
  }, []);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!newMessage.trim() && !imageFile) || sending) return;

    if (!user) {
      toast.error('Please sign in to send messages');
      return;
    }

    setSending(true);
    const messageContent = newMessage;
    const replyToId = replyTo?.id || null;
    setNewMessage('');
    setReplyTo(null);

    const msgId = crypto.randomUUID();

    try {
      let imageUrl = null;
      if (imageFile) {
        try {
          const path = `chat/${user.id}/${Date.now()}-${imageFile.name}`;
          imageUrl = await uploadFile('media', path, imageFile);
        } catch (err) {
          console.error('Upload error:', err);
          toast.error('Failed to upload image');
        }
      }

      // Optimistically update UI
      setMessages(prev => [...prev, {
        id: msgId,
        sender_id: user.id,
        content: messageContent,
        created_at: new Date().toISOString(),
        image_url: imageUrl || undefined,
        reply_to: replyToId,
        profiles: {
          username: user.email?.split('@')[0] || 'You',
          avatar_url: ''
        }
      }]);

      const { error } = await supabase.from('messages').insert([
        { id: msgId, content: messageContent, sender_id: user.id, image_url: imageUrl, reply_to: replyToId }
      ]);

      if (error) {
        setMessages(prev => prev.filter(m => m.id !== msgId));
        console.error('Insert error:', error);
        setNewMessage(messageContent);
        toast.error('Failed to send — ' + (error.message || 'unknown error'));
        return;
      }

      setImageFile(null);
      setImagePreview(null);
    } catch (err: any) {
      setMessages(prev => prev.filter(m => m.id !== msgId));
      console.error(err);
      setNewMessage(messageContent);
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;

    // Show time for today
    const isToday = date.toDateString() === now.toDateString();
    if (isToday) {
      return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    }

    // Show date + time for older
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) +
      ' ' + date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };

  // Group messages by date
  const getDateLabel = (dateStr: string) => {
    const d = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (d.toDateString() === today.toDateString()) return 'Today';
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return d.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
  };

  const getReplyMessage = (replyId: string | null | undefined) => {
    if (!replyId) return null;
    return messages.find(m => m.id === replyId) || null;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between bg-black/40 backdrop-blur-xl border border-white/10 rounded-t-2xl px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/30 to-rose-500/30 flex items-center justify-center text-orange-400 border border-orange-500/20">
            <Hash size={18} />
          </div>
          <div>
            <h2 className="font-bold text-white text-sm">General Debate</h2>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <p className="text-[10px] text-white/40 uppercase tracking-wider font-medium">Live • {messages.length} messages</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-white/30">
          <Users size={16} />
          <span className="text-xs">{user ? '2+' : '1'} online</span>
        </div>
      </div>

      {/* Messages Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-1 bg-black/20 backdrop-blur-md border-x border-white/10 custom-scrollbar"
      >
        {/* Welcome Note */}
        <div className="bg-gradient-to-r from-orange-500/8 to-rose-500/8 border border-white/5 rounded-2xl p-5 mb-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Hash size={32} />
          </div>
          <h3 className="text-base font-bold mb-1 text-orange-400">Welcome to General Debate</h3>
          <p className="text-white/40 text-xs leading-relaxed max-w-lg">
            Share your insights, respect the discourse, and explore new perspectives together.
          </p>
        </div>

        {messages.length === 0 && (
          <div className="text-center py-16 space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mx-auto border border-white/10">
              <Smile className="text-white/20" size={24} />
            </div>
            <p className="text-white/25 italic text-sm">Be the first to start the debate.</p>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => {
            const isOwn = user && msg.sender_id === user.id;
            const prevMsg = idx > 0 ? messages[idx - 1] : null;
            const showDateSep = !prevMsg || getDateLabel(msg.created_at) !== getDateLabel(prevMsg.created_at);
            const repliedMsg = getReplyMessage(msg.reply_to);

            return (
              <React.Fragment key={msg.id}>
                {/* Date Separator */}
                {showDateSep && (
                  <div className="flex items-center justify-center py-3">
                    <div className="bg-white/10 backdrop-blur-sm px-4 py-1 rounded-full border border-white/5">
                      <span className="text-[10px] text-white/40 font-semibold uppercase tracking-wider">
                        {getDateLabel(msg.created_at)}
                      </span>
                    </div>
                  </div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15 }}
                  className={`flex gap-2.5 group relative py-1 ${isOwn ? 'flex-row-reverse' : ''}`}
                  onMouseLeave={() => setShowReactionsFor(null)}
                >
                  <Avatar className="w-8 h-8 border border-white/10 shadow-md flex-shrink-0 mt-1">
                    <AvatarImage src={msg.profiles?.avatar_url} />
                    <AvatarFallback className="bg-neutral-800 text-[10px] text-orange-300">
                      {msg.profiles?.username?.[0]?.toUpperCase() ?? 'U'}
                    </AvatarFallback>
                  </Avatar>

                  <div className={`space-y-0.5 max-w-[70%] ${isOwn ? 'items-end' : ''}`}>
                    {/* Name & Time */}
                    <div className={`flex items-center gap-2 ${isOwn ? 'flex-row-reverse' : ''}`}>
                      <span className="font-semibold text-[11px] text-orange-200/80">
                        {isOwn ? 'You' : (msg.profiles?.username ?? 'Anonymous')}
                      </span>
                      <span className="text-[9px] text-white/20">{formatTime(msg.created_at)}</span>
                    </div>

                    <div className={`relative inline-flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
                      {/* Action Buttons (React + Reply) */}
                      <div className={`absolute -top-8 opacity-0 group-hover:opacity-100 transition-all z-20 flex items-center gap-0.5 ${
                        isOwn ? 'right-0' : 'left-0'
                      }`}>
                        {user && (
                          <>
                            <button
                              onClick={() => setShowReactionsFor(showReactionsFor === msg.id ? null : msg.id)}
                              className="bg-neutral-900 border border-white/10 rounded-lg p-1.5 hover:bg-white/10 transition-colors shadow-xl"
                              title="React"
                            >
                              <Smile size={14} className="text-white/50" />
                            </button>
                            <button
                              onClick={() => handleReply(msg)}
                              className="bg-neutral-900 border border-white/10 rounded-lg p-1.5 hover:bg-white/10 transition-colors shadow-xl"
                              title="Reply"
                            >
                              <Reply size={14} className="text-white/50" />
                            </button>
                          </>
                        )}
                      </div>

                      {/* Reaction Picker Popup */}
                      <AnimatePresence>
                        {showReactionsFor === msg.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: -5 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: -5 }}
                            className={`absolute -top-16 z-30 bg-neutral-900 border border-white/10 rounded-full shadow-2xl px-2 py-1.5 flex gap-1 ${
                              isOwn ? 'right-0' : 'left-0'
                            }`}
                          >
                            {REACTION_EMOJIS.map(emoji => (
                              <button
                                key={emoji}
                                onClick={() => handleReact(msg.id, emoji)}
                                className="hover:scale-130 transition-transform text-lg p-0.5 hover:bg-white/10 rounded-md"
                                title={`React with ${emoji}`}
                              >
                                {emoji}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Reply Reference */}
                      {repliedMsg && (
                        <div className={`flex items-start gap-1.5 px-3 py-1.5 bg-white/5 border-l-2 border-orange-500/40 rounded-lg text-[11px] text-white/40 mb-1 max-w-full ${isOwn ? 'ml-auto' : ''}`}>
                          <CornerDownRight size={10} className="mt-0.5 flex-shrink-0 text-orange-400/40" />
                          <div className="min-w-0">
                            <span className="text-orange-400/60 font-semibold">{repliedMsg.profiles?.username || 'User'}</span>
                            <p className="truncate">{repliedMsg.content || '📷 Image'}</p>
                          </div>
                        </div>
                      )}

                      {/* Message Content */}
                      {msg.content && (
                        <div className={`text-white/85 text-sm leading-relaxed p-3 ${
                          isOwn
                            ? 'bg-orange-500/15 rounded-2xl rounded-tr-sm border border-orange-500/10 text-left'
                            : 'bg-white/5 rounded-2xl rounded-tl-sm border border-white/5'
                        }`}>
                          {msg.content}
                        </div>
                      )}

                      {/* Image */}
                      {msg.image_url && (
                        <div className="mt-1 rounded-xl overflow-hidden border border-white/10 max-w-xs shadow-xl">
                          <img src={msg.image_url} alt="Shared" className="w-full h-auto object-cover max-h-64" />
                        </div>
                      )}

                      {/* Reactions Display */}
                      {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                        <div className={`flex items-center gap-1 mt-1 ${isOwn ? 'justify-end' : ''}`}>
                          {Object.entries(msg.reactions).map(([emoji, userIds]) => (
                            <button
                              key={emoji}
                              onClick={() => handleReact(msg.id, emoji)}
                              className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border transition-all hover:scale-105 ${
                                userIds.includes(user?.id || '')
                                  ? 'bg-orange-500/15 border-orange-500/30 text-orange-300'
                                  : 'bg-neutral-900 border-white/10 text-white/60'
                              }`}
                            >
                              <span>{emoji}</span>
                              <span className="font-medium text-[10px]">{userIds.length}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </React.Fragment>
            );
          })}
        </AnimatePresence>
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 bg-black/40 backdrop-blur-xl border border-white/10 border-t-0 rounded-b-2xl px-4 py-3 space-y-2">
        {/* Reply Preview */}
        <AnimatePresence>
          {replyTo && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="flex items-center gap-2 bg-white/5 border-l-2 border-orange-500 rounded-lg px-3 py-2 mb-2">
                <Reply size={12} className="text-orange-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-orange-400 font-semibold">Replying to {replyTo.profiles?.username || 'User'}</p>
                  <p className="text-xs text-white/40 truncate">{replyTo.content || '📷 Image'}</p>
                </div>
                <button onClick={() => setReplyTo(null)} aria-label="Cancel reply" className="text-white/30 hover:text-white p-0.5">
                  <X size={14} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Image Preview */}
        {imagePreview && (
          <div className="relative inline-block">
            <img src={imagePreview} alt="Image preview" className="h-16 w-auto max-w-[160px] object-cover rounded-lg border border-white/20 shadow-lg" />
            <button
              onClick={() => { setImageFile(null); setImagePreview(null); }}
              aria-label="Remove image preview"
              className="absolute -top-1.5 -right-1.5 bg-rose-500 rounded-full p-0.5 shadow-lg hover:scale-110 transition-transform"
            >
              <X size={10} className="text-white" />
            </button>
          </div>
        )}

        {!user && (
          <p className="text-center text-xs text-orange-400/60 py-1">
            Sign in to join the conversation
          </p>
        )}

        <form onSubmit={sendMessage} className="flex gap-2">
          <label className="cursor-pointer bg-white/5 hover:bg-white/10 p-2.5 rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 group border border-white/5">
            <ImageIcon size={18} className="text-white/40 group-hover:text-orange-400" />
            <input type="file" aria-label="Upload image" className="hidden" accept="image/*" onChange={handleImageSelect} />
          </label>
          <Input
            ref={inputRef}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={user ? (replyTo ? `Reply to ${replyTo.profiles?.username}...` : "Type your argument...") : "Sign in to chat..."}
            disabled={!user}
            className="bg-white/5 border-white/5 focus-visible:ring-orange-500 focus-visible:border-orange-500/30 h-11 rounded-xl"
          />
          <Button
            type="submit"
            disabled={sending || !user}
            className="bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-bold h-11 px-5 rounded-xl shadow-lg shadow-orange-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-30"
          >
            <Send size={16} />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LiveChatRoom;
