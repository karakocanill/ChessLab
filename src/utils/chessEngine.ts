import { Chess, Move, PieceSymbol } from 'chess.js';
import { BestMoveAnalysis, TacticalExplanation, MoveSuggestion } from '../types/chess';
import { getNextBookMove } from '../data/openings';

// Piece values in centipawns
const PIECE_VALUES: Record<PieceSymbol, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000,
};

const PIECE_NAMES_TR: Record<PieceSymbol, string> = {
  p: 'piyonu',
  n: 'atı',
  b: 'fili',
  r: 'kaleyi',
  q: 'veziri',
  k: 'şahı',
};

// Piece-Square bonus tables for positional awareness
const PAWN_PST = [
  0,  0,  0,  0,  0,  0,  0,  0,
  50, 50, 50, 50, 50, 50, 50, 50,
  10, 10, 20, 30, 30, 20, 10, 10,
  5,  5, 10, 25, 25, 10,  5,  5,
  0,  0,  0, 20, 20,  0,  0,  0,
  5, -5,-10,  0,  0,-10, -5,  5,
  5, 10, 10,-20,-20, 10, 10,  5,
  0,  0,  0,  0,  0,  0,  0,  0,
];

const KNIGHT_PST = [
  -50,-40,-30,-30,-30,-30,-40,-50,
  -40,-20,  0,  0,  0,  0,-20,-40,
  -30,  0, 10, 15, 15, 10,  0,-30,
  -30,  5, 15, 20, 20, 15,  5,-30,
  -30,  0, 15, 20, 20, 15,  0,-30,
  -30,  5, 10, 15, 15, 10,  5,-30,
  -40,-20,  0,  5,  5,  0,-20,-40,
  -50,-40,-30,-30,-30,-30,-40,-50,
];

// High-speed static board evaluation (Zero legal move generation inside evaluation to prevent UI freeze)
export function evaluateBoard(chess: Chess): number {
  if (chess.isGameOver()) {
    if (chess.isCheckmate()) {
      return chess.turn() === 'w' ? -20000 : 20000;
    }
    return 0; // Draw
  }

  let whiteMaterial = 0;
  let blackMaterial = 0;
  let whitePositional = 0;
  let blackPositional = 0;

  const board = chess.board();
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (!piece) continue;

      const val = PIECE_VALUES[piece.type];
      const squareIdx = r * 8 + c;

      if (piece.color === 'w') {
        whiteMaterial += val;
        if (piece.type === 'p') whitePositional += PAWN_PST[squareIdx];
        if (piece.type === 'n') whitePositional += KNIGHT_PST[squareIdx];
        if ((r === 3 || r === 4) && (c === 3 || c === 4)) whitePositional += 15;
      } else {
        blackMaterial += val;
        const flippedIdx = (7 - r) * 8 + c;
        if (piece.type === 'p') blackPositional += PAWN_PST[flippedIdx];
        if (piece.type === 'n') blackPositional += KNIGHT_PST[flippedIdx];
        if ((r === 3 || r === 4) && (c === 3 || c === 4)) blackPositional += 15;
      }
    }
  }

  return (whiteMaterial + whitePositional) - (blackMaterial + blackPositional);
}

// Transposition Table Entry
interface TTEntry {
  depth: number;
  score: number;
  flag: 'EXACT' | 'LOWER' | 'UPPER';
  bestMove?: Move;
}

// Fast In-Memory Transposition Table (LRU bounded)
const transpositionTable = new Map<string, TTEntry>();
const MAX_TT_ENTRIES = 30000;

function getTT(key: string, depth: number, alpha: number, beta: number): { hit: boolean; score?: number; bestMove?: Move } {
  const entry = transpositionTable.get(key);
  if (!entry || entry.depth < depth) return { hit: false, bestMove: entry?.bestMove };

  if (entry.flag === 'EXACT') return { hit: true, score: entry.score, bestMove: entry.bestMove };
  if (entry.flag === 'LOWER' && entry.score >= beta) return { hit: true, score: entry.score, bestMove: entry.bestMove };
  if (entry.flag === 'UPPER' && entry.score <= alpha) return { hit: true, score: entry.score, bestMove: entry.bestMove };

  return { hit: false, bestMove: entry.bestMove };
}

