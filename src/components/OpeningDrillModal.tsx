import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, X, CheckCircle2, ChevronRight, RotateCcw, Sparkles, Trophy } from 'lucide-react';
import { OPENING_DRILLS, OpeningDrill } from '../data/motifs';
import { soundFx } from '../utils/audio';
import { triggerConfetti } from '../utils/celebrate';

interface OpeningDrillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadDrillToMainBoard: (drill: OpeningDrill) => void;
  isDarkMode?: boolean;
}

export const OpeningDrillModal: React.FC<OpeningDrillModalProps> = ({
  isOpen,
  onClose,
  onLoadDrillToMainBoard,
  isDarkMode = false,
}) => {
  const [activeDrillIndex, setActiveDrillIndex] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [drillCompletedTimes, setDrillCompletedTimes] = useState<Record<string, number>>(() => {
    if (typeof window !== 'undefined') {
      try {
        return JSON.parse(localStorage.getItem('chessforge_drills_done') || '{}');
      } catch {
        return {};
      }
    }
    return {};
  });

  const drill = OPENING_DRILLS[activeDrillIndex];
  const step = drill.steps[currentStepIndex];
  const isCompleted = currentStepIndex >= drill.steps.length;

  const handleNextStep = () => {
    if (currentStepIndex + 1 >= drill.steps.length) {
      // Completed drill!
      soundFx.playVictory();
      triggerConfetti();
      const updated = {
        ...drillCompletedTimes,
        [drill.id]: (drillCompletedTimes[drill.id] || 0) + 1,
      };
      setDrillCompletedTimes(updated);
      if (typeof window !== 'undefined') {
        localStorage.setItem('chessforge_drills_done', JSON.stringify(updated));
      }
      setCurrentStepIndex(drill.steps.length);
    } else {
      soundFx.playMove();
      setCurrentStepIndex((s) => s + 1);
    }
  };

  const handleRestart = () => {
    setCurrentStepIndex(0);
    soundFx.playMove();
  };

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
                : 'bg-white border-purple-300 text-slate-800'
            }`}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-fuchsia-600 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-xl shadow-inner">
                  🔁
                </div>
                <div>
                  <h3 className="font-black text-base leading-tight">
                    Açılış Ezberleme & Tekrar Drill Modu
                  </h3>
                  <p className="text-xs text-purple-100 font-medium">
                    Kas hafızası oluştur, hamleleri otomatik oynayacak kadar ustalaş!
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

            {/* Drill Switcher Tabs */}
            <div
              className={`p-2.5 border-b flex items-center gap-2 overflow-x-auto ${
                isDarkMode ? 'bg-slate-800/80 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}
            >
              {OPENING_DRILLS.map((d, idx) => {
                const count = drillCompletedTimes[d.id] || 0;
                return (
                  <button
                    key={d.id}
                    onClick={() => {
                      setActiveDrillIndex(idx);
                      setCurrentStepIndex(0);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black shrink-0 flex items-center gap-1.5 transition-all cursor-pointer ${
                      activeDrillIndex === idx
                        ? 'bg-purple-600 text-white shadow-sm'
                        : isDarkMode
                        ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>{d.name.split(' ')[0]}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-purple-900/40 text-purple-200">
                      {count}/10
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Drill Content */}
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-black text-base">{drill.name}</h4>
                  <p className="text-xs opacity-75">{drill.description}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-extrabold text-purple-600 block">
                    Tamamlanma: {drillCompletedTimes[drill.id] || 0} / 10
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-purple-600 h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(100, (currentStepIndex / drill.steps.length) * 100)}%`,
                  }}
                />
              </div>

              {/* Step Card */}
              {!isCompleted ? (
                <div
                  className={`p-4 rounded-2xl border-2 space-y-2.5 ${
                    isDarkMode
                      ? 'bg-slate-800/80 border-purple-500/40'
                      : 'bg-purple-50/70 border-purple-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-purple-600">
                      Adım #{currentStepIndex + 1} / {drill.steps.length}
                    </span>
                    <span className="font-mono text-xs font-black px-2 py-0.5 rounded-md bg-purple-600 text-white">
                      Senin Hamlen: {step.moveSan}
                    </span>
                  </div>

                  <p className="text-xs font-semibold leading-relaxed">
                    💡 İpucu: {step.tip}
                  </p>

                  {step.botReplySan && (
                    <div className="text-[11px] opacity-75 pt-1 border-t border-purple-200/50">
                      Rakibin Otomatik Yanıtı: <span className="font-mono font-bold">{step.botReplySan}</span>
                    </div>
                  )}

                  <button
                    onClick={handleNextStep}
                    className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer mt-2"
                  >
                    <span>Hamleyi Oyna & Devam Et ({step.moveSan})</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-400 text-center space-y-2">
                  <Trophy className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="font-black text-base text-emerald-900 dark:text-emerald-200">
                    Harika! Bu Açılış Drill'ini Başarıyla Bitirdin! 🎉
                  </h4>
                  <p className="text-xs text-emerald-800 dark:text-emerald-300 font-medium">
                    Kas hafızana bir tuğla daha ekledin. 10 tekrarı tamamlayana kadar pratik yapmaya devam et!
                  </p>
                  <button
                    onClick={handleRestart}
                    className="py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-sm inline-flex items-center gap-1.5 cursor-pointer mt-2"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Tekrar Pratik Yap</span>
                  </button>
                </div>
              )}

              {/* Action: Tahtaya Aktar */}
              <div className="pt-2 border-t border-slate-200/50 flex justify-end">
                <button
                  onClick={() => {
                    onLoadDrillToMainBoard(drill);
                    onClose();
                  }}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                    isDarkMode
                      ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Ana Tahtada Oyna
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
