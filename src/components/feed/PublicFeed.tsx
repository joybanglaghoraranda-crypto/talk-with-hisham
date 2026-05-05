import React, { useState, useEffect, useRef } from 'react';
import { supabase, uploadFile } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import GlassWrapper from '../layout/GlassWrapper';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { MessageSquare, Share2, Image as ImageIcon, X, Loader2, Rss, Send, Smile, Clock } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { cn } from '@/lib/utils';

interface Post {
  id: string;
  author_id: string;
  content: string;
  image_url?: string;
  likes_count: number;
  reactions?: Record<string, string[]>;
  created_at: string;
  profiles?: {
    username: string;
    full_name: string;
    avatar_url: string;
  };
}

const FEED_EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🔥'];

const PublicFeed: React.FC = () => {
  const { user, isConfigured, isAdmin } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [newPostContent, setNewPostContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [comments, setComments] = useState<Record<string, any[]>>({});
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});
  const [showReactionsFor, setShowReactionsFor] = useState<string | null>(null);
  const [reactorView, setReactorView] = useState<string | null>(null);
  const feedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchPosts();
  }, [isConfigured]);

  const fetchPosts = async () => {
    if (!isConfigured) {
      setLoadingPosts(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*, profiles(username, full_name, avatar_url)')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      if (data) setPosts(data as Post[]);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    } finally {
      setLoadingPosts(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return; }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handlePost = async () => {
    if (!newPostContent.trim() && !imageFile) return;

    if (!isAdmin) {
      toast.error('Only Hisham is allowed to create posts.');
      return;
    }

    setIsPosting(true);
    try {
      let imageUrl = null;
      if (imageFile) {
        try {
          const path = `posts/${user!.id}/${Date.now()}-${imageFile.name}`;
          imageUrl = await uploadFile('media', path, imageFile);
        } catch {
          toast.error('Failed to upload image');
        }
      }

      const { error } = await supabase.from('posts').insert([{
        author_id: user!.id,
        content: newPostContent,
        image_url: imageUrl,
      }]);

      if (error) throw error;

      setNewPostContent('');
      setImageFile(null);
      setImagePreview(null);
      toast.success('Posted!');
      fetchPosts();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to post');
    } finally {
      setIsPosting(false);
    }
  };

  const handleReact = async (postId: string, emoji: string) => {
    if (!user) {
      toast.error('Please sign in to react');
      return;
    }

    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const currentReactions = post.reactions || {};
    const hasReacted = currentReactions[emoji]?.includes(user.id);
    const newReactions = { ...currentReactions };

    // Remove user from all emojis first (one reaction per user)
    Object.keys(newReactions).forEach(key => {
      newReactions[key] = newReactions[key].filter((id: string) => id !== user.id);
      if (newReactions[key].length === 0) delete newReactions[key];
    });

    if (!hasReacted) {
      newReactions[emoji] = [...(newReactions[emoji] || []), user.id];
    }

    // Optimistic update
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, reactions: newReactions } : p));
    setShowReactionsFor(null);

    if (isConfigured) {
      try {
        await supabase.from('posts').update({ reactions: newReactions }).eq('id', postId);
      } catch (err) {
        console.error('Reaction failed:', err);
      }
    }
  };

  const toggleComments = async (postId: string) => {
    const newExpanded = new Set(expandedComments);
    if (newExpanded.has(postId)) {
      newExpanded.delete(postId);
    } else {
      newExpanded.add(postId);
      if (!comments[postId] && isConfigured) {
        try {
          const { data } = await supabase
            .from('comments')
            .select('*, profiles(username, avatar_url)')
            .eq('post_id', postId)
            .order('created_at', { ascending: true });
          if (data) setComments(prev => ({ ...prev, [postId]: data }));
        } catch {
          setComments(prev => ({ ...prev, [postId]: [] }));
        }
      }
    }
    setExpandedComments(newExpanded);
  };

  const handleReply = async (postId: string) => {
    const text = replyTexts[postId]?.trim();
    if (!text) return;

    if (!user) {
      toast.error('Please sign in to reply');
      return;
    }

    if (isConfigured) {
      try {
        const { data, error } = await supabase
          .from('comments')
          .insert([{ post_id: postId, author_id: user.id, content: text }])
          .select('*, profiles(username, avatar_url)')
          .single();

        if (error) throw error;
        if (data) {
          setComments(prev => ({
            ...prev,
            [postId]: [...(prev[postId] || []), data]
          }));
        }
      } catch (err: any) {
        console.error(err);
        toast.error(err.message || 'Failed to post reply');
        return;
      }
    }

    setReplyTexts(prev => ({ ...prev, [postId]: '' }));
    toast.success('Reply posted!');
  };

  const handleShare = (post: Post) => {
    if (navigator.share) {
      navigator.share({ title: 'Talk with Hisham', text: post.content, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(post.content);
      toast.success('Copied to clipboard!');
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const mins = Math.floor(diffMs / 60000);

    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;

    const isToday = date.toDateString() === now.toDateString();
    if (isToday) {
      return 'Today ' + date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    }

    return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) +
      ' ' + date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };

  const getTotalReactions = (reactions?: Record<string, string[]>) => {
    if (!reactions) return 0;
    return Object.values(reactions).reduce((sum, arr) => sum + arr.length, 0);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex-shrink-0 bg-black/40 backdrop-blur-xl border border-white/10 rounded-t-2xl px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/30 to-rose-500/30 flex items-center justify-center text-orange-400 border border-orange-500/20">
            <Rss size={18} />
          </div>
          <div>
            <h2 className="font-bold text-white text-sm">Public Discourse</h2>
            <p className="text-[10px] text-white/40 uppercase tracking-wider font-medium">Where opinions take shape</p>
          </div>
        </div>
      </div>

      {/* Scrollable Feed */}
      <div ref={feedRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-black/20 backdrop-blur-md border-x border-white/10 custom-scrollbar">
        {/* Create Post (Admin Only) */}
        {isAdmin && (
          <GlassWrapper className="p-4 border-orange-500/10">
            <div className="flex gap-3">
              <Avatar className="w-10 h-10 border border-white/10 shadow-lg flex-shrink-0">
                <AvatarFallback className="bg-neutral-800 text-sm font-bold text-orange-300">
                  {user?.email?.[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-3">
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  className="w-full bg-transparent border-none focus:ring-0 text-white placeholder:text-white/20 resize-none min-h-[48px] text-sm outline-none leading-relaxed"
                  placeholder="Share your perspective..."
                  rows={2}
                />
                {imagePreview && (
                  <div className="relative group inline-block">
                    <img src={imagePreview} alt="Image preview" className="max-h-40 rounded-xl border border-white/10 shadow-xl" />
                    <button
                      onClick={() => { setImageFile(null); setImagePreview(null); }}
                      aria-label="Remove image preview"
                      className="absolute top-2 right-2 bg-black/60 hover:bg-rose-500 p-1.5 rounded-full backdrop-blur-md transition-all"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2 border-t border-white/10">
                  <label className="flex items-center gap-2 text-white/40 hover:text-orange-400 cursor-pointer transition-colors text-sm group">
                    <div className="p-1.5 rounded-lg bg-white/5 group-hover:bg-orange-500/10 transition-colors">
                      <ImageIcon size={14} />
                    </div>
                    <input type="file" aria-label="Upload image" className="hidden" accept="image/*" onChange={handleImageSelect} />
                  </label>
                  <Button
                    onClick={handlePost}
                    disabled={isPosting || (!newPostContent.trim() && !imageFile)}
                    size="sm"
                    className="bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 rounded-full font-bold px-5 shadow-lg shadow-orange-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-30 text-xs"
                  >
                    {isPosting ? <Loader2 className="animate-spin" size={14} /> : 'Post'}
                  </Button>
                </div>
              </div>
            </div>
          </GlassWrapper>
        )}

        {!isAdmin && (
          <GlassWrapper className="p-4 border-orange-500/10 text-center">
            <p className="text-white/50 text-xs">
              {user ? "Enjoy the feed! Only Hisham can create new posts, but you can react and reply." : "Sign in to interact with the feed."}
            </p>
          </GlassWrapper>
        )}

        {/* Loading */}
        {loadingPosts && (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-orange-500" size={24} />
          </div>
        )}

        {!loadingPosts && posts.length === 0 && (
          <div className="text-center py-12 text-white/20 text-sm italic">
            No posts yet. Stay tuned!
          </div>
        )}

        {/* Posts */}
        <AnimatePresence initial={false}>
          {posts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <GlassWrapper className="group p-0 overflow-hidden border-white/5 hover:border-white/10 transition-all">
                <div className="p-4 space-y-3">
                  {/* Author Header */}
                  <div className="flex gap-3 items-center">
                    <Avatar className="w-10 h-10 border border-white/10 shadow-lg">
                      <AvatarImage src={post.profiles?.avatar_url} />
                      <AvatarFallback className="bg-neutral-800 text-xs font-bold text-orange-300">
                        {post.profiles?.username?.[0]?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-bold text-orange-200 text-sm">{post.profiles?.full_name || post.profiles?.username || 'User'}</h4>
                      <p className="text-[10px] text-white/30 flex items-center gap-1">
                        <Clock size={9} />
                        @{post.profiles?.username} · {formatTime(post.created_at)}
                      </p>
                    </div>
                  </div>

                  {/* Content */}
                  <p className="text-white/80 leading-relaxed text-sm">{post.content}</p>

                  {/* Image */}
                  {post.image_url && (
                    <div className="rounded-xl overflow-hidden border border-white/10 shadow-xl">
                      <img src={post.image_url} alt="Post" className="w-full h-auto object-cover max-h-[400px]" />
                    </div>
                  )}

                  {/* Reactions Display */}
                  {post.reactions && Object.keys(post.reactions).length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {Object.entries(post.reactions).map(([emoji, userIds]) => (
                        <button
                          key={emoji}
                          onClick={() => user ? handleReact(post.id, emoji) : toast.error('Sign in to react')}
                          onContextMenu={(e) => {
                            e.preventDefault();
                            if (isAdmin) setReactorView(reactorView === `${post.id}-${emoji}` ? null : `${post.id}-${emoji}`);
                          }}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs border transition-all hover:scale-105 ${
                            userIds.includes(user?.id || '')
                              ? 'bg-orange-500/15 border-orange-500/30 text-orange-300'
                              : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                          }`}
                        >
                          <span>{emoji}</span>
                          <span className="font-semibold text-[10px]">{userIds.length}</span>
                        </button>
                      ))}
                      <span className="text-[10px] text-white/20 ml-1">{getTotalReactions(post.reactions)} reactions</span>
                    </div>
                  )}

                  {/* Admin: Reactor Details (right-click on emoji to see) */}
                  {isAdmin && reactorView?.startsWith(post.id) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="bg-white/5 rounded-xl p-3 border border-white/5 text-xs text-white/50 overflow-hidden"
                    >
                      <p className="text-[10px] text-orange-400/60 font-semibold uppercase tracking-wider mb-2">Who reacted</p>
                      {Object.entries(post.reactions || {}).map(([emoji, ids]) => (
                        <div key={emoji} className="flex items-center gap-2 mb-1">
                          <span>{emoji}</span>
                          <span className="text-white/40">{ids.length} users: {ids.map((id: string) => id.slice(0, 8)).join(', ')}</span>
                        </div>
                      ))}
                    </motion.div>
                  )}

                  {/* Action Bar */}
                  <div className="flex items-center gap-1 pt-2 border-t border-white/5 relative">
                    {/* React Button */}
                    <div className="relative">
                      <button
                        onClick={() => setShowReactionsFor(showReactionsFor === post.id ? null : post.id)}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all hover:bg-white/5 active:scale-95",
                          getTotalReactions(post.reactions) > 0 ? "text-orange-400" : "text-white/30 hover:text-white/60"
                        )}
                      >
                        <Smile size={16} />
                        {getTotalReactions(post.reactions) > 0 && (
                          <span className="text-xs font-semibold">{getTotalReactions(post.reactions)}</span>
                        )}
                      </button>

                      {/* Emoji Picker Popup */}
                      <AnimatePresence>
                        {showReactionsFor === post.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 5 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 5 }}
                            className="absolute bottom-full left-0 mb-2 bg-neutral-900 border border-white/10 rounded-full shadow-2xl px-2 py-1.5 flex gap-1 z-30"
                          >
                            {FEED_EMOJIS.map(emoji => (
                              <button
                                key={emoji}
                                onClick={() => handleReact(post.id, emoji)}
                                className="hover:scale-130 transition-transform text-lg p-0.5 hover:bg-white/10 rounded-md"
                              >
                                {emoji}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Comment Button */}
                    <FeedAction
                      icon={<MessageSquare size={16} />}
                      count={comments[post.id]?.length}
                      active={expandedComments.has(post.id)}
                      activeColor="text-blue-400"
                      onClick={() => toggleComments(post.id)}
                    />

                    {/* Share Button */}
                    <FeedAction
                      icon={<Share2 size={16} />}
                      onClick={() => handleShare(post)}
                    />
                  </div>

                  {/* Comments Section */}
                  <AnimatePresence>
                    {expandedComments.has(post.id) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-3 pt-3 border-t border-white/5">
                          {(!comments[post.id] || comments[post.id].length === 0) && (
                            <p className="text-white/20 text-xs italic text-center py-2">No replies yet. Be the first!</p>
                          )}
                          {comments[post.id]?.map((comment: any) => (
                            <div key={comment.id} className="flex gap-2 items-start">
                              <Avatar className="w-6 h-6 border border-white/10 flex-shrink-0">
                                <AvatarImage src={comment.profiles?.avatar_url} />
                                <AvatarFallback className="bg-neutral-800 text-[9px] font-bold text-white/60">
                                  {comment.profiles?.username?.[0]?.toUpperCase() || 'U'}
                                </AvatarFallback>
                              </Avatar>
                              <div className="bg-white/5 rounded-xl rounded-tl-sm p-2.5 border border-white/5 flex-1">
                                <div className="flex items-center gap-2 mb-0.5">
                                  <span className="text-[10px] font-semibold text-white/60">@{comment.profiles?.username || 'user'}</span>
                                  <span className="text-[9px] text-white/20 flex items-center gap-0.5">
                                    <Clock size={8} /> {formatTime(comment.created_at)}
                                  </span>
                                </div>
                                <p className="text-white/70 text-xs leading-relaxed">{comment.content}</p>
                              </div>
                            </div>
                          ))}
                          {user && (
                            <div className="flex gap-2 pt-1">
                              <Input
                                value={replyTexts[post.id] || ''}
                                onChange={(e) => setReplyTexts(prev => ({ ...prev, [post.id]: e.target.value }))}
                                onKeyDown={(e) => { if (e.key === 'Enter') handleReply(post.id); }}
                                placeholder="Write a reply..."
                                className="bg-white/5 border-white/5 h-8 text-xs rounded-full focus-visible:ring-orange-500"
                              />
                              <Button
                                onClick={() => handleReply(post.id)}
                                size="sm"
                                className="bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 rounded-full h-8 px-3"
                              >
                                <Send size={12} />
                              </Button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </GlassWrapper>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Bottom bar */}
      <div className="flex-shrink-0 bg-black/40 backdrop-blur-xl border border-white/10 border-t-0 rounded-b-2xl px-5 py-3 text-center">
        <p className="text-[10px] text-white/20 uppercase tracking-wider">
          {posts.length} posts · Scroll to explore
        </p>
      </div>
    </div>
  );
};

const FeedAction: React.FC<{
  icon: React.ReactNode;
  count?: number;
  active?: boolean;
  activeColor?: string;
  onClick?: () => void;
}> = ({ icon, count, active, activeColor = 'text-orange-400', onClick }) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all hover:bg-white/5 active:scale-95",
      active ? activeColor : "text-white/30 hover:text-white/60"
    )}
  >
    {icon}
    {count !== undefined && count > 0 && <span className="text-xs font-semibold">{count}</span>}
  </button>
);

export default PublicFeed;
