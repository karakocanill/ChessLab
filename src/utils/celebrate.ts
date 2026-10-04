import confetti from 'canvas-confetti';

export function triggerConfetti() {
  // Joyful confetti explosion for great moves & victories
  confetti({
    particleCount: 75,
    spread: 70,
    origin: { y: 0.65 },
    colors: ['#34d399', '#38bdf8', '#fbbf24', '#f43f5e', '#a855f7'],
    disableForReducedMotion: true,
  });
}

export function triggerStarBurst(originX = 0.5, originY = 0.5) {
  // Golden star sparkle burst when a Best Move is found
  confetti({
    particleCount: 40,
    spread: 60,
    startVelocity: 25,
    origin: { x: originX, y: originY },
    shapes: ['star', 'circle'],
    colors: ['#fbbf24', '#f59e0b', '#10b981', '#38bdf8'],
    scalar: 1.2,
    ticks: 120,
    disableForReducedMotion: true,
  });
}
