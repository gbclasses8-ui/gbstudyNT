import React from 'react';
import { Sparkles, Send, PlayCircle, BookCheck, Users, Award } from 'lucide-react';
import { GB_LOGO_URL, TELEGRAM_URL } from '../data/batchesData';

interface HeroBannerProps {
  onExploreClick: () => void;
  onOpenTelegram: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onExploreClick, onOpenTelegram }) => {
  return (
    <div className="relative overflow-hidden pt-8 pb-10 sm:pt-12 sm:pb-14 border-b border-pink-500/20">
      {/* Background Neon Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-pink-600/20 via-rose-500/15 to-fuchsia-600/10 rounded-full blur-[110px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center">
        {/* Top Highlight Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-950/60 border border-pink-500/30 text-pink-300 text-xs font-semibold mb-6 pink-glow-sm">
          <Sparkles className="w-3.5 h-3.5 text-pink-400" />
          <span>India&apos;s Leading 100% Free Educational Ecosystem</span>
          <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
          <span className="text-white font-bold">Session 2026-27</span>
        </div>

        {/* Main Header */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white font-heading tracking-tight max-w-4xl leading-tight">
          Empowering Your Dreams with{' '}
          <span className="bg-gradient-to-r from-pink-400 via-rose-400 to-fuchsia-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(236,72,153,0.4)]">
            GB STUDY
          </span>
        </h1>

        <p className="mt-4 text-sm sm:text-base md:text-lg text-pink-200/80 max-w-2xl leading-relaxed">
          Access all premium batches, live & recorded video lectures, handwritten chapter notes, DPPs, and Olympiad modules completely free — no login or signup needed!
        </p>

        {/* Action Buttons */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3.5 sm:gap-4">
          <button
            onClick={onExploreClick}
            className="px-7 py-3.5 rounded-xl font-bold text-sm text-white flex items-center gap-2 btn-pink-gradient pink-glow cursor-pointer transition-all"
          >
            <PlayCircle className="w-4 h-4" />
            Explore All Batches
          </button>

          <button
            onClick={onOpenTelegram}
            className="px-6 py-3.5 rounded-xl font-bold text-sm text-pink-200 hover:text-white bg-pink-950/50 hover:bg-pink-900/60 border border-pink-500/30 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Send className="w-4 h-4 text-pink-400" />
            Join Telegram Channel
          </button>
        </div>

        {/* Stats Grid */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full max-w-4xl">
          <div className="p-4 rounded-2xl bg-pink-950/30 border border-pink-500/20 backdrop-blur-sm flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-pink-400 mb-1">
              <Award className="w-4 h-4" />
              <span className="text-xl sm:text-2xl font-black text-white font-heading">27+</span>
            </div>
            <span className="text-xs text-pink-300/80 font-medium">Premium Batches</span>
          </div>

          <div className="p-4 rounded-2xl bg-pink-950/30 border border-pink-500/20 backdrop-blur-sm flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-pink-400 mb-1">
              <PlayCircle className="w-4 h-4" />
              <span className="text-xl sm:text-2xl font-black text-white font-heading">1,200+</span>
            </div>
            <span className="text-xs text-pink-300/80 font-medium">Video Lectures</span>
          </div>

          <div className="p-4 rounded-2xl bg-pink-950/30 border border-pink-500/20 backdrop-blur-sm flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-pink-400 mb-1">
              <BookCheck className="w-4 h-4" />
              <span className="text-xl sm:text-2xl font-black text-white font-heading">500+</span>
            </div>
            <span className="text-xs text-pink-300/80 font-medium">PDF Notes & DPPs</span>
          </div>

          <div className="p-4 rounded-2xl bg-pink-950/30 border border-pink-500/20 backdrop-blur-sm flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-pink-400 mb-1">
              <Users className="w-4 h-4" />
              <span className="text-xl sm:text-2xl font-black text-white font-heading">100%</span>
            </div>
            <span className="text-xs text-pink-300/80 font-medium">Free Access</span>
          </div>
        </div>
      </div>
    </div>
  );
};
