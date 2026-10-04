import { Chess } from 'chess.js';
import { MoveRecord, BlunderReviewItem, GameReviewReport } from '../types/chess';
import { evaluateBoard, chessEngine } from './chessEngine';

export async function generateGameReview(history: MoveRecord[]): Promise<GameReviewReport> {
  if (!history || history.length === 0) {
    return {
      totalMoves: 0,
      accuracyWhite: 100,
      accuracyBlack: 100,
      blunders: [],
    };
  }

  const blunders: BlunderReviewItem[] = [];
  let totalLossWhite = 0;
  let totalLossBlack = 0;
  let countWhite = 0;
  let countBlack = 0;

  for (let i = 0; i < history.length; i++) {
    const record = history[i];
    const isWhite = record.color === 'w';

    if (isWhite) countWhite++;
    else countBlack++;

    try {
      // Analyze position before this move
      const chessBefore = new Chess(record.fenBefore);
      const evalBefore = evaluateBoard(chessBefore);

      // Analyze best move from before state
      const bestAnalysis = await chessEngine.analyzePosition(
        record.fenBefore,
        2,
        1,
        1800,
        [],
        false
      );

      const chessAfter = new Chess(record.fenAfter);
      const evalAfter = evaluateBoard(chessAfter);

      // Loss relative to active player
      // For white, dropping eval means evalAfter < evalBefore
      // For black, dropping eval means evalAfter > evalBefore
      let evalLoss = 0;
      if (isWhite) {
        evalLoss = evalBefore - evalAfter;
        if (evalLoss > 0) totalLossWhite += evalLoss;
      } else {
        evalLoss = evalAfter - evalBefore;
        if (evalLoss > 0) totalLossBlack += evalLoss;
      }

      // Check if move differs from best move and lost >= 75 centipawns
      const playedUci = `${record.from}${record.to}`;
      const isNotBest = bestAnalysis.uci && bestAnalysis.uci !== playedUci;

      if (isNotBest && evalLoss >= 75) {
        let severity: BlunderReviewItem['severity'] = 'inaccuracy';
        if (evalLoss >= 250) severity = 'blunder';
        else if (evalLoss >= 130) severity = 'mistake';

        const pieceName = record.piece ? record.piece.toUpperCase() : 'taş';
        const bestSan = bestAnalysis.san || 'en iyi hamle';

        let whyBad = '';
        let whatShouldPlay = '';
        let continuationLine = '';

        if (severity === 'blunder') {
          whyBad = `Bu hamleyle ${record.san} oynayarak rakibe büyük bir taktik kapı açtın! Tahtadaki avantajın yaklaşık ${(evalLoss / 100).toFixed(1)} puan birden eridi.`;
          whatShouldPlay = `Burada ${record.san} yerine kesinlikle 🟢 ${bestSan} oynamalıydın!`;
          continuationLine = `Eğer ${bestSan} oynasaydın, taşın güvende kalacak ve sen 5 hamle sonra tahtada ${(Math.abs(bestAnalysis.scoreCp) / 100).toFixed(1)} puan daha önde olacaktın!`;
        } else if (severity === 'mistake') {
          whyBad = `${record.san} hamlesi rakibe inisiyatif veriyor ve savunmanı zorlaştırıyor.`;
          whatShouldPlay = `Daha aktif olan 🔵 ${bestSan} hamlesi tercih edilmeliydi.`;
          continuationLine = `${bestSan} hamlesi merkezi kilitler ve rakip taşların etkinliğini sıfırlardı.`;
        } else {
          whyBad = `${record.san} fena bir hamle değil fakat tahtadaki en keskin kazanç fırsatını kaçırdı.`;
          whatShouldPlay = `Fırsatı değerlendirmek için ${bestSan} daha güçlüydü.`;
          continuationLine = `Pozisyonunu sağlamlaştırıp rakip şaha daha hızlı baskı kurabilirdin.`;
        }

        blunders.push({
          id: `review-${i}-${record.san}`,
          moveIndex: i,
          moveNumber: record.moveNumber,
          color: record.color,
          playedSan: record.san,
          playedFrom: record.from,
          playedTo: record.to,
          bestSan,
          bestFrom: bestAnalysis.from,
          bestTo: bestAnalysis.to,
          evalLossCp: evalLoss,
          evalBeforeCp: evalBefore,
          evalAfterCp: evalAfter,
          severity,
          whyBad,
          whatShouldPlay,
          continuationLine,
          fenBefore: record.fenBefore,
          fenAfter: record.fenAfter,
        });
      }
    } catch {
      // skip move if analysis fails
    }
  }

  // Calculate approximate accuracy (0-100%)
  const avgLossWhite = countWhite > 0 ? totalLossWhite / countWhite : 0;
  const avgLossBlack = countBlack > 0 ? totalLossBlack / countBlack : 0;

  const accuracyWhite = Math.max(30, Math.min(100, Math.round(100 - avgLossWhite * 0.25)));
  const accuracyBlack = Math.max(30, Math.min(100, Math.round(100 - avgLossBlack * 0.25)));

  return {
    totalMoves: history.length,
    accuracyWhite,
    accuracyBlack,
    blunders,
  };
}
