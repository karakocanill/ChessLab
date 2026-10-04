import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Chess, Square } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Bot,
  Users,
  RotateCcw,
  Zap,
  SlidersHorizontal,
  History,
  Grid,
  ShieldAlert,
  RotateCw,
  Compass,
} from 'lucide-react';

import { Header } from './components/Header';
import { PowerBar } from './components/PowerBar';
import { TalkingMascot } from './components/TalkingMascot';
import { MoveHistory } from './components/MoveHistory';
import { SandboxTray } from './components/SandboxTray';
import { BestMoveButton } from './components/BestMoveButton';
import { PromotionModal } from './components/PromotionModal';
import { AiCoachModal } from './components/AiCoachModal';
import { PresetsModal } from './components/PresetsModal';
import { EloAndSuggestionControls } from './components/EloAndSuggestionControls';
import { OpeningBanner } from './components/OpeningBanner';
import { EasterEggModal } from './components/EasterEggModal';
import { GameReviewModal } from './components/GameReviewModal';
import { VisionBoardModal } from './components/VisionBoardModal';
import { GuessTheMoveModal } from './components/GuessTheMoveModal';
import { TacticalMotifsModal } from './components/TacticalMotifsModal';
import { OpeningDrillModal } from './components/OpeningDrillModal';
import { EndgameTrainerModal } from './components/EndgameTrainerModal';
import { DailyChallengeModal } from './components/DailyChallengeModal';
import { AiPuzzleGenModal } from './components/AiPuzzleGenModal';
import { AcademyStackView } from './components/AcademyStackView';
import { DailyStreakBadge } from './components/DailyStreakBadge';
import { BlunderPuzzleBanner } from './components/BlunderPuzzleBanner';

import { BOARD_THEMES } from './data/themes';
import {
  GameMode,
  BoardThemeId,
  MoveRecord,
  BestMoveAnalysis,
  PresetPosition,
  GameReviewReport,
  BlunderReviewItem,
} from './types/chess';
import { MotifPuzzle, OpeningDrill, EndgameScenario } from './data/motifs';
import { chessEngine, evaluateBoard } from './utils/chessEngine';
import { soundFx } from './utils/audio';
import { triggerConfetti, triggerStarBurst } from './utils/celebrate';
import { generateGameReview } from './utils/gameReview';
import {
  squareMapToFen,
  fenToSquareMap,
  isValidChessFen,
} from './utils/boardUtils';

const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

