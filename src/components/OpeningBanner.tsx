import React from 'react';
import { BookOpen } from 'lucide-react';
import { detectOpening } from '../data/openings';

interface OpeningBannerProps {
  sanMoves: string[];
}

export const OpeningBanner: React.FC<OpeningBannerProps> = ({ sanMoves }) => {
  const opening = detectOpening(sanMoves);
  if (!opening) return null;

  return (
    <div className="w-full bg-gradient-to-r from-purple-500/10 via-fuchsia-500/10 to-indigo-500/10 border-2 border-purple-200/80 rounded-2xl p-2.5 sm:p-3 flex items-center justify-between gap-2 shadow-2xs">
      <div className="flex items-center gap-2 min-w-0">
        <div className="w-7 h-7 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
          <BookOpen className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded">
              Açılış Kitaplığı
            </span>
            <span className="font-extrabold text-xs text-slate-800 truncate">
              {opening.nameTr}
            </span>
          </div>
          <p className="text-[11px] text-slate-600 truncate hidden sm:block">
            {opening.descriptionTr}
          </p>
        </div>
      </div>

      <span className="text-[11px] font-mono font-black text-purple-800 bg-white px-2 py-0.5 rounded-lg border border-purple-200 shrink-0">
        {opening.moves.slice(0, 3).join(' ')}...
      </span>
    </div>
  );
};
