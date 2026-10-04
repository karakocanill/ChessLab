import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Lightbulb,
  Play,
  Eye,
  Sparkles,
  BookOpen,
  AlertTriangle,
  ChevronRight,
  Layers,
  ShieldAlert,
} from 'lucide-react';
import { BestMoveAnalysis, MoveSuggestion } from '../types/chess';

interface BestMoveButtonProps {
  isAnalyzing: boolean;
  analysis: BestMoveAnalysis | null;
  onAnalyze: () => void;
  onPlayMove?: (from: string, to: string) => void;
  onOpenDetails?: () => void;
  isShowingArrow: boolean;
  onToggleArrow: () => void;
  activeHighlightedUci: string | null;
  onSelectSuggestion: (uci: string | null) => void;
  onOpenGameReview?: () => void;
  isReviewLoading?: boolean;
}

export const BestMoveButton: React.FC<BestMoveButtonProps> = ({
  isAnalyzing,
  analysis,
  onAnalyze,
  onPlayMove,
  onOpenDetails,
  isShowingArrow,
  onToggleArrow,
  activeHighlightedUci,
  onSelectSuggestion,
  onOpenGameReview,
  isReviewLoading,
}) => {
  return (
    <div className="space-y-2.5">
      {/* Primary Trigger Button: Hamle Önerileri & Oklar */}
      <motion.button
        onClick={onAnalyze}
        disabled={isAnalyzing}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3.5 px-4 rounded-2xl font-black text-sm text-white bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:to-teal-600 shadow-md hover:shadow-lg shadow-emerald-500/25 border-2 border-emerald-400/40 flex items-center justify-center gap-2.5 transition-all cursor-pointer relative overflow-hidden group"
      >
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />

        {isAnalyzing ? (
          <>
            <Sparkles className="w-5 h-5 animate-spin text-amber-300" />
            <span>Hesaplanıyor (Çoklu Ok & ELO Analizi)...</span>
          </>
        ) : (
          <>
            <Lightbulb className="w-5 h-5 text-amber-300 fill-amber-300 group-hover:scale-110 transition-transform" />
            <span>🧠 Hamle Önerilerini ve Okları Göster</span>
          </>
        )}
      </motion.button>

      {/* Secondary Button: Hatalarımı Göster (Game Review & Blunder Explainer) */}
      {onOpenGameReview && (
        <motion.button
          onClick={onOpenGameReview}
          disabled={isReviewLoading}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-2.5 px-4 rounded-xl font-extrabold text-xs text-rose-800 bg-rose-50 hover:bg-rose-100/90 border-2 border-rose-200/90 shadow-2xs flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          {isReviewLoading ? (
            <>
              <Sparkles className="w-4 h-4 text-rose-600 animate-spin" />
              <span>Oyun Hataları Taranıyor...</span>
            </>
          ) : (
            <>
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>🔍 Hatalarımı Göster (Neden Sakıncalıydı?)</span>
            </>
          )}
        </motion.button>
      )}

      {/* Analysis Results Container with Multi-Color Cards */}
      <AnimatePresence>
        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-emerald-50/70 via-white to-amber-50/50 border-2 border-emerald-300 shadow-sm space-y-2.5"
          >
            {/* Header: Best move motive & Toggle controls */}
            <div className="flex items-center justify-between gap-2 border-b border-emerald-100 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-emerald-600 text-white shadow-2xs">
                  {analysis.explanation.badge}
                </span>
                <span className="text-xs font-bold text-slate-700 hidden sm:inline">
                  {analysis.suggestions.length} Öneri Tahtada
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={onToggleArrow}
                  className={`text-[11px] font-bold px-2 py-1 rounded-lg border transition-all flex items-center gap-1 ${
                    isShowingArrow
                      ? 'bg-amber-100 text-amber-900 border-amber-300'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                  title="Tahtadaki okları aç/kapat"
                >
                  <Eye className="w-3 h-3" />
                  <span>{isShowingArrow ? 'Okları Gizle' : 'Okları Göster'}</span>
                </button>

                {onOpenDetails && (
                  <button
                    onClick={onOpenDetails}
                    className="text-[11px] font-bold px-2 py-1 rounded-lg bg-sky-50 text-sky-800 border border-sky-200 hover:bg-sky-100 transition-colors"
                  >
                    Detay
                  </button>
                )}
              </div>
            </div>

            {/* List of Suggestion Cards with Color Badges */}
            <div className="space-y-2 max-h-[280px] overflow-y-auto pr-0.5">
              {analysis.suggestions.map((sug, idx) => {
                const isSelected = activeHighlightedUci === sug.uci;
                const isBlunder = sug.category === 'blunder';
                const isBook = sug.category === 'opening';

                let cardStyle = 'border-slate-200 bg-white hover:border-slate-300';
                if (sug.rank === 1) cardStyle = 'border-emerald-300 bg-emerald-50/50 hover:bg-emerald-50';
                else if (sug.rank === 2) cardStyle = 'border-blue-300 bg-blue-50/50 hover:bg-blue-50';
                else if (sug.rank === 3) cardStyle = 'border-orange-300 bg-orange-50/50 hover:bg-orange-50';
                else if (isBlunder) cardStyle = 'border-rose-300 bg-rose-50/60 hover:bg-rose-100/60';
                else if (isBook) cardStyle = 'border-purple-300 bg-purple-50/60 hover:bg-purple-100/60';

                return (
                  <motion.div
                    key={`${sug.uci}-${idx}`}
                    whileHover={{ scale: 1.01 }}
                    onClick={() => onSelectSuggestion(isSelected ? null : sug.uci)}
                    className={`p-2.5 rounded-xl border-2 transition-all cursor-pointer shadow-2xs ${cardStyle} ${
                      isSelected ? 'ring-2 ring-emerald-500 shadow-sm' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-1.5">
                        <div
                          className="w-3.5 h-3.5 rounded-full shadow-2xs border border-white shrink-0"
                          style={{ backgroundColor: sug.colorHex }}
                        />
                        <span className="text-xs font-black text-slate-800">
                          {sug.badgeLabel}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs font-extrabold text-slate-900 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                          {sug.san}
                        </span>

                        {onPlayMove && !isBlunder && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onPlayMove(sug.from, sug.to);
                            }}
                            className="p-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                            title="Bu hamleyi doğrudan tahtada oyna"
                          >
                            <Play className="w-3 h-3 fill-current" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="text-[11px] font-semibold text-slate-600 line-clamp-2">
                      {sug.explanation}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
