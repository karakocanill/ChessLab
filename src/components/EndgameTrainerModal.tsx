import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Crown, X, Compass, CheckCircle2, Play, BookOpen } from 'lucide-react';
import { ENDGAME_SCENARIOS, EndgameScenario } from '../data/motifs';

interface EndgameTrainerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadScenarioToBoard: (scenario: EndgameScenario) => void;
  isDarkMode?: boolean;
}

export const EndgameTrainerModal: React.FC<EndgameTrainerModalProps> = ({
  isOpen,
  onClose,
  onLoadScenarioToBoard,
  isDarkMode = false,
}) => {
  const [selectedId, setSelectedId] = useState(ENDGAME_SCENARIOS[0].id);

  const activeScenario = ENDGAME_SCENARIOS.find((s) => s.id === selectedId) || ENDGAME_SCENARIOS[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 15 }}
            className={`rounded-3xl max-w-xl w-full shadow-2xl border-4 overflow-hidden flex flex-col ${
              isDarkMode
                ? 'bg-slate-900 border-slate-700 text-slate-100'
                : 'bg-white border-amber-300 text-slate-800'
            }`}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-xl shadow-inner">
                  👑
                </div>
                <div>
                  <h3 className="font-black text-base leading-tight">
                    Endgame Trainer (Oyun Sonu Antrenörü)
                  </h3>
                  <p className="text-xs text-amber-100 font-medium">
                    Şah+Piyon, Lucena Köprüsü, Vezir Sonları ve Kazanan Plan
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

            {/* Scenarios Tabs */}
            <div
              className={`p-2.5 border-b flex items-center gap-2 overflow-x-auto ${
                isDarkMode ? 'bg-slate-800/80 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}
            >
              {ENDGAME_SCENARIOS.map((sc) => (
                <button
                  key={sc.id}
                  onClick={() => setSelectedId(sc.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black shrink-0 transition-all cursor-pointer ${
                    selectedId === sc.id
                      ? 'bg-amber-500 text-white shadow-sm'
                      : isDarkMode
                      ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {sc.title.split(' ')[0]}
                </button>
              ))}
            </div>

            {/* Scenario Breakdown */}
            <div className="p-5 space-y-4">
              <div>
                <div className="text-[10px] font-black uppercase text-amber-600 tracking-wider">
                  Kategori: {activeScenario.category}
                </div>
                <h4 className="font-black text-base mt-0.5">{activeScenario.title}</h4>
              </div>

              {/* The Winning Plan Card */}
              <div
                className={`p-4 rounded-2xl border-2 space-y-2 ${
                  isDarkMode
                    ? 'bg-slate-800/80 border-amber-500/30'
                    : 'bg-amber-50/70 border-amber-200'
                }`}
              >
                <h5 className="font-black text-xs text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-amber-600" />
                  <span>Büyükusta Kazanan Plan:</span>
                </h5>
                <p className="text-xs font-semibold leading-relaxed">
                  {activeScenario.winningPlan}
                </p>
                <div className="text-[11px] font-bold text-amber-700 dark:text-amber-400 pt-1 border-t border-amber-200/50">
                  📌 Altın Kural: {activeScenario.keyRule}
                </div>
              </div>

              {/* Load to Board Action */}
              <button
                onClick={() => {
                  onLoadScenarioToBoard(activeScenario);
                  onClose();
                }}
                className="w-full py-3 px-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Bu Oyun Sonunu Tahtaya Yükle ve Pratik Yap! 🚀</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
