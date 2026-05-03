import { Send, Linkedin, Facebook, MessageCircle } from 'lucide-react';

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
