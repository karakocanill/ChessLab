import React from 'react';
import { motion } from 'motion/react';

interface PowerBarProps {
  scoreCp: number; // Centipawns (+ for white, - for black)
  isMate: boolean;
  mateIn?: number;
  orientation: 'white' | 'black';
}

export const PowerBar: React.FC<PowerBarProps> = ({
  scoreCp,
  isMate,
  mateIn,
  orientation,
}) => {
  // Convert score to percentage 0-100 (50 is equal)
  // Max clamp at +1000 and -1000 centipawns (10 pawns)
  let whitePercent = 50;
  if (isMate) {
    whitePercent = scoreCp > 0 ? 98 : 2;
  } else {
    // Sigmoid or clamped linear
    const clamped = Math.max(-1000, Math.min(1000, scoreCp));
    whitePercent = 50 + (clamped / 1000) * 45;
  }

  // Bar height representation based on board orientation
  const barPercent = orientation === 'white' ? whitePercent : 100 - whitePercent;

  // Formatting display text
  let evalText = '0.0';
  let emoji = '⚖️';

  if (isMate) {
    const winner = scoreCp > 0 ? 'Beyaz' : 'Siyah';
    evalText = `M${mateIn ?? 1}`;
    emoji = '🔥';
  } else {
    const inPawns = (scoreCp / 100).toFixed(1);
    evalText = scoreCp > 0 ? `+${inPawns}` : inPawns;

    if (scoreCp > 150) {
      emoji = orientation === 'white' ? '🔥' : '🧊';
    } else if (scoreCp < -150) {
      emoji = orientation === 'white' ? '🧊' : '🔥';
    } else {
      emoji = '⚖️';
    }
  }

  const isWinning = orientation === 'white' ? scoreCp > 100 : scoreCp < -100;
  const isLosing = orientation === 'white' ? scoreCp < -100 : scoreCp > 100;

  return (
    <div className="flex flex-col items-center select-none">
      {/* Top Status Emoji */}
      <div className="text-xl mb-1 filter drop-shadow-sm transition-transform hover:scale-125 duration-200">
        {isWinning ? '🔥' : isLosing ? '🧊' : '⚖️'}
      </div>

      {/* Main Power Bar Track */}
      <div
        className="w-7 sm:w-8 h-80 sm:h-96 md:h-[460px] bg-slate-900 rounded-full p-1 flex flex-col justify-end shadow-inner relative overflow-hidden border-2 border-slate-700/60"
        title={`Güç Dengesi: ${evalText} (${scoreCp > 0 ? 'Beyaz önde' : scoreCp < 0 ? 'Siyah önde' : 'Eşit'})`}
      >
        {/* Subtle grid ticks */}
        <div className="absolute inset-0 flex flex-col justify-between py-2 pointer-events-none opacity-20">
          <div className="w-full h-0.5 bg-white" />
          <div className="w-full h-0.5 bg-white" />
          <div className="w-full h-1 bg-amber-400 opacity-60" />
          <div className="w-full h-0.5 bg-white" />
          <div className="w-full h-0.5 bg-white" />
        </div>

        {/* Animated fill (White advantage goes up) */}
        <motion.div
          className="w-full rounded-full bg-gradient-to-t from-emerald-400 via-teal-200 to-white shadow-md relative"
          animate={{ height: `${barPercent}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 18 }}
        >
          {/* Glowing pulse indicator at balance edge */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-amber-300 blur-[1px] rounded-full" />
        </motion.div>

        {/* Floating Eval Score Tag */}
        <div className="absolute inset-x-0 bottom-2 text-center pointer-events-none">
          <span className="text-[11px] font-black tracking-tight text-slate-900 bg-white/95 px-1 py-0.5 rounded-md shadow-sm border border-slate-200 inline-block font-mono">
            {evalText}
          </span>
        </div>
      </div>

      {/* Bottom Status Emoji */}
      <div className="text-sm mt-1 text-slate-500 font-bold font-mono">
        {orientation === 'white' ? 'B' : 'S'}
      </div>
    </div>
  );
};
