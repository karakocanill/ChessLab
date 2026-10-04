import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Upload, Sparkles, X, Check, Image as ImageIcon, AlertCircle } from 'lucide-react';

interface VisionBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadFen: (fen: string) => void;
  isDarkMode?: boolean;
}

export const VisionBoardModal: React.FC<VisionBoardModalProps> = ({
  isOpen,
  onClose,
  onLoadFen,
  isDarkMode = false,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/jpeg');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMimeType(file.type || 'image/jpeg');
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setErrorMsg(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyzePhoto = async () => {
    if (!selectedImage) return;
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/board-vision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: selectedImage,
          mimeType,
        }),
      });

      if (!res.ok) throw new Error('Fotoğraf analiz edilemedi.');
      const data = await res.json();

      if (data.fen) {
        onLoadFen(data.fen);
        onClose();
      } else {
        throw new Error('Geçerli bir tahta pozisyonu tespit edilemedi.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Görsel işlenirken bir sorun oluştu.');
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
            className={`rounded-3xl max-w-md w-full shadow-2xl border-4 overflow-hidden flex flex-col ${
              isDarkMode
                ? 'bg-slate-900 border-slate-700 text-slate-100'
                : 'bg-white border-sky-300 text-slate-800'
            }`}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-xl shadow-inner">
                  📸
                </div>
                <div>
                  <h3 className="font-black text-base leading-tight">
                    Fotoğraftan Tahta Yükle (Vision AI)
                  </h3>
                  <p className="text-xs text-sky-100 font-medium">
                    Gerçek tahta veya ekran görüntüsünden otomatik FEN çıkarımı
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
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {/* Upload Dropzone / Preview */}
              {selectedImage ? (
                <div className="relative rounded-2xl overflow-hidden border-2 border-dashed border-sky-400 max-h-56 flex items-center justify-center bg-black/5">
                  <img
                    src={selectedImage}
                    alt="Chessboard preview"
                    className="max-h-56 w-auto object-contain mx-auto"
                  />
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-black transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                    isDarkMode
                      ? 'border-slate-700 bg-slate-800/60 hover:bg-slate-800'
                      : 'border-sky-300 bg-sky-50/60 hover:bg-sky-100/60'
                  }`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-600 flex items-center justify-center">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div className="text-xs font-black">
                    Tahta Fotoğrafı Seç veya Buraya Bırak
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Ekran görüntüsü (Chess.com / Lichess) veya fiziksel tahta fotoğrafı yükle
                  </p>
                </div>
              )}

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-colors ${
                    isDarkMode
                      ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                      : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Farklı Fotoğraf
                </button>

                <button
                  onClick={handleAnalyzePhoto}
                  disabled={!selectedImage || isLoading}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-black text-xs shadow-md disabled:opacity-40 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
                      <span>Yapay Zeka Taşları Okuyor...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Tahtayı Çıkar ve Analiz Et</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
