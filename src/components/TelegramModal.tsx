import React from 'react';
import { Send, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { GB_LOGO_URL, TELEGRAM_URL } from '../data/batchesData';

interface TelegramModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TelegramModal: React.FC<TelegramModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleJoin = () => {
    window.open(TELEGRAM_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md overflow-hidden rounded-3xl bg-[#140612] border border-pink-500/30 shadow-[0_0_50px_-10px_rgba(236,72,153,0.4)] text-pink-50 animate-in zoom-in-95 duration-250"
        role="dialog"
        aria-modal="true"
      >
        {/* Glow ambient background */}
        <div className="absolute -top-20 -right-20 w-44 h-44 bg-pink-600/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-44 h-44 bg-rose-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-pink-300/70 hover:text-white hover:bg-pink-500/20 rounded-full transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 flex flex-col items-center text-center relative z-10">
          {/* Logo Badge */}
          <div className="relative mb-5">
            <div className="w-20 h-20 rounded-2xl overflow-hidden p-1 bg-gradient-to-tr from-pink-500 via-rose-500 to-pink-300 shadow-[0_0_25px_rgba(236,72,153,0.5)]">
              <img
                src={GB_LOGO_URL}
                alt="GB STUDY Logo"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-pink-500 text-white rounded-full p-1 shadow-md">
              <CheckCircle2 className="w-4 h-4 fill-white text-pink-600" />
            </div>
          </div>

          {/* Heading */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/15 border border-pink-500/30 text-pink-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            Official Community
          </div>

          <h3 className="text-2xl font-black tracking-tight text-white font-heading">
            Join <span className="text-pink-400 drop-shadow-[0_0_12px_rgba(236,72,153,0.6)]">GB STUDY</span> Telegram Channel
          </h3>

          <p className="mt-3 text-sm text-pink-200/80 leading-relaxed max-w-xs">
            Get instant free daily live classes, chapter PDF notes, DPPs, test series, and study updates directly on your phone!
          </p>

          {/* Perks list */}
          <div className="w-full my-5 p-3 rounded-2xl bg-pink-950/40 border border-pink-500/20 text-left text-xs space-y-2 text-pink-200">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-400 shrink-0" />
              <span>100% Free Daily Lecture Links & Timetables</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-400 shrink-0" />
              <span>Handwritten Chapter Notes & DPP Sheets</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-400 shrink-0" />
              <span>Exam Alerts, Important Questions & Doubts</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="w-full flex flex-col gap-3">
            <button
              onClick={handleJoin}
              className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2.5 btn-pink-gradient pink-glow cursor-pointer"
            >
              <Send className="w-4 h-4" />
              Join Telegram
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 px-6 rounded-xl font-semibold text-sm text-pink-300 hover:text-white bg-pink-950/30 hover:bg-pink-900/40 border border-pink-500/20 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
