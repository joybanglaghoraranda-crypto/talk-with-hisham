import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Search, Loader2, Calendar, AtSign, BookOpen } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import GlassWrapper from '../layout/GlassWrapper';
import { Input } from '../ui/input';

interface UserProfile {
  id: string;
  username: string;
  full_name: string;
  bio: string;
  avatar_url: string;
  updated_at: string;
}

const AdminUsers: React.FC = () => {
  const { isConfigured } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [isConfigured]);

  const fetchUsers = async () => {
    if (!isConfigured) { setLoading(false); return; }
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      if (data) setUsers(data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(u =>
    u.username?.toLowerCase().includes(search.toLowerCase()) ||
    u.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'Unknown';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="animate-spin text-orange-500" size={28} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search users by name or username..."
          className="bg-white/5 border-white/10 pl-11 h-12 rounded-xl focus-visible:ring-orange-500 text-sm"
        />
      </div>

      {/* Stats */}
      <div className="flex items-center gap-2 px-1">
        <Users size={14} className="text-white/30" />
        <span className="text-xs text-white/40">{filteredUsers.length} users found</span>
      </div>

      {/* User Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence initial={false}>
          {filteredUsers.map(user => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              layout
            >
              <GlassWrapper
                className={`p-4 cursor-pointer transition-all hover:border-orange-500/20 hover:bg-white/5 ${
                  selectedUser?.id === user.id ? 'border-orange-500/30 bg-orange-500/5' : 'border-white/5'
                }`}
              >
                <button
                  onClick={() => setSelectedUser(selectedUser?.id === user.id ? null : user)}
                  className="w-full text-left"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12 border border-white/10">
                      <AvatarImage src={user.avatar_url} />
                      <AvatarFallback className="bg-neutral-800 text-sm font-bold text-orange-300">
                        {user.username?.[0]?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-white truncate">{user.full_name || 'No Name'}</h4>
                      <p className="text-xs text-orange-400/60 flex items-center gap-1">
                        <AtSign size={10} /> {user.username || 'no-username'}
                      </p>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {selectedUser?.id === user.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 pt-3 border-t border-white/10 space-y-3">
                          {user.bio && (
                            <div>
                              <div className="flex items-center gap-1.5 mb-1">
                                <BookOpen size={10} className="text-white/30" />
                                <span className="text-[10px] text-white/30 uppercase tracking-wider font-semibold">Bio</span>
                              </div>
                              <p className="text-xs text-white/60 leading-relaxed">{user.bio}</p>
                            </div>
                          )}
                          <div className="flex items-center gap-1.5">
                            <Calendar size={10} className="text-white/30" />
                            <span className="text-[10px] text-white/40">Last active: {formatDate(user.updated_at)}</span>
                          </div>
                          <div className="text-[10px] text-white/20 font-mono break-all">ID: {user.id}</div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </GlassWrapper>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredUsers.length === 0 && (
        <GlassWrapper className="text-center py-12 border-white/5">
          <Users className="mx-auto text-white/10 mb-3" size={40} />
          <p className="text-white/30 text-sm">
            {search ? `No users matching "${search}"` : 'No registered users yet.'}
          </p>
        </GlassWrapper>
      )}
    </div>
  );
};

export default AdminUsers;
