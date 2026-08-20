'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Send, Loader2, MessageCircle, Share2, Smile, ArrowLeft, Check, User,
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { useLanguageStore } from '@/stores/language-store';
import { t } from '@/lib/i18n';
import { getSupabaseClient } from '@/lib/supabase/client';
import { FEED_EMOJIS } from '@/lib/constants';
import { formatRelativeTime, sanitizeUrl } from '@/lib/utils';
import { toast } from 'sonner';
import type { Post, Comment } from '@/lib/types';
import Link from 'next/link';

export default function PostDetailClient({ postId }: { postId: string }) {
  const { locale } = useLanguageStore();
  const { user } = useAuthStore();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeEmoji, setActiveEmoji] = useState(false);
  const [copied, setCopied] = useState(false);
  const supabase = getSupabaseClient();

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [postId]);

  const fetchPost = async () => {
    const { data } = await supabase
      .from('posts')
      .select('*, profiles(username, full_name, avatar_url)')
      .eq('id', postId)
      .single();
    setPost(data);
    setLoading(false);
  };

  const fetchComments = async () => {
    const { data } = await supabase
      .from('comments')
      .select('*, profiles(username, full_name, avatar_url)')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });
    setComments(data || []);
  };

  const handleReaction = async (emoji: string) => {
    if (!user || !post) return;
    const reactions = { ...(post.reactions || {}) };

    // Remove user ID from all other emoji reaction arrays
    Object.keys(reactions).forEach((key) => {
      if (key !== emoji) {
        reactions[key] = (reactions[key] || []).filter((id: string) => id !== user.id);
        if (reactions[key].length === 0) {
          delete reactions[key];
        }
      }
    });

    const current = reactions[emoji] || [];
    const already = current.includes(user.id);

    if (already) {
      reactions[emoji] = current.filter((id: string) => id !== user.id);
      if (reactions[emoji].length === 0) delete reactions[emoji];
    } else {
      reactions[emoji] = [...current, user.id];
    }

    setPost({ ...post, reactions });
    await supabase.from('posts').update({ reactions }).eq('id', postId);
  };

  const handleComment = async () => {
    const content = newComment.trim();
    if (!content || !user) return;

    const { error } = await supabase.from('comments').insert({
      post_id: postId,
      author_id: user.id,
      content,
    });
    if (error) {
      toast.error(t('post.cmt_fail', locale));
      return;
    }
    setNewComment('');
    fetchComments();
  };

  const handleShare = async () => {
    const postUrl = window.location.href;
    const shareText = post?.content?.slice(0, 100) || 'Check out this post';

    if (navigator.share) {
      try {
        await navigator.share({ title: 'Talk with Hisham', text: shareText, url: postUrl });
        return;
      } catch { /* fall through */ }
    }

    try {
      await navigator.clipboard.writeText(postUrl);
      setCopied(true);
      toast.success(t('post.link_copied', locale));
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(t('post.copy_fail', locale));
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <MessageCircle className="text-white/10 mb-4" size={48} />
        <h2 className="text-xl font-heading font-bold text-white mb-2">{t('post.signin_t', locale)}</h2>
        <p className="text-white/35 text-sm">{t('post.signin_d', locale)}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-6">
        <div className="glass-card p-5 space-y-3">
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
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-2xl mx-auto py-6 text-center">
        <p className="text-white/30 text-sm">{t('post.not_found', locale)}</p>
        <Link href="/feed" className="text-brand-400 text-sm mt-2 inline-block hover:underline">← {t('post.back_feed', locale)}</Link>
      </div>
    );
  }

  const avatarUrl = post.profiles?.avatar_url ? sanitizeUrl(post.profiles.avatar_url) : '';

  return (
    <div className="max-w-2xl mx-auto py-6">
      <Link href="/feed" className="flex items-center gap-2 text-white/40 hover:text-white text-sm mb-4 transition-colors">
        <ArrowLeft size={16} /> {t('post.back_feed', locale)}
      </Link>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
        {/* Post Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-surface-300 flex items-center justify-center text-white font-bold text-sm shadow-lg overflow-hidden">
            {avatarUrl ? (
              <img src={avatarUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <User size={24} className="text-white/40" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-base font-semibold text-white">{post.profiles?.full_name || post.profiles?.username || 'Unknown'}</p>
              {post.profiles?.username === 'hisham' && (
                <span className="text-[9px] bg-brand-500/10 text-brand-400 px-1.5 py-0.5 rounded-md font-semibold uppercase tracking-wider">{t('post.author', locale)}</span>
              )}
            </div>
            <p className="text-xs text-white/25">@{post.profiles?.username} · {formatRelativeTime(post.created_at)}</p>
          </div>
        </div>

        {/* Post Content */}
        <p className="text-white/80 leading-relaxed text-base mb-4 whitespace-pre-wrap">{post.content}</p>

        {post.image_url && (
          <div className="mb-4 rounded-xl overflow-hidden border border-white/5">
            <img src={sanitizeUrl(post.image_url)} alt={t("post.attach_alt", locale)} className="w-full max-h-[500px] object-cover" loading="lazy" />
          </div>
        )}

        {/* Reactions */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {FEED_EMOJIS.map((emoji) => {
            const users = post.reactions?.[emoji] || [];
            const count = users.length;
            const reacted = user ? users.includes(user.id) : false;
            if (count === 0 && !activeEmoji) return null;
            return (
              <button
                key={emoji}
                onClick={() => handleReaction(emoji)}
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

        {/* Actions */}
        <div className="flex items-center gap-1 pt-3 border-t border-white/5">
          <button onClick={() => setActiveEmoji(!activeEmoji)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/30 hover:text-white hover:bg-white/5 transition-all">
            <Smile size={14} /> {t('chat.react', locale)}
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/30 hover:text-white hover:bg-white/5 transition-all">
            <MessageCircle size={14} /> {comments.length || ''} {t('post.comment', locale)}
          </button>
          <button onClick={handleShare} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/30 hover:text-white hover:bg-white/5 transition-all">
            {copied ? <Check size={14} className="text-green-400" /> : <Share2 size={14} />} {t('post.share', locale)}
          </button>
        </div>

        {/* Emoji Picker */}
        {activeEmoji && (
          <div className="flex gap-1.5 pt-3">
            {FEED_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => { handleReaction(emoji); setActiveEmoji(false); }}
                className="text-xl hover:scale-130 transition-transform p-1"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </motion.div>

      {/* Comments Section */}
      <div className="glass-card p-6 mt-4">
        <h3 className="text-sm font-heading font-bold text-white mb-4">
          {t('post.comments', locale)} {comments.length > 0 && <span className="text-white/30">({comments.length})</span>}
        </h3>

        <div className="space-y-3 mb-4">
          {comments.length === 0 ? (
            <p className="text-white/20 text-xs text-center py-4">{t('post.no_comments', locale)}</p>
          ) : (
            comments.map((comment) => {
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
            })
          )}
        </div>

        {/* Comment Input */}
        <div className="flex gap-2 items-center pt-3 border-t border-white/5">
          <input
            type="text"
            placeholder={t("feed.comment_ph", locale)}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleComment()}
            className="flex-1 bg-white/3 border border-white/8 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-brand-500/30"
          />
          <button
            onClick={handleComment}
            disabled={!newComment.trim()}
            className="p-2.5 bg-brand-500/20 rounded-lg text-brand-400 hover:bg-brand-500/30 disabled:opacity-20 transition-all"
            title={t('post.send_cmt', locale)}
          >
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
