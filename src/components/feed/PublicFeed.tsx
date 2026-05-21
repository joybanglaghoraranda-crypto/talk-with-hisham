'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Loader2, ImagePlus, X, MessageCircle, Trash2, Share2,
  Smile, BookOpen, Link2, Check, User,
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { getSupabaseClient } from '@/lib/supabase/client';
import { FEED_EMOJIS } from '@/lib/constants';
import { formatRelativeTime, uploadFile, sanitizeUrl } from '@/lib/utils';
import { toast } from 'sonner';
import type { Post, Comment } from '@/lib/types';
import Link from 'next/link';

export default function PublicFeed() {
  const { user, isAdmin } = useAuthStore();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState('');
  const [postImage, setPostImage] = useState<File | null>(null);
  const [postImagePreview, setPostImagePreview] = useState<string | null>(null);
  const [posting, setPosting] = useState(false);
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});
  const [newComments, setNewComments] = useState<Record<string, string>>({});
  const [activeEmoji, setActiveEmoji] = useState<string | null>(null);
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null);
  const supabase = getSupabaseClient();

  const fetchPosts = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*, profiles(username, full_name, avatar_url)')
        .order('created_at', { ascending: false })
        .limit(30);
      if (error) throw error;
      setPosts(data || []);

      // Fetch comment counts for all posts
      if (data && data.length > 0) {
        const postIds = data.map((p: Post) => p.id);
        const { data: countData } = await supabase
          .from('comments')
          .select('post_id')
          .in('post_id', postIds);
        if (countData) {
          const counts: Record<string, number> = {};
          countData.forEach((c: { post_id: string }) => {
            counts[c.post_id] = (counts[c.post_id] || 0) + 1;
          });
          setCommentCounts(counts);
        }
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchPosts();
    // Realtime subscription
    const channel = supabase
      .channel('public_feed')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, () => fetchPosts())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchPosts, supabase]);

  const handlePost = async () => {
    if (!newPost.trim() || !isAdmin) return;
    setPosting(true);
    try {
      let imageUrl: string | undefined;
      if (postImage) {
        const path = `posts/${Date.now()}_${postImage.name}`;
        imageUrl = await uploadFile(supabase as any, 'media', path, postImage);
      }
      const { error } = await supabase.from('posts').insert({
        author_id: user!.id,
        content: newPost.trim(),
        image_url: imageUrl || null,
        likes_count: 0,
        reactions: {},
      });
      if (error) throw error;
      toast.success('Post published!');
      setNewPost('');
      setPostImage(null);
      setPostImagePreview(null);
    } catch (err: any) {
      toast.error(err.message || 'Failed to post');
    } finally {
      setPosting(false);
    }
  };

  const handleReaction = async (postId: string, emoji: string) => {
    if (!user) return;
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    const reactions = { ...(post.reactions || {}) };
    const current = reactions[emoji] || [];
    const already = current.includes(user.id);

    if (already) {
      reactions[emoji] = current.filter((id: string) => id !== user.id);
      if (reactions[emoji].length === 0) delete reactions[emoji];
    } else {
      reactions[emoji] = [...current, user.id];
    }

    // Optimistic update
    setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, reactions } : p)));

    await supabase.from('posts').update({ reactions }).eq('id', postId);
  };

  const handleDelete = async (postId: string) => {
    if (!isAdmin) return;
    const confirmed = window.confirm('Delete this post?');
    if (!confirmed) return;
    await supabase.from('posts').delete().eq('id', postId);
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    toast.success('Post deleted');
  };

  const fetchComments = async (postId: string) => {
    const { data } = await supabase
      .from('comments')
      .select('*, profiles(username, full_name, avatar_url)')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });
    setComments((prev) => ({ ...prev, [postId]: data || [] }));
    if (data) {
      setCommentCounts((prev) => ({ ...prev, [postId]: data.length }));
    }
  };

  const toggleComments = (postId: string) => {
    const updated = new Set(expandedComments);
    if (updated.has(postId)) {
      updated.delete(postId);
    } else {
      updated.add(postId);
      fetchComments(postId);
    }
    setExpandedComments(updated);
  };

  const handleComment = async (postId: string) => {
    const content = newComments[postId]?.trim();
    if (!content || !user) return;

    const { error } = await supabase.from('comments').insert({
      post_id: postId,
      author_id: user.id,
      content,
    });
    if (error) {
      toast.error('Failed to post comment');
      return;
    }
    setNewComments((prev) => ({ ...prev, [postId]: '' }));
    fetchComments(postId);
  };

  const handleShare = async (post: Post) => {
    const postUrl = `${window.location.origin}/feed/post/${post.id}`;
    const shareText = post.content.slice(0, 100) + (post.content.length > 100 ? '...' : '');

    // Try Web Share API first
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Talk with Hisham',
          text: shareText,
          url: postUrl,
        });
        return;
      } catch {
        // User cancelled or Share API failed, fall through to clipboard
      }
    }

    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(postUrl);
      setCopiedPostId(post.id);
      toast.success('Post link copied!');
      setTimeout(() => setCopiedPostId(null), 2000);
    } catch {
      toast.error('Failed to copy link');
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be under 5MB');
        return;
      }
      setPostImage(file);
      setPostImagePreview(URL.createObjectURL(file));
    }
  };

  const getReactionCount = (post: Post, emoji: string) => {
    return (post.reactions?.[emoji] || []).length;
  };

  const hasReacted = (post: Post, emoji: string) => {
    return user ? (post.reactions?.[emoji] || []).includes(user.id) : false;
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <BookOpen className="text-white/10 mb-4" size={48} />
        <h2 className="text-xl font-heading font-bold text-white mb-2">Feed Access Required</h2>
        <p className="text-white/35 text-sm">Sign in to view posts and join the conversation.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-white tracking-tight mb-1">Community Feed</h1>
        <p className="text-white/30 text-sm">Follow the discourse, react, and share your thoughts.</p>
      </div>

      {/* Post Composer (Admin Only) */}
      {isAdmin && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-5 mb-6"
        >
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Share your thoughts with the community..."
            className="w-full bg-transparent text-white placeholder:text-white/20 outline-none resize-none text-sm min-h-[80px] leading-relaxed"
          />
          {postImagePreview && (
            <div className="relative mt-3 inline-block">
              <img src={sanitizeUrl(postImagePreview)} alt="Preview" className="max-h-48 rounded-xl border border-white/8" />
              <button onClick={() => { setPostImage(null); setPostImagePreview(null); }} className="absolute -top-2 -right-2 bg-surface-200 border border-white/8 p-1.5 rounded-full text-white/40 hover:text-white" title="Remove image">
                <X size={12} />
              </button>
            </div>
          )}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
            <label className="flex items-center gap-2 text-white/30 hover:text-white/60 cursor-pointer transition-colors text-xs">
              <ImagePlus size={16} />
              <span>Add Image</span>
              <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
            </label>
            <button
              onClick={handlePost}
              disabled={posting || !newPost.trim()}
              className="flex items-center gap-2 bg-gradient-to-r from-brand-500 to-accent-500 hover:from-brand-600 hover:to-accent-600 px-5 py-2 rounded-lg text-sm font-bold text-white shadow-lg shadow-brand-500/15 disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
            >
              {posting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              Post
            </button>
          </div>
        </motion.div>
      )}

      {/* Posts */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full skeleton" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-3 w-32 skeleton rounded-md" />
                  <div className="h-2 w-20 skeleton rounded-md" />
                </div>
              </div>
              <div className="h-3 w-full skeleton rounded-md" />
              <div className="h-3 w-3/4 skeleton rounded-md" />
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="glass-card py-16 text-center">
          <BookOpen className="mx-auto text-white/10 mb-3" size={40} />
          <p className="text-white/25 text-sm">No posts yet. Stay tuned!</p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {posts.map((post) => {
              const avatarUrl = post.profiles?.avatar_url ? sanitizeUrl(post.profiles.avatar_url) : '';
              return (
              <motion.div
                key={post.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-card glass-card-hover p-5 group"
              >
                {/* Post Header */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-surface-300 flex items-center justify-center text-white font-bold text-xs shadow-lg overflow-hidden">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <User size={20} className="text-white/40" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-white truncate">{post.profiles?.full_name || post.profiles?.username || 'Unknown'}</p>
                      {post.author_id === user?.id || post.profiles?.username === 'hisham' ? (
                        <span className="text-[9px] bg-brand-500/10 text-brand-400 px-1.5 py-0.5 rounded-md font-semibold uppercase tracking-wider">Author</span>
                      ) : null}
                    </div>
                    <p className="text-[11px] text-white/25">@{post.profiles?.username} · {formatRelativeTime(post.created_at)}</p>
                  </div>
                  {isAdmin && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleDelete(post.id)} className="p-1.5 text-white/20 hover:text-accent-400 transition-colors rounded-lg hover:bg-white/5" title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Post Content */}
                <Link href={`/feed/post/${post.id}`} className="block">
                  <p className="text-white/75 leading-relaxed text-[15px] mb-3 whitespace-pre-wrap">{post.content}</p>
                </Link>

                {post.image_url && (
                  <Link href={`/feed/post/${post.id}`} className="block mb-3 rounded-xl overflow-hidden border border-white/5">
                    <img src={sanitizeUrl(post.image_url)} alt="Post attachment" className="w-full max-h-96 object-cover" loading="lazy" />
                  </Link>
                )}

                {/* Reactions */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {FEED_EMOJIS.map((emoji) => {
                    const count = getReactionCount(post, emoji);
                    const reacted = hasReacted(post, emoji);
                    if (count === 0 && activeEmoji !== post.id) return null;
                    return (
                      <button
                        key={emoji}
                        onClick={() => handleReaction(post.id, emoji)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs transition-all ${
                          reacted
                            ? 'bg-brand-500/15 border border-brand-500/30 text-brand-300'
                            : 'bg-white/3 border border-white/8 text-white/40 hover:bg-white/5'
                        }`}
                      >
                        <span className="text-sm">{emoji}</span>
                        {count > 0 && <span className="font-medium">{count}</span>}
                      </button>
                    );
                  })}
                </div>

                {/* Actions: React, Comment, Share */}
                <div className="flex items-center gap-1 pt-2 border-t border-white/5">
                  <button onClick={() => setActiveEmoji(activeEmoji === post.id ? null : post.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/30 hover:text-white hover:bg-white/5 transition-all" title="React">
                    <Smile size={14} /> React
                  </button>
                  <button onClick={() => toggleComments(post.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/30 hover:text-white hover:bg-white/5 transition-all">
                    <MessageCircle size={14} /> {commentCounts[post.id] ? `${commentCounts[post.id]}` : ''} Comment
                  </button>
                  <button onClick={() => handleShare(post)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/30 hover:text-white hover:bg-white/5 transition-all" title="Share">
                    {copiedPostId === post.id ? <Check size={14} className="text-green-400" /> : <Share2 size={14} />} Share
                  </button>
                </div>

                {/* Emoji Picker */}
                <AnimatePresence>
                  {activeEmoji === post.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="flex gap-1.5 pt-3">
                        {FEED_EMOJIS.map((emoji) => (
                          <button
                            key={emoji}
                            onClick={() => { handleReaction(post.id, emoji); setActiveEmoji(null); }}
                            className="text-xl hover:scale-130 transition-transform p-1"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Comments */}
                <AnimatePresence>
                  {expandedComments.has(post.id) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3 pt-3 border-t border-white/5 space-y-3">
                        {(comments[post.id] || []).map((comment) => {
                          const commentAvatar = comment.profiles?.avatar_url ? sanitizeUrl(comment.profiles.avatar_url) : '';
                          return (
                          <div key={comment.id} className="flex gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-surface-300 flex items-center justify-center text-[9px] font-bold text-white/40 flex-shrink-0 overflow-hidden">
                              {commentAvatar ? (
                                <img src={commentAvatar} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              ) : (
                                <User size={14} className="text-white/40" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-white/70">{comment.profiles?.full_name || comment.profiles?.username || 'User'}</span>
                                <span className="text-[10px] text-white/20">{formatRelativeTime(comment.created_at)}</span>
                              </div>
                              <p className="text-xs text-white/50 mt-0.5 leading-relaxed">{comment.content}</p>
                            </div>
                          </div>
                          );
                        })}

                        <div className="flex gap-2 items-center">
                          <input
                            type="text"
                            placeholder="Write a comment..."
                            value={newComments[post.id] || ''}
                            onChange={(e) => setNewComments((prev) => ({ ...prev, [post.id]: e.target.value }))}
                            onKeyDown={(e) => e.key === 'Enter' && handleComment(post.id)}
                            className="flex-1 bg-white/3 border border-white/8 rounded-lg px-3 py-2 text-xs text-white placeholder:text-white/20 outline-none focus:border-brand-500/30"
                          />
                          <button
                            onClick={() => handleComment(post.id)}
                            disabled={!newComments[post.id]?.trim()}
                            className="p-2 bg-brand-500/20 rounded-lg text-brand-400 hover:bg-brand-500/30 disabled:opacity-20 transition-all"
                            title="Send comment"
                          >
                            <Send size={13} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
