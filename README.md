# ♟️ ChessLab

<p align="center">
  <strong>Comprehensive AI Chess Training, Real-Time Engine Analysis & Academy Platform</strong><br>
  <em>Yapay Zeka Destekli Kapsamlı Satranç Gelişim, Canlı Analiz ve Akademi Platformu</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-6.x-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/TailwindCSS-4.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Google_Gemini-2.5_Flash-orange?style=for-the-badge&logo=google" alt="Google Gemini" />
</p>

---

## 🌐 Language Navigation / Dil Seçimi
- [English Documentation](#-english-documentation)
- [Türkçe Dokümantasyon](#-türkçe-dokümantasyon)

---

## 🇬🇧 English Documentation

**ChessLab** is an all-in-one web-based chess workstation engineered to bridge raw engine calculations with contextual pedagogical coaching. Powered by Google Gemini and real-time board evaluation engines, ChessLab provides instant blunder mitigation, structured tactical drills, sandbox piece positioning, and dynamic conversational feedback.

### 🌟 Core Interface & Key Modules

#### 1. Real-Time Dynamic Analysis & Evaluation Bar
* **Dynamic Centipawn Bar:** Smoothly reflects engine evaluations, advantage changes, and game swings in real time.
* **Top 1–3 Engine Move Suggestions:** Live tactical evaluation revealing the primary engine line and alternative continuations with directional arrows.
* **En Kötü Hamle Uyarısı (Blunder Prevention):** Red highlight warnings identifying potential immediate mistakes and hanging pieces before committing the move.
* **Color-Coded Tactical Arrows:** Visual cues categorizing best moves (green), candidate alternatives (blue), tactical traps (orange), and blunder warnings (red).

#### 2. Grandmaster Divo (Interactive AI Mascot Coach)
* **Contextual Speech Bubble:** Delivers instantaneous verbal explanations for user decisions, game states, and strategic milestones.
* **Psychological & Strategic Feedback:** Shifts between encouraging tips, stern positional cautions, and tactical puzzle hints.

#### 3. Custom ELO Engine Calibration
* **Dynamic Engine Ratings:** Test your strength against scalable engine levels from Beginner (200 ELO) up to Master/Super GM (2800 ELO).
* **Speed & Thinking Modes:** Configure instant vs. deep calculation search depths.

#### 4. Sandbox Board Laboratory (Serbest Dizilim)
* **Free Piece Placement:** Drag and drop pieces anywhere to reconstruct study positions, historic games, or book endgames.
* **Board Setup Tools:** Quick clear, standard board reset, and turn-to-move toggling for both White and Black.

#### 5. ChessLab Academy (Akademi)
Seven specialized training environments designed to systematically build chess mastery:
* **⭐ The Chosen Move (15 Points):** Guess master-level moves in legendary games and earn mastery points.
* **🧩 Fundamental Motifs (Çatal, Açmaz, Şiş):** 10 curated tactical categories covering pins, skewers, forks, discovered attacks, and deflection.
* **⚡ Opening Memory (Automated Variations):** Interactive opening drills validating deep opening book paths and flagging deviations.
* **👑 Endgame Trainer:** Deep mastery modules focusing on theoretical Rook, Pawn, and Minor Piece endgames against stubborn engine defenses.
* **⏱️ Rapid Pulse vs Clock:** Blitz decision training designed to build tactical intuition under extreme time constraints.
* **🪄 AI Coach On-Demand:** Freeform natural-language discussions analyzing tactical plans, weak squares, and pawn structures.
* **📷 Camera & Image Board Scanner:** Automatic OCR/vision board reconstruction converting real-life 2D/3D board photos into playable digital FEN positions.

### 🛠️ Tech Stack & Architecture

* **Frontend:** React, TypeScript, Vite
* **Styling & System Design:** Tailwind CSS with responsive dark/light tactical boards
* **AI Engine:** Google Gemini Flash/Pro models integrated via `@google/genai`
* **Audio & Feedback:** Low-latency responsive sound effects for moves, captures, checks, and blunder alerts
* **Deployment:** Vercel

### 🚀 Getting Started Locally

```bash
# 1. Clone repository
git clone [https://github.com/karakocanill/ChessLab.git](https://github.com/karakocanill/ChessLab.git)
cd ChessLab

# 2. Install dependencies
npm install --legacy-peer-deps

# 3. Environment configuration
cp .env.example .env
# Set your Gemini API key inside .env:
# VITE_GEMINI_API_KEY=your_key_here

# 4. Start local development server
npm run dev