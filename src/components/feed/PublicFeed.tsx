import React, { useState, useEffect } from 'react';
import { supabase, uploadFile } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import GlassWrapper from '../layout/GlassWrapper';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Heart, MessageSquare, Share2, Image as ImageIcon, X, Loader2, Rss, Send, Bookmark } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { cn } from '@/lib/utils';

interface Post {
  id: string;
  author_id: string;
  content: string;
  image_url?: string;
  likes_count: number;
  created_at: string;
  profiles?: {
    username: string;
    full_name: string;
    avatar_url: string;
  };
}

const PublicFeed: React.FC = () => {
  const { user, isConfigured } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [newPostContent, setNewPostContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [comments, setComments] = useState<Record<string, any[]>>({});
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});

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

    if (!user) {
      toast.error('Please sign in to post');
      return;
    }

    setIsPosting(true);
    try {
      let imageUrl = null;
      if (imageFile) {
        try {
          const path = `posts/${user.id}/${Date.now()}-${imageFile.name}`;
          imageUrl = await uploadFile('media', path, imageFile);
        } catch {
          toast.error('Failed to upload image');
        }
      }

      const { error } = await supabase.from('posts').insert([{
        author_id: user.id,
        content: newPostContent,
        image_url: imageUrl,
      }]);

      if (error) throw error;

      setNewPostContent('');
      setImageFile(null);
      setImagePreview(null);
      toast.success('Posted!');
      fetchPosts(); // Refresh
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to post');
    } finally {
      setIsPosting(false);
    }
  };

  const handleLike = async (postId: string) => {
    const isLiked = likedPosts.has(postId);
    const newLiked = new Set(likedPosts);

    // Optimistic update
    if (isLiked) {
      newLiked.delete(postId);
    } else {
      newLiked.add(postId);
    }
    setLikedPosts(newLiked);

    setPosts(posts.map(p =>
      p.id === postId
        ? { ...p, likes_count: isLiked ? Math.max(0, p.likes_count - 1) : p.likes_count + 1 }
        : p
    ));

    // Persist to Supabase
    if (isConfigured) {
      try {
        await supabase
          .from('posts')
          .update({ likes_count: isLiked ? Math.max(0, (posts.find(p => p.id === postId)?.likes_count || 1) - 1) : (posts.find(p => p.id === postId)?.likes_count || 0) + 1 })
          .eq('id', postId);
      } catch (err) {
        console.error('Like update failed:', err);
      }
    }
  };

  const toggleComments = async (postId: string) => {
    const newExpanded = new Set(expandedComments);
    if (newExpanded.has(postId)) {
      newExpanded.delete(postId);
    } else {
      newExpanded.add(postId);
      // Fetch comments if we don't have them
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
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    if (mins < 1440) return `${Math.floor(mins / 60)}h ago`;
    return `${Math.floor(mins / 1440)}d ago`;
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      {/* Create Post */}
      {user && (
        <GlassWrapper className="p-5 border-orange-500/10">
          <div className="flex gap-4">
            <Avatar className="w-11 h-11 border border-white/10 shadow-lg flex-shrink-0">
              <AvatarFallback className="bg-neutral-800 text-sm font-bold text-orange-300">
                {user.email?.[0]?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-3">
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                className="w-full bg-transparent border-none focus:ring-0 text-white placeholder:text-white/20 resize-none min-h-[50px] text-base outline-none leading-relaxed"
                placeholder="Share your perspective..."
                rows={2}
              />
              {imagePreview && (
                <div className="relative group inline-block">
                  <img src={imagePreview} className="max-h-48 rounded-xl border border-white/10 shadow-xl" />
                  <button
                    onClick={() => { setImageFile(null); setImagePreview(null); }}
                    className="absolute top-2 right-2 bg-black/60 hover:bg-rose-500 p-1.5 rounded-full backdrop-blur-md transition-all"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
              <div className="flex justify-between items-center pt-3 border-t border-white/10">
                <label className="flex items-center gap-2 text-white/40 hover:text-orange-400 cursor-pointer transition-colors text-sm font-medium group">
                  <div className="p-2 rounded-lg bg-white/5 group-hover:bg-orange-500/10 transition-colors">
                    <ImageIcon size={16} />
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageSelect} />
                </label>
                <Button
                  onClick={handlePost}
                  disabled={isPosting || (!newPostContent.trim() && !imageFile)}
                  size="sm"
                  className="bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 rounded-full font-bold px-6 shadow-lg shadow-orange-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-30"
                >
                  {isPosting ? <Loader2 className="animate-spin" size={16} /> : 'Post'}
                </Button>
              </div>
            </div>
          </div>
        </GlassWrapper>
      )}

      {!user && (
        <GlassWrapper className="p-6 border-orange-500/10 text-center">
          <p className="text-white/50 text-sm">Sign in to share your opinions and join the conversation.</p>
        </GlassWrapper>
      )}

      {/* Feed */}
      <div className="space-y-5">
        <div className="bg-gradient-to-br from-neutral-950 to-neutral-900 border border-white/5 rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-5 opacity-5"><Rss size={40} /></div>
          <h3 className="text-lg font-bold mb-1 bg-gradient-to-r from-orange-400 to-rose-400 bg-clip-text text-transparent">Public Discourse</h3>
          <p className="text-white/35 text-sm leading-relaxed max-w-md">Where opinions take shape and conversations begin.</p>
        </div>

        {loadingPosts && (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-orange-500" size={24} />
          </div>
        )}

        {!loadingPosts && posts.length === 0 && (
          <div className="text-center py-12 text-white/20 text-sm italic">
            No posts yet. Be the first to share your thoughts!
          </div>
        )}

        <AnimatePresence initial={false}>
          {posts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <GlassWrapper className="group p-0 overflow-hidden border-white/5 hover:border-white/10 transition-all">
                <div className="p-5 space-y-3">
                  <div className="flex gap-3 items-center">
                    <Avatar className="w-10 h-10 border border-white/10 shadow-lg">
                      <AvatarImage src={post.profiles?.avatar_url} />
                      <AvatarFallback className="bg-neutral-800 text-xs font-bold text-orange-300">
                        {post.profiles?.username?.[0]?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-bold text-orange-200 text-sm">{post.profiles?.full_name || post.profiles?.username || 'User'}</h4>
                      <p className="text-[11px] text-white/30">@{post.profiles?.username} · {formatTime(post.created_at)}</p>
                    </div>
                  </div>

                  <p className="text-white/80 leading-relaxed">{post.content}</p>

                  {post.image_url && (
                    <div className="rounded-xl overflow-hidden border border-white/10 shadow-xl">
                      <img src={post.image_url} alt="Post" className="w-full h-auto object-cover max-h-[400px]" />
                    </div>
                  )}

                  <div className="flex items-center gap-1 pt-2 border-t border-white/5">
                    <FeedAction
                      icon={<Heart size={16} fill={likedPosts.has(post.id) ? 'currentColor' : 'none'} />}
                      count={post.likes_count}
                      active={likedPosts.has(post.id)}
                      activeColor="text-rose-500"
                      onClick={() => handleLike(post.id)}
                    />
                    <FeedAction
                      icon={<MessageSquare size={16} />}
                      count={comments[post.id]?.length}
                      active={expandedComments.has(post.id)}
                      activeColor="text-blue-400"
                      onClick={() => toggleComments(post.id)}
                    />
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
                            <div key={comment.id} className="flex gap-2.5 items-start">
                              <Avatar className="w-7 h-7 border border-white/10 flex-shrink-0">
                                <AvatarImage src={comment.profiles?.avatar_url} />
                                <AvatarFallback className="bg-neutral-800 text-[10px] font-bold text-white/60">
                                  {comment.profiles?.username?.[0]?.toUpperCase() || 'U'}
                                </AvatarFallback>
                              </Avatar>
                              <div className="bg-white/5 rounded-xl rounded-tl-sm p-2.5 border border-white/5 flex-1">
                                <div className="flex items-center gap-2 mb-0.5">
                                  <span className="text-xs font-semibold text-white/60">@{comment.profiles?.username || 'user'}</span>
                                  <span className="text-[10px] text-white/20">{formatTime(comment.created_at)}</span>
                                </div>
                                <p className="text-white/70 text-sm leading-relaxed">{comment.content}</p>
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
                                className="bg-white/5 border-white/5 h-9 text-sm rounded-full focus-visible:ring-orange-500"
                              />
                              <Button
                                onClick={() => handleReply(post.id)}
                                size="sm"
                                className="bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 rounded-full h-9 px-3"
                              >
                                <Send size={14} />
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
