import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface PromotionModalProps {
  isOpen: boolean;
  color: 'w' | 'b';
  onSelectPiece: (piece: 'q' | 'r' | 'b' | 'n') => void;
  onCancel: () => void;
}

const PROMOTION_CHOICES = [
  {
    type: 'q' as const,
    title: 'Vezir (Queen)',
    emoji: '👑',
    desc: 'En güçlü taş! Her yöne sınırsız gider.',
    power: 'Puan: 9',
    bg: 'from-amber-400 to-orange-500',
  },
  {
    type: 'n' as const,
    title: 'At (Knight)',
    emoji: '🐴',
    desc: 'Zıplayan süvari! Taşların üstünden atlar.',
    power: 'Puan: 3',
    bg: 'from-sky-400 to-blue-600',
  },
  {
    type: 'r' as const,
    title: 'Kale (Rook)',
    emoji: '🏰',
    desc: 'Düz çizgilerin hâkimi kale kulesi.',
    power: 'Puan: 5',
    bg: 'from-emerald-400 to-teal-600',
  },
  {
    type: 'b' as const,
    title: 'Fil (Bishop)',
    emoji: '🧙',
    desc: 'Çapraz yolların gizemli büyücüsü.',
    power: 'Puan: 3',
    bg: 'from-purple-400 to-indigo-600',
  },
];

export const PromotionModal: React.FC<PromotionModalProps> = ({
  isOpen,
  color,
  onSelectPiece,
  onCancel,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 15 }}
            className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border-4 border-amber-300 relative overflow-hidden"
          >
            {/* Playful decoration */}
            <div className="absolute top-0 right-0 -mt-6 -mr-6 w-24 h-24 bg-amber-200/50 rounded-full blur-xl pointer-events-none" />

            <div className="text-center mb-5">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 mb-2">
                <Sparkles className="w-6 h-6 animate-spin" />
              </div>
              <h2 className="text-xl font-black text-slate-900">
                Piyonun Terfi Ediyor! 🎉
              </h2>
              <p className="text-xs text-slate-500 font-semibold mt-1">
                Piyonun son kareye ulaştı. Hangi süper taşa dönüşmesini istersin?
              </p>
            </div>

            {/* Selection Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {PROMOTION_CHOICES.map((choice) => (
                <motion.button
                  key={choice.type}
                  onClick={() => onSelectPiece(choice.type)}
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  className="bg-slate-50 hover:bg-amber-50/80 p-3.5 rounded-2xl border-2 border-slate-200 hover:border-amber-400 transition-all text-left flex flex-col items-center group relative cursor-pointer shadow-xs hover:shadow-md"
                >
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${choice.bg} text-white flex items-center justify-center text-3xl shadow-sm mb-2 group-hover:scale-110 transition-transform`}
                  >
                    {choice.emoji}
                  </div>
                  <div className="font-extrabold text-sm text-slate-800 group-hover:text-amber-900 text-center">
                    {choice.title}
                  </div>
                  <div className="text-[11px] text-slate-500 text-center mt-0.5 line-clamp-1">
                    {choice.desc}
                  </div>
                  <span className="mt-1 text-[10px] font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                    {choice.power}
                  </span>
                </motion.button>
              ))}
            </div>

            {/* Cancel / Close */}
            <div className="text-center">
              <button
                onClick={onCancel}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
              >
                Vazgeç / Hamleyi Geri Al
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
