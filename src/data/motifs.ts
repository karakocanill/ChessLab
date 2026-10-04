export interface MotifPuzzle {
  id: string;
  motif: string; // e.g. 'Çatal', 'Açmaz', 'Ara Hamle (Zwischenzug)'
  title: string;
  fen: string;
  turn: 'w' | 'b';
  bestMoveSan: string;
  bestMoveFrom: string;
  bestMoveTo: string;
  description: string;
  explanation: string;
}

export const TACTICAL_MOTIFS: Record<string, { nameTr: string; icon: string; description: string; puzzles: MotifPuzzle[] }> = {
  fork: {
    nameTr: 'Çatal (Fork)',
    icon: '⚡',
    description: 'Bir taşın aynı anda iki veya daha fazla rakip taşı tehdit etmesi.',
    puzzles: [
      {
        id: 'fork-1',
        motif: 'Çatal',
        title: 'Ölümcül At Çatalı',
        fen: 'r3k3/pppq1ppp/8/3N4/8/8/PPPP1PPP/R1B1K2R w KQq - 0 1',
        turn: 'w',
        bestMoveSan: 'Nc7+',
        bestMoveFrom: 'd5',
        bestMoveTo: 'c7',
        description: 'At şah ve kaleyi aynı anda çatalayarak bedava kale kazanır.',
        explanation: 'At c7 karesine zıplayarak şaha saldırır; şah kaçınca a8 kalesini alırız!',
      },
      {
        id: 'fork-2',
        motif: 'Çatal',
        title: 'Piyon Çatalı',
        fen: 'r1b1k2r/pp1p1ppp/2n2n2/4p3/1b2P3/2N5/PPPB1PPP/R2QKB1R w KQkq - 0 1',
        turn: 'w',
        bestMoveSan: 'Nd5',
        bestMoveFrom: 'c3',
        bestMoveTo: 'd5',
        description: 'Merkezi ata baskı ve taş kazanımı.',
        explanation: 'Merkezi ele geçirerek rakibin filini ve atını aynı anda hedef alıyoruz.',
      },
    ],
  },
  pin: {
    nameTr: 'Açmaz (Pin)',
    icon: '🎯',
    description: 'Arkada daha değerli bir taş olduğu için hareket edemeyen taş taktiği.',
    puzzles: [
      {
        id: 'pin-1',
        motif: 'Açmaz',
        title: 'Mutlak Açmaz',
        fen: '4k3/4r3/8/8/8/8/4R3/4K3 w - - 0 1',
        turn: 'w',
        bestMoveSan: 'Rxe7+',
        bestMoveFrom: 'e2',
        bestMoveTo: 'e7',
        description: 'Rakip kale şahın önünde açmazda olduğu için kaçamaz.',
        explanation: 'Açmazdaki kaleyi doğrudan alarak oyunu kazanıyoruz.',
      },
      {
        id: 'pin-2',
        motif: 'Açmaz',
        title: 'Vezire Açmaz',
        fen: 'r1b1k2r/pppp1ppp/5q2/4n3/1b2P3/2N5/PPP2PPP/R1BQKB1R w KQkq - 0 1',
        turn: 'w',
        bestMoveSan: 'Bd2',
        bestMoveFrom: 'c1',
        bestMoveTo: 'd2',
        description: 'Açmazı kırıp taşları serbest bırakma.',
        explanation: 'Kendi taşımızın açmazını kırıp karşı taktiğe geçiyoruz.',
      },
    ],
  },
  skewer: {
    nameTr: 'Şiş (Skewer)',
    icon: '🍢',
    description: 'Öndeki değerli taş kaçmak zorunda kalır ve arkasındaki taş düşer.',
    puzzles: [
      {
        id: 'skewer-1',
        motif: 'Şiş',
        title: 'Şah-Kale Şişi',
        fen: '8/8/8/8/3k4/8/R7/1K5r w - - 0 1',
        turn: 'w',
        bestMoveSan: 'Ra4+',
        bestMoveFrom: 'a2',
        bestMoveTo: 'a4',
        description: 'Şah kaçmak zorunda kalır, arkadaki taş düşer.',
        explanation: 'Şaha yataydan veya dikeyden saldırıp arkasındaki taşı hedef alıyoruz.',
      },
    ],
  },
  zwischenzug: {
    nameTr: 'Ara Hamle (Zwischenzug)',
    icon: '⏱️',
    description: 'Beklenen hamleden önce araya sıkıştırılan şah çekişi veya tehdit.',
    puzzles: [
      {
        id: 'zwischenzug-1',
        motif: 'Ara Hamle',
        title: 'Ölümcül Ara Şah',
        fen: 'r2q1rk1/pb3ppp/1pnbpn2/3p4/3P4/1PN1PN2/PB2BPPP/R2Q1RK1 w - - 0 1',
        turn: 'w',
        bestMoveSan: 'Nb5',
        bestMoveFrom: 'c3',
        bestMoveTo: 'b5',
        description: 'Doğrudan taş değişmek yerine önce fili tehdit eden ara hamle.',
        explanation: 'Rakibin temposunu bozan ara hamle rakibi şaşırtır!',
      },
    ],
  },
  backrank: {
    nameTr: 'Arka Yatay (Back Rank)',
    icon: '🏰',
    description: 'Kendi piyonlarının arkasında sıkışan şaha son yataydan vurulan darbe.',
    puzzles: [
      {
        id: 'backrank-1',
        motif: 'Arka Yatay',
        title: 'Koridorda Mat',
        fen: '6k1/5ppp/8/8/8/5N2/5PPP/4Q1K1 w - - 0 1',
        turn: 'w',
        bestMoveSan: 'Qe8#',
        bestMoveFrom: 'e1',
        bestMoveTo: 'e8',
        description: 'Vezir son yataya inerek tek hamlede mat yapar.',
        explanation: 'Şahın hava deliği (luft) olmadığı için kaçacak hiçbir yeri yok!',
      },
    ],
  },
  deflection: {
    nameTr: 'Saptırma (Deflection)',
    icon: '🧲',
    description: 'Kritik bir kareyi veya taşı koruyan savunucuyu zorla oradan uzaklaştırmak.',
    puzzles: [
      {
        id: 'deflection-1',
        motif: 'Saptırma',
        title: 'Veziri Saptırma',
        fen: '2r3k1/5ppp/8/3Q4/8/8/5PPP/2R3K1 w - - 0 1',
        turn: 'w',
        bestMoveSan: 'Rxc8#',
        bestMoveFrom: 'c1',
        bestMoveTo: 'c8',
        description: 'Son yatayı savunan taşı saptırarak doğrudan mat yap.',
        explanation: 'Rakip kaleyi ortadan kaldırıp arkadaki şahı mat ediyoruz.',
      },
    ],
  },
  matingnet: {
    nameTr: 'Mat Ağı (Mating Net)',
    icon: '🕸️',
    description: 'Şahın etrafındaki tüm kaçış karelerini adım adım kilitleyen ağ.',
    puzzles: [
      {
        id: 'matingnet-1',
        motif: 'Mat Ağı',
        title: 'Ölümcül Kafes',
        fen: '5rk1/5ppp/8/8/8/8/1Q4PP/6K1 w - - 0 1',
        turn: 'w',
        bestMoveSan: 'Qb8',
        bestMoveFrom: 'b2',
        bestMoveTo: 'b8',
        description: 'Vezir son yatayı bağlar ve mat tehdidi kurar.',
        explanation: 'Kaçış yollarını kapatan hamle zaferi getirir.',
      },
    ],
  },
  zugzwang: {
    nameTr: 'Zugzwang',
    icon: '⛓️',
    description: 'Sırası gelen tarafın her yapacağı hamlenin pozisyonunu daha da kötüleştirmesi.',
    puzzles: [
      {
        id: 'zugzwang-1',
        motif: 'Zugzwang',
        title: 'Kımıldayan Kaybeder!',
        fen: '8/8/8/4k3/4P3/4K3/8/8 w - - 0 1',
        turn: 'w',
        bestMoveSan: 'Kd3',
        bestMoveFrom: 'e3',
        bestMoveTo: 'd3',
        description: 'Şahı doğru kareye koyarak rakip şahı geri adım atmaya zorla.',
        explanation: 'Siyah şah piyonun önünü açmak zorunda kalır ve piyonumuz vezire koşar!',
      },
    ],
  },
};