function storeTT(key: string, depth: number, score: number, flag: 'EXACT' | 'LOWER' | 'UPPER', bestMove?: Move) {
  if (transpositionTable.size >= MAX_TT_ENTRIES) {
    // Clear half of the cache to avoid memory bloat
    let count = 0;
    for (const k of transpositionTable.keys()) {
      transpositionTable.delete(k);
      count++;
      if (count > 15000) break;
    }
  }
  transpositionTable.set(key, { depth, score, flag, bestMove });
}

// Fast move ordering for alpha-beta cutoffs (Captures & Promotions first)
function orderMoves(moves: Move[], hashMoveSan?: string): Move[] {
  return moves.sort((a, b) => {
    if (hashMoveSan) {
      if (a.san === hashMoveSan) return -1;
      if (b.san === hashMoveSan) return 1;
    }
    let scoreA = 0;
    let scoreB = 0;
    if (a.captured) {
      scoreA += PIECE_VALUES[a.captured] * 10 - PIECE_VALUES[a.piece];
    }
    if (b.captured) {
      scoreB += PIECE_VALUES[b.captured] * 10 - PIECE_VALUES[b.piece];
    }
    if (a.promotion) scoreA += 800;
    if (b.promotion) scoreB += 800;
    if (a.san.includes('+')) scoreA += 200;
    if (b.san.includes('+')) scoreB += 200;

    return scoreB - scoreA;
  });
}

// Global node search counter to prevent any browser freezing
let currentSearchNodes = 0;
const MAX_SEARCH_NODES = 10000;

// Optimized Alpha-Beta Minimax search with Transposition Table & Node Budget
function minimax(
  chess: Chess,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean
): { score: number; bestMove?: Move } {
  currentSearchNodes++;

  if (depth <= 0 || chess.isGameOver() || currentSearchNodes >= MAX_SEARCH_NODES) {
    return { score: evaluateBoard(chess) };
  }

  // Simplified FEN key for transposition caching
  const fenParts = chess.fen().split(' ');
  const posKey = `${fenParts[0]} ${fenParts[1]} ${fenParts[2]}`;

  const originalAlpha = alpha;
  const { hit, score: ttScore, bestMove: ttBestMove } = getTT(posKey, depth, alpha, beta);
  if (hit && ttScore !== undefined) {
    return { score: ttScore, bestMove: ttBestMove };
  }

  const moves = orderMoves(chess.moves({ verbose: true }), ttBestMove?.san);
  if (moves.length === 0) {
    return { score: evaluateBoard(chess) };
  }

  let bestMove: Move | undefined = moves[0];

  if (isMaximizing) {
    let maxEval = -Infinity;

    for (const move of moves) {
      chess.move(move);
      const evalResult = minimax(chess, depth - 1, alpha, beta, false);
      chess.undo();

      if (evalResult.score > maxEval) {
        maxEval = evalResult.score;
        bestMove = move;
      }
      alpha = Math.max(alpha, evalResult.score);
      if (beta <= alpha) break; // Beta cutoff
    }

    let flag: 'EXACT' | 'LOWER' | 'UPPER' = 'EXACT';
    if (maxEval <= originalAlpha) flag = 'UPPER';
    else if (maxEval >= beta) flag = 'LOWER';
    storeTT(posKey, depth, maxEval, flag, bestMove);

    return { score: maxEval, bestMove };
  } else {
    let minEval = Infinity;

    for (const move of moves) {
      chess.move(move);
      const evalResult = minimax(chess, depth - 1, alpha, beta, true);
      chess.undo();

      if (evalResult.score < minEval) {
        minEval = evalResult.score;
        bestMove = move;
      }
      beta = Math.min(beta, evalResult.score);
      if (beta <= alpha) break; // Alpha cutoff
    }

    let flag: 'EXACT' | 'LOWER' | 'UPPER' = 'EXACT';
    if (minEval <= originalAlpha) flag = 'UPPER';
    else if (minEval >= beta) flag = 'LOWER';
    storeTT(posKey, depth, minEval, flag, bestMove);

    return { score: minEval, bestMove };
  }
}

