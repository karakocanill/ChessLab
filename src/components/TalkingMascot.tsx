import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, MessageCircleQuestion } from 'lucide-react';

interface TalkingMascotProps {
  message: string;
  subMessage?: string;
  isThinking?: boolean;
  isInCheck?: boolean;
  isCheckmate?: boolean;
  onAskAdvice?: () => void;
}

const MASCOTS = [
  { id: 'dino', name: 'Büyükusta Dino', emoji: '🦖', bg: 'bg-emerald-500' },
  { id: 'owl', name: 'Bilge Baykuş', emoji: '🦉', bg: 'bg-amber-500' },
  { id: 'robot', name: 'Robo-Şah', emoji: '🤖', bg: 'bg-sky-500' },
  { id: 'panda', name: 'Usta Panda', emoji: '🐼', bg: 'bg-indigo-500' },
];

export const TalkingMascot: React.FC<TalkingMascotProps> = ({
  message,
  subMessage,
  isThinking = false,
  isInCheck = false,
  isCheckmate = false,
  onAskAdvice,
}) => {
  const [mascotIndex, setMascotIndex] = useState(0);
  const currentMascot = MASCOTS[mascotIndex];

  const cycleMascot = () => {
    setMascotIndex((prev) => (prev + 1) % MASCOTS.length);
  };

  return (
    <div className="flex items-start gap-3 bg-white/90 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border-2 border-emerald-100 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
      {/* Dynamic Background Glow when Alert or Check */}
      {isInCheck && (
        <div className="absolute inset-0 bg-rose-500/10 pointer-events-none animate-pulse" />
      )}

      {/* Mascot Avatar with click to switch character */}
      <div className="relative shrink-0">
        <motion.button
          onClick={cycleMascot}
          title="Farklı bir koç seçmek için tıkla!"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          className={`w-13 h-13 sm:w-14 sm:h-14 rounded-2xl ${currentMascot.bg} text-white flex items-center justify-center text-3xl shadow-md border-2 border-white relative cursor-pointer group`}
        >
          <motion.span
            animate={
              isInCheck
                ? { rotate: [-8, 8, -8], scale: [1, 1.15, 1] }
                : isThinking
                ? { y: [0, -4, 0] }
                : { rotate: [0, -3, 3, 0] }
            }
            transition={{
              repeat: Infinity,
              duration: isInCheck ? 0.6 : 2,
              ease: 'easeInOut',
            }}
          >
            {currentMascot.emoji}
          </motion.span>
          <div className="absolute -bottom-1 -right-1 bg-white text-[9px] font-bold text-slate-700 px-1 py-0.2 rounded-full shadow border border-slate-200">
            Değiştir
          </div>
        </motion.button>
      </div>

      {/* Speech Bubble */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-xs font-extrabold text-emerald-800 tracking-wide flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
            {currentMascot.name}
            {isInCheck && <span className="text-rose-600 font-black">⚠️ DİKKAT: ŞAH!</span>}
            {isCheckmate && <span className="text-purple-600 font-black">👑 ŞAH MAT!</span>}
          </span>

          {onAskAdvice && (
            <button
              onClick={onAskAdvice}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-700 hover:text-sky-900 bg-sky-50 hover:bg-sky-100 px-2 py-1 rounded-lg border border-sky-200 transition-colors"
            >
              <MessageCircleQuestion className="w-3.5 h-3.5" />
              <span>Koçla Konuş</span>
            </button>
          )}
        </div>

        {/* Message Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={message}
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            className="text-sm font-semibold text-slate-800 leading-snug"
          >
            {isThinking ? (
              <span className="inline-flex items-center gap-2 text-slate-600">
                <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
                Hımm... Tahtadaki en güçlü hamleyi hesaplıyorum...
              </span>
            ) : (
              message
            )}
          </motion.div>
        </AnimatePresence>

        {subMessage && !isThinking && (
          <p className="text-xs text-slate-500 mt-1 line-clamp-2">
            {subMessage}
          </p>
        )}
      </div>
    </div>
  );
};
