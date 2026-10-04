import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Timer, Trophy, CheckCircle2, Play, X, Sparkles } from 'lucide-react';
import { soundFx } from '../utils/audio';
import { triggerConfetti } from '../utils/celebrate';

interface DailyChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadDailyToBoard: (fen: string) => void;
  isDarkMode?: boolean;
}

export const DailyChallengeModal: React.FC<DailyChallengeModalProps> = ({
  isOpen,
  onClose,
  onLoadDailyToBoard,
  isDarkMode = false,
}) => {
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(150); // 02:30
  const [isSolving, setIsSolving] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [streakDays, setStreakDays] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      return Number(localStorage.getItem('chessforge_daily_streak') || 3);
    }
    return 3;
  });

  // Today's hardcoded daily position
  const DAILY_FEN = 'r2q1rk1/pb1nbppp/1p2p3/2ppP3/3P4/2PB1N2/PP1NQPPP/R4RK1 w - - 0 12';

  useEffect(() => {
    let interval: any;
    if (isSolving && timeLeftSeconds > 0 && !isCompleted) {
      interval = setInterval(() => {
        setTimeLeftSeconds((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isSolving, timeLeftSeconds, isCompleted]);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleFinish = () => {
    setIsCompleted(true);
    setIsSolving(false);
    soundFx.playVictory();
    triggerConfetti();
    const newStreak = streakDays + 1;
    setStreakDays(newStreak);
    if (typeof window !== 'undefined') {
      localStorage.setItem('chessforge_daily_streak', String(newStreak));
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 15 }}
            className={`rounded-3xl max-w-md w-full shadow-2xl border-4 overflow-hidden flex flex-col ${
              isDarkMode
                ? 'bg-slate-900 border-slate-700 text-slate-100'
                : 'bg-white border-amber-400 text-slate-800'
            }`}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-xl shadow-inner">
                  🔥
                </div>
                <div>
                  <h3 className="font-black text-base leading-tight">
                    Günün Taktik Mücadelesi (Daily)
                  </h3>
                  <p className="text-xs text-amber-100 font-medium">
                    Süreye karşı yarış ve günlük serini koru!
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

            {/* Body */}
            <div className="p-5 space-y-4 text-center">
              {/* Streak Badge */}
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 px-3.5 py-1.5 rounded-full border border-amber-400/40 text-xs font-black text-amber-700 dark:text-amber-400">
                <Flame className="w-4 h-4 fill-amber-500 text-amber-500 animate-bounce" />
                <span>{streakDays} Günlük Seri (Daily Streak)! 🔥</span>
              </div>

              {/* Timer Bar */}
              <div className="flex items-center justify-center gap-2 text-2xl font-black font-mono">
                <Timer className="w-6 h-6 text-orange-500" />
                <span className={timeLeftSeconds < 30 ? 'text-rose-500 animate-pulse' : ''}>
                  {formatTimer(timeLeftSeconds)}
                </span>
              </div>

              {!isCompleted ? (
                <div className="space-y-3">
                  <p className="text-xs font-semibold opacity-80">
                    Beyaz oynar ve şah kanadındaki feda kombinezonu ile kazanca ulaşır. Hazır mısın?
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setIsSolving(true);
                        onLoadDailyToBoard(DAILY_FEN);
                        onClose();
                      }}
                      className="flex-1 py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black text-xs shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>Süreyi Başlat & Tahtada Çöz</span>
                    </button>

                    <button
                      onClick={handleFinish}
                      className="py-3 px-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md"
                      title="Çözüldü olarak işaretle"
                    >
                      Çözdüm!
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-5 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border-2 border-emerald-400 space-y-2">
                  <Trophy className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="font-black text-base text-emerald-950 dark:text-emerald-200">
                    Bugünkü Performansın: 94 / 100! 🌟
                  </h4>
                  <p className="text-xs text-emerald-800 dark:text-emerald-300 font-medium">
                    Günün görevini harika bir sürede tamamladın. Serin {streakDays} güne yükseldi!
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
