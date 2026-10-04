import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ShieldAlert,
  AlertTriangle,
  Zap,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Trophy,
} from 'lucide-react';
import { GameReviewReport, BlunderReviewItem } from '../types/chess';

interface GameReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: GameReviewReport | null;
  isLoading: boolean;
  onRetryMove: (blunder: BlunderReviewItem) => void;
  onStartBlunderPuzzle?: (blunder: BlunderReviewItem) => void;
}

export const GameReviewModal: React.FC<GameReviewModalProps> = ({
  isOpen,
  onClose,
  report,
  isLoading,
  onRetryMove,
  onStartBlunderPuzzle,
}) => {
  const [selectedBlunderId, setSelectedBlunderId] = useState<string | null>(null);

  const activeBlunder = report?.blunders.find((b) => b.id === selectedBlunderId) || report?.blunders[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border-4 border-rose-300 overflow-hidden flex flex-col max-h-[88vh]"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 p-4 sm:p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center text-2xl shadow-inner">
                  🔍
                </div>
                <div>
                  <h3 className="font-black text-lg leading-tight">
                    Hatalarımı Göster & Oyun Analizi (Game Review)
                  </h3>
                  <p className="text-xs text-rose-100 font-semibold">
                    Hamlelerini incele, kaçırdığın fırsatları ve doğrularını öğren!
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

            {/* Content Body */}
            {isLoading ? (
              <div className="p-10 text-center space-y-3">
                <Sparkles className="w-8 h-8 text-amber-500 animate-spin mx-auto" />
                <h4 className="font-black text-base text-slate-800">
                  Oyunun Bütün Hamleleri Taranıyor...
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Stockfish ve taktik motorumuz her hamleyi derinlemesine inceliyor ve en iyi alternatiflerle kıyaslıyor.
                </p>
              </div>
            ) : report ? (
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
                {/* Accuracy Scoreboard */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-center">
                    <span className="text-[10px] font-black uppercase text-slate-400 block">
                      ⚪ Beyaz İsabeti
                    </span>
                    <span className="text-xl font-black text-emerald-600 font-mono">
                      %{report.accuracyWhite}
                    </span>
                  </div>

                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-center">
                    <span className="text-[10px] font-black uppercase text-slate-400 block">
                      ⚫ Siyah İsabeti
                    </span>
                    <span className="text-xl font-black text-slate-800 font-mono">
                      %{report.accuracyBlack}
                    </span>
                  </div>

                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-center col-span-2 sm:col-span-1">
                    <span className="text-[10px] font-black uppercase text-slate-400 block">
                      Bulunan Hatalar
                    </span>
                    <span className="text-xl font-black text-rose-600 font-mono">
                      {report.blunders.length}
                    </span>
                  </div>
                </div>

                {/* If No Blunders Found */}
                {report.blunders.length === 0 ? (
                  <div className="p-6 bg-emerald-50 rounded-2xl border-2 border-emerald-200 text-center space-y-2">
                    <Trophy className="w-10 h-10 text-emerald-600 mx-auto" />
                    <h4 className="font-black text-base text-emerald-950">
                      Tebrikler! Oyunda Büyük Bir Hata Bulunamadı! 🏆
                    </h4>
                    <p className="text-xs text-emerald-800 font-medium">
                      Bütün hamlelerin büyükusta seviyesinde veya çok sağlamdı. Harika bir oyun çıkardın!
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Blunders Selectable Tabs / List */}
                    <div>
                      <div className="text-xs font-black text-slate-700 mb-2 flex items-center justify-between">
                        <span>Tespit Edilen Kritik Hamleler:</span>
                        <span className="text-[11px] text-slate-400">Detayını görmek için tıkla</span>
                      </div>

                      <div className="flex gap-2 overflow-x-auto pb-1">
                        {report.blunders.map((b, idx) => {
                          const isSelected = activeBlunder?.id === b.id;
                          return (
                            <button
                              key={b.id}
                              onClick={() => setSelectedBlunderId(b.id)}
                              className={`p-2 rounded-xl border text-left shrink-0 transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-rose-50 border-rose-400 shadow-sm ring-2 ring-rose-200'
                                  : 'bg-white border-slate-200 hover:bg-slate-50'
                              }`}
                            >
                              <div className="flex items-center gap-1.5 text-xs font-black">
                                <span>{b.severity === 'blunder' ? '❌' : b.severity === 'mistake' ? '⚠️' : '⚡'}</span>
                                <span>{b.moveNumber}. {b.playedSan}</span>
                              </div>
                              <span className="text-[10px] font-bold text-rose-600 block">
                                -{(b.evalLossCp / 100).toFixed(1)} Puan
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Active Blunder Deep Dive Breakdown */}
                    {activeBlunder && (
                      <motion.div
                        key={activeBlunder.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-2xl bg-gradient-to-br from-rose-50/70 via-white to-amber-50/50 border-2 border-rose-300 space-y-3.5"
                      >
                        {/* Comparison Banner: Played vs Should Play */}
                        <div className="grid grid-cols-2 gap-2 text-center">
                          {/* What was played */}
                          <div className="p-2.5 bg-rose-100/70 border border-rose-300 rounded-xl">
                            <span className="text-[10px] font-black uppercase text-rose-800 block">
                              ❌ Senin Oynadığın Hamle
                            </span>
                            <span className="font-mono text-base font-black text-rose-950">
                              {activeBlunder.playedSan}
                            </span>
                          </div>

                          {/* What should have been played */}
                          <div className="p-2.5 bg-emerald-100/70 border border-emerald-300 rounded-xl">
                            <span className="text-[10px] font-black uppercase text-emerald-800 block">
                              🟢 Oynaman Gereken En İyi Hamle
                            </span>
                            <span className="font-mono text-base font-black text-emerald-950">
                              {activeBlunder.bestSan}
                            </span>
                          </div>
                        </div>

                        {/* Why it is bad */}
                        <div className="bg-white p-3 rounded-xl border border-rose-200 text-xs space-y-1">
                          <h5 className="font-extrabold text-rose-900 flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                            <span>Neden Bu Hamle Sakıncalıydı?</span>
                          </h5>
                          <p className="text-slate-700 leading-relaxed font-medium">
                            {activeBlunder.whyBad}
                          </p>
                        </div>

                        {/* What should have happened (The 5-step advantage simulation) */}
                        <div className="bg-emerald-50/80 p-3 rounded-xl border border-emerald-200 text-xs space-y-1">
                          <h5 className="font-extrabold text-emerald-900 flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Bunu Oynasaydın Ne Olurdu? (5 Hamlelik Zafer Yolu):</span>
                          </h5>
                          <p className="text-slate-700 leading-relaxed font-medium">
                            {activeBlunder.continuationLine}
                          </p>
                        </div>

                        {/* Actions: Puzzle Challenge & Jump to Move */}
                        <div className="space-y-2 pt-1">
                          {onStartBlunderPuzzle && (
                            <button
                              onClick={() => {
                                onStartBlunderPuzzle(activeBlunder);
                                onClose();
                              }}
                              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-700 text-white font-black text-xs shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                            >
                              <Sparkles className="w-4 h-4 text-amber-200" />
                              <span>🧩 Hatamdan Puzzle Oluştur & Tahtada Çöz!</span>
                            </button>
                          )}

                          <button
                            onClick={() => {
                              onRetryMove(activeBlunder);
                              onClose();
                            }}
                            className="w-full py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                          >
                            <RotateCcw className="w-4 h-4 text-slate-500" />
                            <span>Pozisyona Geri Dön (Analizle Birlikte)</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </>
                )}
              </div>
            ) : null}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
