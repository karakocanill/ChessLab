export type Square = string; // e.g. 'e4'

export type GameMode = 'game' | 'sandbox' | 'academy';

export type AIDifficulty = 'easy' | 'medium' | 'hard' | 'grandmaster';

export interface TacticalExplanation {
  title: string;
  badge: '🔥 Mat Tehdidi' | '⚔️ Feda Taktiği' | '⚡ Çatal' | '🎯 Açmaz' | '🛡️ Güçlü Savunma' | '🏰 Şah Güvenliği' | '👑 Terfi' | '🌟 Stratejik Kazanç';
  shortSummary: string; // Turkish kid-friendly summary
  details: string; // Grandmaster explanation
  motives: string[];
}

export interface MoveSuggestion {
  rank: number; // 1 = Best, 2 = 2nd Best, 3 = 3rd, ..., 999 = Worst (Blunder)
  category: 'best' | 'great' | 'alternative' | 'blunder' | 'opening';
  colorHex: string; // #22c55e (green), #3b82f6 (blue), #f97316 (orange), #ef4444 (red), #a855f7 (purple)
  from: string;
  to: string;
  uci: string;
  san: string;
  scoreCp: number;
  isMate: boolean;
  mateIn?: number;
  explanation: string;
  badgeLabel: string;
  isOpeningBook?: boolean;
  openingName?: string;
}

export interface EloPreset {
  elo: number;
  title: string;
  character: string;
  avatar: string;
  description: string;
  depth: number;
}

export interface BestMoveAnalysis {
  from: string;
  to: string;
  uci: string;
  san: string;
  scoreCp: number; // centipawns (positive = white advantage)
  isMate: boolean;
  mateIn?: number;
  depth: number;
  explanation: TacticalExplanation;
  suggestions: MoveSuggestion[];
}

export interface BlunderReviewItem {
  id: string;
  moveIndex: number;
  moveNumber: number;
  color: 'w' | 'b';
  playedSan: string;
  playedFrom: string;
  playedTo: string;
  bestSan: string;
  bestFrom: string;
  bestTo: string;
  evalLossCp: number;
  evalBeforeCp: number;
  evalAfterCp: number;
  severity: 'blunder' | 'mistake' | 'inaccuracy';
  whyBad: string;
  whatShouldPlay: string;
  continuationLine: string;
  fenBefore: string;
  fenAfter: string;
}

export interface GameReviewReport {
  totalMoves: number;
  accuracyWhite: number;
  accuracyBlack: number;
  blunders: BlunderReviewItem[];
}

export interface MoveRecord {
  id: string;
  moveNumber: number;
  color: 'w' | 'b';
  san: string;
  from: string;
  to: string;
  piece: string;
  captured?: string;
  promotion?: string;
  fenBefore: string;
  fenAfter: string;
  evaluation?: {
    scoreCp: number;
    isMate: boolean;
    mateIn?: number;
    quality?: 'best' | 'great' | 'good' | 'inaccuracy' | 'blunder';
  };
  commentary?: string;
}

export type BoardThemeId = 'playdough' | 'classicWood' | 'neonCyber' | 'mintFresh' | 'tournament';

export interface BoardTheme {
  id: BoardThemeId;
  name: string;
  description: string;
  lightSquare: string;
  darkSquare: string;
  boardBorder: string;
  boardBg: string;
  highlightMove: string;
  bestMoveColor: string;
}

export interface PresetPosition {
  id: string;
  title: string;
  category: 'Puzzles' | 'Endgames' | 'Openings' | 'Classics';
  fen: string;
  turn: 'w' | 'b';
  difficulty: 'Kolay' | 'Orta' | 'İleri';
  description: string;
  targetObjective: string;
}