export default function App() {
  // Theme & Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('chess_dark_mode') === 'true';
    }
    return false;
  });

  // Game & Sandbox & Academy Mode
  const [gameMode, setGameMode] = useState<GameMode>('game');
  const [playVsAi, setPlayVsAi] = useState(false);

  // Fully Assisted / Auto-Engine Mode & Side Selection (White vs Black)
  const [isAutoAssisted, setIsAutoAssisted] = useState<boolean>(true);
  const [playerSide, setPlayerSide] = useState<'white' | 'black'>('white');

  // Daily Streak Counter
  const [streakDays, setStreakDays] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      return Number(localStorage.getItem('chessforge_daily_streak') || 3);
    }
    return 3;
  });

  // Active Blunder-to-Puzzle Training State
  const [activeBlunderPuzzle, setActiveBlunderPuzzle] = useState<{
    blunder: BlunderReviewItem;
    isSolved: boolean;
    showHint: boolean;
    attempts: number;
    statusMessage: string;
  } | null>(null);

  // ELO & Multi-PV Suggestions Configuration
  const [currentElo, setCurrentElo] = useState<number>(1500);
  const [suggestionCount, setSuggestionCount] = useState<number>(3);
  const [showBlunderArrow, setShowBlunderArrow] = useState<boolean>(true);
  const [activeHighlightedUci, setActiveHighlightedUci] = useState<string | null>(null);

  // Mobile Active Tab
  const [mobileTab, setMobileTab] = useState<'board' | 'elo' | 'history'>('board');

  // Board State
  const [chess, setChess] = useState(() => new Chess());
  const [fen, setFen] = useState(START_FEN);
  const [orientation, setOrientation] = useState<'white' | 'black'>('white');
  const [boardThemeId, setBoardThemeId] = useState<BoardThemeId>('playdough');
  const [isMuted, setIsMuted] = useState(false);

  // History & Variations
  const [history, setHistory] = useState<MoveRecord[]>([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);

  // Sandbox Mode Specifics
  const [sandboxPieces, setSandboxPieces] = useState<Record<string, string>>(() =>
    fenToSquareMap(START_FEN)
  );
  const [sandboxTurn, setSandboxTurn] = useState<'w' | 'b'>('w');
  const [selectedStampPiece, setSelectedStampPiece] = useState<string | null>(null);
  const [isTrashHovered, setIsTrashHovered] = useState(false);

  // AI & Tactical Analysis
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [bestMoveAnalysis, setBestMoveAnalysis] = useState<BestMoveAnalysis | null>(null);
  const [isShowingArrow, setIsShowingArrow] = useState(true);
  const [arrowTargetSide, setArrowTargetSide] = useState<'auto' | 'w' | 'b'>('auto');
  const [evalScoreCp, setEvalScoreCp] = useState<number>(0);
  const [isMate, setIsMate] = useState(false);
  const [mateIn, setMateIn] = useState<number | undefined>();

  // Modals
  const [isPresetsOpen, setIsPresetsOpen] = useState(false);
  const [isAiCoachOpen, setIsAiCoachOpen] = useState(false);
  const [isPromotionOpen, setIsPromotionOpen] = useState(false);
  const [pendingPromotion, setPendingPromotion] = useState<{
    from: string;
    to: string;
  } | null>(null);

  const [isEasterEggOpen, setIsEasterEggOpen] = useState(false);
  const [isGameReviewOpen, setIsGameReviewOpen] = useState(false);
  const [gameReviewReport, setGameReviewReport] = useState<GameReviewReport | null>(null);
  const [isReviewLoading, setIsReviewLoading] = useState(false);

  // Academy Modals
  const [isVisionOpen, setIsVisionOpen] = useState(false);
  const [isGuessTheMoveOpen, setIsGuessTheMoveOpen] = useState(false);
  const [isMotifsOpen, setIsMotifsOpen] = useState(false);
  const [isDrillsOpen, setIsDrillsOpen] = useState(false);
  const [isEndgameOpen, setIsEndgameOpen] = useState(false);
  const [isDailyOpen, setIsDailyOpen] = useState(false);
  const [isAiPuzzleOpen, setIsAiPuzzleOpen] = useState(false);

  // Mascot Speech State
  const [mascotMessage, setMascotMessage] = useState(
    'ChessLab: Satranç Analiz & Eğitim motoruna hoş geldin! Tamamen yardımlı mod devrede, en iyi hamleler parlıyor! 🚀'
  );
  const [mascotSubMessage, setMascotSubMessage] = useState(
    'Tahtadaki taşlarını hareket ettirebilir veya üst menüden Akademi modunu seçebilirsin!'
  );

  const currentTheme = BOARD_THEMES[boardThemeId] || BOARD_THEMES.playdough;
  const isComputerThinking = useRef(false);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('chess_dark_mode', String(next));
      }
      return next;
    });
  };

  // Synchronize evaluation whenever position changes
  const updateEvaluation = useCallback(async (currentFen: string) => {
    try {
      if (isValidChessFen(currentFen)) {
        const c = new Chess(currentFen);
        const staticScore = evaluateBoard(c);
        setEvalScoreCp(staticScore);
        setIsMate(c.isCheckmate());
      }
    } catch {
      // ignore
    }
  }, []);

  // Compute effective FEN when user requests arrows specifically for White ('w') or Black ('b')
  const getEffectiveFenForAnalysis = useCallback(
    (baseFen: string, targetSide: 'auto' | 'w' | 'b'): string => {
      if (targetSide === 'auto' || !isValidChessFen(baseFen)) {
        return baseFen;
      }
      const parts = baseFen.split(' ');
      if (parts.length >= 2 && parts[1] !== targetSide) {
        const candidateParts = [...parts];
        candidateParts[1] = targetSide;
        const candidateFen = candidateParts.join(' ');
        if (isValidChessFen(candidateFen)) {
          return candidateFen;
        }
      }
      return baseFen;
    },
    []
  );

  useEffect(() => {
    updateEvaluation(fen);
  }, [fen, updateEvaluation]);

  // AUTO-ASSISTED ENGINE: Calculate best moves automatically whenever position changes
  // Works in both 'game' mode and 'sandbox' (serbest dizilim) mode!
  // Note: If a blunder puzzle is actively in progress, don't spoil it with arrows unless hint is requested!
  useEffect(() => {
    if (isAutoAssisted && (gameMode === 'game' || gameMode === 'sandbox')) {
      if (activeBlunderPuzzle && !activeBlunderPuzzle.isSolved && !activeBlunderPuzzle.showHint) {
        return; // Don't spoil the blunder puzzle!
      }

      const effectiveFen = getEffectiveFenForAnalysis(fen, arrowTargetSide);

      if (!isValidChessFen(effectiveFen)) {
        if (gameMode === 'sandbox') {
          setBestMoveAnalysis(null);
          setIsShowingArrow(false);
        }
        return;
      }

      const pastSanMoves = history.map((h) => h.san);
      chessEngine
        .analyzePosition(effectiveFen, 3, suggestionCount, currentElo, pastSanMoves, showBlunderArrow)
        .then((analysis) => {
          setBestMoveAnalysis(analysis);
          setIsShowingArrow(true);
          setEvalScoreCp(analysis.scoreCp);
          setIsMate(analysis.isMate);
          setMateIn(analysis.mateIn);
        })
        .catch(() => {});
    } else if (gameMode === 'sandbox' && !isValidChessFen(fen)) {
      setBestMoveAnalysis(null);
      setIsShowingArrow(false);
    }
  }, [
    fen,
    isAutoAssisted,
    suggestionCount,
    currentElo,
    showBlunderArrow,
    history,
    gameMode,
    activeBlunderPuzzle,
    arrowTargetSide,
    getEffectiveFenForAnalysis,
  ]);

  // Request Multi-PV Best Moves Manually
  const handleAnalyzeBestMove = async () => {
    const effectiveFen = getEffectiveFenForAnalysis(fen, arrowTargetSide);

    if (!isValidChessFen(effectiveFen)) {
      setMascotMessage('⚠️ Otomatik okların ve analizin çalışabilmesi için tahtada en az 1 Beyaz Şah ve 1 Siyah Şah olmalı!');
      soundFx.playBlunder();
      return;
    }

    setIsAnalyzing(true);
    try {
      const pastSanMoves = history.map((h) => h.san);
      const analysis = await chessEngine.analyzePosition(
        effectiveFen,
        3,
        suggestionCount,
        currentElo,
        pastSanMoves,
        showBlunderArrow
      );

      setBestMoveAnalysis(analysis);
      setIsShowingArrow(true);
      setActiveHighlightedUci(null);
      setEvalScoreCp(analysis.scoreCp);
      setIsMate(analysis.isMate);
      setMateIn(analysis.mateIn);

      soundFx.playBestMove();
      triggerStarBurst(0.5, 0.4);

      const targetLabel = arrowTargetSide === 'w' ? 'Beyaz' : arrowTargetSide === 'b' ? 'Siyah' : 'Sıradaki oyuncu';
      setMascotMessage(`Buldum! 🌟 (${targetLabel} için) ${analysis.explanation.shortSummary}`);
      setMascotSubMessage(
        `Tahtaya ${analysis.suggestions.length} renkli taktik oku yerleştirdim: 🟢 Yeşil (1. En İyi), 🔵 Mavi (2. En İyi), 🟠 Turuncu (Alternatif)${
          showBlunderArrow ? ', 🔴 Kırmızı (Hata)' : ''
        }!`
      );
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Game Review Trigger
  const handleOpenGameReview = async () => {
    setIsGameReviewOpen(true);
    setIsReviewLoading(true);
    try {
      const report = await generateGameReview(history);
      setGameReviewReport(report);
      if (report.blunders.length > 0) {
        soundFx.playBlunder();
      } else {
        soundFx.playVictory();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsReviewLoading(false);
    }
  };

  // 🧩 START BLUNDER-TO-PUZZLE TRAINING
  const handleStartBlunderPuzzle = (blunder: BlunderReviewItem) => {
    setGameMode('game');
    const loaded = new Chess(blunder.fenBefore);
    setChess(loaded);
    setFen(blunder.fenBefore);
    setCurrentMoveIndex(blunder.moveIndex - 1);
    const turnColor = loaded.turn() === 'w' ? 'white' : 'black';
    setOrientation(turnColor);
    setPlayerSide(turnColor);
    setBestMoveAnalysis(null);
    setIsShowingArrow(false);

    setActiveBlunderPuzzle({
      blunder,
      isSolved: false,
      showHint: false,
      attempts: 0,
      statusMessage: 'Doğru hamleyi tahtada oyna!',
    });

    setMascotMessage(
      `🧩 Hatamdan Puzzle Antrenmanı: Bu pozisyonda ${blunder.playedSan} oynamıştın. Şimdi kaçırdığın doğru hamleyi bularak taktiği çöz!`
    );
    setMascotSubMessage('Doğru hamleyi tahtada oyna. Takılırsan İpucu İste!');
    soundFx.playMove();
  };

  // Show Hint for Blunder Puzzle
  const handleShowBlunderHint = () => {
    if (!activeBlunderPuzzle) return;
    setActiveBlunderPuzzle((prev) => (prev ? { ...prev, showHint: true } : null));

    const { blunder } = activeBlunderPuzzle;
    setBestMoveAnalysis({
      from: blunder.bestFrom,
      to: blunder.bestTo,
      uci: `${blunder.bestFrom}${blunder.bestTo}`,
      san: blunder.bestSan,
      scoreCp: blunder.evalBeforeCp,
      isMate: false,
      depth: 3,
      explanation: {
        title: 'Taktik İpucu',
        badge: '🌟 Stratejik Kazanç',
        shortSummary: blunder.whatShouldPlay,
        details: blunder.continuationLine,
        motives: ['İpucu'],
      },
      suggestions: [
        {
          rank: 1,
          category: 'best',
          colorHex: '#22c55e',
          from: blunder.bestFrom,
          to: blunder.bestTo,
          uci: `${blunder.bestFrom}${blunder.bestTo}`,
          san: blunder.bestSan,
          scoreCp: blunder.evalBeforeCp,
          isMate: false,
          explanation: blunder.whatShouldPlay,
          badgeLabel: '1. Doğru Hamle',
        },
      ],
    });
    setIsShowingArrow(true);
    soundFx.playMagicChime();
  };

  // Exit Blunder Puzzle Training
  const handleExitBlunderPuzzle = () => {
    setActiveBlunderPuzzle(null);
    setBestMoveAnalysis(null);
    setMascotMessage('Antrenmandan çıkıldı. Normal oyun modundasın! ♟️');
    soundFx.playMove();
  };

  // Jump to blunder move and try the best continuation
  const handleRetryBlunder = (blunder: BlunderReviewItem) => {
    const loaded = new Chess(blunder.fenBefore);
    setChess(loaded);
    setFen(blunder.fenBefore);
    setCurrentMoveIndex(blunder.moveIndex - 1);
    setGameMode('game');

    setBestMoveAnalysis({
      from: blunder.bestFrom,
      to: blunder.bestTo,
      uci: `${blunder.bestFrom}${blunder.bestTo}`,
      san: blunder.bestSan,
      scoreCp: blunder.evalBeforeCp,
      isMate: false,
      depth: 3,
      explanation: {
        title: 'Doğru Hamle Fırsatı!',
        badge: '🌟 Stratejik Kazanç',
        shortSummary: `Burada ${blunder.playedSan} yerine 🟢 ${blunder.bestSan} oynamalıydın!`,
        details: blunder.continuationLine,
        motives: ['Düzeltme'],
      },
      suggestions: [
        {
          rank: 1,
          category: 'best',
          colorHex: '#22c55e',
          from: blunder.bestFrom,
          to: blunder.bestTo,
          uci: `${blunder.bestFrom}${blunder.bestTo}`,
          san: blunder.bestSan,
          scoreCp: blunder.evalBeforeCp,
          isMate: false,
          explanation: blunder.whatShouldPlay,
          badgeLabel: '1. Doğru Hamle',
        },
      ],
    });
    setIsShowingArrow(true);
    setActiveHighlightedUci(null);

    setMascotMessage(`Hatanın olduğu ${blunder.moveNumber}. hamleye geri döndük! 🟢 Yeşil okla gösterilen ${blunder.bestSan} hamlesini dene!`);
    setMascotSubMessage(blunder.continuationLine);
    soundFx.playMove();
  };

  // Bot Auto-Move logic when playVsAi is active
  useEffect(() => {
    if (
      playVsAi &&
      gameMode === 'game' &&
      !activeBlunderPuzzle &&
      chess.turn() === (playerSide === 'white' ? 'b' : 'w') &&
      !chess.isGameOver() &&
      !isComputerThinking.current
    ) {
      isComputerThinking.current = true;

      const timer = setTimeout(async () => {
        try {
          const pastSanMoves = history.map((h) => h.san);
          const analysis = await chessEngine.analyzePosition(
            chess.fen(),
            3,
            1,
            currentElo,
            pastSanMoves,
            false
          );
          if (analysis.from && analysis.to) {
            executeMove(analysis.from, analysis.to, 'q');
          }
        } finally {
          isComputerThinking.current = false;
        }
      }, 550);

      return () => clearTimeout(timer);
    }
  }, [chess, fen, playVsAi, gameMode, currentElo, history, playerSide, activeBlunderPuzzle]);

  // Core Move Execution in Game Mode
  const executeMove = (
    from: string,
    to: string,
    promotionPiece: 'q' | 'r' | 'b' | 'n' = 'q'
  ): boolean => {
    try {
      const fenBefore = chess.fen();
      const move = chess.move({
        from: from as Square,
        to: to as Square,
        promotion: promotionPiece,
      });

      if (!move) return false;

      const fenAfter = chess.fen();
      setFen(fenAfter);

      // 🧩 INTERCEPT MOVE IF IN ACTIVE BLUNDER PUZZLE
      if (activeBlunderPuzzle && !activeBlunderPuzzle.isSolved) {
        const targetBlunder = activeBlunderPuzzle.blunder;
        const isCorrect =
          (from === targetBlunder.bestFrom && to === targetBlunder.bestTo) ||
          move.san === targetBlunder.bestSan;

        if (isCorrect) {
          soundFx.playVictory();
          triggerConfetti();
          setActiveBlunderPuzzle({
            ...activeBlunderPuzzle,
            isSolved: true,
            statusMessage: `Tebrikler! ${targetBlunder.bestSan} hamlesini başarıyla buldun!`,
          });
          setMascotMessage(`MÜKEMMEL! 🏆 Kaçırdığın ${targetBlunder.bestSan} hamlesini bularak hatanı başarıyla telafi ettin!`);
          setMascotSubMessage(targetBlunder.continuationLine);
          return true;
        } else {
          soundFx.playBlunder();
          setActiveBlunderPuzzle((prev) =>
            prev
              ? {
                  ...prev,
                  attempts: prev.attempts + 1,
                  statusMessage: '❌ Bu hamle taktiği çözmüyor. Tekrar dene!',
                }
              : null
          );
          setMascotMessage(`Aman! Oynadığın ${move.san} aradığımız en iyi hamle değil. Pozisyonu geri sarıyorum, tekrar dene! 🔄`);

          // Revert position back after 850ms so user can try another move!
          setTimeout(() => {
            const resetChess = new Chess(targetBlunder.fenBefore);
            setChess(resetChess);
            setFen(targetBlunder.fenBefore);
          }, 850);
          return true;
        }
      }

      if (chess.isCheckmate()) {
        soundFx.playVictory();
        triggerConfetti();
        setMascotMessage('ŞAH MAT! 🏆 Muhteşem bir zafer kazandın, tebrikler!');
        setMascotSubMessage('Kombinezon kusursuz çalıştı!');
      } else if (chess.inCheck()) {
        soundFx.playCheck();
        setMascotMessage('ŞAH! 🚨 Rakibin şahı tehlike altında!');
        setMascotSubMessage('Rakip şahını kaçmak veya araya taş koymak zorunda.');
      } else if (move.captured) {
        soundFx.playCapture();
        setMascotMessage(`Harika vuruş! 🎯 ${to} karesindeki taşı aldın!`);
        setMascotSubMessage('Materyal üstünlüğü kazanmak oyunu çok kolaylaştırır.');
      } else {
        soundFx.playMove();
        if (move.san === 'O-O' || move.san === 'O-O-O') {
          setMascotMessage('Şahane Rok! 🏰 Şahın artık güvende!');
          setMascotSubMessage('Kaleni de oyuna dahil ettin.');
        } else {
          setMascotMessage('Güzel hamle! 🌟 Tahtada baskın devam ediyor.');
          setMascotSubMessage('Taşlarını geliştirmeye ve merkezi korumaya devam et.');
        }
      }

      if (bestMoveAnalysis) {
        const playedUci = `${from}${to}`;
        const matched = bestMoveAnalysis.suggestions.find((s) => s.uci === playedUci);
        if (matched) {
          if (matched.rank === 1) {
            triggerStarBurst(0.5, 0.5);
            setMascotMessage('TAM BİR BÜYÜKUSTA HAMLESİ! ⭐ 1. En iyi hamleyi oynadın!');
          } else if (matched.category === 'blunder') {
            soundFx.playBlunder();
            setMascotMessage('Aman dikkat! 🔴 Bu hamle kırmızı ile işaretlenen riskli hamleydi!');
          } else {
            setMascotMessage(`Harika bir seçenek! 🎯 ${matched.badgeLabel} hamlesini tercih ettin.`);
          }
        }
      }

      if (!isAutoAssisted) {
        setBestMoveAnalysis(null);
        setActiveHighlightedUci(null);
      }

      const newRecord: MoveRecord = {
        id: `${from}-${to}-${Date.now()}`,
        moveNumber: Math.floor(history.length / 2) + 1,
        color: move.color,
        san: move.san,
        from: move.from,
        to: move.to,
        piece: move.piece,
        captured: move.captured,
        promotion: move.promotion,
        fenBefore,
        fenAfter,
      };

      const truncated = history.slice(0, currentMoveIndex + 1);
      const nextHistory = [...truncated, newRecord];
      setHistory(nextHistory);
      setCurrentMoveIndex(nextHistory.length - 1);

      return true;
    } catch {
      return false;
    }
  };

  const onPieceDrop = ({
    piece,
    sourceSquare,
    targetSquare,
  }: {
    piece: { pieceType: string };
    sourceSquare: string;
    targetSquare: string | null;
  }): boolean => {
    if (gameMode === 'sandbox') {
      const nextMap = { ...sandboxPieces };

      if (!targetSquare || isTrashHovered) {
        delete nextMap[sourceSquare];
        soundFx.playCapture();
        setSandboxPieces(nextMap);
        const newFen = squareMapToFen(nextMap, sandboxTurn);
        setFen(newFen);
        setMascotMessage('Taş çöpe atıldı ve tahtadan silindi! 🗑️');
        return true;
      }

      nextMap[targetSquare] = piece.pieceType;
      if (sourceSquare !== targetSquare) {
        delete nextMap[sourceSquare];
      }
      soundFx.playMove();
      setSandboxPieces(nextMap);
      const newFen = squareMapToFen(nextMap, sandboxTurn);
      setFen(newFen);
      setMascotMessage(`${sourceSquare} karesinden ${targetSquare} karesine serbest taşıma yapıldı! 🎨`);
      return true;
    }

    if (!targetSquare) {
      return false;
    }

    const isWhitePawnPromotion =
      piece.pieceType === 'wP' && sourceSquare[1] === '7' && targetSquare[1] === '8';
    const isBlackPawnPromotion =
      piece.pieceType === 'bP' && sourceSquare[1] === '2' && targetSquare[1] === '1';

    if (isWhitePawnPromotion || isBlackPawnPromotion) {
      setPendingPromotion({ from: sourceSquare, to: targetSquare });
      setIsPromotionOpen(true);
      return true;
    }

    const success = executeMove(sourceSquare, targetSquare);
    if (!success) {
      soundFx.playBlunder();
    }
    return success;
  };

  const onSquareClick = ({ square }: { square: string }) => {
    if (gameMode !== 'sandbox') return;

    if (selectedStampPiece === 'erase') {
      const nextMap = { ...sandboxPieces };
      if (nextMap[square]) {
        delete nextMap[square];
        soundFx.playCapture();
        setSandboxPieces(nextMap);
        const newFen = squareMapToFen(nextMap, sandboxTurn);
        setFen(newFen);
        setMascotMessage(`${square} karesindeki taş silindi! 🧹`);
      }
    } else if (selectedStampPiece) {
      const nextMap = { ...sandboxPieces, [square]: selectedStampPiece };
      soundFx.playMove();
      setSandboxPieces(nextMap);
      const newFen = squareMapToFen(nextMap, sandboxTurn);
      setFen(newFen);
      setMascotMessage(`${square} karesine yeni taş yerleştirildi! ✨`);
    }
  };

  const handlePromotionSelect = (chosenPiece: 'q' | 'r' | 'b' | 'n') => {
    if (pendingPromotion) {
      executeMove(pendingPromotion.from, pendingPromotion.to, chosenPiece);
    }
    setIsPromotionOpen(false);
    setPendingPromotion(null);
  };

  // Play suggested best move directly in Sandbox mode
  const handlePlayBestMoveInSandbox = (fromSquare: string, toSquare: string) => {
    const nextMap = { ...sandboxPieces };
    const piece = nextMap[fromSquare];
    if (piece) {
      nextMap[toSquare] = piece;
      delete nextMap[fromSquare];
      setSandboxPieces(nextMap);
      const nextTurn = sandboxTurn === 'w' ? 'b' : 'w';
      setSandboxTurn(nextTurn);
      const newFen = squareMapToFen(nextMap, nextTurn);
      setFen(newFen);
      soundFx.playMove();
      setMascotMessage(`🟢 ${fromSquare} ➔ ${toSquare} serbest tahtada oynandı! Sıra diğer tarafta.`);
    }
  };

  const handleSelectMove = (index: number) => {
    if (index === -1) {
      const fresh = new Chess(START_FEN);
      setChess(fresh);
      setFen(START_FEN);
      setCurrentMoveIndex(-1);
      setMascotMessage('Başlangıç pozisyonuna geri dönüldü! 🏁');
    } else {
      const targetRecord = history[index];
      if (targetRecord) {
        const loaded = new Chess(targetRecord.fenAfter);
        setChess(loaded);
        setFen(targetRecord.fenAfter);
        setCurrentMoveIndex(index);
        setMascotMessage(`${targetRecord.moveNumber}. ${targetRecord.san} hamlesine gidildi! Buradan yeni bir hamle deneyebilirsin. 🌿`);
      }
    }
  };

  const handleResetGame = () => {
    const fresh = new Chess(START_FEN);
    setChess(fresh);
    setFen(START_FEN);
    setHistory([]);
    setCurrentMoveIndex(-1);
    setBestMoveAnalysis(null);
    setActiveBlunderPuzzle(null);
    setSandboxPieces(fenToSquareMap(START_FEN));
    setMascotMessage('Yeni bir oyun başladı! Bol şanslar dilerim! 🌟');
    soundFx.playMove();
  };

  const handleLoadCustomFen = (newFen: string, customTitle?: string) => {
    try {
      const newChess = new Chess(newFen);
      setChess(newChess);
      setFen(newFen);
      setHistory([]);
      setCurrentMoveIndex(-1);
      setOrientation(newChess.turn() === 'w' ? 'white' : 'black');
      setSandboxPieces(fenToSquareMap(newFen));
      setSandboxTurn(newChess.turn());
      setGameMode('game'); // switch to game to play the loaded position!
      setActiveBlunderPuzzle(null);
      setMascotMessage(customTitle ? `"${customTitle}" yüklendi! 🎯` : 'Yeni tahta pozisyonu yüklendi!');
      soundFx.playBestMove();
    } catch {
      setGameMode('sandbox');
      setFen(newFen);
      setSandboxPieces(fenToSquareMap(newFen));
      setActiveBlunderPuzzle(null);
      setMascotMessage('Serbest laboratuvara yüklendi! 🎨');
    }
  };

  const handleClearBoard = () => {
    setSandboxPieces({});
    setFen('8/8/8/8/8/8/8/8 w - - 0 1');
    soundFx.playCapture();
    setMascotMessage('Tahta tamamen temizlendi! Taş paletinden istediğin taşları ekleyebilirsin. 🧹');
  };

  const handleResetStandard = () => {
    setSandboxPieces(fenToSquareMap(START_FEN));
    setFen(START_FEN);
    setActiveBlunderPuzzle(null);
    soundFx.playMove();
    setMascotMessage('Standart başlangıç dizilimi geri yüklendi! ♟️');
  };

  const handleImportPgn = (pgnString: string) => {
    try {
      const importedChess = new Chess();
      importedChess.loadPgn(pgnString);
      setChess(importedChess);
      setFen(importedChess.fen());
      setGameMode('game');
      setActiveBlunderPuzzle(null);
      setMascotMessage('PGN başarıyla içe aktarıldı ve son pozisyona gelindi! 📜');
      soundFx.playVictory();
    } catch {
      setMascotMessage('⚠️ Geçersiz PGN metni. Lütfen formatı kontrol edin.');
      soundFx.playBlunder();
    }
  };

  const arrows = [];
  if (bestMoveAnalysis && isShowingArrow) {
    if (activeHighlightedUci) {
      const item = bestMoveAnalysis.suggestions.find((s) => s.uci === activeHighlightedUci);
      if (item) {
        arrows.push({
          startSquare: item.from,
          endSquare: item.to,
          color: item.colorHex,
        });
      }
    } else {
      for (const sug of bestMoveAnalysis.suggestions) {
        arrows.push({
          startSquare: sug.from,
          endSquare: sug.to,
          color: sug.colorHex,
        });
      }
    }
  }

  const customSquareStyles: Record<string, React.CSSProperties> = {};
  if (gameMode === 'game' && chess.inCheck()) {
    const board = chess.board();
    const turn = chess.turn();
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = board[r][c];
        if (p && p.type === 'k' && p.color === turn) {
          const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
          const square = `${files[c]}${8 - r}`;
          customSquareStyles[square] = {
            backgroundColor: 'rgba(239, 68, 68, 0.55)',
            borderRadius: '12px',
            boxShadow: 'inset 0 0 12px rgba(220, 38, 38, 0.8)',
          };
        }
      }
    }
  }

  const sanMovesList = history.map((h) => h.san);

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-300 pb-20 lg:pb-8 ${
        isDarkMode ? 'bg-slate-950 text-slate-100' : `${currentTheme.boardBg} text-slate-800`
      }`}
    >
      {/* Top Header with 3-Mode Selector */}
      <Header
        mode={gameMode}
        onToggleMode={(newMode) => {
          setGameMode(newMode);
          if (newMode === 'sandbox') {
            setSandboxPieces(fenToSquareMap(fen));
            const turn = fen.split(' ')[1] === 'b' ? 'b' : 'w';
            setSandboxTurn(turn);
            setMascotMessage('🎨 Serbest Dizilim Modundasın! Kurallar kalktı, taşları dilediğin gibi diz. Otomatik taktik okları serbest modda da devrede! ⚡');
          } else if (newMode === 'game') {
            if (isValidChessFen(fen)) {
              setChess(new Chess(fen));
              setMascotMessage('🎮 Oyun Moduna geçildi! Standart satranç kuralları devrede.');
            } else {
              setMascotMessage('⚠️ Tahtada geçerli bir dizilim olmalı. Standart dizilime dönüldü.');
              handleResetStandard();
            }
          } else if (newMode === 'academy') {
            setMascotMessage('🎓 ChessLab Akademisi açıldı! Çalışmak istediğin antrenman modunu seç.');
          }
        }}
        orientation={orientation}
        onFlipBoard={() => setOrientation((o) => (o === 'white' ? 'black' : 'white'))}
        isMuted={isMuted}
        onToggleMute={() => setIsMuted(soundFx.toggleMute())}
        currentThemeId={boardThemeId}
        onChangeTheme={(th) => setBoardThemeId(th)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        onTriggerEasterEgg={() => {
          soundFx.playBestMove();
          setIsEasterEggOpen(true);
        }}
        onOpenVision={() => setIsVisionOpen(true)}
      />

      {/* Main Play Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-3 sm:py-5">
        {/* VIEW 1: ACADEMY MODE (Dedicated Full-Width Vertical Rectangle Stack View) */}
        {gameMode === 'academy' ? (
          <AcademyStackView
            onOpenGuessTheMove={() => setIsGuessTheMoveOpen(true)}
            onOpenMotifs={() => setIsMotifsOpen(true)}
            onOpenDrills={() => setIsDrillsOpen(true)}
            onOpenEndgame={() => setIsEndgameOpen(true)}
            onOpenDaily={() => setIsDailyOpen(true)}
            onOpenAiPuzzle={() => setIsAiPuzzleOpen(true)}
            onOpenVision={() => setIsVisionOpen(true)}
            onOpenPresets={() => setIsPresetsOpen(true)}
            isDarkMode={isDarkMode}
          />
        ) : (
          /* VIEW 2: GAME & SANDBOX MODES (Centered Chessboard, Clean area below board, Full Right Column) */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 items-start">
            {/* LEFT COLUMN: Evaluation PowerBar (Desktop) */}
            <div className="hidden lg:flex lg:col-span-1 justify-center pt-2">
              <PowerBar
                scoreCp={evalScoreCp}
                isMate={isMate}
                mateIn={mateIn}
                orientation={orientation}
              />
            </div>

            {/* CENTER COLUMN: Chess Board & Core Controls (NO ACADEMY BELOW BOARD!) */}
            <div
              className={`lg:col-span-7 flex flex-col items-center gap-3 w-full ${
                mobileTab !== 'board' ? 'hidden lg:flex' : 'flex'
              }`}
            >
              {/* Status Bubble (Mascot) */}
              <div className="w-full">
                <TalkingMascot
                  message={mascotMessage}
                  subMessage={mascotSubMessage}
                  isThinking={isAnalyzing}
                  isInCheck={gameMode === 'game' && chess.inCheck()}
                  isCheckmate={gameMode === 'game' && chess.isCheckmate()}
                  onAskAdvice={() => setIsAiCoachOpen(true)}
                />
              </div>

              {/* 🧩 Active Blunder-to-Puzzle Banner */}
              {activeBlunderPuzzle && (
                <BlunderPuzzleBanner
                  puzzle={activeBlunderPuzzle}
                  onShowHint={handleShowBlunderHint}
                  onExitPuzzle={handleExitBlunderPuzzle}
                  onOpenGameReview={() => setIsGameReviewOpen(true)}
                  isDarkMode={isDarkMode}
                />
              )}

              {/* Opening Recognition Banner (when not in puzzle mode) */}
              {gameMode === 'game' && !activeBlunderPuzzle && (
                <OpeningBanner sanMoves={sanMovesList} />
              )}

              {/* Interactive Chessboard Container */}
              <div
                className={`relative w-full max-w-[500px] sm:max-w-[560px] aspect-square flex items-center justify-center p-2 sm:p-3 backdrop-blur-md rounded-3xl shadow-xl border-4 group touch-none ${
                  isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-200/90'
                }`}
              >
                {/* The Chessboard */}
                <div className="w-full h-full rounded-2xl overflow-hidden shadow-md">
                  <Chessboard
                    options={{
                      position: fen,
                      boardOrientation: orientation,
                      onPieceDrop,
                      onSquareClick,
                      arrows,
                      allowDragging: true,
                      allowDragOffBoard: true,
                      animationDurationInMs: 220,
                      showAnimations: true,
                      showNotation: true,
                      boardStyle: {
                        borderRadius: '16px',
                      },
                      darkSquareStyle: {
                        backgroundColor: currentTheme.darkSquare,
                      },
                      lightSquareStyle: {
                        backgroundColor: currentTheme.lightSquare,
                      },
                      squareStyles: customSquareStyles,
                    }}
                  />
                </div>

                {/* Mobile PowerBar floating pill */}
                <div className="lg:hidden absolute top-3.5 left-3.5 z-20">
                  <span className="font-mono text-xs font-black bg-slate-900/95 text-white px-2 py-1 rounded-lg shadow border border-slate-700">
                    {isMate ? `M${mateIn ?? 1}` : (evalScoreCp / 100).toFixed(1)} {evalScoreCp > 100 ? '🔥' : '⚖️'}
                  </span>
                </div>
              </div>

              {/* Taraf & Bakış Açısı ve Otomatik Oklar Kontrol Çubuğu */}
              <div
                className={`w-full max-w-[560px] flex flex-wrap items-center justify-between gap-2 p-2.5 sm:p-3 rounded-2xl border shadow-2xs text-xs ${
                  isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200'
                }`}
              >
                {/* Side selection: Clean White or Black Choice */}
                <div className="flex items-center gap-1.5">
                  <span className="opacity-60 font-bold text-[11px] pr-0.5">Taraf:</span>
                  <button
                    onClick={() => {
                      setPlayerSide('white');
                      setOrientation('white');
                    }}
                    className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      playerSide === 'white'
                        ? 'bg-emerald-600 text-white shadow-xs ring-1 ring-emerald-400'
                        : isDarkMode
                        ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    ⚪ Beyaz Oyna
                  </button>

                  <button
                    onClick={() => {
                      setPlayerSide('black');
                      setOrientation('black');
                    }}
                    className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      playerSide === 'black'
                        ? 'bg-slate-900 text-white shadow-xs ring-2 ring-emerald-500'
                        : isDarkMode
                        ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    ⚫ Siyah Oyna
                  </button>

                  <button
                    onClick={() => setOrientation((o) => (o === 'white' ? 'black' : 'white'))}
                    className="p-1.5 rounded-xl border hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                    title="Tahtayı Döndür (Bakış Açısını Değiştir)"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Auto-Assisted, Target Side & Bot Switch */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    onClick={() => setIsAutoAssisted(!isAutoAssisted)}
                    className={`px-2.5 py-1 rounded-xl font-black text-xs flex items-center gap-1 transition-all cursor-pointer ${
                      isAutoAssisted
                        ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-400'
                        : 'opacity-50 hover:opacity-100 border border-slate-300'
                    }`}
                    title="Her hamlede otomatik taktik oklarını aç/kapat"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>{isAutoAssisted ? '⚡ Oklar Açık' : 'Oklar Kapalı'}</span>
                  </button>

                  {/* Quick Arrow Target Side Selector (Kimin İçin: Sıradaki | Beyaz | Siyah) */}
                  <div className="flex items-center p-0.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-[11px] font-bold">
                    <button
                      onClick={() => setArrowTargetSide('auto')}
                      className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
                        arrowTargetSide === 'auto'
                          ? 'bg-emerald-600 text-white shadow-xs font-black'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                      title="Okları sırası gelen tarafa göre göster"
                    >
                      🔄 Sıradaki
                    </button>
                    <button
                      onClick={() => setArrowTargetSide('w')}
                      className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
                        arrowTargetSide === 'w'
                          ? 'bg-white text-amber-900 font-black shadow-xs ring-1 ring-amber-400 dark:bg-amber-950 dark:text-amber-200'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                      title="Her zaman Beyaz için en iyi hamle oklarını göster"
                    >
                      ⚪ Beyaz
                    </button>
                    <button
                      onClick={() => setArrowTargetSide('b')}
                      className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
                        arrowTargetSide === 'b'
                          ? 'bg-slate-900 text-white font-black shadow-xs ring-1 ring-slate-400 dark:bg-slate-950'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                      title="Her zaman Siyah için en iyi hamle oklarını göster"
                    >
                      ⚫ Siyah
                    </button>
                  </div>

                  <button
                    onClick={() => setPlayVsAi(!playVsAi)}
                    className={`px-2.5 py-1 rounded-xl font-black text-xs flex items-center gap-1 transition-all cursor-pointer ${
                      playVsAi
                        ? 'bg-sky-500 text-white shadow-xs'
                        : isDarkMode
                        ? 'text-slate-400 hover:bg-slate-800 border border-slate-700'
                        : 'text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <Bot className="w-3.5 h-3.5" />
                    <span>{playVsAi ? 'AI Rakip' : 'Yapay Zeka'}</span>
                  </button>
                </div>
              </div>

              {/* Quick Best Move Button right under board for Mobile */}
              <div className="w-full max-w-[560px] lg:hidden">
                <BestMoveButton
                  isAnalyzing={isAnalyzing}
                  analysis={bestMoveAnalysis}
                  onAnalyze={handleAnalyzeBestMove}
                  onPlayMove={
                    bestMoveAnalysis?.from && bestMoveAnalysis?.to
                      ? gameMode === 'game'
                        ? (f, t) => executeMove(f, t)
                        : (f, t) => handlePlayBestMoveInSandbox(f, t)
                      : undefined
                  }
                  onOpenDetails={() => setIsAiCoachOpen(true)}
                  isShowingArrow={isShowingArrow}
                  onToggleArrow={() => setIsShowingArrow((v) => !v)}
                  activeHighlightedUci={activeHighlightedUci}
                  onSelectSuggestion={setActiveHighlightedUci}
                  onOpenGameReview={handleOpenGameReview}
                  isReviewLoading={isReviewLoading}
                />
              </div>
            </div>

            {/* RIGHT COLUMN: Daily Streak Badge, ELO, Multi-PV Suggestions, Sandbox & History */}
            <div
              className={`lg:col-span-4 flex flex-col gap-3.5 w-full ${
                mobileTab === 'board' ? 'hidden lg:flex' : 'flex'
              }`}
            >
              {/* Daily Streak Badge right above ELO */}
              <DailyStreakBadge
                streakDays={streakDays}
                onOpenDaily={() => setIsDailyOpen(true)}
                isDarkMode={isDarkMode}
              />

              {/* ELO & Suggestion Controls */}
              <EloAndSuggestionControls
                currentElo={currentElo}
                onChangeElo={setCurrentElo}
                suggestionCount={suggestionCount}
                onChangeSuggestionCount={setSuggestionCount}
                showBlunderArrow={showBlunderArrow}
                onToggleShowBlunder={() => setShowBlunderArrow(!showBlunderArrow)}
                arrowTargetSide={arrowTargetSide}
                onChangeArrowTargetSide={setArrowTargetSide}
              />

              {/* "En İyi Hamle" (Best Move) Trigger and Multi-Color Cards (Desktop) */}
              <div
                className={`hidden lg:block backdrop-blur-md rounded-2xl border-2 p-3.5 sm:p-4 shadow-sm ${
                  isDarkMode ? 'bg-slate-900/95 border-slate-800' : 'bg-white/95 border-emerald-200/80'
                }`}
              >
                <BestMoveButton
                  isAnalyzing={isAnalyzing}
                  analysis={bestMoveAnalysis}
                  onAnalyze={handleAnalyzeBestMove}
                  onPlayMove={
                    bestMoveAnalysis?.from && bestMoveAnalysis?.to
                      ? gameMode === 'game'
                        ? (f, t) => executeMove(f, t)
                        : (f, t) => handlePlayBestMoveInSandbox(f, t)
                      : undefined
                  }
                  onOpenDetails={() => setIsAiCoachOpen(true)}
                  isShowingArrow={isShowingArrow}
                  onToggleArrow={() => setIsShowingArrow((v) => !v)}
                  activeHighlightedUci={activeHighlightedUci}
                  onSelectSuggestion={setActiveHighlightedUci}
                  onOpenGameReview={handleOpenGameReview}
                  isReviewLoading={isReviewLoading}
                />
              </div>

              {/* Conditional: Free Sandbox Tray OR Move History */}
              {gameMode === 'sandbox' ? (
                <SandboxTray
                  selectedPiece={selectedStampPiece}
                  onSelectPiece={setSelectedStampPiece}
                  onClearBoard={handleClearBoard}
                  onResetStandard={handleResetStandard}
                  turn={sandboxTurn}
                  onChangeTurn={(t) => {
                    setSandboxTurn(t);
                    setFen(squareMapToFen(sandboxPieces, t));
                  }}
                  isTrashHovered={isTrashHovered}
                  setIsTrashHovered={setIsTrashHovered}
                />
              ) : (
                <MoveHistory
                  history={history}
                  currentMoveIndex={currentMoveIndex}
                  onSelectMove={handleSelectMove}
                  onReset={handleResetGame}
                  fen={fen}
                  isDarkMode={isDarkMode}
                  onImportPgn={handleImportPgn}
                  onOpenVision={() => setIsVisionOpen(true)}
                />
              )}

              {/* Kid-Friendly Chess Tip Card */}
              <div
                className={`p-3.5 rounded-2xl border text-xs flex items-start gap-2.5 ${
                  isDarkMode
                    ? 'bg-slate-900/90 border-slate-800 text-amber-200'
                    : 'bg-amber-50/80 border-amber-200/70 text-amber-950'
                }`}
              >
                <Zap className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold block text-amber-400">
                    ChessLab Analiz İpucu:
                  </span>
                  <span className="font-medium leading-tight">
                    🟢 Yeşil ok en iyi hamledir. 🔴 Kırmızı ok tuzak ve blunder hamleleridir. Tamamen yardımlı modda oklar siz hamle yaptıkça otomatik yenilenir!
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav
        className={`lg:hidden fixed bottom-0 inset-x-0 backdrop-blur-md border-t-2 px-3 py-2 z-40 flex items-center justify-around shadow-lg transition-colors ${
          isDarkMode ? 'bg-slate-900/95 border-slate-800' : 'bg-white/95 border-slate-200'
        }`}
      >
        <button
          onClick={() => {
            setGameMode('game');
            setMobileTab('board');
          }}
          className={`flex flex-col items-center gap-1 text-xs font-black transition-colors ${
            gameMode === 'game' && mobileTab === 'board' ? 'text-emerald-500' : 'text-slate-400'
          }`}
        >
          <Grid className="w-5 h-5" />
          <span>Tahta</span>
        </button>

        <button
          onClick={() => {
            setGameMode('academy');
          }}
          className={`flex flex-col items-center gap-1 text-xs font-black transition-colors ${
            gameMode === 'academy' ? 'text-indigo-500 font-extrabold' : 'text-slate-400'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span>Akademi</span>
        </button>

        <button
          onClick={() => setMobileTab('elo')}
          className={`flex flex-col items-center gap-1 text-xs font-black transition-colors ${
            mobileTab === 'elo' ? 'text-emerald-500' : 'text-slate-400'
          }`}
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span>ELO & Oklar</span>
        </button>

        <button
          onClick={() => setMobileTab('history')}
          className={`flex flex-col items-center gap-1 text-xs font-black transition-colors ${
            mobileTab === 'history' ? 'text-emerald-500' : 'text-slate-400'
          }`}
        >
          <History className="w-5 h-5" />
          <span>Hamleler</span>
        </button>

        <button
          onClick={handleAnalyzeBestMove}
          disabled={isAnalyzing}
          className="flex flex-col items-center gap-1 text-xs font-black text-amber-500 active:scale-95 transition-transform"
        >
          <Sparkles className="w-5 h-5 animate-pulse" />
          <span>Öneri Bul</span>
        </button>
      </nav>

      {/* MODALS */}
      <PromotionModal
        isOpen={isPromotionOpen}
        color={chess.turn()}
        onSelectPiece={handlePromotionSelect}
        onCancel={() => {
          setIsPromotionOpen(false);
          setPendingPromotion(null);
        }}
      />

      <PresetsModal
        isOpen={isPresetsOpen}
        onClose={() => setIsPresetsOpen(false)}
        onSelectPreset={(p) => handleLoadCustomFen(p.fen, p.title)}
      />

      <AiCoachModal
        isOpen={isAiCoachOpen}
        onClose={() => setIsAiCoachOpen(false)}
        fen={fen}
        moves={history.map((h) => h.san)}
        bestMoveAnalysis={bestMoveAnalysis}
        turn={chess.turn()}
      />

      <EasterEggModal
        isOpen={isEasterEggOpen}
        onClose={() => setIsEasterEggOpen(false)}
      />

      <GameReviewModal
        isOpen={isGameReviewOpen}
        onClose={() => setIsGameReviewOpen(false)}
        report={gameReviewReport}
        isLoading={isReviewLoading}
        onRetryMove={handleRetryBlunder}
        onStartBlunderPuzzle={handleStartBlunderPuzzle}
      />

      <VisionBoardModal
        isOpen={isVisionOpen}
        onClose={() => setIsVisionOpen(false)}
        onLoadFen={(f) => handleLoadCustomFen(f, 'Fotoğraftan Çıkarılan Pozisyon')}
        isDarkMode={isDarkMode}
      />

      <GuessTheMoveModal
        isOpen={isGuessTheMoveOpen}
        onClose={() => setIsGuessTheMoveOpen(false)}
        onLoadPositionToBoard={(f, title) => handleLoadCustomFen(f, title)}
        isDarkMode={isDarkMode}
      />

      <TacticalMotifsModal
        isOpen={isMotifsOpen}
        onClose={() => setIsMotifsOpen(false)}
        onSelectPuzzle={(puz) => handleLoadCustomFen(puz.fen, puz.title)}
        isDarkMode={isDarkMode}
      />

      <OpeningDrillModal
        isOpen={isDrillsOpen}
        onClose={() => setIsDrillsOpen(false)}
        onLoadDrillToMainBoard={(drill) => handleLoadCustomFen(START_FEN, drill.name)}
        isDarkMode={isDarkMode}
      />

      <EndgameTrainerModal
        isOpen={isEndgameOpen}
        onClose={() => setIsEndgameOpen(false)}
        onLoadScenarioToBoard={(sc) => handleLoadCustomFen(sc.fen, sc.title)}
        isDarkMode={isDarkMode}
      />

      <DailyChallengeModal
        isOpen={isDailyOpen}
        onClose={() => setIsDailyOpen(false)}
        onLoadDailyToBoard={(f) => handleLoadCustomFen(f, 'Günün Mücadelesi')}
        isDarkMode={isDarkMode}
      />

      <AiPuzzleGenModal
        isOpen={isAiPuzzleOpen}
        onClose={() => setIsAiPuzzleOpen(false)}
        onLoadGeneratedPuzzle={(p) => handleLoadCustomFen(p.fen, p.title)}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}