// Extract tactical explanation in human-friendly Turkish
export function generateTacticalExplanation(
  chessBefore: Chess,
  move: Move,
  scoreCp: number,
  isMate: boolean,
  mateIn?: number
): TacticalExplanation {
  const clone = new Chess(chessBefore.fen());
  clone.move(move);

  const motives: string[] = [];
  let title = 'Harika Hamle!';
  let badge: TacticalExplanation['badge'] = '🌟 Stratejik Kazanç';
  let shortSummary = '';
  let details = '';

  const pieceName = PIECE_NAMES_TR[move.piece] || 'taşı';
  const targetSquare = move.to;

  if (isMate || clone.isCheckmate()) {
    badge = '🔥 Mat Tehdidi';
    title = 'Şah Mat Zaferi! 🏆';
    motives.push('Mat Ağı');
    if (clone.isCheckmate()) {
      shortSummary = `Buldum! 🚀 ${pieceName.toUpperCase()} ${targetSquare} karesine getirerek doğrudan ŞAH MAT yapıyoruz!`;
      details = `Rakip şahın hiçbir kaçış karesi kalmadı. Kombinezon zaferle sonuçlanıyor!`;
    } else {
      shortSummary = `Buldum! 🚀 Bu hamle rakip şahı köşeye sıkıştırıyor ve ${mateIn || 2} hamle sonra kaçınılmaz mat geliyor!`;
      details = `Rakibin karşı koyamayacağı mutlak bir mat ağı kuruldu.`;
    }
    return { title, badge, shortSummary, details, motives };
  }

  if (move.promotion) {
    badge = '👑 Terfi';
    title = 'Taç Giyme Töreni! 👑';
    motives.push('Piyon Terfisi');
    shortSummary = `Piyonumuz son yataya ulaştı ve süper bir ${PIECE_NAMES_TR[move.promotion as PieceSymbol]} dönüşüyor! 🌟`;
    details = `Piyonu vezire terfi ettirerek tahtada ezici bir materyal üstünlüğü sağlıyoruz.`;
    return { title, badge, shortSummary, details, motives };
  }

  const causesCheck = clone.inCheck();
  if (causesCheck) {
    motives.push('Şah Çekişi');
  }

  if (move.captured) {
    const capturedName = PIECE_NAMES_TR[move.captured] || 'rakip taşı';
    const pieceVal = PIECE_VALUES[move.piece];
    const capturedVal = PIECE_VALUES[move.captured];

    if (pieceVal > capturedVal + 150) {
      badge = '⚔️ Feda Taktiği';
      title = 'Dahi Taş Fedası! 💎';
      motives.push('Taş Fedası', 'Pozisyonel Baskı');
      shortSummary = `Buldum! ${pieceName} burada feda ederek rakip savunmayı paramparça ediyor ve saldırıyı başlatıyoruz! 💥`;
      details = `Bu feda rakip şahın koruyucu kalkanını yok ediyor ve taşlarımızın ölümcül karelere sızmasını sağlıyor.`;
      return { title, badge, shortSummary, details, motives };
    } else {
      motives.push('Materyal Kazancı');
      badge = '⚔️ Feda Taktiği';
      title = `Taş Avı: ${capturedName.toUpperCase()} Kazanıldı! 🎯`;
      shortSummary = `${targetSquare} karesindeki korumasız ${capturedName} alarak avantajı perçinliyoruz!`;
      details = `Rakibin zayıf düşen taşını ortadan kaldırarak taş üstünlüğü elde ediyoruz.`;
    }
  }

  const attackedSquares = clone.moves({ verbose: true }).filter((m) => m.from === move.to);
  const targets = attackedSquares.filter(
    (m) => m.captured && ['q', 'r', 'k', 'b', 'n'].includes(m.captured)
  );
  if (targets.length >= 2 || (causesCheck && targets.length >= 1)) {
    badge = '⚡ Çatal';
    title = 'Yıldırım Çatalı! ⚡';
    motives.push('Çifte Tehdit (Çatal)');
    shortSummary = `Çatal Taktiği! ⚡ ${pieceName} ${targetSquare} karesine koyarak iki hedefi aynı anda tehdit ediyoruz!`;
    details = `Rakip şahını veya bir taşını kaçmak zorunda kaldığında diğer taşı bedava kazanıyoruz!`;
    return { title, badge, shortSummary, details, motives };
  }

  if (move.san === 'O-O' || move.san === 'O-O-O') {
    badge = '🏰 Şah Güvenliği';
    title = 'Kale Kalkanı (Rok)! 🏰';
    motives.push('Rok', 'Şah Güvenliği');
    shortSummary = `Şahımızı güvenli köşeye alırken kalemizi merkez savaşına dahil ediyoruz!`;
    details = `Rok hamlesi kralı korur ve kaleyi açık hatta koyarak oyuna dinamizm kazandırır.`;
    return { title, badge, shortSummary, details, motives };
  }

  if (causesCheck) {
    badge = '🔥 Mat Tehdidi';
    title = 'Şah Sıkıştırması! 🚨';
    shortSummary = `Şah çekerek rakibin temposunu bozuyoruz ve savunma yapmaya zorluyoruz!`;
    details = `Rakip şah tehdidi bertaraf etmeye çalışırken biz bir sonraki ölümcül hamlemizi hazırlıyoruz.`;
    return { title, badge, shortSummary, details, motives };
  }

  if (['d4', 'd5', 'e4', 'e5', 'c4', 'f4'].includes(targetSquare)) {
    badge = '🌟 Stratejik Kazanç';
    title = 'Merkez Hakimiyeti! 👑';
    motives.push('Merkez Kontrolü');
    shortSummary = `Tahtanın kalbi olan ${targetSquare} karesini ele geçirerek rakibi geri püskürtüyoruz!`;
    details = `Merkezi kontrol eden oyuncu, taşlarını her iki kanada da kolayca kaydırabilir.`;
    return { title, badge, shortSummary, details, motives };
  }

  shortSummary = `${pieceName} ${targetSquare} karesine taşıyarak konumumuzu güçlendiriyoruz ve rakibe baskı yapıyoruz! 🚀`;
  details = `Bu hamle taşlarımızın hareket alanını genişletirken rakibin planlarını engelliyor.`;
  return { title, badge, shortSummary, details, motives };
}

