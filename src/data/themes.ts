import { BoardTheme } from '../types/chess';

export const BOARD_THEMES: Record<string, BoardTheme> = {
  playdough: {
    id: 'playdough',
    name: '🎨 Oyun Hamuru (Playdough)',
    description: 'Yumuşak nane yeşili ve kayısı kreması, çocuklar için süper eğlenceli ve göz yormaz.',
    lightSquare: '#faebd7', // warm almond/playdough cream
    darkSquare: '#6ee7b7', // vibrant mint
    boardBorder: '#10b981',
    boardBg: 'bg-emerald-50',
    highlightMove: 'rgba(251, 191, 36, 0.65)',
    bestMoveColor: 'rgba(34, 197, 94, 0.9)',
  },
  classicWood: {
    id: 'classicWood',
    name: '🪵 Klasik Ahşap (Wood)',
    description: 'Doğal ceviz ve akçaağaç kaplama, büyükusta zarafeti.',
    lightSquare: '#f0d9b5',
    darkSquare: '#b58863',
    boardBorder: '#85583b',
    boardBg: 'bg-amber-50',
    highlightMove: 'rgba(245, 158, 11, 0.6)',
    bestMoveColor: 'rgba(16, 185, 129, 0.9)',
  },
  tournament: {
    id: 'tournament',
    name: '🏆 FIDE Turnuva Yeşili',
    description: 'Uluslararası yarışmalarda kullanılan göz dostu turnuva renkleri.',
    lightSquare: '#ffffdd',
    darkSquare: '#86a666',
    boardBorder: '#5b7343',
    boardBg: 'bg-stone-50',
    highlightMove: 'rgba(234, 179, 8, 0.6)',
    bestMoveColor: 'rgba(22, 163, 74, 0.9)',
  },
  neonCyber: {
    id: 'neonCyber',
    name: '⚡ Gece Gökyüzü & Neon',
    description: 'Gök mavisi ve neon parıltılar, modern uzay çağı teması.',
    lightSquare: '#e0f2fe',
    darkSquare: '#38bdf8',
    boardBorder: '#0284c7',
    boardBg: 'bg-sky-50',
    highlightMove: 'rgba(244, 63, 94, 0.6)',
    bestMoveColor: 'rgba(16, 185, 129, 0.95)',
  },
};
