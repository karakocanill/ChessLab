import React from 'react';
import { motion } from 'motion/react';
import { Trash2, Eraser, RotateCcw, Sparkles, PlusCircle } from 'lucide-react';

interface SandboxTrayProps {
  selectedPiece: string | null; // e.g. 'wP', 'bQ', or 'erase'
  onSelectPiece: (piece: string | null) => void;
  onClearBoard: () => void;
  onResetStandard: () => void;
  turn: 'w' | 'b';
  onChangeTurn: (turn: 'w' | 'b') => void;
  isTrashHovered: boolean;
  setIsTrashHovered: (hovered: boolean) => void;
}

// Visual piece SVGs / representations
const PIECES_CONFIG = [
  { type: 'wK', name: 'Şah (B)', char: '♔', color: 'w' },
  { type: 'wQ', name: 'Vezir (B)', char: '♕', color: 'w' },
  { type: 'wR', name: 'Kale (B)', char: '♖', color: 'w' },
  { type: 'wB', name: 'Fil (B)', char: '♗', color: 'w' },
  { type: 'wN', name: 'At (B)', char: '♘', color: 'w' },
  { type: 'wP', name: 'Piyon (B)', char: '♙', color: 'w' },
  { type: 'bK', name: 'Şah (S)', char: '♚', color: 'b' },
  { type: 'bQ', name: 'Vezir (S)', char: '♛', color: 'b' },
  { type: 'bR', name: 'Kale (S)', char: '♜', color: 'b' },
  { type: 'bB', name: 'Fil (S)', char: '♝', color: 'b' },
  { type: 'bN', name: 'At (S)', char: '♞', color: 'b' },
  { type: 'bP', name: 'Piyon (S)', char: '♟', color: 'b' },
];

export const SandboxTray: React.FC<SandboxTrayProps> = ({
  selectedPiece,
  onSelectPiece,
  onClearBoard,
  onResetStandard,
  turn,
  onChangeTurn,
  isTrashHovered,
  setIsTrashHovered,
}) => {
  const whitePieces = PIECES_CONFIG.filter((p) => p.color === 'w');
  const blackPieces = PIECES_CONFIG.filter((p) => p.color === 'b');

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl border-2 border-amber-200/80 shadow-sm p-4 space-y-4">
      {/* Title & Turn Indicator */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-100 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500 animate-spin" />
          <h3 className="font-extrabold text-sm text-slate-800">
            Serbest Taş Laboratuvarı (Sandbox)
          </h3>
        </div>

        {/* Turn Selector in Free Mode */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          <span className="text-xs font-bold text-slate-500 pl-1.5">Sıra:</span>
          <button
            onClick={() => onChangeTurn('w')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              turn === 'w'
                ? 'bg-white text-slate-900 shadow-sm ring-1 ring-emerald-500'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ⚪ Beyaz
          </button>
          <button
            onClick={() => onChangeTurn('b')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              turn === 'b'
                ? 'bg-slate-900 text-white shadow-sm ring-1 ring-emerald-500'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ⚫ Siyah
          </button>
        </div>
      </div>

      {/* Piece Palette */}
      <div className="space-y-2.5">
        <div className="text-xs font-bold text-slate-600 flex items-center justify-between">
          <span>Taş Seç & Tahtaya Tıkla (veya Sürükle):</span>
          {selectedPiece && selectedPiece !== 'erase' && (
            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-extrabold text-[11px]">
              Seçili: {selectedPiece} (Tahtaya tıkla)
            </span>
          )}
          {selectedPiece === 'erase' && (
            <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full font-extrabold text-[11px]">
              🧹 Silgi Modu Aktif (Kaldırmak istediğin taşa tıkla)
            </span>
          )}
        </div>

        {/* White Pieces */}
        <div className="flex items-center justify-between gap-1 bg-amber-50/70 p-2 rounded-xl border border-amber-200/50">
          <span className="text-xs font-extrabold text-amber-900 w-12 shrink-0">Beyaz:</span>
          <div className="flex-1 flex items-center justify-around gap-1">
            {whitePieces.map((p) => {
              const isSelected = selectedPiece === p.type;
              return (
                <motion.button
                  key={p.type}
                  onClick={() => onSelectPiece(isSelected ? null : p.type)}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  title={`${p.name} yerleştirmek için tıkla`}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-2xl font-serif shadow-xs transition-all border ${
                    isSelected
                      ? 'bg-emerald-500 text-white border-emerald-600 shadow-md ring-2 ring-emerald-300'
                      : 'bg-white hover:bg-emerald-50 text-slate-800 border-amber-200'
                  }`}
                >
                  {p.char}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Black Pieces */}
        <div className="flex items-center justify-between gap-1 bg-slate-100 p-2 rounded-xl border border-slate-200">
          <span className="text-xs font-extrabold text-slate-700 w-12 shrink-0">Siyah:</span>
          <div className="flex-1 flex items-center justify-around gap-1">
            {blackPieces.map((p) => {
              const isSelected = selectedPiece === p.type;
              return (
                <motion.button
                  key={p.type}
                  onClick={() => onSelectPiece(isSelected ? null : p.type)}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  title={`${p.name} yerleştirmek için tıkla`}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-2xl font-serif shadow-xs transition-all border ${
                    isSelected
                      ? 'bg-emerald-500 text-white border-emerald-600 shadow-md ring-2 ring-emerald-300'
                      : 'bg-slate-800 hover:bg-slate-700 text-amber-100 border-slate-700'
                  }`}
                >
                  {p.char}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Trash Can & Eraser Zone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
        {/* Trash Can Zone */}
        <div
          onMouseEnter={() => setIsTrashHovered(true)}
          onMouseLeave={() => setIsTrashHovered(false)}
          className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed transition-all cursor-pointer ${
            isTrashHovered
              ? 'border-rose-500 bg-rose-100 text-rose-800 scale-102 shadow-md'
              : 'border-rose-300 bg-rose-50/60 text-rose-700 hover:bg-rose-100/60'
          }`}
          title="Tahtadaki taşları silmek için buraya sürükle veya silgi modunu aç"
        >
          <Trash2 className="w-5 h-5 text-rose-600 animate-bounce" />
          <div className="text-left">
            <div className="text-xs font-extrabold">Çöp Kutusu</div>
            <div className="text-[10px] text-rose-600/80">Taşları buraya bırak ve yok et</div>
          </div>
        </div>

        {/* Eraser Button */}
        <button
          onClick={() => onSelectPiece(selectedPiece === 'erase' ? null : 'erase')}
          className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 font-bold text-xs transition-all ${
            selectedPiece === 'erase'
              ? 'border-rose-600 bg-rose-500 text-white shadow-md ring-2 ring-rose-200'
              : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Eraser className="w-4 h-4" />
          <span>{selectedPiece === 'erase' ? 'Silgiyi Kapat' : '🧹 Silgi Modu'}</span>
        </button>
      </div>

      {/* Quick Setup Actions */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
        <button
          onClick={onClearBoard}
          className="flex-1 py-2 px-3 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors border border-rose-200 flex items-center justify-center gap-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Tahtayı Temizle</span>
        </button>

        <button
          onClick={onResetStandard}
          className="flex-1 py-2 px-3 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors border border-slate-200 flex items-center justify-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Standart Dizilim</span>
        </button>
      </div>
    </div>
  );
};
