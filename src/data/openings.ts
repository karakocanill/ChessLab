export interface OpeningDef {
  name: string;
  nameTr: string;
  moves: string[]; // e.g. ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4']
  descriptionTr: string;
}

export const CHESS_OPENINGS: OpeningDef[] = [
  // 1. e4 Openings
  {
    name: 'Italian Game',
    nameTr: 'İtalyan Açılışı (Giuoco Piano)',
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4'],
    descriptionTr: 'Merkezi hedef alan ve f7 karesine göz diken klasik İtalyan kurgusu.',
  },
  {
    name: 'Ruy Lopez',
    nameTr: 'İspanyol Açılışı (Ruy Lopez)',
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5'],
    descriptionTr: 'Dünya şampiyonlarının en çok tercih ettiği derin stratejik açılış.',
  },
  {
    name: 'Sicilian Defense',
    nameTr: 'Sicilya Savunması',
    moves: ['e4', 'c5'],
    descriptionTr: 'Siyahın merkezi dengesizleştirerek galibiyet için oynadığı en popüler karşı saldırı.',
  },
  {
    name: 'French Defense',
    nameTr: 'Fransız Savunması',
    moves: ['e4', 'e6'],
    descriptionTr: 'Sağlam piyon zinciriyle beyazın merkezine karşı oynanan dirençli savunma.',
  },
  {
    name: 'Caro-Kann Defense',
    nameTr: 'Caro-Kann Savunması',
    moves: ['e4', 'c6'],
    descriptionTr: 'Filin önünü kapatmadan d5 sürüşünü hazırlayan son derece sağlam bir kale.',
  },
  {
    name: 'Scandinavian Defense',
    nameTr: 'İskandinav Savunması',
    moves: ['e4', 'd5'],
    descriptionTr: 'Hemen 1. hamlede beyazın e4 piyonuna meydan okuyan doğrudan hamle.',
  },
  {
    name: 'King\'s Gambit',
    nameTr: 'Şah Gambiti',
    moves: ['e4', 'e5', 'f4'],
    descriptionTr: 'Romantik satranç döneminin feda dolu, çılgın hücum açılışı!',
  },
  {
    name: 'Four Knights Game',
    nameTr: 'Dört At Açılışı',
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Nc3', 'Nf6'],
    descriptionTr: 'Tahtadaki dört atın da erkenden oyuna girdiği dengeli başlangıç.',
  },
  {
    name: 'Scholar\'s Mate Setup',
    nameTr: 'Çoban Matı Tuzağı',
    moves: ['e4', 'e5', 'Qh5'],
    descriptionTr: 'Yeni başlayanların en çok denediği, f7 piyonuna erken vezir saldırısı.',
  },

  // 1. d4 Openings
  {
    name: 'Queen\'s Gambit',
    nameTr: 'Vezir Gambiti',
    moves: ['d4', 'd5', 'c4'],
    descriptionTr: 'Merkez hakimiyetini piyon fedası teklifiyle ele geçirmeyi amaçlayan efsane açılış.',
  },
  {
    name: 'King\'s Indian Defense',
    nameTr: 'Şah-Hint Savunması',
    moves: ['d4', 'Nf6', 'c4', 'g6'],
    descriptionTr: 'Siyahın rok atıp şah kanadından dev bir fırtına kopardığı dinamik sistem.',
  },
  {
    name: 'London System',
    nameTr: 'Londra Sistemi',
    moves: ['d4', 'd5', 'Bf4'],
    descriptionTr: 'Sağlam üçgen piyon yapısı ve erkenden çıkan koyu renkli fil ile oynaması çok rahat bir sistem.',
  },
  {
    name: 'Slav Defense',
    nameTr: 'Slav Savunması',
    moves: ['d4', 'd5', 'c4', 'c6'],
    descriptionTr: 'Vezir gambitine karşı en kaya gibi sağlam savunma.',
  },

  // Flank Openings
  {
    name: 'English Opening',
    nameTr: 'İngiliz Açılışı',
    moves: ['c4'],
    descriptionTr: 'Merkezi kanattan kontrol eden esnek ve modern bir başlangıç.',
  },
  {
    name: 'Reti Opening',
    nameTr: 'Réti Açılışı',
    moves: ['Nf3'],
    descriptionTr: 'Hipermodern okulun piyon sürmeden atı çıkan zarif açılışı.',
  },
];

// Helper to find matching opening from move list
export function detectOpening(sanMoves: string[]): OpeningDef | null {
  if (!sanMoves || sanMoves.length === 0) return null;

  let bestMatch: OpeningDef | null = null;
  let maxMatched = 0;

  for (const opening of CHESS_OPENINGS) {
    if (opening.moves.length <= sanMoves.length) {
      let matches = true;
      for (let i = 0; i < opening.moves.length; i++) {
        if (opening.moves[i] !== sanMoves[i]) {
          matches = false;
          break;
        }
      }
      if (matches && opening.moves.length > maxMatched) {
        maxMatched = opening.moves.length;
        bestMatch = opening;
      }
    }
  }

  return bestMatch;
}

// Check if next move is a book opening move
export function getNextBookMove(sanMoves: string[]): { san: string; openingName: string } | null {
  const currentLen = sanMoves.length;
  for (const opening of CHESS_OPENINGS) {
    if (opening.moves.length > currentLen) {
      let matches = true;
      for (let i = 0; i < currentLen; i++) {
        if (opening.moves[i] !== sanMoves[i]) {
          matches = false;
          break;
        }
      }
      if (matches) {
        return {
          san: opening.moves[currentLen],
          openingName: opening.nameTr,
        };
      }
    }
  }
  return null;
}
