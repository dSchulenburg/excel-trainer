import confetti from 'canvas-confetti';

export function fireConfetti() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#003366', '#00A3E0', '#B5E505', '#FFD700'],
  });
}

export function fireStarConfetti() {
  const end = Date.now() + 500;
  const frame = () => {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#FFD700', '#B5E505'],
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#FFD700', '#B5E505'],
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  };
  frame();
}
