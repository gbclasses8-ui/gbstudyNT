/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useMemo } from 'react';
import { Sparkles, Bookmark, Search, X, Loader2, ChevronDown, FolderOpen, Send, ExternalLink } from 'lucide-react';
import { Batch, VideoMediaData } from './types';
import { fetchBatches } from './services/apiService';
import { INITIAL_BATCHES, TELEGRAM_URL } from './data/batchesData';
import { Navbar } from './components/Navbar';
import { BatchCard } from './components/BatchCard';
import { CourseDetailPage } from './components/CourseDetailPage';
import { TelegramModal } from './components/TelegramModal';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { DownloaderModal } from './components/DownloaderModal';
import { Toast } from './components/Toast';

const ITEMS_PER_PAGE = 12;

export default function App() {
  const [batches, setBatches] = useState<Batch[]>(INITIAL_BATCHES);
  const [currentTab, setCurrentTab] = useState<'new' | 'wishlist'>('new');
  const [searchQuery, setSearchQuery] = useState('');
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(false);

  // Selected batch for content.html view
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);

  // Modals
  const [isTelegramOpen, setIsTelegramOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState<VideoMediaData | null>(null);
  const [activeDownload, setActiveDownload] = useState<VideoMediaData | null>(null);

  // Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  // Enrolled Wishlist in localStorage
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('studybee_wishlist');
      return stored ? JSON.parse(stored).map(String) : [];
    } catch {
      return [];
    }
  });

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToastMsg(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMsg(null);
    }, 3000);
  };

  // Telegram popup on open
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTelegramOpen(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Fetch batches live
  useEffect(() => {
    setIsInitialLoading(true);
    fetchBatches()
      .then((data) => {
        if (data && data.length > 0) {
          setBatches(data);
        }
      })
      .finally(() => {
        setIsInitialLoading(false);
      });
  }, []);

  // Handle URL parameter sync for content.html?id=... and browser Back button
  useEffect(() => {
    const handleUrlChange = () => {
      const params = new URLSearchParams(window.location.search);
      const courseId = params.get('id') || params.get('courseId');
      if (courseId) {
        const found = batches.find((b) => String(b.id) === String(courseId));
        if (found) {
          setSelectedBatch(found);
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
      }
      setSelectedBatch(null);
    };

    handleUrlChange();
    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, [batches]);

  const switchTab = (tab: 'new' | 'wishlist') => {
    setCurrentTab(tab);
    setSearchQuery('');
    setDisplayCount(ITEMS_PER_PAGE);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleEnroll = (e: React.MouseEvent, batchId: string | number) => {
    e.stopPropagation();
    const id = String(batchId);
    setWishlist((prev) => {
      const idx = prev.indexOf(id);
      let updated: string[];
      if (idx === -1) {
        updated = [...prev, id];
        showToast('Enrolled in batch!', 'success');
      } else {
        updated = prev.filter((item) => item !== id);
        showToast('Removed from enrollments', 'error');
      }
      try {
        localStorage.setItem('studybee_wishlist', JSON.stringify(updated));
      } catch (err) {
        console.warn(err);
      }
      return updated;
    });
  };

  const handleStudyClick = (e: React.MouseEvent, batchId: string | number) => {
    e.preventDefault();
    const found = batches.find((b) => String(b.id) === String(batchId));
    if (found) {
      setSelectedBatch(found);
      window.history.pushState({}, '', `?id=${batchId}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBackToHome = () => {
    setSelectedBatch(null);
    window.history.pushState({}, '', window.location.pathname);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter batches matching old website applyFiltersAndRender logic
  const filteredBatches = useMemo(() => {
    let list: Batch[] = [];
    if (currentTab === 'wishlist') {
      const uniqueBatches = Array.from(new Map(batches.map((item) => [String(item.id), item])).values());
      list = uniqueBatches.filter((b) => wishlist.includes(String(b.id)));
    } else {
      list = batches;
    }

    const q = searchQuery.toLowerCase().trim();
    if (q) {
      list = list.filter((b) => {
        return b.title.toLowerCase().includes(q) || String(b.id).includes(q);
      });
    }

    return list;
  }, [batches, currentTab, wishlist, searchQuery]);

  // Sliced items for pagination matching loadMore
  const displayedBatches = useMemo(() => {
    return filteredBatches.slice(0, displayCount);
  }, [filteredBatches, displayCount]);

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setDisplayCount((prev) => prev + ITEMS_PER_PAGE);
      setIsLoadingMore(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e5e5e5] font-sans flex flex-col">
      {/* Toast Notification matching old website */}
      <Toast message={toastMsg} type={toastType} />

      {selectedBatch ? (
        /* ==================== VIEW 2: COURSE CONTENT (content.html) ==================== */
        <CourseDetailPage
          batch={selectedBatch}
          onBack={handleBackToHome}
          isSaved={wishlist.includes(String(selectedBatch.id))}
          onToggleSave={(id) => toggleEnroll({ stopPropagation: () => {} } as any, id)}
          onPlayVideo={(media) => setActiveVideo(media)}
          onOpenPdf={(url) => {
            if (url) window.open(url, '_blank', 'noopener,noreferrer');
          }}
          onOpenDownload={(media) => setActiveDownload(media)}
          onOpenTelegram={() => setIsTelegramOpen(true)}
        />
      ) : (
        /* ==================== VIEW 1: HOMEPAGE (index.html) ==================== */
        <>
          {/* Navbar matching index.html */}
          <Navbar
            currentTab={currentTab}
            onSwitchTab={switchTab}
            enrolledCount={wishlist.length}
            onOpenTelegram={() => setIsTelegramOpen(true)}
            onReload={() => {
              setCurrentTab('new');
              setSearchQuery('');
              setDisplayCount(ITEMS_PER_PAGE);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />

          {/* Main Content matching index.html */}
          <main className="flex-1 w-full max-w-[90rem] mx-auto px-4 sm:px-6 pt-8 relative z-10 pb-16">
            {/* Filter / Search Row matching index.html */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 fade-in-pop">
              {/* Compact Buttons UI matching index.html */}
              <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto hide-scroll w-full md:w-auto p-1 bg-[#121212] rounded-xl border border-white/5 shadow-inner">
                {/* Tab: Latest Batches */}
                <button
                  id="tab-new"
                  onClick={() => switchTab('new')}
                  className={`tab-btn shrink-0 px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg text-[11px] sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    currentTab === 'new'
                      ? 'bg-white/10 text-white border border-white/10 shadow-sm'
                      : 'bg-transparent text-stone-400 hover:text-stone-200 border border-transparent'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-pink-400" />
                  Latest <span className="hidden sm:inline">Batches</span>
                </button>

                {/* Tab: My Enrolled */}
                <button
                  id="tab-wishlist"
                  onClick={() => switchTab('wishlist')}
                  className={`tab-btn shrink-0 px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg text-[11px] sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    currentTab === 'wishlist'
                      ? 'bg-white/10 text-white border border-white/10 shadow-sm'
                      : 'bg-transparent text-stone-400 hover:text-stone-200 border border-transparent'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">My </span>Enrolled
                  {wishlist.length > 0 && (
                    <span className="bg-pink-500 text-white text-[9px] sm:text-[10px] font-black px-1.5 py-0.5 rounded">
                      {wishlist.length}
                    </span>
                  )}
                </button>

                <div className="w-px h-4 bg-white/10 mx-1 shrink-0" />

                {/* Telegram Channel Button */}
                <button
                  onClick={() => window.open(TELEGRAM_URL, '_blank', 'noopener,noreferrer')}
                  className="shrink-0 px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg text-[11px] sm:text-sm font-bold transition-all bg-transparent text-stone-400 hover:text-pink-400 border border-transparent flex items-center gap-1.5 btn-click-effect cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-pink-500" />
                  Official <span className="hidden sm:inline">Telegram</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </button>
              </div>

              {/* Search Bar matching index.html */}
              <div className="relative w-full md:w-[350px]">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Search className="w-4 h-4 text-stone-500" />
                </div>
                <input
                  type="text"
                  id="searchInput"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setDisplayCount(ITEMS_PER_PAGE);
                  }}
                  placeholder="Search batches..."
                  className="w-full bg-[#121212] border border-white/10 text-white text-sm rounded-lg block pl-10 pr-10 py-2.5 transition-all placeholder:text-stone-600 focus:outline-none focus:border-pink-500/50 focus:bg-[#1a1a1a]"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setDisplayCount(ITEMS_PER_PAGE);
                    }}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-500 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Loading Indicator */}
            {isInitialLoading && (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-pink-500 mb-3" />
                <p className="text-stone-400 font-medium text-sm">Loading batches...</p>
              </div>
            )}

            {/* Batch Grid matching index.html */}
            {displayedBatches.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {displayedBatches.map((batch, index) => (
                  <BatchCard
                    key={batch.id}
                    batch={batch}
                    index={index}
                    isEnrolled={wishlist.includes(String(batch.id))}
                    onToggleEnroll={toggleEnroll}
                    onStudyClick={handleStudyClick}
                  />
                ))}
              </div>
            ) : (
              /* Empty State matching index.html */
              <div className="flex flex-col items-center justify-center py-20 text-center fade-in-pop">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/5">
                  <FolderOpen className="w-8 h-8 text-stone-600" />
                </div>
                <h3 className="text-xl font-bold text-white mb-1">No Batches Found</h3>
                <p className="text-stone-500 text-sm">
                  {currentTab === 'wishlist'
                    ? 'No enrolled batches yet. Click ENROLL on any batch to add it here.'
                    : 'Try adjusting your search or enrolling in new batches.'}
                </p>
              </div>
            )}

            {/* Load More Button matching index.html */}
            {displayCount < filteredBatches.length && (
              <div className="w-full flex justify-center mt-10 mb-6 fade-in-pop">
                <button
                  disabled={isLoadingMore}
                  onClick={handleLoadMore}
                  className="px-8 py-2.5 bg-[#121212] border border-white/10 hover:border-pink-500/40 rounded-lg text-white font-semibold text-sm transition-all btn-click-effect flex items-center gap-2 cursor-pointer shadow-md"
                >
                  {isLoadingMore ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-pink-400" />
                      <span>Loading</span>
                    </>
                  ) : (
                    <>
                      <span>Load More</span>
                      <ChevronDown className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}
          </main>
        </>
      )}

      {/* Floating Telegram Button */}
      <button
        onClick={() => setIsTelegramOpen(true)}
        className="fixed bottom-6 right-6 z-40 p-3.5 rounded-full bg-pink-500 hover:bg-pink-600 pink-glow text-white shadow-2xl flex items-center gap-2 cursor-pointer transition-transform hover:scale-105 active:scale-95"
        title="Join GB STUDY Telegram"
        aria-label="Join GB STUDY Telegram"
      >
        <Send className="w-5 h-5" />
        <span className="hidden sm:inline font-bold text-xs pr-1">Telegram</span>
      </button>

      {/* Telegram Popup Modal */}
      <TelegramModal
        isOpen={isTelegramOpen}
        onClose={() => setIsTelegramOpen(false)}
      />

      {/* Video Player Modal matching play.html */}
      {activeVideo && (
        <VideoPlayerModal
          media={activeVideo}
          onClose={() => setActiveVideo(null)}
          onOpenDownload={() => {
            setActiveDownload(activeVideo);
            setActiveVideo(null);
          }}
        />
      )}

      {/* Downloader Modal matching d.html */}
      {activeDownload && (
        <DownloaderModal
          media={activeDownload}
          onClose={() => setActiveDownload(null)}
          onWatchNow={() => {
            setActiveVideo(activeDownload);
            setActiveDownload(null);
          }}
        />
      )}
    </div>
  );
}