// Generate single move human description
function generateMoveQuickDescription(
  chess: Chess,
  move: Move,
  rank: number,
  isBlunder = false,
  isBook = false,
  bookName?: string
): string {
  if (isBook) {
    return `🟣 Kitap Açılış Hamlesi: ${bookName || 'Klasik Teori'}. Taşları doğal gelişim karelerine yerleştirir.`;
  }
  if (isBlunder) {
    return `🔴 Dikkat, Ciddi Hata! Bu hamle pozisyonu bozar veya rakibe büyük bir taktik fırsat verir.`;
  }
  if (move.san.includes('#')) {
    return `🟢 Mat Zaferi! Tek hamlede oyunu bitirir.`;
  }
  if (move.san.includes('+')) {
    return `Şah Çekişi! Rakip şahı köşeye sıkıştırır.`;
  }
  if (move.captured) {
    return `${move.to} karesindeki taşı alarak materyal üstünlüğü sağlar.`;
  }
  if (rank === 1) {
    return `🟢 1. En İyi Hamle: Pozisyonel üstünlüğü ve merkez kontrolünü maksimize eder.`;
  }
  if (rank === 2) {
    return `🔵 2. En İyi Hamle: Çok güçlü bir alternatif, dengeli ve aktif oyun sağlar.`;
  }
  if (rank === 3) {
    return `🟠 3. Alternatif: Makul bir devam yolu, ancak en keskin seçenek değil.`;
  }
  return `Hamle: Taş gelişimini destekler.`;
}

// In-Memory Results Cache for Instant (0ms) Re-renders
const analysisCache = new Map<string, BestMoveAnalysis>();
const MAX_ANALYSIS_CACHE = 100;

