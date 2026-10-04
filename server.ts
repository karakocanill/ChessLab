import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '15mb' }));

// 1. API route for AI Chess Coach
app.post('/api/chess-coach', async (req, res) => {
  try {
    const { fen, moves, pgn, userQuestion, tone = 'kid_friendly' } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(200).json({
        advice: 'Harika bir hamle arayışındasın! Taşlarını merkeze yaklaştır ve şahını güvene almayı unutma! 🌟',
        tactics: ['Merkez kontrolü', 'Şah güvenliği', 'Taş gelişimi'],
      });
    }

    const ai = new GoogleGenAI();
    const prompt = `Sen "ChessForge" satranç akademisinin sevimli ve bilge Satranç Koçusun.
Kullanıcı satranç tahtasında şu pozisyonda:
FEN: "${fen || 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'}"
Son hamleler / PGN: "${pgn || moves?.join(' ') || 'Oyun başlangıcı'}"
Kullanıcı sorusu/isteği: "${userQuestion || 'Bu pozisyonda bana en iyi taktiği ve ne yapmam gerektiğini açıkla.'}"
İletişim Tonu: ${tone === 'kid_friendly' ? 'Eğlenceli, neşeli, bol emojili ve çok anlaşılır' : 'Profesyonel büyükusta analizi'}

Lütfen:
1. Pozisyonu kısaca özetle (Kim daha aktif? Hangi taşlar tehlikede?).
2. 1 veya 2 harika hamle öner ve nedenini açıkla.
3. Pratik bir taktik kural veya ipucu ekle.
Cevabını 2-3 kısa paragraf halinde Türkçe olarak yaz.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const text = response.text || 'Tahtada harika fırsatlar var! Taşlarını koru ve hücuma hazırlan!';
    return res.status(200).json({ advice: text });
  } catch (error: any) {
    console.error('Error in /api/chess-coach:', error);
    return res.status(200).json({
      advice: 'Harika odaklandın! Rakibin hamlesine dikkat et, merkez kareleri (d4, d5, e4, e5) kontrol altında tut ve şahını koru! 🚀',
    });
  }
});

// 2. Vision AI: Extract Chessboard FEN from Photo / Screenshot
app.post('/api/board-vision', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg' } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: 'Görsel verisi bulunamadı.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Fallback demonstration FEN
      return res.status(200).json({
        fen: 'r1bqk2r/pppp1ppp/2n2n2/4p3/1bB1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 4 4',
        message: 'Görsel işlendi (Demo FEN aktarıldı).',
      });
    }

    const ai = new GoogleGenAI();
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `You are an expert Chess Vision engine.
Inspect this image of a chessboard very carefully. Identify the exact pieces on all 64 squares (from rank 8 down to rank 1, file a to h).
Return ONLY the standard FEN (Forsyth-Edwards Notation) string representing this position.
Format example: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
Do NOT wrap in markdown formatting or explanation. Output ONLY the raw FEN string.`,
            },
            {
              inlineData: {
                mimeType,
                data: cleanBase64,
              },
            },
          ],
        },
      ],
    });

    let rawFen = (response.text || '').trim();
    // Remove any markdown code blocks if model added them
    rawFen = rawFen.replace(/```[a-z]*\n?/gi, '').replace(/```/g, '').trim();

    return res.status(200).json({ fen: rawFen });
  } catch (error: any) {
    console.error('Error in /api/board-vision:', error);
    return res.status(500).json({
      error: 'Görsel analiz edilirken bir hata oluştu.',
    });
  }
});

// 3. AI Custom Puzzle Generator from Prompt
app.post('/api/generate-puzzle', async (req, res) => {
  try {
    const { userPrompt } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(200).json({
        title: 'Akıllı At Çatalı',
        category: 'Çatal',
        fen: 'r3k2r/ppp2ppp/2n5/3N4/8/8/PPPP1PPP/R1B1K2R w KQkq - 0 1',
        turn: 'w',
        bestMoveSan: 'Nc7+',
        bestMoveFrom: 'd5',
        bestMoveTo: 'c7',
        description: 'At şah ve kaleyi aynı anda tehdit ederek taş kazancı sağlar.',
        objective: 'Atı c7 karesine oynayarak şah ve kale çatalı at!',
      });
    }

    const ai = new GoogleGenAI();
    const prompt = `You are ChessForge Puzzle Architect.
Create a chess tactical puzzle based on this user request: "${userPrompt || 'Orta seviye kral saldırısı'}".
Generate a valid, legal chess position in JSON format with these exact keys:
- "title": Short catchy Turkish title (e.g. "Arka Yatay Baskısı", "Dahi Vezir Fedası")
- "category": Motive name in Turkish (e.g. "Çatal", "Açmaz", "Saptırma", "Mat Ağı", "Savunucuyu Kaldırma")
- "fen": Valid FEN position string with both kings present and correct turn
- "turn": "w" or "b"
- "bestMoveSan": SAN string (e.g. "Qxf7#", "Nf6+", "Rd8+")
- "bestMoveFrom": source square (e.g. "d1")
- "bestMoveTo": target square (e.g. "d8")
- "description": Turkish explanation of the puzzle tactic
- "objective": Turkish action objective for the player (e.g. "Rakip kaleyi açmaza al ve taşı kazan!")

Respond ONLY with valid JSON matching these fields.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.status(200).json(parsed);
  } catch (error: any) {
    console.error('Error in /api/generate-puzzle:', error);
    return res.status(200).json({
      title: 'Taktik Hücum',
      category: 'Saldırı',
      fen: '6k1/5ppp/8/8/8/5N2/5PPP/4Q1K1 w - - 0 1',
      turn: 'w',
      bestMoveSan: 'Qe8#',
      bestMoveFrom: 'e1',
      bestMoveTo: 'e8',
      description: 'Zayıf arka yataydan şah çekerek tek hamlede mat yap!',
      objective: 'Vezirle e8 karesinden son yatay matı yap.',
    });
  }
});

// Vite dev middleware or static files
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
