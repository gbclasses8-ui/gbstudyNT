import React from 'react';
import { ArrowRight, Check, Plus } from 'lucide-react';
import { Batch } from '../types';

interface BatchCardProps {
  batch: Batch;
  isEnrolled: boolean;
  onToggleEnroll: (e: React.MouseEvent, id: string | number) => void;
  onStudyClick: (e: React.MouseEvent, id: string | number) => void;
  index: number;
}

export const BatchCard: React.FC<BatchCardProps> = ({
  batch,
  isEnrolled,
  onToggleEnroll,
  onStudyClick,
  index,
}) => {
  const id = String(batch.id);
  const delay = ((index % 12) * 30) + 'ms';

  return (
    <div
      className="premium-card rounded-xl overflow-hidden fade-in-pop group flex flex-col relative"
      style={{ animationDelay: delay }}
    >
      {/* 16/9 Thumbnail matching old website */}
      <div 
        onClick={(e) => onStudyClick(e, id)}
        className="relative w-full aspect-[16/9] overflow-hidden bg-black border-b border-white/5 cursor-pointer"
      >
        <img
          src={batch.thumbnail}
          alt={batch.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60';
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent opacity-90 pointer-events-none" />

        {/* FREE Badge in Pink */}
        <div className="absolute top-3 right-3 bg-pink-500/20 backdrop-blur-md border border-pink-500/30 px-2 py-1 rounded flex items-center justify-center z-10 shadow-sm">
          <span className="text-pink-400 text-[9px] font-black tracking-widest uppercase">FREE</span>
        </div>
      </div>

      {/* Card Body matching old website */}
      <div className="p-5 flex flex-col flex-1 relative z-20">
        <h3 
          onClick={(e) => onStudyClick(e, id)}
          className="text-gray-200 font-semibold text-sm leading-relaxed mb-4 line-clamp-2 group-hover:text-white transition-colors cursor-pointer"
        >
          {batch.title}
        </h3>

        {/* Bottom Row matching old website */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
          {/* Enroll / Enrolled Button */}
          <div>
            {isEnrolled ? (
              <button
                onClick={(e) => onToggleEnroll(e, id)}
                className="bg-pink-500/10 text-pink-400 border border-pink-500/20 px-3 py-1.5 rounded text-[11px] font-bold tracking-wider flex items-center gap-1.5 hover:bg-pink-500/20 transition-colors cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" /> ENROLLED
              </button>
            ) : (
              <button
                onClick={(e) => onToggleEnroll(e, id)}
                className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-1.5 rounded text-[11px] font-bold tracking-wider flex items-center gap-1.5 transition-colors btn-click-effect shadow-md cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> ENROLL
              </button>
            )}
          </div>

          {/* Let's Study Button in Pink */}
          <button
            onClick={(e) => onStudyClick(e, id)}
            className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors btn-click-effect shadow-md cursor-pointer"
          >
            Let&apos;s Study <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