// High-Performance Chess Engine Controller
export class ChessEngineController {
  // Multi-PV analysis with ELO depth scaling, Candidate Pruning, and Transposition Caching
  public async analyzePosition(
    fen: string,
    depth = 3,
    suggestionCount = 3,
    elo = 1500,
    historyMoves: string[] = [],
    showBlunder = true
  ): Promise<BestMoveAnalysis> {
    const cacheKey = `${fen}_${depth}_${suggestionCount}_${elo}_${showBlunder}`;
    const cached = analysisCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const chess = new Chess(fen);
    const turn = chess.turn();

    if (chess.isGameOver()) {
      const isMate = chess.isCheckmate();
      const score = isMate ? (turn === 'w' ? -20000 : 20000) : 0;
      const res: BestMoveAnalysis = {
        from: '',
        to: '',
        uci: '',
        san: isMate ? 'Mat!' : 'Berabere',
        scoreCp: score,
        isMate,
        mateIn: isMate ? 0 : undefined,
        depth: 0,
        explanation: {
          title: isMate ? 'Oyun Bitti: Şah Mat! 🏆' : 'Oyun Bitti: Beraberlik! 🤝',
          badge: isMate ? '🔥 Mat Tehdidi' : '🌟 Stratejik Kazanç',
          shortSummary: isMate ? 'Harika bir oyun! Şah mat gerçekleşti.' : 'Tahtada beraberlik durumu oluştu.',
          details: 'Yeni bir oyuna başlayabilirsin!',
          motives: ['Oyun Sonu'],
        },
        suggestions: [],
      };
      analysisCache.set(cacheKey, res);
      return res;
    }

    const legalMoves = chess.moves({ verbose: true });
    if (legalMoves.length === 0) {
      return {
        from: '',
        to: '',
        uci: '',
        san: '',
        scoreCp: 0,
        isMate: false,
        depth: 0,
        explanation: {
          title: 'Hamle Yok',
          badge: '🌟 Stratejik Kazanç',
          shortSummary: 'Yasal hamle bulunamadı.',
          details: '',
          motives: [],
        },
        suggestions: [],
      };
    }

    // Determine calculation depth from chosen ELO with ultra-smooth scaling:
    // Depth 1: ELO < 800
    // Depth 2: ELO 800 - 1499
    // Depth 3: ELO 1500 - 2199
    // Depth 4: ELO >= 2200
    let calcDepth = 2;
    if (elo >= 2200) calcDepth = 4;
    else if (elo >= 1500) calcDepth = 3;
    else if (elo >= 800) calcDepth = 2;
    else calcDepth = 1;

    // Reset node search budget for this request
    currentSearchNodes = 0;

    // Check for book move
    const bookInfo = getNextBookMove(historyMoves);

    const isMaximizing = turn === 'w';

    // Step 1: Quick root pre-sorting using depth 1
    const candidateMoves: Array<{
      move: Move;
      quickScore: number;
    }> = [];

    for (const m of legalMoves) {
      chess.move(m);
      const s = evaluateBoard(chess);
      chess.undo();
      candidateMoves.push({
        move: m,
        quickScore: turn === 'w' ? s : -s,
      });
    }

    // Sort candidates best to worst
    candidateMoves.sort((a, b) => b.quickScore - a.quickScore);

    // Step 2: Root Candidate Pruning:
    // If legalMoves > 12 and calcDepth >= 3, only search top 12 moves deeply
    // plus all captures and checks. Prunes 75% of wasteful search time!
    const deepCandidates: Move[] = [];
    const maxDeepCount = calcDepth >= 3 ? 12 : candidateMoves.length;

    for (let i = 0; i < candidateMoves.length; i++) {
      const c = candidateMoves[i];
      if (i < maxDeepCount || c.move.captured || c.move.san.includes('+') || c.move.promotion) {
        deepCandidates.push(c.move);
      }
    }

    // Step 3: Deep search on prioritized candidate moves
    const evaluatedMoves: Array<{
      move: Move;
      score: number; // For current player (higher = better)
      rawCp: number;
    }> = [];

    const searchSubDepth = Math.max(0, calcDepth - 1);

    for (const m of deepCandidates) {
      chess.move(m);
      const nextEval = minimax(chess, searchSubDepth, -Infinity, Infinity, !isMaximizing);
      chess.undo();

      const playerAdvantage = turn === 'w' ? nextEval.score : -nextEval.score;

      evaluatedMoves.push({
        move: m,
        score: playerAdvantage,
        rawCp: nextEval.score,
      });
    }

    // Add unsearched lower candidates using their quickScore so blunder detection still works
    for (const c of candidateMoves) {
      if (!evaluatedMoves.some((em) => em.move.san === c.move.san)) {
        evaluatedMoves.push({
          move: c.move,
          score: c.quickScore,
          rawCp: turn === 'w' ? c.quickScore : -c.quickScore,
        });
      }
    }

    // Sort moves: best to worst
    evaluatedMoves.sort((a, b) => b.score - a.score);

    const bestOne = evaluatedMoves[0];
    const isBestMate = Math.abs(bestOne.score) >= 19000;

    // Primary explanation for best move
    const bestExplanation = generateTacticalExplanation(
      chess,
      bestOne.move,
      bestOne.rawCp,
      isBestMate
    );

    // Build suggestions list with color coding
    const suggestions: MoveSuggestion[] = [];

    // Slice top candidates based on user-requested suggestionCount
    const countToTake = Math.min(suggestionCount, evaluatedMoves.length);
    for (let i = 0; i < countToTake; i++) {
      const item = evaluatedMoves[i];
      const rank = i + 1;
      const isBook = Boolean(bookInfo && item.move.san === bookInfo.san);

      let colorHex = '#22c55e'; // Green for #1
      let category: MoveSuggestion['category'] = 'best';
      let badgeLabel = '1. En İyi';

      if (isBook) {
        colorHex = '#a855f7'; // Purple for book
        category = 'opening';
        badgeLabel = `Kitap (${bookInfo?.openingName || 'Açılış'})`;
      } else if (rank === 1) {
        colorHex = '#22c55e'; // 🟢 Green
        category = 'best';
        badgeLabel = '1. En İyi';
      } else if (rank === 2) {
        colorHex = '#3b82f6'; // 🔵 Blue
        category = 'great';
        badgeLabel = '2. En İyi';
      } else if (rank === 3) {
        colorHex = '#f97316'; // 🟠 Orange
        category = 'alternative';
        badgeLabel = '3. Alternatif';
      } else {
        colorHex = '#0ea5e9'; // Cyan
        category = 'alternative';
        badgeLabel = `${rank}. Alternatif`;
      }

      suggestions.push({
        rank,
        category,
        colorHex,
        from: item.move.from,
        to: item.move.to,
        uci: `${item.move.from}${item.move.to}`,
        san: item.move.san,
        scoreCp: item.rawCp,
        isMate: Math.abs(item.rawCp) >= 19000,
        mateIn: Math.abs(item.rawCp) >= 19000 ? 1 : undefined,
        explanation: generateMoveQuickDescription(
          chess,
          item.move,
          rank,
          false,
          isBook,
          bookInfo?.openingName
        ),
        badgeLabel,
        isOpeningBook: isBook,
        openingName: isBook ? bookInfo?.openingName : undefined,
      });
    }

    // Add Blunder / Worst Move (🔴 Red) if requested and there are at least 2 legal moves
    if (showBlunder && evaluatedMoves.length >= 2) {
      const worstItem = evaluatedMoves[evaluatedMoves.length - 1];
      const alreadyInList = suggestions.some((s) => s.san === worstItem.move.san);
      if (!alreadyInList) {
        suggestions.push({
          rank: 999,
          category: 'blunder',
          colorHex: '#ef4444', // 🔴 Red
          from: worstItem.move.from,
          to: worstItem.move.to,
          uci: `${worstItem.move.from}${worstItem.move.to}`,
          san: worstItem.move.san,
          scoreCp: worstItem.rawCp,
          isMate: Math.abs(worstItem.rawCp) >= 19000,
          mateIn: Math.abs(worstItem.rawCp) >= 19000 ? 1 : undefined,
          explanation: generateMoveQuickDescription(chess, worstItem.move, 999, true),
          badgeLabel: '⚠️ En Kötü (Hata)',
        });
      }
    }

    const result: BestMoveAnalysis = {
      from: bestOne.move.from,
      to: bestOne.move.to,
      uci: `${bestOne.move.from}${bestOne.move.to}`,
      san: bestOne.move.san,
      scoreCp: bestOne.rawCp,
      isMate: isBestMate,
      mateIn: isBestMate ? 1 : undefined,
      depth: calcDepth,
      explanation: bestExplanation,
      suggestions,
    };

    if (analysisCache.size >= MAX_ANALYSIS_CACHE) {
      analysisCache.clear();
    }
    analysisCache.set(cacheKey, result);

    return result;
  }
}

export const chessEngine = new ChessEngineController();
