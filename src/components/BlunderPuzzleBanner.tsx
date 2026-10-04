import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Lightbulb,
  CheckCircle2,
  X,
  RotateCcw,
  ArrowRight,
  Trophy,
} from 'lucide-react';
import { BlunderReviewItem } from '../types/chess';

interface BlunderPuzzleBannerProps {
  puzzle: {
    blunder: BlunderReviewItem;
    isSolved: boolean;
    showHint: boolean;
    attempts: number;
    statusMessage: string;
  };
  onShowHint: () => void;
  onExitPuzzle: () => void;
  onOpenGameReview: () => void;
  isDarkMode?: boolean;
}

export const BlunderPuzzleBanner: React.FC<BlunderPuzzleBannerProps> = ({
  puzzle,
  onShowHint,
  onExitPuzzle,
  onOpenGameReview,
  isDarkMode = false,
}) => {
  const { blunder, isSolved, showHint, attempts } = puzzle;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`w-full max-w-[560px] p-4 rounded-3xl border-2 shadow-md transition-all ${
        isSolved
          ? 'bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-transparent border-emerald-400 dark:border-emerald-500'
          : 'bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-transparent border-amber-400 dark:border-amber-500'
      } ${isDarkMode ? 'bg-slate-900/90 text-slate-100' : 'bg-white/95 text-slate-800'}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl shrink-0 shadow-sm ${
              isSolved
                ? 'bg-emerald-500 text-white'
                : 'bg-gradient-to-tr from-amber-500 to-orange-500 text-white'
            }`}
          >
            {isSolved ? <Trophy className="w-5 h-5" /> : '🧩'}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-black text-sm tracking-tight">
                {isSolved
                  ? 'Taktik Başarıyla Çözüldü! 🎉'
                  : 'Hatamdan Puzzle Antrenmanı'}
              </h4>
              <span
                className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                  isSolved
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300'
                    : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-300'
                }`}
              >
                Hamle #{blunder.moveNumber}
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-0.5 leading-snug">
              {isSolved
                ? `Kaçırdığın büyükusta hamlesini (${blunder.bestSan}) başarıyla buldun!`
                : `Oyunda ${blunder.playedSan} oynamıştın. Şimdi tahtada en iyi hamleyi oyna!`}
            </p>
          </div>
        </div>

        <button
          onClick={onExitPuzzle}
          className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          title="Antrenmandan Çık"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Detail or Explanation */}
      {isSolved ? (
        <div className="mt-3 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-xs space-y-1">
          <span className="font-black text-emerald-800 dark:text-emerald-300 block">
            💡 Doğru Plan:
          </span>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            {blunder.whatShouldPlay}
          </p>
          <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold pt-1 border-t border-emerald-200/50">
            {blunder.continuationLine}
          </p>
        </div>
      ) : (
        attempts > 0 && (
          <div className="mt-2 text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
            <span>❌ Bu aradığımız en iyi hamle değil ({attempts} deneme). Tekrar dene!</span>
          </div>
        )
      )}

      {/* Action Buttons */}
      <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between gap-2">
        {!isSolved ? (
          <>
            <button
              onClick={onShowHint}
              disabled={showHint}
              className={`py-1.5 px-3 rounded-xl border text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                showHint
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300 dark:bg-slate-800 dark:text-amber-300 dark:border-amber-700'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>{showHint ? 'Yeşil Oku Takip Et' : '💡 İpucu İste'}</span>
            </button>

            <button
              onClick={onExitPuzzle}
              className="py-1.5 px-3 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Antrenmanı Bitir
            </button>
          </>
        ) : (
          <>
            <button
              onClick={onOpenGameReview}
              className="py-1.5 px-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>Diğer Hataları İncele</span>
            </button>

            <button
              onClick={onExitPuzzle}
              className="py-1.5 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Normal Oyuna Dön</span>
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
};
