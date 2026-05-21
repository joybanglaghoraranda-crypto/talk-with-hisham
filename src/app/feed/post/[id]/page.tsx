import type { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';
import PostDetailClient from './PostDetailClient';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

function getServerSupabase() {
  return createClient(supabaseUrl, supabaseKey);
}

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = getServerSupabase();

  const { data: post } = await supabase
    .from('posts')
    .select('content, image_url, profiles(full_name, username)')
    .eq('id', id)
    .single();

  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'This post does not exist or has been removed.',
    };
  }

  const profilesArr = post.profiles as unknown as { full_name: string; username: string }[] | null;
  const profiles = profilesArr?.[0] ?? null;
  const authorName = profiles?.full_name || profiles?.username || 'Unknown';
  const contentPreview = (post.content as string)?.slice(0, 160) || '';
  const title = `${authorName} on Talk with Hisham`;

  return {
    title,
    description: contentPreview,
    openGraph: {
      title,
      description: contentPreview,
      type: 'article',
      ...(post.image_url ? { images: [{ url: post.image_url, width: 1200, height: 630 }] } : {}),
    },
    twitter: {
      card: post.image_url ? 'summary_large_image' : 'summary',
      title,
      description: contentPreview,
      ...(post.image_url ? { images: [post.image_url] } : {}),
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { id } = await params;

  return (
    <div className="px-4 md:px-8 max-w-7xl mx-auto mesh-bg min-h-screen pb-4">
      <PostDetailClient postId={id} />
    </div>
  );
}
