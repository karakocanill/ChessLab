import React, { useRef } from 'react';
import {
  Volume2,
  VolumeX,
  RotateCw,
  Sparkles,
  Palette,
  Gamepad2,
  Brush,
  Sun,
  Moon,
  Camera,
  BookOpen,
} from 'lucide-react';
import { GameMode, BoardThemeId } from '../types/chess';
import { BOARD_THEMES } from '../data/themes';

interface HeaderProps {
  mode: GameMode;
  onToggleMode: (mode: GameMode) => void;
  orientation: 'white' | 'black';
  onFlipBoard: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  currentThemeId: BoardThemeId;
  onChangeTheme: (themeId: BoardThemeId) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onTriggerEasterEgg: () => void;
  onOpenVision: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  onToggleMode,
  orientation,
  onFlipBoard,
  isMuted,
  onToggleMute,
  currentThemeId,
  onChangeTheme,
  isDarkMode,
  onToggleDarkMode,
  onTriggerEasterEgg,
  onOpenVision,
}) => {
  const clickTimestampsRef = useRef<number[]>([]);

  const handleDarkToggleClick = () => {
    const now = Date.now();
    clickTimestampsRef.current = clickTimestampsRef.current.filter((t) => now - t < 2200);
    clickTimestampsRef.current.push(now);

    if (clickTimestampsRef.current.length >= 6) {
      clickTimestampsRef.current = [];
      onTriggerEasterEgg();
    }

    onToggleDarkMode();
  };

  return (
    <header
      className={`w-full backdrop-blur-md border-b-2 py-2.5 px-3 sm:px-4 sticky top-0 z-40 transition-colors duration-300 ${
        isDarkMode
          ? 'bg-slate-900/95 border-slate-800 text-slate-100 shadow-md'
          : 'bg-white/90 border-emerald-100 text-slate-800 shadow-2xs'
      }`}
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5 sm:gap-3">
        {/* Brand / Logo with "AI DESTEKLİ" Badge */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-amber-300 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 text-lg sm:text-xl font-black">
            ♞
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <h1
                className={`font-black text-base sm:text-lg tracking-tight ${
                  isDarkMode ? 'text-white' : 'text-slate-900'
                }`}
              >
                ChessLab
              </h1>
              {/* Requested AI DESTEKLİ Badge */}
              <span className="text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-400/50 shadow-xs flex items-center gap-1">
                <span>🤖 AI DESTEKLİ ✨</span>
              </span>
            </div>
            <p
              className={`text-[10px] sm:text-[11px] font-bold hidden sm:block ${
                isDarkMode ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              Satranç Analiz & Eğitim
            </p>
          </div>
        </div>

        {/* 3-Part Mode Selector: Oyun Modu | Serbest Dizilim | Akademi */}
        <div
          className={`flex items-center p-1 rounded-2xl border shadow-2xs ${
            isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'
          }`}
        >
          <button
            onClick={() => onToggleMode('game')}
            className={`flex items-center gap-1.5 py-1 px-2.5 sm:py-1.5 sm:px-3 rounded-xl text-xs font-black transition-all cursor-pointer ${
              mode === 'game'
                ? 'bg-emerald-600 text-white shadow-sm'
                : isDarkMode
                ? 'text-slate-400 hover:text-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Oyun Modu</span>
          </button>

          <button
            onClick={() => onToggleMode('sandbox')}
            className={`flex items-center gap-1.5 py-1 px-2.5 sm:py-1.5 sm:px-3 rounded-xl text-xs font-black transition-all cursor-pointer ${
              mode === 'sandbox'
                ? 'bg-amber-500 text-white shadow-sm'
                : isDarkMode
                ? 'text-slate-400 hover:text-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Brush className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>🎨 Serbest Dizilim</span>
          </button>

          {/* Direct 3rd Mode Button: Kitap + Şapka Akademi */}
          <button
            onClick={() => onToggleMode('academy')}
            className={`flex items-center gap-1.5 py-1 px-2.5 sm:py-1.5 sm:px-3 rounded-xl text-xs font-black transition-all cursor-pointer ${
              mode === 'academy'
                ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-400'
                : isDarkMode
                ? 'text-indigo-400 hover:text-indigo-200 hover:bg-slate-700'
                : 'text-indigo-700 hover:text-indigo-900 hover:bg-indigo-50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>🎓 Akademi</span>
          </button>
        </div>

        {/* Quick Toolbar Actions */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* Vision AI Button (Camera) */}
          <button
            onClick={onOpenVision}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              isDarkMode
                ? 'bg-slate-800 text-sky-400 border-slate-700 hover:bg-slate-700'
                : 'bg-slate-50 text-sky-600 border-slate-200 hover:bg-slate-100'
            }`}
            title="Fotoğraftan Tahta Yükle (Vision AI)"
          >
            <Camera className="w-4 h-4" />
          </button>

          {/* Dark / Light Mode Toggle Button (Ay & Güneş Görseli) */}
          <button
            onClick={handleDarkToggleClick}
            className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
              isDarkMode
                ? 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-700 ring-1 ring-amber-400/40'
                : 'bg-slate-50 hover:bg-amber-50 text-indigo-600 border-slate-200'
            }`}
            title={
              isDarkMode
                ? '☀️ Aydınlık Moda Geç (YOU ARE MY SUNSHINE!)'
                : '🌙 Karanlık Moda Geç'
            }
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600" />
            )}
          </button>

          {/* Theme Selector Dropdown */}
          <div className="relative group">
            <button
              className={`p-2 rounded-xl border transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold ${
                isDarkMode
                  ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
              title="Tahta Temasını Değiştir"
            >
              <Palette className="w-4 h-4 text-amber-500" />
            </button>
            <div
              className={`absolute right-0 mt-1 w-48 rounded-2xl shadow-xl border p-2 hidden group-hover:block z-50 animate-in fade-in zoom-in-95 ${
                isDarkMode
                  ? 'bg-slate-800 border-slate-700 text-slate-200'
                  : 'bg-white border-slate-200 text-slate-800'
              }`}
            >
              <div className="text-[10px] font-black px-2 py-1 uppercase tracking-wider text-slate-400">
                Tahta Teması
              </div>
              {Object.values(BOARD_THEMES).map((th) => (
                <button
                  key={th.id}
                  onClick={() => onChangeTheme(th.id)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center justify-between transition-colors ${
                    currentThemeId === th.id
                      ? 'bg-emerald-500 text-white font-black'
                      : isDarkMode
                      ? 'hover:bg-slate-700 text-slate-200'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span>{th.name}</span>
                  <div
                    className="w-4 h-4 rounded-full border border-slate-300"
                    style={{ backgroundColor: th.darkSquare }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Flip Board */}
          <button
            onClick={onFlipBoard}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              isDarkMode
                ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
            title={`Tahtayı Çevir (${orientation === 'white' ? 'Siyah' : 'Beyaz'} perspektifi)`}
          >
            <RotateCw className="w-4 h-4" />
          </button>

          {/* Mute/Unmute */}
          <button
            onClick={onToggleMute}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              isMuted
                ? 'bg-rose-50 text-rose-600 border-rose-200'
                : isDarkMode
                ? 'bg-slate-800 text-emerald-400 border-slate-700 hover:bg-slate-700'
                : 'bg-slate-50 text-emerald-700 border-slate-200 hover:bg-slate-100'
            }`}
            title={isMuted ? 'Sesi Aç' : 'Sesi Kapat'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
