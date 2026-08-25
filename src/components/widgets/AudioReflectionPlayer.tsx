'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, RotateCcw, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguageStore } from '@/stores/language-store';

interface AudioReflectionPlayerProps {
  title?: string;
  speaker?: string;
  durationText?: string;
  src?: string;
}

export default function AudioReflectionPlayer({
  title = 'Voice Reflection: On Knowledge, Ethics and Moderation',
  speaker = 'Muhibbullah Hisham',
  durationText = '2:45',
  src,
}: AudioReflectionPlayerProps) {
  const { locale } = useLanguageStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState('0:00');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (!audioRef.current && !src) {
      // Simulate playback if no custom audio file is provided yet
      setIsPlaying((prev) => !prev);
      return;
    }

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => {});
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Simulated visualizer / progress animation when running demo playback
  useEffect(() => {
    let interval: any;
    if (isPlaying && !src) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          const next = prev + 1;
          const secs = Math.floor((next / 100) * 165);
          const mins = Math.floor(secs / 60);
          const remSecs = secs % 60;
          setCurrentTime(`${mins}:${remSecs < 10 ? '0' : ''}${remSecs}`);
          return next;
        });
      }, 300);
    }
    return () => clearInterval(interval);
  }, [isPlaying, src]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative overflow-hidden rounded-2xl bg-surface-100/60 border border-white/6 p-5 backdrop-blur-xl shadow-xl hover:border-brand-500/20 transition-all duration-300"
    >
      {src && (
        <audio
          ref={audioRef}
          src={src}
          onTimeUpdate={() => {
            if (audioRef.current) {
              const cur = audioRef.current.currentTime;
              const dur = audioRef.current.duration || 1;
              setProgress((cur / dur) * 100);
              const mins = Math.floor(cur / 60);
              const remSecs = Math.floor(cur % 60);
              setCurrentTime(`${mins}:${remSecs < 10 ? '0' : ''}${remSecs}`);
            }
          }}
          onEnded={() => setIsPlaying(false)}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
          <span className="font-mono text-[11px] uppercase tracking-widest text-brand-400 font-semibold">
            {locale === 'bn' ? 'অডিও বার্তা' : 'Audio Note'}
          </span>
        </div>
        <span className="font-mono text-[10px] text-white/30 tracking-wider">
          {currentTime} / {durationText}
        </span>
      </div>

      {/* Title */}
      <h4 className="text-sm font-semibold text-white/90 truncate mb-1">
        {title}
      </h4>
      <p className="text-[11px] text-white/40 mb-4 font-mono">{speaker}</p>

      {/* Progress Bar & Waveform Simulation */}
      <div className="space-y-2 mb-4">
        {/* Animated Sound Wave Bars */}
        <div className="flex items-center justify-between gap-1 h-8 px-1">
          {Array.from({ length: 28 }).map((_, i) => {
            const isBarActive = (i / 28) * 100 <= progress;
            const barHeight = Math.sin(i * 0.4) * 12 + 16;
            return (
              <div
                key={i}
                style={{
                  height: isPlaying ? `${Math.max(6, (barHeight * (Math.random() * 0.5 + 0.75)))}px` : `${barHeight}px`,
                }}
                className={`w-1 rounded-full transition-all duration-150 ${
                  isBarActive ? 'bg-brand-400 shadow-sm shadow-brand-500/50' : 'bg-white/10'
                }`}
              />
            );
          })}
        </div>

        {/* Scrubber track */}
        <div className="relative h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div
            style={{ width: `${progress}%` }}
            className="h-full bg-gradient-to-r from-brand-500 to-accent-500 rounded-full transition-all duration-150"
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={togglePlay}
          className="flex items-center gap-2 bg-gradient-to-r from-brand-500 to-accent-500 hover:from-brand-600 hover:to-accent-600 text-white text-xs font-semibold py-2 px-5 rounded-xl shadow-lg shadow-brand-500/20 transition-all hover:scale-105 active:scale-95"
        >
          {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          <span>{isPlaying ? (locale === 'bn' ? 'বিরতি' : 'Pause') : (locale === 'bn' ? 'শুনুন' : 'Listen')}</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setProgress(0);
              setCurrentTime('0:00');
              if (audioRef.current) audioRef.current.currentTime = 0;
            }}
            className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors"
            title="Restart"
          >
            <RotateCcw size={14} />
          </button>
          <button
            onClick={() => {
              setIsMuted(!isMuted);
              if (audioRef.current) audioRef.current.muted = !isMuted;
            }}
            className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors"
          >
            {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
