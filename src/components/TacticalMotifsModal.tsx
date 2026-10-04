import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, ChevronRight, CheckCircle2, Play, Target } from 'lucide-react';
import { TACTICAL_MOTIFS, MotifPuzzle } from '../data/motifs';

interface TacticalMotifsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPuzzle: (puzzle: MotifPuzzle) => void;
  isDarkMode?: boolean;
}

export const TacticalMotifsModal: React.FC<TacticalMotifsModalProps> = ({
  isOpen,
  onClose,
  onSelectPuzzle,
  isDarkMode = false,
}) => {
  const [selectedKey, setSelectedKey] = useState<string>('fork');

  const activeCategory = TACTICAL_MOTIFS[selectedKey] || TACTICAL_MOTIFS.fork;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 15 }}
            className={`rounded-3xl max-w-2xl w-full shadow-2xl border-4 overflow-hidden flex flex-col max-h-[85vh] ${
              isDarkMode
                ? 'bg-slate-900 border-slate-700 text-slate-100'
                : 'bg-white border-emerald-300 text-slate-800'
            }`}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-600 p-4 sm:p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center text-2xl shadow-inner">
                  ♟️
                </div>
                <div>
                  <h3 className="font-black text-lg leading-tight">
                    Taktik Motif Akademisi
                  </h3>
                  <p className="text-xs text-emerald-100 font-medium">
                    Çatal, Açmaz, Şiş, Ara Hamle (Zwischenzug) ve 13 farklı taktik kategorisi
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Motifs Category Tabs Grid */}
            <div
              className={`p-3 border-b flex items-center gap-1.5 overflow-x-auto ${
                isDarkMode ? 'bg-slate-800/80 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}
            >
              {Object.entries(TACTICAL_MOTIFS).map(([key, data]) => {
                const isSelected = selectedKey === key;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedKey(key)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black shrink-0 flex items-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-400'
                        : isDarkMode
                        ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>{data.icon}</span>
                    <span>{data.nameTr.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Category Description & Puzzles */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
              {/* Category Info Banner */}
              <div
                className={`p-3.5 rounded-2xl border flex items-start gap-3 ${
                  isDarkMode
                    ? 'bg-slate-800/60 border-slate-700'
                    : 'bg-emerald-50/60 border-emerald-200'
                }`}
              >
                <span className="text-2xl">{activeCategory.icon}</span>
                <div>
                  <h4 className="font-black text-sm text-emerald-900 dark:text-emerald-300">
                    {activeCategory.nameTr}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-0.5">
                    {activeCategory.description}
                  </p>
                </div>
              </div>

              {/* Puzzle Cards */}
              <div className="space-y-2.5">
                <div className="text-xs font-black opacity-70">
                  Antrenman Pozisyonları:
                </div>

                {activeCategory.puzzles.map((puz) => (
                  <motion.div
                    key={puz.id}
                    whileHover={{ scale: 1.01 }}
                    onClick={() => {
                      onSelectPuzzle(puz);
                      onClose();
                    }}
                    className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 group ${
                      isDarkMode
                        ? 'bg-slate-800/80 border-slate-700 hover:border-emerald-500'
                        : 'bg-white border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/40'
                    }`}
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm group-hover:text-emerald-600 transition-colors">
                          {puz.title}
                        </span>
                        <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          Sıra: {puz.turn === 'w' ? '⚪ Beyaz' : '⚫ Siyah'}
                        </span>
                      </div>
                      <p className="text-xs opacity-75 font-medium">
                        {puz.description}
                      </p>
                    </div>

                    <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
