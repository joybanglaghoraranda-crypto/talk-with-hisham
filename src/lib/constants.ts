import { Send, Linkedin, Facebook, MessageCircle } from 'lucide-react';

export const ADMIN_EMAIL = 'ibnenurakondo@gmail.com';

export const SOCIAL_LINKS = [
  {
    label: 'Telegram',
    href: 'https://t.me/twhisham',
    icon: Send,
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/groups/20700010/',
    icon: Linkedin,
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/share/g/1AxfLpatCd/',
    icon: Facebook,
  },
  {
    label: 'WhatsApp',
    href: 'https://chat.whatsapp.com/F4ceIDtHzFdG7n7q7AyetC',
    icon: MessageCircle,
  },
] as const;

export const FEED_EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🔥'] as const;
export const CHAT_EMOJIS = ['👍', '❤️', '😂', '😮', '😢'] as const;

export const SITE_CONFIG = {
  name: 'Talk with Hisham',
  description: 'A personal portfolio and social platform by Muhibbullah Hisham — for real-time debates, communication, and intellectual discourse.',
  url: 'https://talkwithhisham.vercel.app',
  author: 'Muhibbullah Hisham',
  email: 'ibnenurakondo@gmail.com',
  phone: '+88 01898529450',
  whatsapp: 'https://wa.me/8801898529450',
} as const;
