import { Player } from './player';
import { Bullet } from './bullet';
import { Enemy } from './enemy';
import { Particle } from './particle';
import { Star } from './star';
import { ContribDay, EXPLOSION_COLORS, BLAST_THRESHOLDS } from './constants';

interface YearBand {
  year: number;
  startY: number;
}

export class Game {
  private W: number;
  private H: number;
  private running = false;
  private raf = 0;
  private yearBands: YearBand[] = [];
  private prevBlastLevel = 0;
  private levelUpTimer = 0;
  private isMobile = false;

  player: Player;
  bullets: Bullet[] = [];
  enemies: Enemy[] = [];
  particles: Particle[] = [];
  stars: Star[] = [];
  keys: Record<string, boolean> = {};

  score = 0;
  totalContribs = 0;
  cellSize = 11;
  won = false;
  loaded = false;

  constructor(
    private canvas: HTMLCanvasElement,
    private ctx: CanvasRenderingContext2D,
  ) {
    this.W = canvas.width = window.innerWidth;
    this.H = canvas.height = window.innerHeight;
    this.player = new Player(this.W / 2, this.H - 70);
    this.stars = Array.from({ length: 90 }, () => Star.spawn(this.W, this.H));
  }

  // ── Data ───────────────────────────────────────────────────────────────────

  buildGrid(yearData: Array<{ year: number; days: ContribDay[] }>) {
    // Clamp stride so 52 weeks always fit within screen with 48px padding each side
    const stride  = Math.max(5, Math.min(13, Math.floor((this.W - 96) / 53)));
    const yearGap = stride * 2;
    this.cellSize = stride - 2;
    this.enemies = [];
    this.yearBands = [];
    this.totalContribs = 0;

    yearData.forEach(({ year, days }, bandIdx) => {
      const weeks: ContribDay[][] = [];
      let week: ContribDay[] = [];

      for (const d of days) {
        if (new Date(d.date).getDay() === 0 && week.length) {
          weeks.push(week);
          week = [];
        }
        week.push(d);
      }
      if (week.length) weeks.push(week);

      const startX = (this.W - weeks.length * stride) / 2;
      const startY = 90 + bandIdx * (7 * stride + yearGap);
      this.yearBands.push({ year, startY });
      this.totalContribs += days.reduce((s, d) => s + d.count, 0);

      weeks.forEach((wk, col) =>
        wk.forEach((day, row) => {
          if (day.level === 0) return;
          this.enemies.push(new Enemy(
            startX + col * stride + stride / 2,
            startY + row * stride + stride / 2,
            col, row,
            day.count, day.level,
            day.level, day.level,
            day.date,
          ));
        }),
      );
    });

    this.loaded = true;
  }

  private mockYear(year: number): ContribDay[] {
    const result: ContribDay[] = [];
    const cur = new Date(year, 0, 1);
    const end = new Date(year, 11, 31);
    while (cur <= end) {
      const cnt = Math.random() < 0.38 ? 0 : Math.floor(Math.random() * 12) + 1;
      result.push({
        date: cur.toISOString().slice(0, 10),
        count: cnt,
        level: cnt ? Math.min(4, Math.ceil(cnt / 3)) : 0,
      });
      cur.setDate(cur.getDate() + 1);
    }
    return result;
  }

  async loadContributions() {
    const now = new Date().getFullYear();
    const years = [now - 2, now - 1, now];

    try {
      const results = await Promise.all(
        years.map(y =>
          fetch(`https://github-contributions-api.jogruber.de/v4/gevaghajanyan?y=${y}`)
            .then(r => r.json())
            .then(d => ({ year: y, days: d.contributions as ContribDay[] })),
        ),
      );
      this.buildGrid(results);
    } catch {
      this.buildGrid(years.map(y => ({ year: y, days: this.mockYear(y) })));
    }
  }

  // ── Effects ────────────────────────────────────────────────────────────────

  private explode(x: number, y: number, level: number) {
    const n = 10 + level * 4;
    for (let i = 0; i < n; i++) {
      const angle = (Math.PI * 2 * i / n) + Math.random() * 0.5;
      const speed = Math.random() * 3.5 + 0.8;
      const life = 38 + Math.random() * 22;
      this.particles.push(new Particle(
        x, y,
        Math.cos(angle) * speed,
        Math.sin(angle) * speed,
        life, life,
        EXPLOSION_COLORS[Math.floor(Math.random() * EXPLOSION_COLORS.length)],
      ));
    }
  }

  // ── Loop ──────────────────────────────────────────────────────────────────

  /** 0-based level derived from exponential thresholds: 1000 → lvl1, 2500 → lvl2, 5000 → lvl3, 10000 → lvl4 */
  private get blastLevel() {
    let level = 0;
    for (let i = BLAST_THRESHOLDS.length - 1; i >= 0; i--) {
      if (this.score >= BLAST_THRESHOLDS[i]) {
        level = i;
        break;
      }
    }
    return level;
  }

  private update() {
    this.stars.forEach(s => s.update(this.W, this.H));
    this.player.update(this.keys, this.W);

    const newBullets = this.player.tryShoot(this.keys, 1 + this.blastLevel * 2, this.cellSize + 2);
    this.bullets.push(...newBullets);

    this.bullets.forEach(b => b.update());

    const xHalf = this.cellSize / 2 + 2;
    const yHalf = Bullet.SPEED / 2 + this.cellSize / 2; // covers full travel distance per frame
    for (const b of this.bullets) {
      for (const e of this.enemies) {
        if (!e.alive || !b.hits(e, xHalf, yHalf)) continue;
        if (e.hit()) {
          this.score += e.count;
          this.explode(e.x, e.y, e.level);
        }
        b.y = -9999;
        break;
      }
    }

    this.bullets = this.bullets.filter(b => !b.isDead);
    this.particles.forEach(p => p.update());
    this.particles = this.particles.filter(p => !p.isDead);

    // Level-up notification
    const bl = this.blastLevel;
    if (bl > this.prevBlastLevel) {
      this.levelUpTimer = 120;
      this.prevBlastLevel = bl;
    }
    if (this.levelUpTimer > 0) this.levelUpTimer--;

    if (!this.won && this.loaded && this.enemies.length > 0 && this.enemies.every(e => !e.alive))
      this.won = true;
  }

