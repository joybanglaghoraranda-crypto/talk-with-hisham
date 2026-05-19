'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2, Lock, Mail, MessageSquare, Clock, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { getSupabaseClient } from '@/lib/supabase/client';
import { formatRelativeTime } from '@/lib/utils';
import { toast } from 'sonner';
import type { PrivateMessage } from '@/lib/types';

export default function MyMessages() {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<PrivateMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [selectedMsg, setSelectedMsg] = useState<PrivateMessage | null>(null);
  const supabase = getSupabaseClient();

  useEffect(() => { if (user) fetchMessages(); }, [user]);

  const fetchMessages = async () => {
    try {
      const { data } = await supabase.from('private_messages').select('*').eq('sender_id', user!.id).order('created_at', { ascending: false });
      setMessages(data || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;
    setSending(true);
    try {
      const { error } = await supabase.from('private_messages').insert({ sender_id: user.id, sender_name: user.email?.split('@')[0] || 'User', sender_contact: user.email || '', message: newMessage.trim() });
      if (error) throw error;
      toast.success('Message sent to Hisham!');
      setNewMessage('');
      fetchMessages();
    } catch (err: any) { toast.error(err.message || 'Failed to send'); } finally { setSending(false); }
  };

  if (!user) return (<div className="flex flex-col items-center justify-center min-h-[50vh] text-center"><Mail className="text-white/10 mb-4" size={48} /><h2 className="text-xl font-heading font-bold text-white mb-2">Sign in Required</h2><p className="text-white/35 text-sm">Sign in to access your inbox.</p></div>);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto py-6">
      <div className="mb-6"><h1 className="text-2xl font-heading font-bold text-white tracking-tight flex items-center gap-2"><Lock size={20} className="text-brand-400" /> Private Inbox</h1><p className="text-white/30 text-sm">Send private messages directly to Hisham.</p></div>
      <form onSubmit={handleSend} className="glass-card p-5 mb-6">
        <textarea value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Write a private message..." rows={3} className="w-full bg-transparent outline-none text-sm text-white placeholder:text-white/20 resize-none" />
        <div className="flex justify-end mt-2">
          <button type="submit" disabled={sending || !newMessage.trim()} className="flex items-center gap-2 bg-gradient-to-r from-brand-500 to-accent-500 px-5 py-2 rounded-lg text-sm font-bold text-white disabled:opacity-30 transition-all hover:scale-105 active:scale-95">
            {sending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />} Send
          </button>
        </div>
      </form>
      {loading ? <div className="space-y-3">{[1,2,3].map(i=><div key={i} className="glass-card p-5 h-24 skeleton"/>)}</div>
      : messages.length === 0 ? <div className="glass-card py-16 text-center"><MessageSquare className="mx-auto text-white/10 mb-3" size={36}/><p className="text-white/20 text-sm">No messages yet.</p></div>
      : <div className="space-y-3">{messages.map(msg=>(
        <motion.div key={msg.id} layout className="glass-card glass-card-hover p-5 cursor-pointer" onClick={()=>setSelectedMsg(selectedMsg?.id===msg.id?null:msg)}>
          <p className="text-sm text-white/65 leading-relaxed line-clamp-2">{msg.message}</p>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-[10px] text-white/20 flex items-center gap-1"><Clock size={10}/>{formatRelativeTime(msg.created_at)}</span>
            {msg.admin_reply?<span className="text-[10px] text-green-400/60 flex items-center gap-1"><CheckCircle2 size={10}/>Replied</span>:<span className="text-[10px] text-brand-400/40">Awaiting reply</span>}
          </div>
          {selectedMsg?.id===msg.id&&msg.admin_reply&&(
            <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} className="mt-3 pt-3 border-t border-white/5">
              <p className="text-[10px] text-green-400/60 uppercase tracking-widest font-semibold mb-1">Reply</p>
              <p className="text-sm text-white/60 leading-relaxed">{msg.admin_reply}</p>
            </motion.div>
          )}
        </motion.div>
      ))}</div>}
    </motion.div>
  );
}
