import React from 'react';
import { LayoutGrid, Bookmark, Send } from 'lucide-react';
import { GB_LOGO_URL, TELEGRAM_URL } from '../data/batchesData';

interface NavbarProps {
  currentTab: 'new' | 'wishlist';
  onSwitchTab: (tab: 'new' | 'wishlist') => void;
  enrolledCount: number;
  onOpenTelegram: () => void;
  onReload: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSwitchTab,
  enrolledCount,
  onOpenTelegram,
  onReload,
}) => {
  return (
    <nav className="w-full z-40 nav-glass h-[70px] sticky top-0">
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
        {/* Logo and Brand */}
        <div
          className="flex items-center gap-3 cursor-pointer btn-click-effect"
          onClick={onReload}
        >
          <div className="w-9 h-9 bg-black border border-white/10 rounded-lg flex items-center justify-center relative z-10 overflow-hidden">
            <img src={GB_LOGO_URL} alt="Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-xl font-black tracking-wider text-white font-syne">
            GB <span className="text-pink-500">STUDY</span>
          </h1>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-6">
          <button
            onClick={() => onSwitchTab('new')}
            className={`font-bold text-sm transition-colors flex items-center gap-2 btn-click-effect cursor-pointer ${
              currentTab === 'new' ? 'text-pink-400' : 'text-stone-300 hover:text-pink-400'
            }`}
          >
            <LayoutGrid className="w-4 h-4" /> Batches
          </button>

          <button
            onClick={() => onSwitchTab('wishlist')}
            className={`font-bold text-sm transition-colors flex items-center gap-2 btn-click-effect cursor-pointer ${
              currentTab === 'wishlist' ? 'text-pink-400' : 'text-stone-400 hover:text-white'
            }`}
          >
            <Bookmark className="w-4 h-4" /> My Enrollments
            {enrolledCount > 0 && (
              <span className="bg-pink-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded">
                {enrolledCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenTelegram}
            className="text-stone-400 hover:text-pink-400 font-bold text-sm transition-colors flex items-center gap-1.5 btn-click-effect cursor-pointer"
          >
            <Send className="w-4 h-4 text-pink-500" /> Telegram
          </button>
        </div>

        {/* Mobile Nav Actions */}
        <div className="md:hidden flex items-center gap-3">
          <button
            onClick={() => onSwitchTab('wishlist')}
            className="text-stone-300 p-2 border border-white/10 rounded-lg hover:text-pink-400 hover:border-pink-500 transition-colors btn-click-effect relative bg-white/5 cursor-pointer"
            title="My Enrollments"
          >
            <Bookmark className="w-5 h-5" />
            {enrolledCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-pink-500 rounded-full" />
            )}
          </button>

          <button
            onClick={onOpenTelegram}
            className="p-2 border border-pink-500/30 text-pink-400 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 transition-colors btn-click-effect cursor-pointer"
            title="Telegram Channel"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  );
};
