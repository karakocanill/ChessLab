import { EloPreset } from '../types/chess';

export const ELO_PRESETS: EloPreset[] = [
  {
    elo: 250,
    title: 'Acemi Civciv',
    character: '🐣',
    avatar: 'bg-amber-400',
    description: 'Satranca yeni başlayan sevimli civciv. Basit hamleler yapar, bazen taş bırakır.',
    depth: 1,
  },
  {
    elo: 600,
    title: 'Meraklı Tilki',
    character: '🦊',
    avatar: 'bg-orange-500',
    description: 'Taktik peşinde koşan kurnaz tilki. Çatal ve açmazları denemeyi sever.',
    depth: 2,
  },
  {
    elo: 1000,
    title: 'Kulüp Baykuşu',
    character: '🦉',
    avatar: 'bg-emerald-600',
    description: 'Düzenli kulüp oyuncusu. Taş gelişimine ve merkez kontrolüne dikkat eder.',
    depth: 3,
  },
  {
    elo: 1500,
    title: 'Taktisyen Aslan',
    character: '🦁',
    avatar: 'bg-indigo-600',
    description: 'Keskin hücum ustası. Feda ve kombinezonları affetmez.',
    depth: 4,
  },
  {
    elo: 2000,
    title: 'Usta Büyücü',
    character: '🧙',
    avatar: 'bg-purple-600',
    description: 'Uluslararası usta seviyesi. Çok hamle sonrasını ve oyun sonlarını hesaplar.',
    depth: 5,
  },
  {
    elo: 2800,
    title: 'Büyükusta Dino (Max)',
    character: '🦖',
    avatar: 'bg-rose-600',
    description: 'Stockfish motorunun zirve gücü! Dünya şampiyonu seviyesinde kusursuz analiz.',
    depth: 6,
  },
];
