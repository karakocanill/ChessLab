import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronDown,
  ChevronUp,
  Sparkles,
  Info,
  Target,
} from 'lucide-react';
import { ELO_PRESETS } from '../data/eloPresets';

interface EloAndSuggestionControlsProps {
  currentElo: number;
  onChangeElo: (elo: number) => void;
  suggestionCount: number;
  onChangeSuggestionCount: (count: number) => void;
  showBlunderArrow: boolean;
  onToggleShowBlunder: () => void;
  arrowTargetSide: 'auto' | 'w' | 'b';
  onChangeArrowTargetSide: (side: 'auto' | 'w' | 'b') => void;
}

export const EloAndSuggestionControls: React.FC<EloAndSuggestionControlsProps> = ({
  currentElo,
  onChangeElo,
  suggestionCount,
  onChangeSuggestionCount,
  showBlunderArrow,
  onToggleShowBlunder,
  arrowTargetSide,
  onChangeArrowTargetSide,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Find active preset or closest
  const activePreset =
    ELO_PRESETS.find((p) => p.elo === currentElo) ||
    ELO_PRESETS.reduce((prev, curr) =>
      Math.abs(curr.elo - currentElo) < Math.abs(prev.elo - currentElo) ? curr : prev
    );

  const getTargetSideLabel = () => {
    if (arrowTargetSide === 'w') return '⚪ Beyaz Okları';
    if (arrowTargetSide === 'b') return '⚫ Siyah Okları';
    return '🔄 Sıradaki';
  };

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl border-2 border-slate-200/90 shadow-sm overflow-hidden transition-all">
      {/* Top Bar / Summary (Always visible & tap-friendly) */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-3.5 py-2.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors cursor-pointer select-none"
      >
        <div className="flex items-center gap-2.5">
          <div
            className={`w-9 h-9 rounded-xl ${activePreset.avatar} text-white flex items-center justify-center text-lg shadow-sm`}
          >
            {activePreset.character}
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-extrabold text-xs text-slate-800">
                Motor Gücü & ELO:
              </span>
              <span className="font-mono font-black text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                {currentElo} ELO
              </span>
              <span className="text-[10px] font-black text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                {getTargetSideLabel()}
              </span>
            </div>
            <div className="text-[11px] text-slate-500 font-semibold flex items-center gap-1.5 flex-wrap">
              <span>{activePreset.title}</span>
              <span>•</span>
              <span className="text-emerald-600 font-bold">{suggestionCount} Ok</span>
              {showBlunderArrow && (
                <>
                  <span>•</span>
                  <span className="text-rose-500 font-bold">🔴 Hata Oku Açık</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 text-slate-400">
          <span className="text-xs font-bold hidden sm:inline">
            {isExpanded ? 'Kapat' : 'Ayarla'}
          </span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Expanded Controls Panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-slate-100 p-3.5 space-y-3.5 bg-slate-50/50"
          >
            {/* ELO Presets Grid */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-extrabold text-slate-700">
                  Seviye Seç (Chess.com ELO):
                </label>
                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  ⚡ Optimize & Hızlı
                </span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                {ELO_PRESETS.map((p) => {
                  const isSelected = p.elo === currentElo;
                  return (
                    <button
                      key={p.elo}
                      onClick={() => onChangeElo(p.elo)}
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm font-black'
                          : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 font-semibold'
                      }`}
                    >
                      <div className="text-base">{p.character}</div>
                      <div className="text-xs font-black">{p.elo}</div>
                      <div
                        className={`text-[9px] truncate ${
                          isSelected ? 'text-emerald-100' : 'text-slate-400'
                        }`}
                      >
                        {p.title}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Oklar Kimin İçin Gösterilsin? (White / Black / Auto Target Side Option) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-xl bg-white border border-slate-200">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <div className="text-xs font-extrabold text-slate-800">
                    Oklar Kimin İçin Gösterilsin?
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Sırası gelen tarafı veya özel olarak Beyaz/Siyah'ın taktik planlarını göster.
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0">
                <button
                  onClick={() => onChangeArrowTargetSide('auto')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                    arrowTargetSide === 'auto'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  🔄 Sıradaki (Oto)
                </button>
                <button
                  onClick={() => onChangeArrowTargetSide('w')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                    arrowTargetSide === 'w'
                      ? 'bg-amber-100 text-amber-900 shadow-xs ring-1 ring-amber-400'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  ⚪ Beyaz
                </button>
                <button
                  onClick={() => onChangeArrowTargetSide('b')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                    arrowTargetSide === 'b'
                      ? 'bg-slate-900 text-white shadow-xs ring-1 ring-emerald-400'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  ⚫ Siyah
                </button>
              </div>
            </div>

            {/* Suggestion Count (Multi-PV Slider/Buttons) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-extrabold text-slate-700">
                  Gösterilecek Alternatif Hamle Sayısı:
                </label>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {suggestionCount} Farklı Ok
                </span>
              </div>
              <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200">
                {[1, 2, 3, 4, 5].map((cnt) => (
                  <button
                    key={cnt}
                    onClick={() => onChangeSuggestionCount(cnt)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                      suggestionCount === cnt
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {cnt} Öneri
                  </button>
                ))}
              </div>
            </div>

            {/* Worst Move / Blunder Toggle */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200">
              <div className="flex items-center gap-2">
                <span className="text-base">🔴</span>
                <div>
                  <div className="text-xs font-extrabold text-slate-800">
                    En Kötü Hamle Uyarısı (Kırmızı Ok)
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Büyük hataları önceden fark et ve sakın yapma!
                  </div>
                </div>
              </div>

              <button
                onClick={onToggleShowBlunder}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-colors ${
                  showBlunderArrow
                    ? 'bg-rose-500 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {showBlunderArrow ? 'Açık' : 'Kapalı'}
              </button>
            </div>

            {/* Color Legend */}
            <div className="p-3 bg-white rounded-xl border border-slate-200 text-[11px] space-y-1.5">
              <div className="font-black text-slate-700 flex items-center gap-1 text-xs">
                <Info className="w-3.5 h-3.5 text-sky-500" />
                <span>Renk Anlamları & Taktik Okları:</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 pt-1">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
                  <span className="font-bold text-slate-700">1. En İyi (Yeşil)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-blue-500 shrink-0" />
                  <span className="font-bold text-slate-700">2. En İyi (Mavi)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-orange-500 shrink-0" />
                  <span className="font-bold text-slate-700">3. Alternatif (Turuncu)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500 shrink-0" />
                  <span className="font-bold text-slate-700">En Kötü / Hata (Kırmızı)</span>
                </div>
                <div className="flex items-center gap-1.5 col-span-2 sm:col-span-1">
                  <div className="w-3 h-3 rounded-full bg-purple-500 shrink-0" />
                  <span className="font-bold text-slate-700">Açılış Kitabı (Mor)</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
