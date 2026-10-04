import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Send, Bot, CheckCircle, ShieldAlert } from 'lucide-react';
import { BestMoveAnalysis } from '../types/chess';

interface AiCoachModalProps {
  isOpen: boolean;
  onClose: () => void;
  fen: string;
  moves: string[];
  bestMoveAnalysis: BestMoveAnalysis | null;
  turn: 'w' | 'b';
}

export const AiCoachModal: React.FC<AiCoachModalProps> = ({
  isOpen,
  onClose,
  fen,
  moves,
  bestMoveAnalysis,
  turn,
}) => {
  const [question, setQuestion] = useState('');
  const [coachResponse, setCoachResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const askCoach = async (customPrompt?: string) => {
    setIsLoading(true);
    setCoachResponse(null);

    try {
      const res = await fetch('/api/chess-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fen,
          moves,
          userQuestion: customPrompt || question || 'Bu pozisyonda bana en iyi taktiği ve ne yapmam gerektiğini açıkla.',
          tone: 'kid_friendly',
        }),
      });

      if (!res.ok) throw new Error('API request failed');
      const data = await res.json();
      setCoachResponse(data.advice || 'Harika bir hamle arayışındasın! Taşlarını merkezde tut ve şahını koru!');
    } catch {
      // Local fallback explanation
      if (bestMoveAnalysis) {
        setCoachResponse(
          `🦉 Merhaba genç usta! Tahtada ${bestMoveAnalysis.explanation.title} fırsatı var! ${bestMoveAnalysis.explanation.shortSummary} ${bestMoveAnalysis.explanation.details}`
        );
      } else {
        setCoachResponse(
          '🦉 Harika odaklandın! Taşlarını oyuna sokmaya devam et, merkezi kontrol et ve rakibin şah kanadındaki açıklarını ara!'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border-4 border-emerald-300 overflow-hidden flex flex-col max-h-[85vh]"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl shadow-inner">
                  🦉
                </div>
                <div>
                  <h3 className="font-black text-base leading-tight">
                    Bilge Baykuş & Büyükusta Koç
                  </h3>
                  <p className="text-xs text-emerald-100 font-medium">
                    Çocuk Dostu Taktik & Pozisyon Rehberi
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

            {/* Scrollable Content */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-sm flex-1">
              {/* Tactical Summary Box */}
              {bestMoveAnalysis && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-xs font-black text-emerald-800 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      Motorun Önerisi:
                    </span>
                    <span className="text-xs font-black px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                      {bestMoveAnalysis.explanation.badge}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-800 mb-1">
                    {bestMoveAnalysis.explanation.title} ({bestMoveAnalysis.san})
                  </h4>
                  <p className="text-xs font-semibold text-slate-700 leading-relaxed mb-2">
                    {bestMoveAnalysis.explanation.shortSummary}
                  </p>
                  <p className="text-xs text-slate-600 italic border-t border-emerald-200/60 pt-1.5">
                    {bestMoveAnalysis.explanation.details}
                  </p>
                </div>
              )}

              {/* Coach AI Response area */}
              {coachResponse ? (
                <div className="p-4 rounded-2xl bg-sky-50 border-2 border-sky-200 text-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-sky-900 font-black text-xs">
                    <Bot className="w-4 h-4 text-sky-600" />
                    <span>Koçun Kişisel Tavsiyesi:</span>
                  </div>
                  <div className="text-xs font-semibold leading-relaxed whitespace-pre-line text-slate-700">
                    {coachResponse}
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-xs font-bold text-slate-600 mb-2">
                    Pozisyon hakkında derinlemesine bir masal ve taktik tavsiyesi ister misin?
                  </p>
                  <button
                    onClick={() => askCoach()}
                    disabled={isLoading}
                    className="py-2 px-4 rounded-xl font-black text-xs text-white bg-sky-600 hover:bg-sky-700 shadow-sm inline-flex items-center gap-2 transition-all disabled:opacity-50"
                  >
                    {isLoading ? (
                      <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
                    ) : (
                      <Sparkles className="w-4 h-4 text-amber-300" />
                    )}
                    <span>{isLoading ? 'Koç Düşünüyor...' : '🦉 Koça Bu Konumu Sor'}</span>
                  </button>
                </div>
              )}

              {/* Quick Questions Buttons */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-500">Hızlı Sorular:</span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => askCoach('Rakibin bana kurduğu bir tuzak var mı?')}
                    disabled={isLoading}
                    className="text-xs bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 font-bold px-2.5 py-1 rounded-lg border border-slate-200 transition-colors"
                  >
                    ⚠️ Rakibin tuzağı var mı?
                  </button>
                  <button
                    onClick={() => askCoach('Şahımı nasıl daha güvenli bir yere alabilirim?')}
                    disabled={isLoading}
                    className="text-xs bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 font-bold px-2.5 py-1 rounded-lg border border-slate-200 transition-colors"
                  >
                    🏰 Şahımı nasıl korurum?
                  </button>
                  <button
                    onClick={() => askCoach('Hangi taşımı oyuna sokmalıyım?')}
                    disabled={isLoading}
                    className="text-xs bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 font-bold px-2.5 py-1 rounded-lg border border-slate-200 transition-colors"
                  >
                    🚀 Hangi taşımı geliştirmeliyim?
                  </button>
                </div>
              </div>
            </div>

            {/* Footer Prompt Input */}
            <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && askCoach()}
                placeholder="Koça merak ettiğin bir şeyi yaz (örn: Vezirimi nereye kaçmalıyım?)..."
                className="flex-1 bg-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 font-medium"
              />
              <button
                onClick={() => askCoach()}
                disabled={isLoading}
                className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
