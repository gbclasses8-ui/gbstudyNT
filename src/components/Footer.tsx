import React from 'react';
import { Send, Heart, BookOpen, ShieldCheck, Sparkles } from 'lucide-react';
import { GB_LOGO_URL, TELEGRAM_URL } from '../data/batchesData';

interface FooterProps {
  onOpenTelegram: () => void;
  onSelectCategory: (cat: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenTelegram, onSelectCategory }) => {
  return (
    <footer className="w-full bg-[#0a0208] border-t border-pink-500/20 pt-12 pb-24 md:pb-12 text-pink-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Telegram Banner inside Footer */}
        <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-pink-950/70 via-pink-900/40 to-rose-950/70 border border-pink-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl mb-12">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 p-1 bg-gradient-to-tr from-pink-500 to-rose-400 pink-glow-sm hidden sm:block">
              <img src={GB_LOGO_URL} alt="GB STUDY" className="w-full h-full object-cover rounded-xl" />
            </div>
            <div>
              <span className="text-xs font-bold text-pink-400 uppercase tracking-widest flex items-center gap-1.5 justify-center md:justify-start">
                <Sparkles className="w-3.5 h-3.5" /> NEVER MISS A CLASS
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white font-heading mt-1">
                Join 50,000+ Students on GB STUDY Telegram
              </h3>
              <p className="text-xs sm:text-sm text-pink-200/70 mt-1 max-w-xl">
                Get daily live class links, handwritten PDF chapter notes, DPPs, test series, and real-time updates directly on your phone.
              </p>
            </div>
          </div>

          <button
            onClick={() => window.open(TELEGRAM_URL, '_blank', 'noopener,noreferrer')}
            className="shrink-0 px-6 py-3.5 rounded-xl font-bold text-sm text-white btn-pink-gradient pink-glow flex items-center gap-2 cursor-pointer transition-all"
          >
            <Send className="w-4 h-4" />
            Join Telegram Channel
          </button>
        </div>

        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden p-0.5 bg-gradient-to-tr from-pink-500 to-rose-400 pink-glow-sm">
                <img src={GB_LOGO_URL} alt="GB STUDY" className="w-full h-full object-cover rounded-[10px]" />
              </div>
              <span className="text-2xl font-black text-white font-heading">
                GB <span className="text-pink-400">STUDY</span>
              </span>
            </div>

            <p className="text-xs leading-relaxed max-w-md text-pink-300/80">
              GB STUDY is dedicated to making top-tier education accessible to every student across India. We believe education should be high quality, free, and without barriers. No logins, no paywalls, just pure learning.
            </p>

            <div className="flex items-center gap-2 text-xs text-pink-400 font-semibold pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Free &bull; No Login Required &bull; Android Friendly</span>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Popular Batches</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onSelectCategory('Class 10')}
                  className="hover:text-pink-300 transition-colors"
                >
                  Class 10th Aarambh 2.0
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('Class 9')}
                  className="hover:text-pink-300 transition-colors"
                >
                  Class 9th Aarambh 2.0
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('Class 11')}
                  className="hover:text-pink-300 transition-colors"
                >
                  Class 11th PCMB Science
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('Class 12')}
                  className="hover:text-pink-300 transition-colors"
                >
                  Class 12th Prarambh Pro
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('Foundation')}
                  className="hover:text-pink-300 transition-colors"
                >
                  Class 7 & 8 Foundation
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Community</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href={TELEGRAM_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-pink-300 flex items-center gap-1.5 transition-colors"
                >
                  <Send className="w-3 h-3 text-pink-400" />
                  Official Telegram
                </a>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('CUET')}
                  className="hover:text-pink-300 transition-colors"
                >
                  CUET UG Preparation
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('Olympiad')}
                  className="hover:text-pink-300 transition-colors"
                >
                  IOQM & Olympiad Courses
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('saved')}
                  className="hover:text-pink-300 transition-colors"
                >
                  My Saved Batches
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-6 border-t border-pink-500/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-pink-300/60">
          <p>© {new Date().getFullYear()} GB STUDY. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made for Students with <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" /> by GB STUDY
          </p>
        </div>
      </div>
    </footer>
  );
};
