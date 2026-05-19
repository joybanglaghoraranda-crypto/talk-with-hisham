'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, MessageSquare, Rss, Mail, Send, Loader2, Trash2, Clock } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { getSupabaseClient } from '@/lib/supabase/client';
import { formatRelativeTime } from '@/lib/utils';
import { toast } from 'sonner';
import type { PrivateMessage, Profile } from '@/lib/types';

export default function AdminDashboard() {
  const { user, isAdmin } = useAuthStore();
  const [activeTab, setActiveTab] = useState('messages');
  const [messages, setMessages] = useState<PrivateMessage[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [stats, setStats] = useState({ users: 0, posts: 0, messages: 0, privates: 0 });
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [replying, setReplying] = useState<string | null>(null);
  const supabase = getSupabaseClient();

  useEffect(() => { if (isAdmin) fetchAll(); }, [isAdmin]);

  const fetchAll = async () => {
    try {
      const [msgs, usrs, postCount, msgCount] = await Promise.all([
        supabase.from('private_messages').select('*').order('created_at', { ascending: false }),
        supabase.from('profiles').select('*').order('updated_at', { ascending: false }),
        supabase.from('posts').select('id', { count: 'exact', head: true }),
        supabase.from('messages').select('id', { count: 'exact', head: true }),
      ]);
      setMessages(msgs.data || []);
      setUsers(usrs.data || []);
      setStats({ users: usrs.data?.length || 0, posts: postCount.count || 0, messages: msgCount.count || 0, privates: msgs.data?.length || 0 });
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleReply = async (msgId: string) => {
    const text = replyText[msgId]?.trim();
    if (!text) return;
    setReplying(msgId);
    try {
      const { error } = await supabase.from('private_messages').update({ admin_reply: text, admin_reply_at: new Date().toISOString() }).eq('id', msgId);
      if (error) throw error;
      toast.success('Reply sent');
      setReplyText(prev => ({ ...prev, [msgId]: '' }));
      fetchAll();
    } catch { toast.error('Failed to reply'); } finally { setReplying(null); }
  };

  const handleDeleteMsg = async (msgId: string) => {
    if (!confirm('Delete this message?')) return;
    await supabase.from('private_messages').delete().eq('id', msgId);
    setMessages(prev => prev.filter(m => m.id !== msgId));
    toast.success('Deleted');
  };

  if (!isAdmin) return (<div className="flex flex-col items-center justify-center min-h-[50vh] text-center"><Shield className="text-white/10 mb-4" size={48} /><h2 className="text-xl font-heading font-bold text-white mb-2">Access Denied</h2></div>);

  const TABS = [
    { key: 'messages', label: 'Messages', icon: Mail, count: stats.privates },
    { key: 'users', label: 'Users', icon: Users, count: stats.users },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto py-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shadow-lg shadow-brand-500/20"><Shield size={18} className="text-white" /></div>
        <div><h1 className="text-2xl font-heading font-bold text-white tracking-tight">Admin Dashboard</h1><p className="text-white/30 text-xs">Manage your platform</p></div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Users', value: stats.users, icon: Users, color: 'from-brand-500 to-brand-300' },
          { label: 'Posts', value: stats.posts, icon: Rss, color: 'from-violet-500 to-purple-400' },
          { label: 'Chat Messages', value: stats.messages, icon: MessageSquare, color: 'from-accent-500 to-accent-400' },
          { label: 'Private Messages', value: stats.privates, icon: Mail, color: 'from-emerald-500 to-teal-400' },
        ].map(s => (
          <div key={s.label} className="glass-card p-4">
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center mb-2`}><s.icon size={14} className="text-white" /></div>
            <p className="text-xl font-heading font-bold text-white">{s.value}</p>
            <p className="text-[9px] uppercase tracking-widest text-white/25 font-semibold">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex bg-white/3 border border-white/8 rounded-xl p-1 mb-5">
        {TABS.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.key ? 'bg-brand-500/20 text-brand-400' : 'text-white/40 hover:text-white/60'}`}>
            <tab.icon size={14} /> {tab.label} <span className="text-[10px] text-white/20">({tab.count})</span>
          </button>
        ))}
      </div>

      {loading ? <div className="space-y-3">{[1,2,3].map(i=><div key={i} className="glass-card p-5 h-24 skeleton"/>)}</div> : (
        <>
          {activeTab === 'messages' && (
            <div className="space-y-3">
              {messages.length === 0 ? <div className="glass-card py-12 text-center"><p className="text-white/20 text-sm">No private messages.</p></div> : messages.map(msg => (
                <div key={msg.id} className="glass-card p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1"><p className="text-xs font-semibold text-white">{msg.sender_name}</p><span className="text-[10px] text-white/20">{msg.sender_contact}</span></div>
                      <p className="text-sm text-white/60 leading-relaxed">{msg.message}</p>
                      <p className="text-[10px] text-white/15 mt-1 flex items-center gap-1"><Clock size={10}/>{formatRelativeTime(msg.created_at)}</p>
                    </div>
                    <button onClick={() => handleDeleteMsg(msg.id)} className="p-1.5 text-white/15 hover:text-accent-400 transition-colors" title="Delete message"><Trash2 size={14}/></button>
                  </div>
                  {msg.admin_reply && <div className="mt-3 pt-3 border-t border-white/5"><p className="text-[10px] text-green-400/50 uppercase tracking-widest font-semibold mb-1">Your Reply</p><p className="text-sm text-white/50">{msg.admin_reply}</p></div>}
                  {!msg.admin_reply && (
                    <div className="mt-3 pt-3 border-t border-white/5 flex gap-2">
                      <input type="text" placeholder="Type a reply..." value={replyText[msg.id]||''} onChange={e=>setReplyText(prev=>({...prev,[msg.id]:e.target.value}))} onKeyDown={e=>e.key==='Enter'&&handleReply(msg.id)} className="flex-1 bg-white/3 border border-white/8 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-brand-500/30"/>
                      <button onClick={()=>handleReply(msg.id)} disabled={replying===msg.id||!replyText[msg.id]?.trim()} className="p-2 bg-brand-500/20 rounded-lg text-brand-400 hover:bg-brand-500/30 disabled:opacity-20 transition-all">{replying===msg.id?<Loader2 size={13} className="animate-spin"/>:<Send size={13}/>}</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-2">
              {users.map(u => (
                <div key={u.id} className="glass-card p-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-surface-300 flex items-center justify-center text-xs font-bold text-white/40">{u.username?.[0]?.toUpperCase()||'?'}</div>
                  <div className="flex-1 min-w-0"><p className="text-sm font-semibold text-white truncate">{u.full_name||u.username}</p><p className="text-[10px] text-white/25">@{u.username}</p></div>
                  <p className="text-[10px] text-white/15">{u.id.slice(0,8)}</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}
