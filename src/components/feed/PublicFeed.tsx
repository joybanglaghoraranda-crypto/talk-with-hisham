import React, { useState } from 'react';
import { uploadFile } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import GlassWrapper from '../layout/GlassWrapper';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Heart, MessageSquare, Share2, MoreHorizontal, Image as ImageIcon, X, Loader2, Rss, Send, Bookmark } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { cn } from '@/lib/utils';

interface Comment {
  id: string;
  author: string;
  content: string;
  time: string;
}

interface Post {
  id: string;
  author: string;
  avatar: string;
  content: string;
  image_url?: string;
  likes: number;
  liked?: boolean;
  saved?: boolean;
  comments: Comment[];
  time: string;
  showComments?: boolean;
}

const PublicFeed: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      author: 'Hisham',
      avatar: '/images/hisham.png',
      content: 'The future of social media isn\'t algorithm-driven feeds, it\'s synchronous communication. We need to talk more, not just scroll more. What do you think?',
      likes: 42,
      liked: false,
      saved: false,
      comments: [
        { id: 'c1', author: 'Arif', content: 'Absolutely agree! Real-time conversation is what\'s missing.', time: '1h ago' },
        { id: 'c2', author: 'Nadia', content: 'This resonates deeply. Social media has become too passive.', time: '45m ago' },
      ],
      time: '2h ago'
    },
    {
      id: '2',
      author: 'Hisham',
      avatar: '/images/hisham.png',
      content: 'Education is not merely the transfer of knowledge — it is the cultivation of the human soul. Every classroom is a garden, and every teacher is a gardener. Let us nurture wisely.',
      likes: 38,
      liked: false,
      saved: false,
      comments: [
        { id: 'c3', author: 'Fatima', content: 'Beautiful analogy, MashaAllah 🌱', time: '3h ago' },
      ],
      time: '5h ago'
    },
    {
      id: '3',
      author: 'Hisham',
      avatar: '/images/hisham.png',
      content: 'True mentorship is not about creating followers — it\'s about empowering independent thinkers. When we guide youth, we must teach them how to think, not what to think.',
      likes: 56,
      liked: false,
      saved: false,
      comments: [],
      time: '1d ago'
    }
  ]);

  const [newPostContent, setNewPostContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handlePost = async () => {
    if (!newPostContent.trim() && !imageFile) return;
    setIsPosting(true);

    try {
      let imageUrl = undefined;
      if (imageFile && user) {
        const path = `posts/${user.id}/${Date.now()}-${imageFile.name}`;
        imageUrl = await uploadFile('media', path, imageFile);
      } else if (imageFile) {
        imageUrl = imagePreview ?? undefined;
      }

      const newPost: Post = {
        id: Math.random().toString(),
        author: user?.email?.split('@')[0] || 'Guest',
        avatar: '',
        content: newPostContent,
        image_url: imageUrl,
        likes: 0,
        liked: false,
        saved: false,
        comments: [],
        time: 'Just now'
      };

      setPosts([newPost, ...posts]);
      setNewPostContent('');
      setImageFile(null);
      setImagePreview(null);
      toast.success('Opinion posted!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to post');
    } finally {
      setIsPosting(false);
    }
  };

  const handleLike = (postId: string) => {
    setPosts(posts.map(p =>
      p.id === postId
        ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
        : p
    ));
  };

  const handleSave = (postId: string) => {
    setPosts(posts.map(p =>
      p.id === postId ? { ...p, saved: !p.saved } : p
    ));
    const post = posts.find(p => p.id === postId);
    toast.success(post?.saved ? 'Removed from saved' : 'Saved!');
  };

  const toggleComments = (postId: string) => {
    setPosts(posts.map(p =>
      p.id === postId ? { ...p, showComments: !p.showComments } : p
    ));
  };

  const handleReply = (postId: string) => {
    const text = replyTexts[postId]?.trim();
    if (!text) return;

    setPosts(posts.map(p =>
      p.id === postId
        ? {
            ...p,
            comments: [...p.comments, {
              id: Math.random().toString(),
              author: user?.email?.split('@')[0] || 'Guest',
              content: text,
              time: 'Just now'
            }],
            showComments: true,
          }
        : p
    ));
    setReplyTexts(prev => ({ ...prev, [postId]: '' }));
    toast.success('Reply added!');
  };

  const handleShare = (post: Post) => {
    if (navigator.share) {
      navigator.share({
        title: 'Talk with Hisham',
        text: post.content,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(post.content);
      toast.success('Copied to clipboard!');
    }
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      {/* Create Post */}
      <GlassWrapper className="p-5 border-orange-500/10">
        <div className="flex gap-4">
          <Avatar className="w-11 h-11 border border-white/10 shadow-lg">
            <AvatarFallback className="bg-neutral-800 text-sm font-bold text-orange-300">
              {user ? user.email?.[0]?.toUpperCase() : 'G'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-4">
            <textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              className="w-full bg-transparent border-none focus:ring-0 text-white placeholder:text-white/20 resize-none min-h-[60px] text-lg outline-none leading-relaxed"
              placeholder="Share your perspective..."
              rows={2}
            />

            {imagePreview && (
              <div className="relative group inline-block">
                <img src={imagePreview} className="max-h-56 rounded-xl border border-white/10 shadow-2xl" />
                <button
                  onClick={() => { setImageFile(null); setImagePreview(null); }}
                  className="absolute top-2 right-2 bg-black/60 hover:bg-rose-500 p-2 rounded-full backdrop-blur-md transition-all"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            <div className="flex justify-between items-center pt-3 border-t border-white/10">
              <label className="flex items-center gap-2 text-white/40 hover:text-orange-400 cursor-pointer transition-colors text-sm font-medium group">
                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-orange-500/10 transition-colors">
                  <ImageIcon size={16} />
                </div>
                <span className="hidden sm:inline">Media</span>
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

      {/* Feed List */}
      <div className="space-y-5">
        {/* Welcome Note */}
        <div className="bg-gradient-to-br from-neutral-950 to-neutral-900 border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
            <Rss size={50} />
          </div>
          <h3 className="text-lg font-bold mb-1 bg-gradient-to-r from-orange-400 to-rose-400 bg-clip-text text-transparent">Public Discourse</h3>
          <p className="text-white/35 text-sm leading-relaxed max-w-md">
            Where opinions take shape and conversations begin. Stay curious, stay respectful.
          </p>
        </div>

        <AnimatePresence initial={false}>
          {posts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <GlassWrapper className="group p-0 overflow-hidden border-white/5 hover:border-white/10 transition-all">
                <div className="p-6 space-y-4">
                  {/* Post Header */}
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3 items-center">
                      <Avatar className="w-11 h-11 border border-white/10 shadow-xl">
                        <AvatarImage src={post.avatar} />
                        <AvatarFallback className="bg-neutral-800 text-sm font-bold">{post.author[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-bold text-orange-200 text-sm">{post.author}</h4>
                        <p className="text-[11px] text-white/30">{post.time}</p>
                      </div>
                    </div>
                    <button className="text-white/15 hover:text-white/50 transition-colors p-1">
                      <MoreHorizontal size={18} />
                    </button>
                  </div>

                  {/* Content */}
                  <p className="text-white/80 leading-relaxed text-[15px]">
                    {post.content}
                  </p>

                  {post.image_url && (
                    <div className="rounded-xl overflow-hidden border border-white/10 shadow-2xl">
                      <img src={post.image_url} alt="Post media" className="w-full h-auto object-cover max-h-[400px]" />
                    </div>
                  )}

                  {/* Action Bar */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <div className="flex items-center gap-1">
                      <FeedAction
                        icon={<Heart size={16} fill={post.liked ? 'currentColor' : 'none'} />}
                        count={post.likes}
                        active={post.liked}
                        activeColor="text-rose-500"
                        onClick={() => handleLike(post.id)}
                      />
                      <FeedAction
                        icon={<MessageSquare size={16} />}
                        count={post.comments.length}
                        active={post.showComments}
                        activeColor="text-blue-400"
                        onClick={() => toggleComments(post.id)}
                      />
                      <FeedAction
                        icon={<Share2 size={16} />}
                        onClick={() => handleShare(post)}
                      />
                    </div>
                    <FeedAction
                      icon={<Bookmark size={16} fill={post.saved ? 'currentColor' : 'none'} />}
                      active={post.saved}
                      activeColor="text-orange-400"
                      onClick={() => handleSave(post.id)}
                    />
                  </div>

                  {/* Comments Section */}
                  <AnimatePresence>
                    {post.showComments && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-3 pt-3 border-t border-white/5">
                          {post.comments.length === 0 && (
                            <p className="text-white/20 text-xs italic text-center py-2">No replies yet. Be the first!</p>
                          )}

                          {post.comments.map((comment) => (
                            <div key={comment.id} className="flex gap-3 items-start">
                              <Avatar className="w-7 h-7 border border-white/10 flex-shrink-0">
                                <AvatarFallback className="bg-neutral-800 text-[10px] font-bold text-white/60">
                                  {comment.author[0].toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="bg-white/5 rounded-xl rounded-tl-sm p-3 border border-white/5 flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs font-semibold text-white/60">{comment.author}</span>
                                  <span className="text-[10px] text-white/20">{comment.time}</span>
                                </div>
                                <p className="text-white/70 text-sm leading-relaxed">{comment.content}</p>
                              </div>
                            </div>
                          ))}

                          {/* Reply Input */}
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
    {count !== undefined && <span className="text-xs font-semibold">{count}</span>}
  </button>
);

export default PublicFeed;
