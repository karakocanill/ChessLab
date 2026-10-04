import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Trophy, BookOpen, Target, ChevronRight } from 'lucide-react';
import { PRESET_POSITIONS } from '../data/presets';
import { PresetPosition } from '../types/chess';

interface PresetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (preset: PresetPosition) => void;
}

export const PresetsModal: React.FC<PresetsModalProps> = ({
  isOpen,
  onClose,
  onSelectPreset,
}) => {
  const [selectedCategory, setSelectedCategory] = React.useState<string>('All');

  const categories = ['All', 'Puzzles', 'Classics', 'Openings', 'Endgames'];

  const filtered = selectedCategory === 'All'
    ? PRESET_POSITIONS
    : PRESET_POSITIONS.filter((p) => p.category === selectedCategory);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border-4 border-amber-300 overflow-hidden flex flex-col max-h-[85vh]"
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-4 sm:p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center text-2xl shadow-inner">
                  🏆
                </div>
                <div>
                  <h3 className="font-black text-lg leading-tight">
                    Taktik Bulmacalar & Klasik Konumlar
                  </h3>
                  <p className="text-xs text-amber-100 font-semibold">
                    Efsane maçları incele veya mat kombinasyonlarını çöz!
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category tabs */}
            <div className="px-5 pt-3 pb-2 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                    selectedCategory === cat
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat === 'All' ? 'Tümü' : cat}
                </button>
              ))}
            </div>

            {/* Preset Cards List */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1">
              {filtered.map((preset) => (
                <motion.div
                  key={preset.id}
                  whileHover={{ scale: 1.01, x: 2 }}
                  onClick={() => {
                    onSelectPreset(preset);
                    onClose();
                  }}
                  className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 hover:bg-amber-50/70 border-2 border-slate-200 hover:border-amber-400 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-900 group-hover:text-amber-900">
                        {preset.title}
                      </span>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                        {preset.difficulty}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-500">
                        Sıra: {preset.turn === 'w' ? '⚪ Beyaz' : '⚫ Siyah'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium">
                      {preset.description}
                    </p>
                    <div className="text-[11px] font-bold text-emerald-700 flex items-center gap-1 pt-0.5">
                      <Target className="w-3.5 h-3.5" />
                      <span>Hedef: {preset.targetObjective}</span>
                    </div>
                  </div>

                  <div className="w-8 h-8 rounded-xl bg-white group-hover:bg-amber-500 group-hover:text-white flex items-center justify-center text-slate-400 border border-slate-200 transition-all shrink-0">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
