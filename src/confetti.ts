import { $ } from './dom';
import { CONFETTI_COLORS } from './config';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  g: number;
  size: number;
  rot: number;
  vr: number;
  color: string;
  life: number;
  shape: 'rect' | 'circ';
}

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
let parts: Particle[] = [];
let fxRaf: number | null = null;

function sizeFx(): void {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}

/** Grab the canvas and keep it sized to the viewport. Call once at boot. */
export function initConfetti(): void {
  canvas = $<HTMLCanvasElement>('fx');
  ctx = canvas.getContext('2d')!;
  sizeFx();
  addEventListener('resize', sizeFx);
}

/** Burst `n` confetti particles from near the top-centre of the screen. */
export function confetti(n: number): void {
  for (let i = 0; i < n; i++) {
    parts.push({
      x: innerWidth / 2 + (Math.random() - 0.5) * 120,
      y: innerHeight * 0.32,
      vx: (Math.random() - 0.5) * 14,
      vy: Math.random() * -16 - 4,
      g: 0.42 + Math.random() * 0.2,
      size: 6 + Math.random() * 8,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.4,
      color: CONFETTI_COLORS[(Math.random() * CONFETTI_COLORS.length) | 0],
      life: 1,
      shape: Math.random() < 0.5 ? 'rect' : 'circ',
    });
  }
  if (!fxRaf) fxRaf = requestAnimationFrame(fxLoop);
}

function fxLoop(): void {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = parts.length - 1; i >= 0; i--) {
    const p = parts[i];
    p.vy += p.g;
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vr;
    p.vx *= 0.99;
    if (p.y > innerHeight * 0.55) p.life -= 0.012;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.globalAlpha = Math.max(0, p.life);
    ctx.fillStyle = p.color;
    if (p.shape === 'rect') ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
    else {
      ctx.beginPath();
      ctx.arc(0, 0, p.size / 2, 0, 7);
      ctx.fill();
    }
    ctx.restore();
    if (p.life <= 0 || p.y > canvas.height + 40) parts.splice(i, 1);
  }
  if (parts.length) {
    fxRaf = requestAnimationFrame(fxLoop);
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    fxRaf = null;
  }
}
