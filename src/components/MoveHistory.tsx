import React, { useRef, useEffect, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  RotateCcw,
  Copy,
  Check,
  GitBranch,
  Download,
  Upload,
  FileText,
  Camera,
} from 'lucide-react';
import { MoveRecord } from '../types/chess';

interface MoveHistoryProps {
  history: MoveRecord[];
  currentMoveIndex: number; // -1 means starting position
  onSelectMove: (index: number) => void;
  onReset: () => void;
  fen: string;
  isDarkMode?: boolean;
  onImportPgn?: (pgn: string) => void;
  onOpenVision?: () => void;
}

export const MoveHistory: React.FC<MoveHistoryProps> = ({
  history,
  currentMoveIndex,
  onSelectMove,
  onReset,
  fen,
  isDarkMode = false,
  onImportPgn,
  onOpenVision,
}) => {
  const [copiedFen, setCopiedFen] = useState(false);
  const [copiedPgn, setCopiedPgn] = useState(false);
  const [showPgnModal, setShowPgnModal] = useState(false);
  const [pastedPgn, setPastedPgn] = useState('');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Group moves into pairs (White & Black)
  const movePairs: Array<{
    moveNumber: number;
    white?: { record: MoveRecord; index: number };
    black?: { record: MoveRecord; index: number };
  }> = [];

  history.forEach((record, index) => {
    if (record.color === 'w') {
      movePairs.push({
        moveNumber: record.moveNumber,
        white: { record, index },
      });
    } else {
      const lastPair = movePairs[movePairs.length - 1];
      if (lastPair && !lastPair.black) {
        lastPair.black = { record, index };
      } else {
        movePairs.push({
          moveNumber: record.moveNumber,
          black: { record, index },
        });
      }
    }
  });

  // Auto scroll to active move
  useEffect(() => {
    if (scrollContainerRef.current) {
      const activeEl = scrollContainerRef.current.querySelector('.active-move');
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [currentMoveIndex]);

  const copyFen = () => {
    navigator.clipboard.writeText(fen);
    setCopiedFen(true);
    setTimeout(() => setCopiedFen(false), 2000);
  };

  // Generate standard PGN format
  const generatePgnString = () => {
    let pgn = '[Event "ChessForge Game"]\n[Site "ChessForge"]\n[Date "' + new Date().toISOString().split('T')[0] + '"]\n\n';
    movePairs.forEach((pair) => {
      pgn += `${pair.moveNumber}. ${pair.white?.record.san || ''} ${pair.black?.record.san || ''} `;
    });
    return pgn.trim();
  };

  const copyPgn = () => {
    const pgn = generatePgnString();
    navigator.clipboard.writeText(pgn);
    setCopiedPgn(true);
    setTimeout(() => setCopiedPgn(false), 2000);
  };

  const getBadgeIcon = (quality?: string) => {
    switch (quality) {
      case 'best':
        return <span title="En İyi Hamle" className="text-emerald-500 font-bold ml-1">⭐</span>;
      case 'great':
        return <span title="Harika Hamle" className="text-teal-500 font-bold ml-1">🎯</span>;
      case 'blunder':
        return <span title="Hata!" className="text-rose-500 font-bold ml-1">❌</span>;
      default:
        return null;
    }
  };

  const isAtStart = currentMoveIndex === -1;
  const isAtEnd = currentMoveIndex === history.length - 1;

  return (
    <div
      className={`rounded-2xl border-2 shadow-sm flex flex-col h-full overflow-hidden transition-colors ${
        isDarkMode
          ? 'bg-slate-900 border-slate-800 text-slate-100 shadow-md'
          : 'bg-white border-slate-200/80 text-slate-800'
      }`}
    >
      {/* Header */}
      <div
        className={`px-3.5 py-2.5 border-b flex items-center justify-between transition-colors ${
          isDarkMode ? 'bg-slate-800/80 border-slate-800' : 'bg-slate-50/70 border-slate-100'
        }`}
      >
        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-emerald-500" />
          <h3 className="font-extrabold text-xs sm:text-sm">
            Hamle Geçmişi
          </h3>
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-200/70 text-slate-700'
            }`}
          >
            {history.length} hamle
          </span>
        </div>

        {/* FEN / PGN Actions */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={copyFen}
            title="Mevcut FEN kodunu panoya kopyala"
            className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-lg border shadow-2xs transition-colors ${
              isDarkMode
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                : 'bg-white hover:bg-emerald-50 text-slate-600 border-slate-200'
            }`}
          >
            {copiedFen ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
            <span>{copiedFen ? 'Kopyalandı' : 'FEN'}</span>
          </button>

          <button
            onClick={copyPgn}
            title="Tüm oyunu PGN olarak kopyala"
            className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-lg border shadow-2xs transition-colors ${
              isDarkMode
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                : 'bg-white hover:bg-sky-50 text-slate-600 border-slate-200'
            }`}
          >
            {copiedPgn ? <Check className="w-3 h-3 text-emerald-500" /> : <FileText className="w-3 h-3" />}
            <span>{copiedPgn ? 'Kopyalandı' : 'PGN'}</span>
          </button>

          {onOpenVision && (
            <button
              onClick={onOpenVision}
              title="Fotoğraftan Tahta Yükle (Vision AI)"
              className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-lg border shadow-2xs transition-colors cursor-pointer ${
                isDarkMode
                  ? 'bg-slate-800 hover:bg-slate-700 text-sky-400 border-slate-700'
                  : 'bg-white hover:bg-sky-50 text-sky-600 border-slate-200'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Fotoğraf</span>
            </button>
          )}

          {onImportPgn && (
            <button
              onClick={() => setShowPgnModal(true)}
              title="PGN yapıştırarak oyunu yükle"
              className={`p-1 rounded-lg border transition-colors ${
                isDarkMode
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                  : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Move List */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-2 space-y-1 min-h-[160px] max-h-[280px] sm:max-h-[340px] text-sm"
      >
        {/* Starting position button */}
        <button
          onClick={() => onSelectMove(-1)}
          className={`w-full text-left px-2.5 py-1.5 rounded-xl font-medium flex items-center justify-between transition-colors ${
            isAtStart
              ? isDarkMode
                ? 'bg-emerald-900/60 text-emerald-200 font-bold active-move ring-1 ring-emerald-500'
                : 'bg-emerald-100/80 text-emerald-950 font-bold active-move ring-1 ring-emerald-400'
              : isDarkMode
              ? 'text-slate-400 hover:bg-slate-800'
              : 'text-slate-500 hover:bg-slate-100'
          }`}
        >
          <span>🏁 Başlangıç Konumu</span>
          <span className="text-[11px] opacity-60">Hamle 0</span>
        </button>

        {movePairs.length === 0 && (
          <div className="py-8 text-center text-xs opacity-50 font-medium">
            Henüz hamle yapılmadı.<br />İlk hamleyi sen yap! 🚀
          </div>
        )}

        {movePairs.map((pair) => (
          <div
            key={pair.moveNumber}
            className={`flex items-center text-xs sm:text-sm font-medium rounded-lg px-1 py-0.5 ${
              isDarkMode ? 'hover:bg-slate-800/60' : 'hover:bg-slate-50'
            }`}
          >
            {/* Move number */}
            <span className="w-8 opacity-50 font-mono font-bold text-right pr-2">
              {pair.moveNumber}.
            </span>

            {/* White move */}
            <div className="flex-1 pr-1">
              {pair.white ? (
                <button
                  onClick={() => onSelectMove(pair.white!.index)}
                  className={`w-full text-left px-2 py-1 rounded-md transition-all flex items-center justify-between ${
                    currentMoveIndex === pair.white.index
                      ? isDarkMode
                        ? 'bg-amber-950 text-amber-200 font-black shadow-xs ring-1 ring-amber-500 active-move'
                        : 'bg-amber-100 text-amber-950 font-black shadow-xs ring-1 ring-amber-400 active-move'
                      : isDarkMode
                      ? 'text-slate-200 hover:bg-slate-800'
                      : 'text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <span className="font-semibold">{pair.white.record.san}</span>
                  {getBadgeIcon(pair.white.record.evaluation?.quality)}
                </button>
              ) : (
                <span className="opacity-30">-</span>
              )}
            </div>

            {/* Black move */}
            <div className="flex-1 pl-1">
              {pair.black ? (
                <button
                  onClick={() => onSelectMove(pair.black!.index)}
                  className={`w-full text-left px-2 py-1 rounded-md transition-all flex items-center justify-between ${
                    currentMoveIndex === pair.black.index
                      ? isDarkMode
                        ? 'bg-amber-950 text-amber-200 font-black shadow-xs ring-1 ring-amber-500 active-move'
                        : 'bg-amber-100 text-amber-950 font-black shadow-xs ring-1 ring-amber-400 active-move'
                      : isDarkMode
                      ? 'text-slate-200 hover:bg-slate-800'
                      : 'text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <span className="font-semibold">{pair.black.record.san}</span>
                  {getBadgeIcon(pair.black.record.evaluation?.quality)}
                </button>
              ) : (
                <span className="opacity-30">-</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Controls */}
      <div
        className={`p-2 border-t flex items-center justify-between gap-1 transition-colors ${
          isDarkMode ? 'bg-slate-800/80 border-slate-800' : 'bg-slate-50/80 border-slate-100'
        }`}
      >
        <button
          onClick={onReset}
          title="Oyunu Sıfırla"
          className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onSelectMove(-1)}
            disabled={isAtStart}
            title="En başa git"
            className="p-1.5 rounded-lg hover:bg-slate-500/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => onSelectMove(Math.max(-1, currentMoveIndex - 1))}
            disabled={isAtStart}
            title="Önceki hamle"
            className="p-1.5 rounded-lg hover:bg-slate-500/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-2 text-xs font-mono font-bold opacity-80">
            {currentMoveIndex + 1} / {history.length}
          </span>
          <button
            onClick={() => onSelectMove(Math.min(history.length - 1, currentMoveIndex + 1))}
            disabled={isAtEnd}
            title="Sonraki hamle"
            className="p-1.5 rounded-lg hover:bg-slate-500/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onSelectMove(history.length - 1)}
            disabled={isAtEnd}
            title="En sona git"
            className="p-1.5 rounded-lg hover:bg-slate-500/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* PGN Import Modal */}
      {showPgnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div
            className={`p-5 rounded-3xl max-w-md w-full shadow-2xl border-2 space-y-3 ${
              isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-200'
            }`}
          >
            <h4 className="font-black text-sm">PGN İçe Aktar (Game Import)</h4>
            <p className="text-xs text-slate-400">
              Başka bir platformdan kopyaladığın PGN metnini buraya yapıştır:
            </p>
            <textarea
              value={pastedPgn}
              onChange={(e) => setPastedPgn(e.target.value)}
              placeholder="1. e4 e5 2. Nf3 Nc6 3. Bc4..."
              rows={4}
              className={`w-full p-2.5 rounded-xl border text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
                isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'
              }`}
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowPgnModal(false)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold opacity-70 hover:opacity-100"
              >
                İptal
              </button>
              <button
                onClick={() => {
                  if (onImportPgn && pastedPgn.trim()) {
                    onImportPgn(pastedPgn.trim());
                  }
                  setShowPgnModal(false);
                }}
                className="px-4 py-1.5 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Yükle ve Başlat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
