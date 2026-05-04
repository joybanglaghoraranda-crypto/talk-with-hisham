import React, { useState, useEffect, useRef } from 'react';
import { supabase, uploadFile } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Send, Hash, Users, Shield, Image as ImageIcon, X, Smile } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import GlassWrapper from '../layout/GlassWrapper';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';

interface Message {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
  image_url?: string;
  profiles?: {
    username: string;
    avatar_url: string;
  };
}

const LiveChatRoom: React.FC = () => {
  const { user, isConfigured } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isConfigured) return;

    // Realtime subscription
    const channel = supabase
      .channel('public_chat')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        async (payload) => {
          const newMsg = payload.new as Message;
          // Fetch profile for the new message
          const { data: profile } = await supabase
            .from('profiles')
            .select('username, avatar_url')
            .eq('id', newMsg.sender_id)
            .single();

          newMsg.profiles = profile || { username: 'Anonymous', avatar_url: '' };
          setMessages((prev) => {
            // Avoid duplicates
            if (prev.find(m => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
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
        .limit(100);

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

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!newMessage.trim() && !imageFile) || sending) return;

    if (!user) {
      toast.error('Please sign in to send messages');
      return;
    }

    setSending(true);
    const messageContent = newMessage;
    setNewMessage(''); // Optimistic clear

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

      const { error } = await supabase.from('messages').insert([
        { content: messageContent, sender_id: user.id, image_url: imageUrl }
      ]);

      if (error) {
        console.error('Insert error:', error);
        setNewMessage(messageContent); // Restore on failure
        toast.error('Failed to send — ' + (error.message || 'unknown error'));
        return;
      }

      setImageFile(null);
      setImagePreview(null);
    } catch (err: any) {
      console.error(err);
      setNewMessage(messageContent);
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[78vh]">
      {/* Sidebar */}
      <div className="hidden lg:flex flex-col gap-4 col-span-1">
        <GlassWrapper className="flex-1 flex flex-col p-5 bg-black/40">
          <div className="flex items-center gap-2 mb-6 px-1">
            <Users className="text-orange-400" size={18} />
            <h3 className="font-bold uppercase tracking-widest text-[10px] text-white/40">Online</h3>
          </div>
          <div className="flex flex-col gap-2">
            <UserEntry name="Hisham" status="online" isAdmin />
            {user && <UserEntry name={user.email?.split('@')[0] || 'You'} status="online" />}
          </div>

          <div className="mt-auto pt-6 border-t border-white/10">
            <div className="bg-gradient-to-br from-orange-500/10 to-rose-500/10 rounded-xl p-4 border border-white/5">
              <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-2">Room Info</p>
              <p className="text-xs text-white/50 leading-relaxed">
                This is a public room. Be respectful, thoughtful, and open-minded.
              </p>
            </div>
          </div>
        </GlassWrapper>
      </div>

      {/* Main Chat Area */}
      <div className="col-span-1 lg:col-span-3">
        <GlassWrapper className="h-full flex flex-col p-0 overflow-hidden bg-black/30 border-white/5">
          {/* Header */}
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/5 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/30 to-rose-500/30 flex items-center justify-center text-orange-400 border border-orange-500/20">
                <Hash size={18} />
              </div>
              <div>
                <h2 className="font-bold text-white">General Debate</h2>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <p className="text-[10px] text-white/40 uppercase tracking-wider font-medium">Live • {messages.length} messages</p>
                </div>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <ScrollArea className="flex-1 px-6 py-4">
            <div className="space-y-4">
              {/* Welcome Note */}
              <div className="bg-gradient-to-r from-orange-500/8 to-rose-500/8 border border-white/5 rounded-2xl p-6 mb-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Hash size={40} />
                </div>
                <h3 className="text-lg font-bold mb-1 text-orange-400">Welcome to General Debate</h3>
                <p className="text-white/40 text-sm leading-relaxed max-w-lg">
                  Share your insights, respect the discourse, and explore new perspectives together.
                </p>
              </div>

              {messages.length === 0 && (
                <div className="text-center py-16 space-y-3">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto border border-white/10">
                    <Smile className="text-white/20" size={28} />
                  </div>
                  <p className="text-white/25 italic text-sm">Be the first to start the debate.</p>
                </div>
              )}

              <AnimatePresence initial={false}>
                {messages.map((msg, idx) => {
                  const isOwn = user && msg.sender_id === user.id;
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : ''}`}
                    >
                      <Avatar className="w-9 h-9 border border-white/10 shadow-md flex-shrink-0">
                        <AvatarImage src={msg.profiles?.avatar_url} />
                        <AvatarFallback className="bg-neutral-800 text-xs text-orange-300">
                          {msg.profiles?.username?.[0]?.toUpperCase() ?? 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`space-y-1 max-w-[75%] ${isOwn ? 'items-end' : ''}`}>
                        <div className={`flex items-center gap-2 ${isOwn ? 'flex-row-reverse' : ''}`}>
                          <span className="font-semibold text-xs text-orange-200/80">
                            {isOwn ? 'You' : (msg.profiles?.username ?? 'Anonymous')}
                          </span>
                          <span className="text-[10px] text-white/20">
                            {formatTime(msg.created_at)}
                          </span>
                        </div>
                        {msg.content && (
                          <div className={`text-white/85 text-sm leading-relaxed p-3 ${
                            isOwn
                              ? 'bg-orange-500/15 rounded-2xl rounded-tr-sm border border-orange-500/10'
                              : 'bg-white/5 rounded-2xl rounded-tl-sm border border-white/5'
                          }`}>
                            {msg.content}
                          </div>
                        )}
                        {msg.image_url && (
                          <div className="mt-1 rounded-xl overflow-hidden border border-white/10 max-w-xs shadow-xl">
                            <img src={msg.image_url} alt="Shared" className="w-full h-auto object-cover max-h-64" />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              <div ref={scrollRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="px-4 py-3 bg-black/30 border-t border-white/10 space-y-2">
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
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={user ? "Type your argument..." : "Sign in to chat..."}
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
        </GlassWrapper>
      </div>
    </div>
  );
};

const UserEntry: React.FC<{ name: string; status: 'online' | 'away' | 'offline'; isAdmin?: boolean }> = ({ name, status, isAdmin }) => (
  <div className="flex items-center justify-between group cursor-pointer hover:bg-white/5 p-2.5 rounded-xl transition-all">
    <div className="flex items-center gap-3">
      <div className="relative">
        <Avatar className="w-8 h-8">
          <AvatarFallback className="bg-orange-950 text-orange-400 text-xs font-bold">
            {name[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 border-2 border-neutral-900 rounded-full ${
          status === 'online' ? 'bg-green-500' : status === 'away' ? 'bg-yellow-500' : 'bg-gray-500'
        }`} />
      </div>
      <span className="text-sm font-medium text-white/60 group-hover:text-white transition-colors">{name}</span>
    </div>
    {isAdmin && <Shield size={12} className="text-orange-400/50" />}
  </div>
);

export default LiveChatRoom;
