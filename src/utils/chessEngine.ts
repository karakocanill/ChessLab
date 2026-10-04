import { Chess, Move, Square, PieceSymbol } from 'chess.js';
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

// Evaluate static position
export function evaluateBoard(chess: Chess): number {
  if (chess.isCheckmate()) {
    return chess.turn() === 'w' ? -20000 : 20000;
  }
  if (chess.isDraw()) {
    return 0;
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

  const currentTurn = chess.turn();
  const movesCount = chess.moves().length;
  const mobility = currentTurn === 'w' ? movesCount * 4 : -movesCount * 4;

  const totalWhite = whiteMaterial + whitePositional;
  const totalBlack = blackMaterial + blackPositional;

  return totalWhite - totalBlack + mobility;
}

// Alpha-Beta Minimax search
function minimax(
  chess: Chess,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean
): { score: number; bestMove?: Move } {
  if (depth === 0 || chess.isGameOver()) {
    return { score: evaluateBoard(chess) };
  }

  const moves = chess.moves({ verbose: true });
  moves.sort((a, b) => {
    let scoreA = 0;
    let scoreB = 0;
    if (a.captured) scoreA += PIECE_VALUES[a.captured] * 10 - PIECE_VALUES[a.piece];
    if (b.captured) scoreB += PIECE_VALUES[b.captured] * 10 - PIECE_VALUES[b.piece];
    if (a.promotion) scoreA += 800;
    if (b.promotion) scoreB += 800;
    return scoreB - scoreA;
  });

  if (isMaximizing) {
    let maxEval = -Infinity;
    let bestMove: Move | undefined = moves[0];

    for (const move of moves) {
      chess.move(move);
      const evalResult = minimax(chess, depth - 1, alpha, beta, false);
      chess.undo();

      if (evalResult.score > maxEval) {
        maxEval = evalResult.score;
        bestMove = move;
      }
      alpha = Math.max(alpha, evalResult.score);
      if (beta <= alpha) break;
    }
    return { score: maxEval, bestMove };
  } else {
    let minEval = Infinity;
    let bestMove: Move | undefined = moves[0];

    for (const move of moves) {
      chess.move(move);
      const evalResult = minimax(chess, depth - 1, alpha, beta, true);
      chess.undo();

      if (evalResult.score < minEval) {
        minEval = evalResult.score;
        bestMove = move;
      }
      beta = Math.min(beta, evalResult.score);
      if (beta <= alpha) break;
    }
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

// Engine Controller supporting ELO, Multi-PV & Blunder detection
export class ChessEngineController {
  private worker: Worker | null = null;
  private isStockfishReady = false;

  constructor() {
    this.initWorker();
  }

  private initWorker() {
    if (typeof window === 'undefined') return;

    try {
      const workerScript = `
        try {
          importScripts('https://cdnjs.cloudflare.com/ajax/libs/stockfish.js/10.0.2/stockfish.js');
        } catch (e) {
          // ignore
        }
      `;
      const blob = new Blob([workerScript], { type: 'application/javascript' });
      const blobUrl = URL.createObjectURL(blob);
      const w = new Worker(blobUrl);

      w.onmessage = (event) => {
        const line = typeof event.data === 'string' ? event.data : '';
        if (line === 'readyok' || line.includes('Stockfish')) {
          this.isStockfishReady = true;
        }
      };

      w.postMessage('uci');
      w.postMessage('isready');
      this.worker = w;
    } catch {
      this.worker = null;
      this.isStockfishReady = false;
    }
  }

  // Multi-PV analysis with ELO depth scaling, Rank coloring, and Blunder detection
  public async analyzePosition(
    fen: string,
    depth = 3,
    suggestionCount = 3,
    elo = 1500,
    historyMoves: string[] = [],
    showBlunder = true
  ): Promise<BestMoveAnalysis> {
    const chess = new Chess(fen);
    const turn = chess.turn();

    if (chess.isGameOver()) {
      const isMate = chess.isCheckmate();
      const score = isMate ? (turn === 'w' ? -20000 : 20000) : 0;
      return {
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

    // Determine calculation depth from chosen ELO
    let calcDepth = 1;
    if (elo >= 2400) calcDepth = 5;
    else if (elo >= 1800) calcDepth = 4;
    else if (elo >= 1200) calcDepth = 3;
    else if (elo >= 600) calcDepth = 2;
    else calcDepth = 1;

    // Check for book move
    const bookInfo = getNextBookMove(historyMoves);

    // Evaluate each legal move
    const evaluatedMoves: Array<{
      move: Move;
      score: number; // for current player (higher = better)
      rawCp: number;
    }> = [];

    const isMaximizing = turn === 'w';

    for (const m of legalMoves) {
      chess.move(m);
      // Minimax evaluation from next state
      const nextEval = minimax(chess, Math.max(0, calcDepth - 1), -Infinity, Infinity, !isMaximizing);
      chess.undo();

      // Normalize so higher score always favors current active turn
      const playerAdvantage = turn === 'w' ? nextEval.score : -nextEval.score;

      evaluatedMoves.push({
        move: m,
        score: playerAdvantage,
        rawCp: nextEval.score,
      });
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
      // Only add if it's not already in top suggestions
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

    return {
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
  }
}

export const chessEngine = new ChessEngineController();
