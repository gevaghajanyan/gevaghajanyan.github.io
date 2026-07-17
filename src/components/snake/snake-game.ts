type Dir    = 'U' | 'D' | 'L' | 'R';
type Screen = 'idle' | 'playing' | 'gameover';
interface Pt { x: number; y: number }
interface Particle {
  x: number; y: number; vx: number; vy: number;
  life: number; maxLife: number; color: string;
}

// Brand colors sourced from TechIcon component; dark originals lightened for canvas legibility
const TECHS = [
  { label: 'JS',   name: 'JavaScript',   color: '#F7DF1E', bg: '#1a1800' },
  { label: 'TS',   name: 'TypeScript',   color: '#4d9de0', bg: '#001428' },
  { label: 'RCT',  name: 'React',        color: '#61DAFB', bg: '#001a1f' },
  { label: 'RN',   name: 'React Native', color: '#61DAFB', bg: '#001520' },
  { label: 'NXT',  name: 'Next.js',      color: '#e8e8e8', bg: '#111111' },
  { label: 'EXPO', name: 'Expo',         color: '#bbbbbb', bg: '#111111' },
  { label: 'RDX',  name: 'Redux',        color: '#9d72e0', bg: '#150020' },
  { label: 'RXJ',  name: 'RxJS',         color: '#d940b0', bg: '#1a0015' },
  { label: 'HTM',  name: 'HTML5',        color: '#E34F26', bg: '#1a0800' },
  { label: 'CSS',  name: 'CSS3',         color: '#2e8ed4', bg: '#001122' },
  { label: 'SCS',  name: 'Sass',         color: '#CC6699', bg: '#1a0010' },
  { label: 'TWD',  name: 'Tailwind',     color: '#06B6D4', bg: '#001515' },
  { label: 'NOD',  name: 'Node.js',      color: '#5cb85c', bg: '#001400' },
  { label: 'GQL',  name: 'GraphQL',      color: '#E10098', bg: '#1a0010' },
  { label: 'WPK',  name: 'Webpack',      color: '#8DD6F9', bg: '#001a22' },
  { label: 'VIT',  name: 'Vite',         color: '#8b8eff', bg: '#0e0020' },
  { label: 'GIT',  name: 'Git',          color: '#F05032', bg: '#1a0800' },
  { label: 'GHB',  name: 'GitHub',       color: '#d0d0d0', bg: '#111111' },
  { label: 'GHA',  name: 'GH Actions',   color: '#2088FF', bg: '#001a33' },
  { label: 'MBX',  name: 'MobX',         color: '#FF7A00', bg: '#1a0a00' },
  { label: 'MGO',  name: 'MongoDB',      color: '#5dbd5d', bg: '#001500' },
  { label: 'DCK',  name: 'Docker',       color: '#2496ED', bg: '#001a2a' },
  { label: 'WSM',  name: 'WASM',         color: '#9b7ef8', bg: '#0a0020' },
] as const;