// Guess the Move Positions
export interface GuessTheMoveChallenge {
  id: string;
  gameTitle: string; // e.g. "Kasparov vs Topalov (1999)"
  fen: string;
  turn: 'w' | 'b';
  questionTr: string;
  options: Array<{
    san: string;
    from: string;
    to: string;
    isCorrect: boolean;
    explanation: string;
  }>;
}

export const GUESS_THE_MOVE_CHALLENGES: GuessTheMoveChallenge[] = [
  {
    id: 'gtm-1',
    gameTitle: 'Garry Kasparov vs Veselin Topalov (Wijk aan Zee 1999)',
    fen: 'b2r1r1k/p1q1b1pp/5p2/2p1n3/2P1N3/1P2B1P1/P1Q2P1P/3RR1K1 w - - 0 24',
    turn: 'w',
    questionTr: 'Kasparov bu efsanevi pozisyonda tarihin en ünlü hamlelerinden birini oynadı. Sence hangisiydi?',
    options: [
      {
        san: 'Rxd8',
        from: 'd1',
        to: 'd8',
        isCorrect: false,
        explanation: 'Standart kale değişimi ancak Kasparov çok daha cesur ve efsanevi bir kombinezon buldu!',
      },
      {
        san: 'Rxd8',
        from: 'd1',
        to: 'd8',
        isCorrect: false,
        explanation: 'Pasif bir devam yolu.',
      },
      {
        san: 'Bf4',
        from: 'e3',
        to: 'f4',
        isCorrect: true,
        explanation: 'Tebrikler! Kasparov e5 atına baskı kurarak rakip savunmayı kilitledi ve kombinezonu başlattı! ⭐',
      },
    ],
  },
  {
    id: 'gtm-2',
    gameTitle: 'Paul Morphy vs Dük Karl (Opera Oyunu 1858)',
    fen: '4kb1r/p2rqppp/5n2/1B2p1B1/4P3/1Q6/PPP2PPP/2KR4 w k - 0 14',
    turn: 'w',
    questionTr: 'Morphy d7 karesindeki açmazda olan kaleye karşı son darbeyi nasıl indirdi?',
    options: [
      {
        san: 'Rxd7',
        from: 'd1',
        to: 'd7',
        isCorrect: true,
        explanation: 'Mükemmel! Morphy kaleyi feda ederek rakip savunmayı tamamen çökertti ve mat ağı kurdu! 🏆',
      },
      {
        san: 'Qd3',
        from: 'b3',
        to: 'd3',
        isCorrect: false,
        explanation: 'İyi bir hamle ancak Morphy doğrudan feda ile zaferi getiren hamleyi tercih etti.',
      },
      {
        san: 'Bxf6',
        from: 'g5',
        to: 'f6',
        isCorrect: false,
        explanation: 'Bu hamle siyahın vezirini oyuna sokmasına izin verir.',
      },
    ],
  },
  {
    id: 'gtm-3',
    gameTitle: 'Mikhail Tal vs Mikhail Botvinnik (Dünya Şampiyonluğu 1960)',
    fen: 'r1bqk2r/pp1nbppp/2n1p3/3pP3/3P4/2NB1N2/PP3PPP/R1BQK2R w KQkq - 0 10',
    turn: 'w',
    questionTr: 'Sihirbaz Tal, f7 ve h7 zayıflıklarına karşı hangi agresif hamleyi başlattı?',
    options: [
      {
        san: 'O-O',
        from: 'e1',
        to: 'g1',
        isCorrect: false,
        explanation: 'Çok güvenli bir hamle ancak Tal şah kanadında fırtına koparmak istiyordu.',
      },
      {
        san: 'h4',
        from: 'h2',
        to: 'h4',
        isCorrect: true,
        explanation: 'Harika sezgi! Tal h4 sürüşüyle şah kanadı hücumunu başlattı ve rakibi savunmaya hapsetti! 🔥',
      },
      {
        san: 'a3',
        from: 'a2',
        to: 'a3',
        isCorrect: false,
        explanation: 'Gereksiz yavaş bir hamle.',
      },
    ],
  },
];

