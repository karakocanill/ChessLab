import React from 'react';
import { motion } from 'motion/react';
import {
  BookOpen,
  GraduationCap,
  Target,
  Crown,
  Flame,
  Wand2,
  Camera,
  ChevronRight,
  Star,
} from 'lucide-react';
import { soundFx } from '../utils/audio';

interface AcademyStackViewProps {
  onOpenGuessTheMove: () => void;
  onOpenMotifs: () => void;
  onOpenDrills: () => void;
  onOpenEndgame: () => void;
  onOpenDaily: () => void;
  onOpenAiPuzzle: () => void;
  onOpenVision: () => void;
  onOpenPresets?: () => void;
  isDarkMode?: boolean;
}

export const AcademyStackView: React.FC<AcademyStackViewProps> = ({
  onOpenGuessTheMove,
  onOpenMotifs,
  onOpenDrills,
  onOpenEndgame,
  onOpenDaily,
  onOpenAiPuzzle,
  onOpenVision,
  isDarkMode = false,
}) => {
  // Lucide-react icons rendered conditionally based on the mode type:
  // - 'motifs' consistently renders with the 'book' icon (BookOpen)
  // - 'drills' consistently renders with the 'hat' icon (GraduationCap)
  // - Other training slots use purpose-built Lucide icons with matching color palettes
  const renderModeIcon = (modeId: string) => {
    switch (modeId) {
      case 'guess':
        return <Target className="w-6 h-6 sm:w-7 sm:h-7 text-amber-500 dark:text-amber-400 stroke-[2.2]" />;
      case 'motifs':
        return <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-500 dark:text-emerald-400 stroke-[2.2]" />;
      case 'drills':
        return <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7 text-violet-500 dark:text-violet-400 stroke-[2.2]" />;
      case 'endgame':
        return <Crown className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-500 dark:text-indigo-400 stroke-[2.2]" />;
      case 'daily':
        return <Flame className="w-6 h-6 sm:w-7 sm:h-7 text-rose-500 dark:text-rose-400 stroke-[2.2]" />;
      case 'aigen':
        return <Wand2 className="w-6 h-6 sm:w-7 sm:h-7 text-teal-500 dark:text-teal-400 stroke-[2.2]" />;
      case 'vision':
        return <Camera className="w-6 h-6 sm:w-7 sm:h-7 text-sky-500 dark:text-sky-400 stroke-[2.2]" />;
      default:
        return null;
    }
  };

  // 7 Unique, Distinctly Color-Coded Training Modules:
  // 1. Amber  (Guess the Move)
  // 2. Emerald (Taktik Motifler - Book)
  // 3. Violet (Açılış Ezberle & Drill - Hat)
  // 4. Indigo (Endgame Trainer)
  // 5. Rose   (Günün Pozisyonu)
  // 6. Teal   (AI Puzzle Architect)
  // 7. Sky    (Vision AI Tahta Çıkarıcı)
  const modules = [
    {
      id: 'guess',
      title: 'Guess the Move (Büyükusta Hamle Tahmini)',
      theme: 'amber',
      isFeatured: true,
      featuredTag: '⭐ ÖNE ÇIKAN MOD',
      badge: 'Efsane Maçlar • +15 Puan',
      desc: 'Büyükustaların zihnini oku! Kasparov, Tal ve Morphy gibi ustaların tarihi maçlarında kritik anı 3 seçenek arasından tahmin et ve taktik sezgini geliştir.',
      borderClasses: isDarkMode
        ? 'border-[3px] border-amber-400 shadow-lg shadow-amber-500/25 ring-2 ring-amber-400/40'
        : 'border-[3px] border-amber-500 shadow-lg shadow-amber-500/20 ring-2 ring-amber-300',
      radiusClass: 'rounded-[28px] sm:rounded-[32px]',
      accentBar: 'bg-amber-400',
      iconBg: isDarkMode ? 'bg-amber-950/70 border-amber-400/60' : 'bg-amber-100 border-amber-400',
      gradientBg: isDarkMode
        ? 'bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900'
        : 'bg-gradient-to-r from-amber-50 via-amber-100/30 to-white',
      badgeStyle: 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border-amber-400',
      btnStyle: 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/30',
      onClick: () => {
        soundFx.playTargetChime();
        onOpenGuessTheMove();
      },
    },
    {
      id: 'motifs',
      title: 'Taktik Motifler Akademisi (13 Taktik Silahı)',
      theme: 'emerald',
      isFeatured: true,
      featuredTag: '⭐ TEMEL EĞİTİM',
      badge: 'Çatal • Açmaz • Şiş • Ara Hamle',
      desc: 'Çatal, Şiş, Açmaz, Çifte Saldırı, Ara Hamle (Zwischenzug), Saptırma ve Zugzwang. 13 farklı taktik kategorisini tek tek çalışarak tahtadaki tüm fırsatları yakala!',
      borderClasses: isDarkMode
        ? 'border-[3px] border-emerald-400 shadow-lg shadow-emerald-500/25 ring-2 ring-emerald-400/40'
        : 'border-[3px] border-emerald-500 shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-300',
      radiusClass: 'rounded-[28px] sm:rounded-[32px]',
      accentBar: 'bg-emerald-500',
      iconBg: isDarkMode ? 'bg-emerald-950/70 border-emerald-400/60' : 'bg-emerald-100 border-emerald-400',
      gradientBg: isDarkMode
        ? 'bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900'
        : 'bg-gradient-to-r from-emerald-50 via-emerald-100/30 to-white',
      badgeStyle: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 border-emerald-400',
      btnStyle: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30',
      onClick: () => {
        soundFx.playBestMove();
        onOpenMotifs();
      },
    },
    {
      id: 'drills',
      title: 'Açılış Ezberle & 10x Tekrar Drill',
      theme: 'violet',
      isFeatured: false,
      badge: 'Kas Hafızası • Otomatik Yanıtlar',
      desc: 'İtalyan Açılışı ve Çoban Matı Savunması için 10 tekrarlı kas hafızası antrenmanı. Doğru hamleleri yap, sistem otomatik cevaplasın ve zihnine kazınsın!',
      borderClasses: isDarkMode
        ? 'border-2 border-violet-400/90 shadow-violet-500/20'
        : 'border-2 border-violet-500 shadow-violet-500/15',
      radiusClass: 'rounded-2xl sm:rounded-3xl',
      accentBar: 'bg-violet-500',
      iconBg: isDarkMode ? 'bg-violet-950/60 border-violet-500/40' : 'bg-violet-100 border-violet-300',
      gradientBg: isDarkMode
        ? 'bg-gradient-to-r from-violet-950/40 via-slate-900 to-slate-900'
        : 'bg-gradient-to-r from-violet-50 via-violet-100/30 to-white',
      badgeStyle: 'bg-violet-100 dark:bg-violet-950/90 text-violet-800 dark:text-violet-300 border-violet-300 dark:border-violet-700',
      btnStyle: 'bg-violet-600 hover:bg-violet-700 text-white shadow-violet-600/25',
      onClick: () => {
        soundFx.playDrillTick();
        onOpenDrills();
      },
    },
    {
      id: 'endgame',
      title: 'Endgame Trainer (Oyun Sonu & Kazanan Plan)',
      theme: 'indigo',
      isFeatured: false,
      badge: 'Lucena • Muhalefet • Vezir Sonları',
      desc: 'Şah+Piyon muhalefeti, Lucena köprü kurma taktiği ve vezir sonları. Motor sana sadece hamleyi değil, büyükustaların uyguladığı "Kazanan Planı" öğretir.',
      borderClasses: isDarkMode
        ? 'border-2 border-indigo-400/90 shadow-indigo-500/20'
        : 'border-2 border-indigo-500 shadow-indigo-500/15',
      radiusClass: 'rounded-2xl sm:rounded-3xl',
      accentBar: 'bg-indigo-500',
      iconBg: isDarkMode ? 'bg-indigo-950/60 border-indigo-500/40' : 'bg-indigo-100 border-indigo-300',
      gradientBg: isDarkMode
        ? 'bg-gradient-to-r from-indigo-950/40 via-slate-900 to-slate-900'
        : 'bg-gradient-to-r from-indigo-50 via-indigo-100/30 to-white',
      badgeStyle: 'bg-indigo-100 dark:bg-indigo-950/90 text-indigo-800 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700',
      btnStyle: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/25',
      onClick: () => {
        soundFx.playMajesticFanfare();
        onOpenEndgame();
      },
    },
    {
      id: 'daily',
      title: 'Günün Pozisyonu (Daily Challenge & Streak)',
      theme: 'rose',
      isFeatured: false,
      badge: '02:30 Süreye Karşı • Günlük Seri',
      desc: 'Her gün yenilenen kritik taktik mücadelesi! Geri sayım sayacına karşı çöz, Duolingo gibi günlük serini (Streak 🔥) büyüt ve satranç alışkanlığını pekiştir.',
      borderClasses: isDarkMode
        ? 'border-2 border-rose-500/90 shadow-rose-500/20'
        : 'border-2 border-rose-500 shadow-rose-500/15',
      radiusClass: 'rounded-2xl sm:rounded-3xl',
      accentBar: 'bg-rose-500',
      iconBg: isDarkMode ? 'bg-rose-950/60 border-rose-500/40' : 'bg-rose-100 border-rose-300',
      gradientBg: isDarkMode
        ? 'bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900'
        : 'bg-gradient-to-r from-rose-50 via-rose-100/30 to-white',
      badgeStyle: 'bg-rose-100 dark:bg-rose-950/90 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-700',
      btnStyle: 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/25',
      onClick: () => {
        soundFx.playFlameWhoosh();
        onOpenDaily();
      },
    },
    {
      id: 'aigen',
      title: 'AI Puzzle Architect (Doğal Dille Puzzle Üret)',
      theme: 'teal',
      isFeatured: false,
      badge: 'Yapay Zeka • Sınırsız Kurgu',
      desc: 'Yapay zekaya "1500 ELO vezir fedası ve mat ağı" veya "Arka yatay kombinezonu" yaz; senin için saniyeler içinde sıfırdan oynanabilir özel taktik pozisyonu kurgulasın!',
      borderClasses: isDarkMode
        ? 'border-2 border-teal-400/90 shadow-teal-500/20'
        : 'border-2 border-teal-500 shadow-teal-500/15',
      radiusClass: 'rounded-2xl sm:rounded-3xl',
      accentBar: 'bg-teal-500',
      iconBg: isDarkMode ? 'bg-teal-950/60 border-teal-500/40' : 'bg-teal-100 border-teal-300',
      gradientBg: isDarkMode
        ? 'bg-gradient-to-r from-teal-950/40 via-slate-900 to-slate-900'
        : 'bg-gradient-to-r from-teal-50 via-teal-100/30 to-white',
      badgeStyle: 'bg-teal-100 dark:bg-teal-950/90 text-teal-800 dark:text-teal-300 border-teal-300 dark:border-teal-700',
      btnStyle: 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-600/25',
      onClick: () => {
        soundFx.playMagicChime();
        onOpenAiPuzzle();
      },
    },
    {
      id: 'vision',
      title: 'Vision AI Tahta Çıkarıcı (Fotoğraftan FEN)',
      theme: 'sky',
      isFeatured: false,
      badge: 'Kamera & Ekran Görüntüsü • Otomatik Dizilim',
      desc: 'Fiziksel satranç tahtanın fotoğrafını çek veya ekrandan bir görsel yükle; gelişmiş multimodal yapay zeka taşları otomatik tanısın ve tahtaya dizip analizi başlatsın.',
      borderClasses: isDarkMode
        ? 'border-2 border-sky-400/90 shadow-sky-500/20'
        : 'border-2 border-sky-500 shadow-sky-500/15',
      radiusClass: 'rounded-2xl sm:rounded-3xl',
      accentBar: 'bg-sky-500',
      iconBg: isDarkMode ? 'bg-sky-950/60 border-sky-500/40' : 'bg-sky-100 border-sky-300',
      gradientBg: isDarkMode
        ? 'bg-gradient-to-r from-sky-950/40 via-slate-900 to-slate-900'
        : 'bg-gradient-to-r from-sky-50 via-sky-100/30 to-white',
      badgeStyle: 'bg-sky-100 dark:bg-sky-950/90 text-sky-800 dark:text-sky-300 border-sky-300 dark:border-sky-700',
      btnStyle: 'bg-sky-500 hover:bg-sky-600 text-white shadow-sky-500/25',
      onClick: () => {
        soundFx.playCameraShutter();
        onOpenVision();
      },
    },
  ];

  return (
    <div className="academy-stack-view-container w-full max-w-4xl mx-auto space-y-3.5 py-1">
      {/* 7 Single-Column Vertical Stacked Rectangle Cards */}
      <div className="flex flex-col space-y-3">
        {modules.map((mod) => (
          <motion.div
            key={mod.id}
            data-theme={mod.theme}
            whileHover={{ scale: 1.015, x: 4 }}
            whileTap={{ scale: 0.985 }}
            onClick={mod.onClick}
            className={`w-full p-4 sm:p-5 ${mod.radiusClass} ${mod.borderClasses} ${mod.gradientBg} shadow-sm hover:shadow-xl transition-all duration-200 cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 sm:gap-4 group relative overflow-hidden`}
          >
            {/* Left Accent Color Indicator Bar */}
            <div
              className={`absolute left-0 inset-y-0 w-1.5 sm:w-2 ${mod.accentBar} opacity-90 group-hover:w-2.5 transition-all`}
            />

            {/* Left Content Area: Icon & Texts */}
            <div className="flex items-start sm:items-center gap-3.5 sm:gap-4 flex-1 min-w-0 pl-1">
              {/* Distinct Mode Icon rendered conditionally with Lucide-react */}
              <div
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-xs border group-hover:scale-110 transition-transform ${mod.iconBg}`}
              >
                {renderModeIcon(mod.id)}
              </div>

              {/* Title, Badge & Explanation */}
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-black text-sm sm:text-base tracking-tight text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {mod.title}
                  </h3>

                  {mod.isFeatured && (
                    <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 shadow-xs flex items-center gap-0.5">
                      <Star className="w-2.5 h-2.5 fill-current" />
                      <span>{mod.featuredTag}</span>
                    </span>
                  )}

                  <span
                    className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border shadow-2xs ${mod.badgeStyle}`}
                  >
                    {mod.badge}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                  {mod.desc}
                </p>
              </div>
            </div>

            {/* Right Action Button Pill */}
            <div className="flex items-center justify-end w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/40 dark:border-slate-800/60">
              <div
                className={`py-2 px-4 rounded-xl font-black text-xs flex items-center gap-1.5 transition-all shadow-xs group-hover:shadow-md ${mod.btnStyle}`}
              >
                <span>Başla</span>
                <ChevronRight className="w-4 h-4 stroke-[3] group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
