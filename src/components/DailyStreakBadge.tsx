import React from 'react';
import { motion } from 'motion/react';
import { Flame, Sparkles, ChevronRight, Check } from 'lucide-react';

interface DailyStreakBadgeProps {
  streakDays: number;
  onOpenDaily: () => void;
  isDarkMode?: boolean;
}

export const DailyStreakBadge: React.FC<DailyStreakBadgeProps> = ({
  streakDays,
  onOpenDaily,
  isDarkMode = false,
}) => {
  const daysOfWeek = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cts', 'Paz'];
  const todayIdx = (new Date().getDay() + 6) % 7; // Monday = 0

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      onClick={onOpenDaily}
      className={`p-3.5 rounded-2xl border-2 shadow-sm transition-all cursor-pointer relative overflow-hidden group ${
        isDarkMode
          ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950/40 border-amber-500/40'
          : 'bg-gradient-to-br from-amber-50/90 via-orange-50/70 to-white border-amber-300/80 shadow-2xs'
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-sm">
            <Flame className="w-5 h-5 fill-current animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-xs text-amber-900 dark:text-amber-300">
                {streakDays} Günlük Antrenman Serisi!
              </span>
              <span className="text-[10px] font-black px-1.5 py-0.2 rounded-md bg-amber-200/60 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200">
                🔥 Canlı
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
              Günün taktiğini çöz ve serini koru!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-0.5 text-xs font-black text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition-transform">
          <span>Çöz</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>

      {/* Week consistency dots (Duolingo style) */}
      <div className="flex items-center justify-between pt-1 border-t border-amber-200/40 dark:border-amber-500/20">
        {daysOfWeek.map((day, idx) => {
          const isDone = idx <= todayIdx;
          const isToday = idx === todayIdx;

          return (
            <div key={day} className="flex flex-col items-center gap-0.5">
              <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500">
                {day}
              </span>
              <div
                className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold transition-all ${
                  isToday
                    ? 'bg-amber-500 text-white ring-2 ring-amber-300 ring-offset-1 ring-offset-white dark:ring-offset-slate-900 shadow-xs'
                    : isDone
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                }`}
              >
                {isDone ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : '·'}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};
