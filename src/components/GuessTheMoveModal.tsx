import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Target, X, CheckCircle2, AlertCircle, Sparkles, ChevronRight, Award, Trophy } from 'lucide-react';
import { GUESS_THE_MOVE_CHALLENGES, GuessTheMoveChallenge } from '../data/motifs';
import { triggerConfetti } from '../utils/celebrate';
import { soundFx } from '../utils/audio';

interface GuessTheMoveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadPositionToBoard: (fen: string, title: string) => void;
  isDarkMode?: boolean;
}

export const GuessTheMoveModal: React.FC<GuessTheMoveModalProps> = ({
  isOpen,
  onClose,
  onLoadPositionToBoard,
  isDarkMode = false,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionSan, setSelectedOptionSan] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const currentChallenge = GUESS_THE_MOVE_CHALLENGES[currentIndex];

  const handleSelectOption = (opt: GuessTheMoveChallenge['options'][0]) => {
    if (selectedOptionSan !== null) return; // already picked
    setSelectedOptionSan(opt.san);

    if (opt.isCorrect) {
      setScore((s) => s + 15);
      soundFx.playVictory();
      triggerConfetti();
    } else {
      soundFx.playBlunder();
    }
  };

  const handleNextChallenge = () => {
    setSelectedOptionSan(null);
    setCurrentIndex((prev) => (prev + 1) % GUESS_THE_MOVE_CHALLENGES.length);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
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
                  🎯
                </div>
                <div>
                  <h3 className="font-black text-base leading-tight">
                    Guess the Move (Hamleyi Tahmin Et)
                  </h3>
                  <p className="text-xs text-amber-100 font-medium">
                    Tarihi maçlardaki efsane hamleleri tahmin et, puanları topla!
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-white/20 px-3 py-1 rounded-xl text-xs font-black flex items-center gap-1">
                  <Trophy className="w-3.5 h-3.5 text-amber-200" />
                  <span>{score} Puan</span>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4">
              {/* Game Title Tag */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-amber-600 uppercase tracking-wider text-[10px]">
                    Kritik Maç #{currentIndex + 1} / {GUESS_THE_MOVE_CHALLENGES.length}
                  </span>
                  <span className="font-bold opacity-70">
                    Sıra: {currentChallenge.turn === 'w' ? '⚪ Beyaz' : '⚫ Siyah'}
                  </span>
                </div>
                <h4 className="font-black text-sm sm:text-base">
                  {currentChallenge.gameTitle}
                </h4>
              </div>

              {/* Question */}
              <div
                className={`p-3.5 rounded-2xl border text-xs font-semibold leading-relaxed ${
                  isDarkMode ? 'bg-slate-800/70 border-slate-700' : 'bg-amber-50/70 border-amber-200'
                }`}
              >
                {currentChallenge.questionTr}
              </div>

              {/* 3 Choices */}
              <div className="space-y-2">
                {currentChallenge.options.map((opt) => {
                  const isPicked = selectedOptionSan === opt.san;
                  const hasAnswered = selectedOptionSan !== null;

                  let btnStyle = isDarkMode
                    ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-white'
                    : 'bg-slate-50 border-slate-200 hover:bg-amber-50 text-slate-800';

                  if (hasAnswered) {
                    if (opt.isCorrect) {
                      btnStyle = 'bg-emerald-500 border-emerald-600 text-white shadow-md ring-2 ring-emerald-300';
                    } else if (isPicked && !opt.isCorrect) {
                      btnStyle = 'bg-rose-500 border-rose-600 text-white shadow-md';
                    } else {
                      btnStyle = 'opacity-40 bg-slate-100 border-slate-200 text-slate-600';
                    }
                  }

                  return (
                    <motion.button
                      key={opt.san}
                      whileHover={!hasAnswered ? { scale: 1.01 } : {}}
                      onClick={() => handleSelectOption(opt)}
                      disabled={hasAnswered}
                      className={`w-full p-3 rounded-2xl border-2 font-mono font-black text-sm flex items-center justify-between transition-all cursor-pointer ${btnStyle}`}
                    >
                      <span className="text-base">{opt.san}</span>
                      {hasAnswered && opt.isCorrect && (
                        <div className="flex items-center gap-1 text-xs font-sans font-black">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Doğru Hamle (+15)</span>
                        </div>
                      )}
                      {hasAnswered && isPicked && !opt.isCorrect && (
                        <div className="flex items-center gap-1 text-xs font-sans font-black">
                          <AlertCircle className="w-4 h-4" />
                          <span>Yanlış</span>
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Feedback after answer */}
              {selectedOptionSan !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-3.5 rounded-2xl border text-xs space-y-1.5 ${
                    currentChallenge.options.find((o) => o.san === selectedOptionSan)?.isCorrect
                      ? 'bg-emerald-50 text-emerald-950 border-emerald-300'
                      : 'bg-rose-50 text-rose-950 border-rose-300'
                  }`}
                >
                  <div className="font-black text-xs">
                    {currentChallenge.options.find((o) => o.san === selectedOptionSan)?.isCorrect
                      ? '✅ Şahane! Büyükustanın aklını okudun!'
                      : '❌ Bu hamle oynanmadı.'}
                  </div>
                  <p className="font-medium text-[11px] leading-relaxed">
                    {currentChallenge.options.find((o) => o.san === selectedOptionSan)?.explanation}
                  </p>
                </motion.div>
              )}

              {/* Footer Actions */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200/50">
                <button
                  onClick={() => {
                    onLoadPositionToBoard(currentChallenge.fen, currentChallenge.gameTitle);
                    onClose();
                  }}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                    isDarkMode
                      ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Tahtada İncele
                </button>

                <button
                  onClick={handleNextChallenge}
                  disabled={selectedOptionSan === null}
                  className="py-2 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white font-black text-xs shadow-sm flex items-center gap-1 transition-all cursor-pointer"
                >
                  <span>Sonraki Maç</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
