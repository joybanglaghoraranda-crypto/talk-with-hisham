import React, { useState } from 'react';
import { supabase, uploadFile } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import GlassWrapper from '../layout/GlassWrapper';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Heart, MessageSquare, Share2, MoreHorizontal, Image as ImageIcon, X, Loader2, Rss } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

interface Post {
  id: string;
  author: string;
  avatar: string;
  content: string;
  image_url?: string;
  likes: number;
  liked?: boolean;
  comments: number;
  time: string;
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
      comments: 12,
      time: '2h ago'
    },
    {
      id: '2',
      author: 'Hisham',
      avatar: '/images/hisham.png',
      content: 'Education is not merely the transfer of knowledge — it is the cultivation of the human soul. Every classroom is a garden, and every teacher is a gardener. Let us nurture wisely.',
      likes: 38,
      liked: false,
      comments: 8,
      time: '5h ago'
    },
    {
      id: '3',
      author: 'Hisham',
      avatar: '/images/hisham.png',
      content: 'True mentorship is not about creating followers — it\'s about empowering independent thinkers. When we guide youth, we must teach them how to think, not what to think.',
      likes: 56,
      liked: false,
      comments: 15,
      time: '1d ago'
    }
  ]);

  const [newPostContent, setNewPostContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isPosting, setIsPosting] = useState(false);

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
        comments: 0,
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
    <div className="max-w-2xl mx-auto flex flex-col gap-8">
      {/* Create Post */}
      <GlassWrapper className="p-4 border-orange-500/10">
        <div className="flex gap-4">
          <Avatar className="w-10 h-10 border border-white/10">
            <AvatarFallback className="bg-neutral-800 text-xs">
              {user ? user.email?.[0]?.toUpperCase() : 'G'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-4">
            <textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              className="w-full bg-transparent border-none focus:ring-0 text-white placeholder:text-white/20 resize-none min-h-[40px] text-lg outline-none"
              placeholder="What's on your mind?"
            />

            {imagePreview && (
              <div className="relative group inline-block">
                <img src={imagePreview} className="max-h-64 rounded-xl border border-white/10 shadow-2xl" />
                <button
                  onClick={() => { setImageFile(null); setImagePreview(null); }}
                  className="absolute top-2 right-2 bg-black/60 hover:bg-rose-500 p-2 rounded-full backdrop-blur-md transition-all"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            <div className="flex justify-between items-center pt-2 border-t border-white/10">
              <label className="flex items-center gap-2 text-white/50 hover:text-orange-400 cursor-pointer transition-colors text-sm font-medium">
                <ImageIcon size={20} />
                <span>Media</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleImageSelect} />
              </label>

              <Button
                onClick={handlePost}
                disabled={isPosting}
                size="sm"
                className="bg-orange-500 hover:bg-orange-600 rounded-full font-bold px-8"
              >
                {isPosting ? <Loader2 className="animate-spin" /> : 'Post Opinion'}
              </Button>
            </div>
          </div>
        </div>
      </GlassWrapper>

      {/* Feed List */}
      <div className="space-y-6">
        {/* Welcome Note */}
        <div className="bg-gradient-to-br from-neutral-900 to-black border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
            <Rss size={60} />
          </div>
          <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-orange-400 to-rose-400 bg-clip-text text-transparent">Public Discourse</h3>
          <p className="text-white/40 text-sm leading-relaxed max-w-md">
            Welcome to the public square. This is where opinions take shape and conversations begin.
            Stay curious, stay respectful, and let your voice be heard.
          </p>
        </div>

        {posts.map((post) => (
          <GlassWrapper key={post.id} className="group p-0 overflow-hidden border-white/5 hover:border-white/10 transition-all">
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex gap-3">
                  <Avatar className="w-12 h-12 border border-white/10 shadow-xl">
                    <AvatarImage src={post.avatar} />
                    <AvatarFallback>{post.author[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-bold text-orange-200">{post.author}</h4>
                    <p className="text-xs text-white/40">{post.time}</p>
                  </div>
                </div>
                <button className="text-white/20 hover:text-white transition-colors">
                  <MoreHorizontal size={20} />
                </button>
              </div>

              <p className="text-white/80 leading-relaxed text-lg">
                {post.content}
              </p>

              {post.image_url && (
                <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                  <img src={post.image_url} alt="Post media" className="w-full h-auto object-cover max-h-[500px]" />
                </div>
              )}

              <div className="flex items-center gap-6 pt-4 border-t border-white/10">
                <FeedAction
                  icon={<Heart size={18} fill={post.liked ? 'currentColor' : 'none'} />}
                  count={post.likes}
                  active={post.liked}
                  onClick={() => handleLike(post.id)}
                />
                <FeedAction icon={<MessageSquare size={18} />} count={post.comments} />
                <FeedAction icon={<Share2 size={18} />} onClick={() => handleShare(post)} />
              </div>
            </div>
          </GlassWrapper>
        ))}
      </div>
    </div>
  );
};

const FeedAction: React.FC<{ icon: React.ReactNode; count?: number; active?: boolean; onClick?: () => void }> = ({ icon, count, active, onClick }) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center gap-2 transition-all hover:scale-110",
      active ? "text-rose-500" : "text-white/40 hover:text-white"
    )}
  >
    {icon}
    {count !== undefined && <span className="text-xs font-bold">{count}</span>}
  </button>
);

export default PublicFeed;
