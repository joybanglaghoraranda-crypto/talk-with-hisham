'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Moon, Copy, Check, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguageStore } from '@/stores/language-store';

interface WisdomItem {
  arabic: string;
  english: string;
  bengali: string;
  source: string;
}

const WISDOM_LIST: WisdomItem[] = [
  {
    arabic: 'وَقُل رَّبِّ زِدْنِي عِلْمًا',
    english: 'And say: "My Lord, increase me in knowledge."',
    bengali: 'আর বলুন: "হে আমার পালনকর্তা, আমার জ্ঞান বৃদ্ধি করে দিন।"',
    source: 'Surah Ta-Ha 20:114',
  },
  {
    arabic: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا',
    english: 'Indeed, with hardship comes ease.',
    bengali: 'নিশ্চয়ই কষ্টের সাথেই স্বস্তি রয়েছে।',
    source: 'Surah Ash-Sharh 94:6',
  },
  {
    arabic: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ',
    english: 'The best among you are those who learn the Quran and teach it.',
    bengali: 'তোমাদের মধ্যে সর্বোত্তম ব্যক্তি সে, যে কুরআন শেখে এবং অন্যকে শিক্ষা দেয়।',
    source: 'Sahih al-Bukhari 5027',
  },
  {
    arabic: 'ادْعُ إِلَىٰ سَبِيلِ رَبِّكَ بِالْحِكْمَةِ وَالْمَوْعِظَةِ الْحَسَنَةِ',
    english: 'Invite to the way of your Lord with wisdom and good instruction.',
    bengali: 'আপনার প্রতিপালকের পথের দিকে হিকমত ও উত্তম উপদেশের মাধ্যমে আহ্বান করুন।',
    source: 'Surah An-Nahl 16:125',
  },
];

export default function DailyWisdom() {
  const { locale } = useLanguageStore();
  const [wisdom, setWisdom] = useState<WisdomItem>(WISDOM_LIST[0]);
  const [hijriDate, setHijriDate] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Select wisdom based on day of year
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    setWisdom(WISDOM_LIST[dayOfYear % WISDOM_LIST.length]);

    // Format Hijri Date using browser's Intl
    try {
      const formatter = new Intl.DateTimeFormat(locale === 'bn' ? 'bn-BD-u-ca-islamic-umalqura' : 'en-US-u-ca-islamic-umalqura', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
      setHijriDate(formatter.format(new Date()));
    } catch {
      setHijriDate(locale === 'bn' ? 'হিজরি ১৪৪৭' : '1447 AH');
    }
  }, [locale]);

  const handleCopy = async () => {
    const textToCopy = `${wisdom.arabic}\n${locale === 'bn' ? wisdom.bengali : wisdom.english}\n— ${wisdom.source}`;
    await navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    toast.success(locale === 'bn' ? 'বাণীটি কপি করা হয়েছে!' : 'Wisdom quote copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative overflow-hidden rounded-2xl bg-surface-100/60 border border-white/6 p-6 backdrop-blur-xl shadow-xl hover:border-brand-500/20 transition-all duration-300"
    >
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header with Hijri Date */}
      <div className="flex items-center justify-between gap-2 border-b border-white/6 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
            <BookOpen size={14} />
          </div>
          <span className="font-mono text-xs uppercase tracking-widest text-brand-400 font-semibold">
            {locale === 'bn' ? 'আজকের অনুপ্রেরণা' : 'Daily Reflection'}
          </span>
        </div>

        {hijriDate && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/4 border border-white/6 text-[11px] font-mono text-white/50">
            <Moon size={11} className="text-brand-400" />
            <span>{hijriDate}</span>
          </div>
        )}
      </div>

      {/* Arabic Quote */}
      <p className="text-xl md:text-2xl font-serif text-right text-brand-200/90 leading-relaxed tracking-wide my-3 select-all">
        {wisdom.arabic}
      </p>

      {/* Translation */}
      <p className="text-xs md:text-sm text-white/70 leading-relaxed font-sans mt-2">
        {locale === 'bn' ? wisdom.bengali : wisdom.english}
      </p>

      {/* Footer / Citation */}
      <div className="flex items-center justify-between pt-4 mt-3 border-t border-white/4">
        <span className="font-mono text-[10px] text-white/35 uppercase tracking-wider">
          {wisdom.source}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-[11px] font-mono text-white/40 hover:text-brand-400 transition-colors"
        >
          {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
          <span>{copied ? (locale === 'bn' ? 'কপি হয়েছে' : 'Copied') : (locale === 'bn' ? 'কপি করুন' : 'Copy')}</span>
        </button>
      </div>
    </motion.div>
  );
}
