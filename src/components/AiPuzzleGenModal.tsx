import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wand2, X, Sparkles, Play, Send } from 'lucide-react';

interface AiPuzzleGenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadGeneratedPuzzle: (puzzle: { fen: string; title: string; objective: string }) => void;
  isDarkMode?: boolean;
}

export const AiPuzzleGenModal: React.FC<AiPuzzleGenModalProps> = ({
  isOpen,
  onClose,
  onLoadGeneratedPuzzle,
  isDarkMode = false,
}) => {
  const [promptText, setPromptText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<any>(null);

  const handleGenerate = async (customPrompt?: string) => {
    const textToSend = customPrompt || promptText || '1500 Elo seviyesinde şah hücumu ve at çatalı içeren taktik';
    setIsLoading(true);
    setGeneratedResult(null);

    try {
      const res = await fetch('/api/generate-puzzle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userPrompt: textToSend }),
      });
      const data = await res.json();
      setGeneratedResult(data);
    } catch {
      // Fallback puzzle
      setGeneratedResult({
        title: 'Ölümcül At Çatalı',
        category: 'Çatal',
        fen: 'r3k3/pppq1ppp/8/3N4/8/8/PPPP1PPP/R1B1K2R w KQq - 0 1',
        turn: 'w',
        bestMoveSan: 'Nc7+',
        description: 'At şah ve kaleyi aynı anda tehdit ederek taş kazancı sağlar.',
        objective: 'Atı c7 karesine oynayarak şah ve kale çatalı at!',
      });
    } finally {
      setIsLoading(false);
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
            className={`rounded-3xl max-w-lg w-full shadow-2xl border-4 overflow-hidden flex flex-col ${
              isDarkMode
                ? 'bg-slate-900 border-slate-700 text-slate-100'
                : 'bg-white border-teal-300 text-slate-800'
            }`}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-teal-500 via-emerald-500 to-sky-600 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-xl shadow-inner">
                  🪄
                </div>
                <div>
                  <h3 className="font-black text-base leading-tight">
                    AI Puzzle Architect
                  </h3>
                  <p className="text-xs text-teal-100 font-medium">
                    Doğal dilde istediğin taktik senaryoyu yaz, yapay zeka tahtayı üretsin!
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
            <div className="p-5 space-y-4">
              {/* Input Area */}
              <div className="space-y-1.5">
                <label className="text-xs font-black opacity-80">
                  Nasıl bir taktik bulmaca istersin?
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={promptText}
                    onChange={(e) => setPromptText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                    placeholder="Örn: 1500 ELO seviyesinde vezir fedası ve mat ağı..."
                    className={`flex-1 p-2.5 rounded-xl border text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-400 ${
                      isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                  <button
                    onClick={() => handleGenerate()}
                    disabled={isLoading}
                    className="p-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white disabled:opacity-40 transition-colors cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Quick Prompts */}
              <div className="space-y-1">
                <span className="text-[11px] opacity-60 font-bold">Örnek İstekler:</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Kral saldırısı içeren vezir fedası',
                    '1400 ELO seviyesinde at çatalı',
                    'Zayıf arka yatay mat kombinasyonu',
                    'Açmazdaki taşa yüklenme taktiği',
                  ].map((presetPrompt) => (
                    <button
                      key={presetPrompt}
                      onClick={() => {
                        setPromptText(presetPrompt);
                        handleGenerate(presetPrompt);
                      }}
                      className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition-colors cursor-pointer ${
                        isDarkMode
                          ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300'
                          : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {presetPrompt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generated Result Card */}
              {isLoading && (
                <div className="p-6 text-center space-y-2">
                  <Sparkles className="w-6 h-6 text-teal-500 animate-spin mx-auto" />
                  <p className="text-xs font-bold opacity-75">
                    Yapay Zeka FEN dizilimini ve taktik çizgiyi hesaplıyor...
                  </p>
                </div>
              )}

              {generatedResult && !isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-2xl border-2 space-y-2 ${
                    isDarkMode ? 'bg-slate-800/80 border-teal-500/40' : 'bg-teal-50/70 border-teal-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-sm text-teal-900 dark:text-teal-200">
                      {generatedResult.title}
                    </span>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-teal-600 text-white">
                      {generatedResult.category}
                    </span>
                  </div>

                  <p className="text-xs font-semibold leading-relaxed">
                    🎯 Hedef: {generatedResult.objective}
                  </p>
                  <p className="text-[11px] opacity-75">
                    {generatedResult.description}
                  </p>

                  <button
                    onClick={() => {
                      onLoadGeneratedPuzzle({
                        fen: generatedResult.fen,
                        title: generatedResult.title,
                        objective: generatedResult.objective,
                      });
                      onClose();
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer mt-2"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Bu Puzzle'ı Tahtaya Aktar ve Oyna! 🚀</span>
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
