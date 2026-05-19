export interface Profile {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
  bio: string;
  updated_at?: string;
}

export interface Post {
  id: string;
  author_id: string;
  content: string;
  image_url?: string;
  likes_count: number;
  reactions?: Record<string, string[]>;
  is_pinned?: boolean;
  is_featured?: boolean;
  edited_at?: string;
  created_at: string;
  profiles?: {
    username: string;
    full_name: string;
    avatar_url: string;
  };
}

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  parent_id?: string;
  created_at: string;
  profiles?: {
    username: string;
    avatar_url: string;
  };
}

export interface ChatMessage {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
  image_url?: string;
  reactions?: Record<string, string[]>;
  reply_to?: string | null;
  profiles?: {
    username: string;
    avatar_url: string;
  };
}

export interface PrivateMessage {
  id: string;
  sender_id: string;
  sender_name: string;
  sender_contact: string;
  message: string;
  admin_reply: string | null;
  admin_reply_at: string | null;
  created_at: string;
}

export interface Notification {
  id: string;
  type: 'message_reply' | 'new_reaction' | 'new_comment' | 'system';
  title: string;
  body: string;
  read: boolean;
  created_at: string;
}