const HUD_H  = 72;
const BOT_H  = 28;
const OPP: Record<Dir, Dir> = { U: 'D', D: 'U', L: 'R', R: 'L' };

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export class SnakeGame {
  private W: number;
  private H: number;
  private running = false;
  private raf = 0;

  private CELL: number;
  private COLS: number;
  private ROWS: number;
  private gridX: number;
  private gridY = HUD_H;

  private snake: Pt[] = [];
  private dir: Dir    = 'R';
  private nextDir: Dir = 'R';

  private food: Pt = { x: 0, y: 0 };
  private foodQueue: number[] = [];
  private foodIdx = 0;
  private collected: number[] = [];

  private screen: Screen = 'idle';
  private lastMove = 0;
  private moveInterval = 175;

  private particles: Particle[] = [];

  constructor(
    private canvas: HTMLCanvasElement,
    private ctx: CanvasRenderingContext2D,
  ) {
    this.W = canvas.width  = window.innerWidth;
    this.H = canvas.height = window.innerHeight;

    this.CELL  = Math.max(16, Math.min(28, Math.floor(this.W / 50)));
    this.COLS  = Math.floor((this.W - 24) / this.CELL);
    this.ROWS  = Math.floor((this.H - HUD_H - BOT_H) / this.CELL);
    this.gridX = Math.floor((this.W - this.COLS * this.CELL) / 2);

    this.initGame();
  }

  // ── Setup ─────────────────────────────────────────────────────────────────

  private initGame() {
    const cx = Math.floor(this.COLS / 2);
    const cy = Math.floor(this.ROWS / 2);
    this.snake      = [{ x: cx, y: cy }, { x: cx - 1, y: cy }, { x: cx - 2, y: cy }];
    this.dir        = 'R';
    this.nextDir    = 'R';
    this.collected  = [];
    this.particles  = [];
    this.moveInterval = 175;
    this.lastMove   = 0;
    this.foodQueue  = shuffle(TECHS.map((_, i) => i));
    this.foodIdx    = 0;
    this.spawnFood();
  }

  private spawnFood() {
    const occupied = new Set(this.snake.map(p => `${p.x},${p.y}`));
    const empty: Pt[] = [];
    for (let x = 0; x < this.COLS; x++)
      for (let y = 0; y < this.ROWS; y++)
        if (!occupied.has(`${x},${y}`)) empty.push({ x, y });
    if (!empty.length) return;
    this.food = empty[Math.floor(Math.random() * empty.length)];
    if (this.foodIdx >= this.foodQueue.length) {
      this.foodQueue = shuffle(TECHS.map((_, i) => i));
      this.foodIdx   = 0;
    }
  }

  // ── Logic ─────────────────────────────────────────────────────────────────

  private moveSnake() {
    this.dir = this.nextDir;
    const { x, y } = this.snake[0];
    const dx = this.dir === 'L' ? -1 : this.dir === 'R' ? 1 : 0;
    const dy = this.dir === 'U' ? -1 : this.dir === 'D' ? 1 : 0;
    const nx = x + dx, ny = y + dy;

    if (nx < 0 || nx >= this.COLS || ny < 0 || ny >= this.ROWS) {
      this.screen = 'gameover'; return;
    }
    if (this.snake.slice(0, -1).some(p => p.x === nx && p.y === ny)) {
      this.screen = 'gameover'; return;
    }

    this.snake.unshift({ x: nx, y: ny });

    if (nx === this.food.x && ny === this.food.y) {
      const idx = this.foodQueue[this.foodIdx];
      this.collected.push(idx);
      this.foodIdx++;
      this.moveInterval = Math.max(78, 175 - this.collected.length * 4);
      this.spawnHitParticles(
        this.gridX + nx * this.CELL + this.CELL / 2,
        this.gridY + ny * this.CELL + this.CELL / 2,
        TECHS[idx].color,
      );
      this.spawnFood();
    } else {
      this.snake.pop();
    }
  }

  private spawnHitParticles(px: number, py: number, color: string) {
    for (let i = 0; i < 14; i++) {
      const angle = (Math.PI * 2 * i / 14) + Math.random() * 0.3;
      const speed = Math.random() * 3.5 + 0.8;
      const life  = 22 + Math.floor(Math.random() * 16);
      this.particles.push({ x: px, y: py, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life, maxLife: life, color });
    }
  }

  private update(now: number) {
    if (this.screen !== 'playing') return;
    if (now - this.lastMove >= this.moveInterval) {
      this.moveSnake();
      this.lastMove = now;
    }
    for (const p of this.particles) { p.x += p.vx; p.y += p.vy; p.vy += 0.1; p.life--; }
    this.particles = this.particles.filter(p => p.life > 0);
  }

  // ── Render ────────────────────────────────────────────────────────────────

  private render(now: number) {
    const { ctx, W, H } = this;
    ctx.fillStyle = '#060a0f';
    ctx.fillRect(0, 0, W, H);

    this.drawGrid();
    this.drawFood(now);
    this.drawSnake();
    this.drawParticles();
    this.drawHUD();

    if (this.screen === 'idle')     this.drawIdle();
    if (this.screen === 'gameover') this.drawGameOver();
  }

  private drawGrid() {
    const { ctx, gridX, gridY, CELL, COLS, ROWS } = this;
    ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    ctx.lineWidth   = 0.5;
    for (let c = 0; c <= COLS; c++) {
      ctx.beginPath();
      ctx.moveTo(gridX + c * CELL, gridY);
      ctx.lineTo(gridX + c * CELL, gridY + ROWS * CELL);
      ctx.stroke();
    }
    for (let r = 0; r <= ROWS; r++) {
      ctx.beginPath();
      ctx.moveTo(gridX,            gridY + r * CELL);
      ctx.lineTo(gridX + COLS * CELL, gridY + r * CELL);
      ctx.stroke();
    }
  }

  private drawFood(now: number) {
    const { ctx, gridX, gridY, CELL, food, foodQueue, foodIdx } = this;
    const tech  = TECHS[foodQueue[foodIdx] ?? 0];
    const x     = gridX + food.x * CELL;
    const y     = gridY + food.y * CELL;
    const pad   = 2;
    const pulse = Math.sin(now / 420) * 0.4 + 0.6;

    ctx.fillStyle = tech.bg;
    this.rr(x + pad, y + pad, CELL - pad * 2, CELL - pad * 2, 3);
    ctx.fill();

    ctx.globalAlpha = 0.65 + 0.35 * pulse;
    ctx.shadowBlur  = 7 * pulse;
    ctx.shadowColor = tech.color;
    ctx.strokeStyle = tech.color;
    ctx.lineWidth   = 1.5;
    this.rr(x + pad, y + pad, CELL - pad * 2, CELL - pad * 2, 3);
    ctx.stroke();
    ctx.shadowBlur  = 0;
    ctx.globalAlpha = 1;

    const fs = Math.max(6, Math.floor(CELL / 3.8));
    ctx.fillStyle    = tech.color;
    ctx.font         = `bold ${fs}px monospace`;
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(tech.label, x + CELL / 2, y + CELL / 2);
    ctx.textBaseline = 'alphabetic';
  }

  private drawSnake() {
    const { ctx, snake, gridX, gridY, CELL } = this;
    const len = snake.length;
    snake.forEach((seg, i) => {
      const x   = gridX + seg.x * CELL;
      const y   = gridY + seg.y * CELL;
      const pad = i === 0 ? 1 : 2;
      const t   = i / Math.max(1, len - 1);
      ctx.globalAlpha = 1 - t * 0.55;
      ctx.shadowBlur  = i === 0 ? 10 : 0;
      ctx.shadowColor = '#39d353';
      ctx.fillStyle   = i === 0 ? '#80ff96' : '#39d353';
      this.rr(x + pad, y + pad, CELL - pad * 2, CELL - pad * 2, i === 0 ? 5 : 3);
      ctx.fill();
      ctx.shadowBlur = 0;
    });
    ctx.globalAlpha = 1;
  }

  private drawParticles() {
    const { ctx } = this;
    for (const p of this.particles) {
      ctx.globalAlpha = p.life / p.maxLife;
      ctx.fillStyle   = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  private drawHUD() {
    const { ctx, W, H, collected, gridX } = this;

    // Title + speed
    ctx.fillStyle  = '#39d353';
    ctx.font       = 'bold 13px monospace';
    ctx.textAlign  = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText('SNAKE', gridX, 20);

    const speed = Math.round(1000 / this.moveInterval * 10) / 10;
    ctx.fillStyle  = 'rgba(57,211,83,0.4)';
    ctx.font       = '11px monospace';
    ctx.textAlign  = 'right';
    ctx.fillText(`${speed}×`, W - gridX, 20);

    // Collected badge strip
    const BADGE_W = 34, BADGE_H = 17, GAP = 3;
    const maxVisible = Math.floor((W - gridX * 2 + GAP) / (BADGE_W + GAP));
    const shown = Math.min(collected.length, maxVisible);
    const overflow = collected.length - shown;
    let bx = gridX;
    const by = 38;

    for (let i = 0; i < shown; i++) {
      const tech = TECHS[collected[i]];
      ctx.fillStyle = tech.bg;
      this.rr(bx, by, BADGE_W, BADGE_H, 3);
      ctx.fill();
      ctx.strokeStyle = tech.color;
      ctx.lineWidth   = 1;
      this.rr(bx, by, BADGE_W, BADGE_H, 3);
      ctx.stroke();
      ctx.fillStyle    = tech.color;
      ctx.font         = `bold ${Math.max(6, 7)}px monospace`;
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(tech.label, bx + BADGE_W / 2, by + BADGE_H / 2);
      ctx.textBaseline = 'alphabetic';
      bx += BADGE_W + GAP;
    }

    if (overflow > 0) {
      ctx.fillStyle  = 'rgba(255,255,255,0.3)';
      ctx.font       = '10px monospace';
      ctx.textAlign  = 'left';
      ctx.fillText(`+${overflow}`, bx + 2, by + BADGE_H - 4);
    }

    // Collected count
    ctx.fillStyle  = 'rgba(255,255,255,0.28)';
    ctx.font       = '10px monospace';
    ctx.textAlign  = 'right';
    ctx.fillText(`${collected.length} / ${TECHS.length} techs`, W - gridX, 58);

    // Bottom hint
    ctx.fillStyle  = 'rgba(255,255,255,0.13)';
    ctx.font       = '11px monospace';
    ctx.textAlign  = 'center';
    ctx.fillText('↑ ↓ ← →  or  W A S D   ·   ESC  CLOSE', W / 2, H - 8);
  }

  private drawIdle() {
    const { ctx, W, H } = this;
    ctx.fillStyle = 'rgba(6,10,15,0.78)';
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle    = '#39d353';
    ctx.font         = `bold ${W < 600 ? 34 : 46}px "Plus Jakarta Sans", sans-serif`;
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText('SNAKE', W / 2, H / 2 - 20);

    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font      = `${W < 600 ? 12 : 14}px monospace`;
    ctx.fillText('Collect your full tech stack', W / 2, H / 2 + 16);

    ctx.fillStyle = 'rgba(255,255,255,0.22)';
    ctx.font      = '12px monospace';
    ctx.fillText('↑ ↓ ← →  or  W A S D  to start', W / 2, H / 2 + 42);
  }

  private drawGameOver() {
    const { ctx, W, H, collected } = this;
    ctx.fillStyle = 'rgba(6,10,15,0.9)';
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle    = '#ff6b6b';
    ctx.font         = `bold ${W < 600 ? 28 : 40}px "Plus Jakarta Sans", sans-serif`;
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText('GAME OVER', W / 2, H / 2 - 44);

    ctx.fillStyle = '#39d353';
    ctx.font      = `bold ${W < 600 ? 20 : 28}px monospace`;
    ctx.fillText(
      `${collected.length} / ${TECHS.length} tech${collected.length !== 1 ? 's' : ''} collected`,
      W / 2, H / 2 + 4,
    );

    if (collected.length > 0) {
      const names = collected.map(i => TECHS[i].label).join('  ');
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.font      = `${W < 600 ? 9 : 11}px monospace`;
      ctx.fillText(names, W / 2, H / 2 + 30);
    }

    ctx.fillStyle = 'rgba(255,255,255,0.32)';
    ctx.font      = '13px monospace';
    ctx.fillText('[R]  PLAY AGAIN   ·   ESC  CLOSE', W / 2, H / 2 + 62);
  }

  // ── Utils ─────────────────────────────────────────────────────────────────

  private rr(x: number, y: number, w: number, h: number, r = 4) {
    const { ctx } = this;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  // ── Lifecycle ─────────────────────────────────────────────────────────────

  start(onClose: () => void): () => void {
    this.running = true;

    const DIRS: Partial<Record<string, Dir>> = {
      ArrowUp: 'U', KeyW: 'U',
      ArrowDown: 'D', KeyS: 'D',
      ArrowLeft: 'L', KeyA: 'L',
      ArrowRight: 'R', KeyD: 'R',
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.type !== 'keydown') return;
      if (e.code === 'Escape') { onClose(); return; }
      if (e.code === 'KeyR' && this.screen === 'gameover') {
        this.initGame();
        this.screen = 'playing';
        this.lastMove = performance.now();
        return;
      }
      const d = DIRS[e.code];
      if (d) {
        e.preventDefault();
        if (d !== OPP[this.dir]) this.nextDir = d;
        if (this.screen === 'idle') {
          this.screen   = 'playing';
          this.lastMove = performance.now();
        }
      }
    };

    window.addEventListener('keydown', onKey);

    const loop = (now: number) => {
      if (!this.running) return;
      this.update(now);
      this.render(now);
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);

    return () => {
      this.running = false;
      cancelAnimationFrame(this.raf);
      window.removeEventListener('keydown', onKey);
    };
  }
}