// Opening Drills (10x Repetition & Muscle Memory)
export interface OpeningDrill {
  id: string;
  name: string;
  category: string;
  description: string;
  steps: Array<{
    moveSan: string;
    from: string;
    to: string;
    botReplySan?: string;
    botFrom?: string;
    botTo?: string;
    tip: string;
  }>;
}

export const OPENING_DRILLS: OpeningDrill[] = [
  {
    id: 'drill-italian',
    name: 'İtalyan Açılışı (Giuoco Piano)',
    category: 'Açık Oyunlar',
    description: '10 tekrar ile f7 piyonunu ve merkezi hedefleyen kusursuz açılış kas hafızası!',
    steps: [
      {
        moveSan: 'e4',
        from: 'e2',
        to: 'e4',
        botReplySan: 'e5',
        botFrom: 'e7',
        botTo: 'e5',
        tip: 'Merkeze piyon sürerek filin ve vezirin yolunu aç.',
      },
      {
        moveSan: 'Nf3',
        from: 'g1',
        to: 'f3',
        botReplySan: 'Nc6',
        botFrom: 'b8',
        botTo: 'c6',
        tip: 'Atı geliştirip rakibin e5 piyonunu tehdit et.',
      },
      {
        moveSan: 'Bc4',
        from: 'f1',
        to: 'c4',
        botReplySan: 'Bc5',
        botFrom: 'f8',
        botTo: 'c5',
        tip: 'Fili c4 karesine koyarak f7 zayıf karesine nişan al!',
      },
      {
        moveSan: 'O-O',
        from: 'e1',
        to: 'g1',
        tip: 'Şahını rok atarak kaleye sakla ve kalemizi merkeze getir.',
      },
    ],
  },
  {
    id: 'drill-scholars-defense',
    name: 'Çoban Matı Savunması',
    category: 'Tuzak Savunması',
    description: 'Yeni başlayanların korkulu rüyası Çoban Matı tuzağını tek hamlede çürütmeyi ezberle!',
    steps: [
      {
        moveSan: 'e5',
        from: 'e7',
        to: 'e5',
        botReplySan: 'Qh5',
        botFrom: 'd1',
        botTo: 'h5',
        tip: 'Merkezi tut. Beyaz vezir erkenden f7 piyonuna saldırıyor!',
      },
      {
        moveSan: 'Nc6',
        from: 'b8',
        to: 'c6',
        botReplySan: 'Bc4',
        botFrom: 'f1',
        botTo: 'c4',
        tip: 'Atı çıkarak e5 piyonunu koru. Beyaz şimdi filini de f7 karesine nişan aldı.',
      },
      {
        moveSan: 'g6',
        from: 'g7',
        to: 'g6',
        botReplySan: 'Qf3',
        botFrom: 'h5',
        botTo: 'f3',
        tip: 'g6 sürerek vezirin f7 ile olan bağlantısını kes ve veziri kov!',
      },
      {
        moveSan: 'Nf6',
        from: 'g8',
        to: 'f6',
        tip: 'Atı f6 karesine zıplatıp vezirin yeni mat tehdidini tamamen kilitle! 🛡️',
      },
    ],
  },
];

