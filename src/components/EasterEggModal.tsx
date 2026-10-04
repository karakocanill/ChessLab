import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Sparkles, X, Heart } from 'lucide-react';
import { triggerConfetti } from '../utils/celebrate';

interface EasterEggModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EasterEggModal: React.FC<EasterEggModalProps> = ({ isOpen, onClose }) => {
  React.useEffect(() => {
    if (isOpen) {
      triggerConfetti();
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.5, rotate: -15, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0.5, rotate: 15, opacity: 0 }}
            className="bg-gradient-to-br from-amber-300 via-orange-400 to-yellow-300 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border-4 border-yellow-200 text-center relative overflow-hidden"
          >
            {/* Spinning sun rays in background */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 15, ease: 'linear' }}
              className="absolute -top-20 -left-20 w-80 h-80 bg-white/20 rounded-full blur-2xl pointer-events-none"
            />

            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/30 hover:bg-white/50 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Mascot with Sunglasses */}
            <div className="relative inline-block mb-3">
              <div className="w-24 h-24 rounded-3xl bg-white/40 shadow-inner flex items-center justify-center text-6xl mx-auto border-2 border-white/60">
                🦖🕶️
              </div>
              <motion.div
                animate={{ scale: [1, 1.25, 1], rotate: [0, 15, -15, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -top-2 -right-2 bg-yellow-100 text-amber-900 text-xl p-1.5 rounded-full shadow-md"
              >
                ☀️
              </motion.div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-amber-950 tracking-tight mb-2 drop-shadow-xs">
              🎶 YOU ARE MY SUNSHINEEE! ☀️
            </h2>

            <p className="text-xs sm:text-sm font-extrabold text-amber-900/90 leading-relaxed mb-4">
              Gece-gündüz anahtarını ışık hızında açıp kapatarak gizli Easter Egg'i uyandırdın! Gözlerin kamaşmadıysa Büyükusta Dino sana selam söylüyor! 😎🌟
            </p>

            <div className="inline-flex items-center gap-2 bg-white/40 px-3 py-1.5 rounded-xl border border-white/60 text-xs font-black text-amber-950 mb-5">
              <Sparkles className="w-4 h-4 text-amber-700" />
              <span>Gizli Başarım: "Güneş Çocuğu" Açıldı!</span>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-2xl bg-amber-950 text-amber-100 hover:bg-amber-900 font-black text-sm shadow-md transition-all cursor-pointer"
            >
              Tamamdır, Oyuna Devam! 🚀
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