  private render() {
    const { ctx, W, H } = this;

    ctx.fillStyle = '#060a0f';
    ctx.fillRect(0, 0, W, H);

    this.stars.forEach(s => s.draw(ctx));
    this.drawHUD();

    if (!this.loaded) {
      ctx.fillStyle = 'rgba(57,211,83,0.6)';
      ctx.font = '14px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('Fetching 3 years of GitHub contributions…', W / 2, H / 2);
    }

    this.drawYearLabels();
    this.enemies.forEach(e => e.draw(ctx, this.cellSize));
    this.bullets.forEach(b => b.draw(ctx));
    this.particles.forEach(p => p.draw(ctx));

    if (!this.won) this.player.draw(ctx);
    if (this.won) this.drawVictory();
  }

  private drawYearLabels() {
    const { ctx } = this;
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'left';
    this.yearBands.forEach(({ year, startY }) => {
      ctx.fillStyle = 'rgba(57,211,83,0.35)';
      ctx.fillText(String(year), 10, startY + this.cellSize);
    });
  }

  private drawHUD() {
    const { ctx, W, H } = this;
    const alive = this.enemies.filter(e => e.alive).length;
    const blastLines = 1 + this.blastLevel * 2;

    ctx.font = 'bold 13px monospace';
    ctx.fillStyle = '#39d353';
    ctx.textAlign = 'left';
    ctx.fillText(`SCORE  ${this.score.toLocaleString()}`, 20, 32);
    ctx.textAlign = 'right';
    ctx.fillText(`REMAINING  ${alive}`, W - 20, 32);
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(57,211,83,0.4)';
    ctx.font = '11px monospace';
    ctx.fillText('github.com/gevaghajanyan  ·  3 years', W / 2, 32);

    if (blastLines > 1) {
      ctx.fillStyle = '#39d353';
      ctx.font = '11px monospace';
      ctx.fillText(`BLAST  ${'|'.repeat(blastLines)}  LVL ${this.blastLevel + 1}`, W / 2, 52);
    }

    if (this.levelUpTimer > 0) {
      ctx.globalAlpha = Math.min(1, this.levelUpTimer / 30);
      ctx.fillStyle = '#39d353';
      ctx.font = `bold ${W < 600 ? 18 : 24}px monospace`;
      ctx.fillText(`BLAST LEVEL ${this.blastLevel + 1}!  ${'|'.repeat(blastLines)}`, W / 2, H / 2 - 60);
      ctx.globalAlpha = 1;
    }

    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    ctx.font = '11px monospace';
    const hint = this.isMobile
      ? 'DRAG  MOVE   ·   TAP  SHOOT   ·   ✕ CLOSE'
      : '← →  MOVE   ·   SPACE  SHOOT   ·   ESC  CLOSE';
    ctx.fillText(hint, W / 2, H - 16);
  }

  private drawVictory() {
    const { ctx, W, H } = this;
    ctx.fillStyle = 'rgba(6,10,15,0.85)';
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = '#39d353';
    ctx.font = `bold ${W < 600 ? 26 : 38}px "Plus Jakarta Sans", sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('CONTRIBUTIONS CLEARED', W / 2, H / 2 - 44);

    ctx.fillStyle = '#9be9a8';
    ctx.font = `${W < 600 ? 15 : 20}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillText(
      `${this.totalContribs.toLocaleString()} contributions  ·  score ${this.score.toLocaleString()}`,
      W / 2, H / 2 + 4,
    );

    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = '13px monospace';
    ctx.fillText('press ESC to close', W / 2, H / 2 + 44);
  }

  // ── Lifecycle ─────────────────────────────────────────────────────────────

  start(onClose: () => void): () => void {
    this.running  = true;
    this.isMobile = 'ontouchstart' in window;

    const onKey = (e: KeyboardEvent) => {
      this.keys[e.code] = e.type === 'keydown';
      if (e.code === 'Space') e.preventDefault();
      if (e.code === 'Escape' && e.type === 'keydown') onClose();
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('keyup',   onKey);

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      this.player.targetX = e.touches[0].clientX;
      this.keys['Space']  = true;
    };
    const onTouchEnd = () => { this.keys['Space'] = false; };
    this.canvas.addEventListener('touchstart',  onTouchMove, { passive: false });
    this.canvas.addEventListener('touchmove',   onTouchMove, { passive: false });
    this.canvas.addEventListener('touchend',    onTouchEnd);
    this.canvas.addEventListener('touchcancel', onTouchEnd);

    const loop = () => {
      if (!this.running) return;
      this.update();
      this.render();
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);

    return () => {
      this.running = false;
      cancelAnimationFrame(this.raf);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('keyup',   onKey);
      this.canvas.removeEventListener('touchstart',  onTouchMove);
      this.canvas.removeEventListener('touchmove',   onTouchMove);
      this.canvas.removeEventListener('touchend',    onTouchEnd);
      this.canvas.removeEventListener('touchcancel', onTouchEnd);
    };
  }
}
