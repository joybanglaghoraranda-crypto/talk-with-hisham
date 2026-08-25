'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send, Bot, User, Loader2, MessageSquare } from 'lucide-react';
import { useLanguageStore } from '@/stores/language-store';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AiAssistantModal() {
  const { locale } = useLanguageStore();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        locale === 'bn'
          ? 'আসসালামু আলাইকুম! আমি মুহিব্বুল্লাহ হিশামের এআই সহকারী। হিশামের গবেষণা, শিক্ষা বা বিষয়ভিত্তিক আলোচনা সম্পর্কে যে কোনো প্রশ্ন করতে পারেন।'
          : 'Peace be upon you! I am the AI Discourse Assistant for Talk with Hisham. Ask me anything about Hisham’s background, scholarship, or topics!',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg }),
      });

      const data = await res.json();
      if (res.ok && data.reply) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: data.error || 'Sorry, I could not process your request right now.',
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Network connection issue. Please try again in a moment.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Ask AI Assistant"
        className="fixed bottom-20 md:bottom-6 right-6 z-40 flex items-center gap-2 bg-gradient-to-r from-brand-500 to-accent-500 hover:from-brand-600 hover:to-accent-600 text-white px-4 py-3 rounded-full shadow-2xl shadow-brand-500/30 border border-white/20 backdrop-blur-lg"
      >
        <Sparkles size={16} className="animate-pulse" />
        <span className="text-xs font-semibold tracking-wide">
          {locale === 'bn' ? 'এআই জিজ্ঞাসা' : 'Ask AI'}
        </span>
      </motion.button>

      {/* AI Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-36 md:bottom-20 right-4 md:right-6 z-50 w-[92vw] max-w-[380px] h-[500px] bg-surface-100/98 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/8 bg-surface-200/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
                  <Bot size={16} />
                </div>
                <div>
                  <h3 className="text-xs font-heading font-bold text-white leading-tight">
                    {locale === 'bn' ? 'হিশাম এআই সহকারী' : 'Hisham AI Assistant'}
                  </h3>
                  <p className="text-[10px] text-brand-400 font-mono">
                    {locale === 'bn' ? 'অনলাইন · ফ্রি এআই' : 'Online · Free AI'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar text-xs">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.role === 'assistant' && (
                    <div className="w-6 h-6 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400 flex-shrink-0 mt-0.5">
                      <Bot size={12} />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-gradient-to-r from-brand-500 to-accent-500 text-white rounded-br-none'
                        : 'bg-white/5 border border-white/8 text-white/90 rounded-bl-none'
                    }`}
                  >
                    {m.content}
                  </div>
                  {m.role === 'user' && (
                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white/60 flex-shrink-0 mt-0.5">
                      <User size={12} />
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-2 text-white/40 text-xs py-1">
                  <Loader2 size={13} className="animate-spin text-brand-400" />
                  <span>{locale === 'bn' ? 'চিন্তা করছে...' : 'Thinking...'}</span>
                </div>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="p-3 border-t border-white/8 bg-surface-200/30 flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={locale === 'bn' ? 'প্রশ্ন লিখুন...' : 'Ask a question...'}
                className="flex-1 bg-white/5 border border-white/8 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-brand-500/40"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white disabled:opacity-40 transition-all hover:scale-105 active:scale-95"
              >
                <Send size={13} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