// Endgame Trainer Positions
export interface EndgameScenario {
  id: string;
  title: string;
  category: 'Şah + Piyon' | 'Kale Sonları' | 'Vezir Sonları';
  fen: string;
  turn: 'w' | 'b';
  winningPlan: string;
  keyRule: string;
}

export const ENDGAME_SCENARIOS: EndgameScenario[] = [
  {
    id: 'endgame-opposition',
    title: 'Şah + Piyon Muhalefeti (Opposition)',
    category: 'Şah + Piyon',
    fen: '8/8/8/4k3/4P3/8/4K3/8 w - - 0 1',
    turn: 'w',
    winningPlan: 'Kendi şahını piyonun önüne koy! Rakip şahın tam karşısına (muhalefet) geçerek rakip şahı yana adım atmaya zorla, piyonun önünü aç.',
    keyRule: 'Piyon şahın arkasında yürümeli, şah yolu açmalıdır.',
  },
  {
    id: 'endgame-lucena',
    title: 'Lucena Pozisyonu (Köprü Kurma)',
    category: 'Kale Sonları',
    fen: '1K1k4/1P6/8/8/8/8/7r/5R2 w - - 0 1',
    turn: 'w',
    winningPlan: 'Kaleyi 4. yataya (Rf4) koy. Sonra şahını dışarı çıkar. Rakip şah çektikçe kaleni araya koyarak "köprü kur" ve piyonu vezir yap!',
    keyRule: 'Kale oyun sonlarının altın anahtarı: 4. yatayda köprü kurmaktır.',
  },
  {
    id: 'endgame-queen-vs-pawn',
    title: 'Vezir vs 7. Yataydaki Piyon',
    category: 'Vezir Sonları',
    fen: '8/4P1k1/8/8/8/8/8/3QK3 w - - 0 1',
    turn: 'w',
    winningPlan: 'Vezirle şah çekerek rakip şahı kendi piyonunun önüne hapset, bu sırada kendi şahını yaklaştırıp mat et.',
    keyRule: 'Rakip şah kendi piyonunu bloke edince senin şahın yaklaşır.',
  },
];
