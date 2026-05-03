import React, { useState, useEffect, useRef } from 'react';
import { supabase, uploadFile } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Send, Hash, Users, Shield, Image as ImageIcon, X, LogIn } from 'lucide-react';
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
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isConfigured) return;

    // Realtime subscription
    const channel = supabase
      .channel('public_chat')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          const newMsg = payload.new as Message;
          setMessages((prev) => [...prev, newMsg]);
        }
      )
      .subscribe();

    // Initial fetch
    fetchMessages();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isConfigured]);

  const fetchMessages = async () => {
    const { data } = await supabase
      .from('messages')
      .select('*, profiles(username, avatar_url)')
      .order('created_at', { ascending: true })
      .limit(50);

    if (data) setMessages(data as any);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() && !imageFile) return;

    if (!user) {
      // Demo mode — add local message
      setMessages(prev => [...prev, {
        id: Math.random().toString(),
        sender_id: 'guest',
        content: newMessage,
        image_url: imagePreview ?? undefined,
        created_at: new Date().toISOString(),
        profiles: { username: 'Guest', avatar_url: '' }
      }]);
      setNewMessage('');
      setImageFile(null);
      setImagePreview(null);
      return;
    }

    let imageUrl = null;
    if (imageFile) {
      try {
        const path = `${user.id}/${Date.now()}-${imageFile.name}`;
        imageUrl = await uploadFile('media', path, imageFile);
      } catch (err) {
        console.error('Upload error:', err);
        toast.error('Failed to upload image');
      }
    }

    try {
      const { error } = await supabase.from('messages').insert([
        { content: newMessage, sender_id: user.id, image_url: imageUrl }
      ]);
      if (error) throw error;
      setNewMessage('');
      setImageFile(null);
      setImagePreview(null);
    } catch (err) {
      console.error(err);
      toast.error('Failed to send message');
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[75vh]">
      {/* Sidebar */}
      <div className="hidden lg:flex flex-col gap-6 col-span-1">
        <GlassWrapper className="flex-1 flex flex-col p-4 bg-black/40">
          <div className="flex items-center gap-2 mb-6 px-2">
            <Users className="text-orange-400" size={20} />
            <h3 className="font-bold uppercase tracking-widest text-xs opacity-50">Online Now</h3>
          </div>
          <div className="flex flex-col gap-4">
            <UserEntry name="Hisham" status="online" isAdmin />
            {user && <UserEntry name={user.email?.split('@')[0] || 'You'} status="online" />}
          </div>
        </GlassWrapper>
      </div>

      {/* Main Chat Area */}
      <div className="col-span-1 lg:col-span-3">
        <GlassWrapper className="h-full flex flex-col p-0 overflow-hidden bg-black/20 border-white/5">
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400">
                <Hash size={20} />
              </div>
              <div>
                <h2 className="font-bold">General Debate</h2>
                <p className="text-xs text-white/40">Real-time public room</p>
              </div>
            </div>
            {!isConfigured && (
              <span className="text-[10px] bg-orange-500/10 text-orange-300 px-3 py-1 rounded-full border border-orange-500/20">
                Demo Mode
              </span>
            )}
          </div>

          {/* Messages Area */}
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-6">
              {/* Welcome Note */}
              <div className="bg-gradient-to-r from-orange-500/10 to-rose-500/10 border border-white/10 rounded-2xl p-6 mb-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Hash size={40} />
                </div>
                <h3 className="text-xl font-bold mb-2 text-orange-400">Welcome to General Debate</h3>
                <p className="text-white/60 text-sm leading-relaxed max-w-xl">
                  This is a space for thoughtful conversation and intellectual curiosity.
                  Share your insights, respect the discourse, and let's explore new perspectives together.
                </p>
                <div className="mt-4 flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/30 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  Live Discussion Active
                </div>
              </div>

              {messages.length === 0 && (
                <div className="text-center py-12 opacity-30 italic text-sm">
                  Welcome to the debate. Be the first to share your thoughts.
                </div>
              )}
              {messages.map((msg) => (
                <div key={msg.id} className="flex gap-4">
                  <Avatar className="w-10 h-10 border border-white/10 shadow-lg">
                    <AvatarImage src={msg.profiles?.avatar_url} />
                    <AvatarFallback className="bg-neutral-800">
                      {msg.profiles?.username?.[0] ?? 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-orange-200">
                        {msg.profiles?.username ?? 'Anonymous'}
                      </span>
                      <span className="text-[10px] text-white/30">
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-white/80 text-sm leading-relaxed max-w-prose bg-white/5 p-3 rounded-2xl rounded-tl-none border border-white/5">
                      {msg.content}
                    </p>
                    {msg.image_url && (
                      <div className="mt-2 rounded-xl overflow-hidden border border-white/10 max-w-sm shadow-2xl">
                        <img src={msg.image_url} alt="Shared" className="w-full h-auto object-cover max-h-80" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="p-4 bg-white/5 border-t border-white/10 space-y-3">
            {imagePreview && (
              <div className="relative inline-block">
                <img src={imagePreview} className="h-20 w-auto max-w-[200px] object-cover rounded-lg border border-white/20 shadow-xl" />
                <button
                  onClick={() => { setImageFile(null); setImagePreview(null); }}
                  className="absolute -top-2 -right-2 bg-rose-500 rounded-full p-1 shadow-lg hover:scale-110 transition-transform"
                >
                  <X size={12} className="text-white" />
                </button>
              </div>
            )}
            <form onSubmit={sendMessage} className="flex gap-3">
              <label className="cursor-pointer bg-white/10 hover:bg-white/20 p-2.5 rounded-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95 group">
                <ImageIcon size={20} className="text-white/60 group-hover:text-white" />
                <input type="file" className="hidden" accept="image/*" onChange={handleImageSelect} />
              </label>
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={user ? "Type your argument..." : "Type as guest..."}
                className="bg-white/5 border-white/10 focus-visible:ring-orange-500 focus-visible:border-orange-500 h-11"
              />
              <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white font-bold h-11 px-5 shadow-lg shadow-orange-500/20">
                <Send size={18} />
              </Button>
            </form>
          </div>
        </GlassWrapper>
      </div>
    </div>
  );
};

const UserEntry: React.FC<{ name: string; status: 'online' | 'away' | 'offline'; isAdmin?: boolean }> = ({ name, status, isAdmin }) => (
  <div className="flex items-center justify-between group cursor-pointer hover:bg-white/5 p-2 rounded-xl transition-all">
    <div className="flex items-center gap-3">
      <div className="relative">
        <Avatar className="w-8 h-8">
          <AvatarFallback className="bg-orange-950 text-orange-400 text-xs">
            {name[0]}
          </AvatarFallback>
        </Avatar>
        <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 border-2 border-black rounded-full ${
          status === 'online' ? 'bg-green-500' : status === 'away' ? 'bg-yellow-500' : 'bg-gray-500'
        }`} />
      </div>
      <span className="text-sm font-medium text-white/70 group-hover:text-white">{name}</span>
    </div>
    {isAdmin && <Shield size={14} className="text-orange-400 opacity-50" />}
  </div>
);

export default LiveChatRoom;
