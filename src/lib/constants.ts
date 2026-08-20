import { Send, Linkedin, Facebook, MessageCircle, Github, Youtube, Twitter } from 'lucide-react';

export const SOCIAL_LINKS = [
  {
    label: 'X (Twitter)',
    href: 'https://x.com/ibne_nur94073',
    icon: Twitter,
  },
  {
    label: 'GitHub',
    href: 'https://github.com/joybanglaghoraranda-crypto',
    icon: Github,
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@muhibbullahhisham2025',
    icon: Youtube,
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/mhakhund',
    icon: Facebook,
  },
  {
    label: 'WhatsApp',
    href: 'https://wa.me/message/4Q4ZTZCBEGNIB1',
    icon: MessageCircle,
  },
  {
    label: 'Telegram',
    href: 'https://t.me/hishamakondo',
    icon: Send,
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/groups/20700010/',
    icon: Linkedin,
  },
] as const;

export const FEED_EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🔥'] as const;
export const CHAT_EMOJIS = ['👍', '❤️', '😂', '😮', '😢'] as const;

export const ADMIN_EMAIL = 'ibnenurakondo@gmail.com';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://twhisham.vercel.app';

export const SITE_CONFIG = {
  name: 'Muhibbullah Hisham',
  description: 'Educator, researcher, and mentor bridging classical Islamic scholarship with modern education - teaching, curriculum development, and youth mentoring.',
  url: 'https://twhisham.vercel.app',
  author: 'Muhibbullah Hisham',
  email: 'ibnenurakondo@gmail.com',
  phone: '+88 01898529450',
  whatsapp: 'https://wa.me/8801898529450',
} as const;
