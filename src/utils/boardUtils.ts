import { Chess } from 'chess.js';

// Convert 8x8 matrix or square-piece record into FEN string
export function squareMapToFen(
  pieceMap: Record<string, string>, // e.g. { 'e4': 'wP', 'e1': 'wK', 'e8': 'bK' }
  turn: 'w' | 'b' = 'w'
): string {
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

  const rows: string[] = [];

  for (const rank of ranks) {
    let emptyCount = 0;
    let rowStr = '';

    for (const file of files) {
      const square = `${file}${rank}`;
      const piece = pieceMap[square];

      if (piece && piece.length >= 2) {
        if (emptyCount > 0) {
          rowStr += emptyCount;
          emptyCount = 0;
        }
        const color = piece[0]; // 'w' or 'b'
        const type = piece[1].toLowerCase(); // 'p', 'r', 'n', 'b', 'q', 'k'
        rowStr += color === 'w' ? type.toUpperCase() : type;
      } else {
        emptyCount++;
      }
    }

    if (emptyCount > 0) {
      rowStr += emptyCount;
    }
    rows.push(rowStr);
  }

  const piecePlacement = rows.join('/');

  // Check if kings exist for basic castling rights
  const hasWhiteKing = pieceMap['e1'] === 'wK';
  const hasBlackKing = pieceMap['e8'] === 'bK';
  let castling = '';
  if (hasWhiteKing && pieceMap['h1'] === 'wR') castling += 'K';
  if (hasWhiteKing && pieceMap['a1'] === 'wR') castling += 'Q';
  if (hasBlackKing && pieceMap['h8'] === 'bR') castling += 'k';
  if (hasBlackKing && pieceMap['a8'] === 'bR') castling += 'q';
  if (!castling) castling = '-';

  return `${piecePlacement} ${turn} ${castling} - 0 1`;
}

// Convert FEN into square-piece map
export function fenToSquareMap(fen: string): Record<string, string> {
  const map: Record<string, string> = {};
  const [placement] = fen.split(' ');
  const rows = placement.split('/');
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

  for (let r = 0; r < rows.length; r++) {
    const row = rows[r];
    const rank = ranks[r];
    let fileIdx = 0;

    for (const char of row) {
      if (char >= '1' && char <= '8') {
        fileIdx += parseInt(char, 10);
      } else {
        const file = files[fileIdx];
        if (file) {
          const square = `${file}${rank}`;
          const isWhite = char === char.toUpperCase();
          map[square] = `${isWhite ? 'w' : 'b'}${char.toUpperCase()}`;
        }
        fileIdx++;
      }
    }
  }

  return map;
}

// Safely test if FEN can be loaded into chess.js
export function isValidChessFen(fen: string): boolean {
  try {
    const c = new Chess();
    c.load(fen);
    return true;
  } catch {
    return false;
  }
}
