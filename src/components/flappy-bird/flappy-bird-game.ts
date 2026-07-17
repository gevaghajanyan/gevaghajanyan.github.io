type Screen = 'idle' | 'playing' | 'dead';

interface Pipe {
  x: number;
  gapCy: number;
  scored: boolean;
}

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  life: number; maxLife: number;
  color: string;
}

interface Star { x: number; y: number; r: number; speed: number }

const PIPE_W       = 54;
const GAP          = 162;
const INIT_SPEED   = 2.8;
const BIRD_X_FRAC  = 0.22;
const BIRD_RX      = 15;
const BIRD_RY      = 12;
const GRAVITY      = 0.38;
const FLAP_VEL     = -7.8;
const GROUND_H     = 56;
const SPAWN_INT    = 96; // frames between pipe spawns

export class FlappyBirdGame {
  private W: number;
  private H: number;
  private GY: number;   // ground Y
  private running = false;
  private raf = 0;

  private birdY  = 0;
  private birdVY = 0;
  private birdRot = 0;

  private pipes: Pipe[]       = [];
  private particles: Particle[] = [];
  private stars: Star[]        = [];

  private pipeTimer   = 0;
  private spawnInt    = SPAWN_INT;
  private speed       = INIT_SPEED;
  private screen: Screen = 'idle';
  private score  = 0;
  private best   = 0;
  private frame  = 0;

  constructor(
    private canvas: HTMLCanvasElement,
    private ctx: CanvasRenderingContext2D,
  ) {
    this.W  = canvas.width  = window.innerWidth;
    this.H  = canvas.height = window.innerHeight;
    this.GY = this.H - GROUND_H;
    this.birdY = this.H / 2;
    this.stars = Array.from({ length: 55 }, () => this.newStar(true));
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  private newStar(randomX = false): Star {
    return {
      x:     randomX ? Math.random() * this.W : this.W + 2,
      y:     Math.random() * this.GY,
      r:     Math.random() * 1.3 + 0.3,
      speed: Math.random() * 0.4 + 0.1,
    };
  }

  private spawnPipe() {
    const lo = GAP / 2 + 80;
    const hi = this.GY - GAP / 2 - 60;
    this.pipes.push({ x: this.W + PIPE_W, gapCy: lo + Math.random() * (hi - lo), scored: false });
  }

  private explode(x: number, y: number) {
    const COLS = ['#39d353', '#80ff96', '#9be9a8', '#ffffff', '#2ea44f'];
    for (let i = 0; i < 18; i++) {
      const angle = (Math.PI * 2 * i / 18) + Math.random() * 0.25;
      const speed = Math.random() * 4.5 + 1;
      const life  = 28 + Math.floor(Math.random() * 18);
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
        life, maxLife: life,
        color: COLS[Math.floor(Math.random() * COLS.length)],
      });
    }
  }

  private die() {
    this.best   = Math.max(this.best, this.score);
    this.screen = 'dead';
    this.explode(this.W * BIRD_X_FRAC, this.birdY);
  }

  private reset() {
    this.birdY     = this.H / 2;
    this.birdVY    = 0;
    this.birdRot   = 0;
    this.pipes     = [];
    this.particles = [];
    this.pipeTimer = 0;
    this.spawnInt  = SPAWN_INT;
    this.speed     = INIT_SPEED;
    this.score     = 0;
    this.frame     = 0;
    this.spawnPipe();
  }

  private flap() {
    if (this.screen === 'idle') {
      this.reset();
      this.screen = 'playing';
    } else if (this.screen === 'playing') {
      this.birdVY = FLAP_VEL;
    } else if (this.screen === 'dead' && this.particles.length === 0) {
      this.reset();
      this.screen = 'playing';
    }
  }

  // ── Update ────────────────────────────────────────────────────────────────

  private update() {
    // Stars always scroll (background only)
    for (const s of this.stars) {
      s.x -= s.speed;
      if (s.x < 0) Object.assign(s, this.newStar());
    }

    if (this.screen !== 'playing') {
      for (const p of this.particles) { p.x += p.vx; p.y += p.vy; p.vy += 0.12; p.life--; }
      this.particles = this.particles.filter(p => p.life > 0);
      return;
    }

    this.frame++;

    // Bird
    this.birdVY  += GRAVITY;
    this.birdY   += this.birdVY;
    this.birdRot  = Math.max(-30, Math.min(85, this.birdVY * 4.5));

    const bx = this.W * BIRD_X_FRAC;

    // Ceiling / ground
    if (this.birdY - BIRD_RY <= 0 || this.birdY + BIRD_RY >= this.GY) {
      this.birdY = this.birdY < this.GY / 2 ? BIRD_RY : this.GY - BIRD_RY;
      this.die(); return;
    }

    // Pipes
    this.pipeTimer++;
    if (this.pipeTimer >= this.spawnInt) { this.pipeTimer = 0; this.spawnPipe(); }

    for (const p of this.pipes) {
      p.x -= this.speed;

      if (!p.scored && p.x + PIPE_W < bx) {
        p.scored = true;
        this.score++;
        if (this.score % 5 === 0) {
          this.speed    = Math.min(6.5, this.speed + 0.22);
          this.spawnInt = Math.max(62, this.spawnInt - 3);
        }
      }

      const hg = GAP / 2;
      if (bx + BIRD_RX * 0.75 > p.x && bx - BIRD_RX * 0.75 < p.x + PIPE_W) {
        if (this.birdY - BIRD_RY * 0.75 < p.gapCy - hg || this.birdY + BIRD_RY * 0.75 > p.gapCy + hg) {
          this.die(); return;
        }
      }
    }

    this.pipes = this.pipes.filter(p => p.x + PIPE_W > -10);

    // Particles
    for (const p of this.particles) { p.x += p.vx; p.y += p.vy; p.vy += 0.12; p.life--; }
    this.particles = this.particles.filter(p => p.life > 0);
  }

  // ── Render ────────────────────────────────────────────────────────────────

  private render() {
    const { ctx, W, H, GY } = this;

    ctx.fillStyle = '#060a0f';
    ctx.fillRect(0, 0, W, H);

    // Stars
    for (const s of this.stars) {
      ctx.globalAlpha = 0.55;
      ctx.fillStyle   = '#ffffff';
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    this.drawPipes();

    // Ground
    ctx.fillStyle = '#0a1a0a';
    ctx.fillRect(0, GY, W, H - GY);
    ctx.strokeStyle = '#39d353';
    ctx.lineWidth   = 1.5;
    ctx.beginPath(); ctx.moveTo(0, GY); ctx.lineTo(W, GY); ctx.stroke();

    this.drawBird();

    // Particles
    for (const p of this.particles) {
      ctx.globalAlpha = p.life / p.maxLife;
      ctx.fillStyle   = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.8, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    this.drawHUD();
    if (this.screen === 'idle') this.drawIdle();
    if (this.screen === 'dead' && this.particles.length === 0) this.drawDead();
  }

  private drawPipes() {
    const { ctx, GY } = this;
    const hg = GAP / 2;

    for (const p of this.pipes) {
      const topH = p.gapCy - hg;
      const botY = p.gapCy + hg;
      const botH = GY - botY;

      // Bodies
      ctx.fillStyle = '#0b240b';
      ctx.fillRect(p.x, 0, PIPE_W, topH);
      ctx.fillRect(p.x, botY, PIPE_W, botH);

      // Borders
      ctx.strokeStyle = 'rgba(57,211,83,0.55)';
      ctx.lineWidth   = 1.5;
      ctx.strokeRect(p.x + 0.75, 0.75,    PIPE_W - 1.5, topH - 0.75);
      ctx.strokeRect(p.x + 0.75, botY + 0.75, PIPE_W - 1.5, botH - 0.75);

      // Bracket symbols at gap mouth
      ctx.fillStyle    = '#39d353';
      ctx.font         = `bold 22px monospace`;
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText('{', p.x + PIPE_W / 2, topH - 5);
      ctx.textBaseline = 'top';
      ctx.fillText('}', p.x + PIPE_W / 2, botY + 5);
      ctx.textBaseline = 'alphabetic';
    }
  }

  private drawBird() {
    const { ctx, W, frame, screen } = this;
    if (screen === 'dead' && this.particles.length > 0) return;

    const bx  = W * BIRD_X_FRAC;
    const rad = this.birdRot * Math.PI / 180;

    ctx.save();
    ctx.translate(bx, this.birdY);
    ctx.rotate(rad);

    // Body
    ctx.shadowBlur  = 14;
    ctx.shadowColor = '#39d353';
    ctx.fillStyle   = '#39d353';
    ctx.beginPath();
    ctx.ellipse(0, 0, BIRD_RX, BIRD_RY, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Wing
    const wingBob = Math.sin(frame * 0.35) * 3.5;
    ctx.fillStyle = '#2ea44f';
    ctx.beginPath();
    ctx.ellipse(-BIRD_RX * 0.25, wingBob, BIRD_RX * 0.55, BIRD_RY * 0.38, -0.3, 0, Math.PI * 2);
    ctx.fill();

    // Eye
    ctx.fillStyle = '#060a0f';
    ctx.beginPath();
    ctx.arc(BIRD_RX * 0.32, -BIRD_RY * 0.22, 3.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(BIRD_RX * 0.32 + 1.2, -BIRD_RY * 0.22 - 1.2, 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Beak
    ctx.fillStyle = '#f0c040';
    ctx.beginPath();
    ctx.moveTo(BIRD_RX * 0.85, -2);
    ctx.lineTo(BIRD_RX * 1.3,  0);
    ctx.lineTo(BIRD_RX * 0.85,  3);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  private drawHUD() {
    const { ctx, W, H, score, screen } = this;
    if (screen !== 'playing') return;

    ctx.fillStyle    = 'rgba(255,255,255,0.88)';
    ctx.font         = `bold ${W < 600 ? 38 : 52}px monospace`;
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(String(score), W / 2, 68);

    ctx.fillStyle = 'rgba(255,255,255,0.13)';
    ctx.font      = '11px monospace';
    ctx.fillText('SPACE / TAP  flap   ·   ESC  close', W / 2, H - 8);
  }

  private drawIdle() {
    const { ctx, W, H } = this;

    ctx.fillStyle = 'rgba(6,10,15,0.72)';
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle    = '#39d353';
    ctx.font         = `bold ${W < 600 ? 34 : 46}px "Plus Jakarta Sans", sans-serif`;
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText('FLAPPY { }', W / 2, H / 2 - 18);

    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font      = `${W < 600 ? 12 : 14}px monospace`;
    ctx.fillText('fly through the brackets', W / 2, H / 2 + 18);

    ctx.fillStyle = 'rgba(255,255,255,0.22)';
    ctx.font      = '12px monospace';
    ctx.fillText('SPACE / TAP / CLICK  to start', W / 2, H / 2 + 44);
  }

  private drawDead() {
    const { ctx, W, H, score, best } = this;

    ctx.fillStyle = 'rgba(6,10,15,0.9)';
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle    = '#ff6b6b';
    ctx.font         = `bold ${W < 600 ? 28 : 40}px "Plus Jakarta Sans", sans-serif`;
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText('SYNTAX ERROR', W / 2, H / 2 - 44);

    ctx.fillStyle = '#39d353';
    ctx.font      = `bold ${W < 600 ? 24 : 32}px monospace`;
    ctx.fillText(`score  ${score}`, W / 2, H / 2 + 8);

    if (best > 0) {
      ctx.fillStyle = 'rgba(255,255,255,0.35)';
      ctx.font      = `${W < 600 ? 13 : 15}px monospace`;
      ctx.fillText(`best   ${best}`, W / 2, H / 2 + 36);
    }

    ctx.fillStyle = 'rgba(255,255,255,0.28)';
    ctx.font      = '13px monospace';
    ctx.fillText('SPACE / TAP  restart   ·   ESC  close', W / 2, H / 2 + 68);
  }

  // ── Lifecycle ─────────────────────────────────────────────────────────────

  start(onClose: () => void): () => void {
    this.running = true;

    const onKey = (e: KeyboardEvent) => {
      if (e.type !== 'keydown') return;
      if (e.code === 'Escape') { onClose(); return; }
      if (e.code === 'Space') { e.preventDefault(); this.flap(); }
    };
    const onTap = () => this.flap();

    window.addEventListener('keydown', onKey);
    this.canvas.addEventListener('click',      onTap);
    this.canvas.addEventListener('touchstart', onTap, { passive: true });

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
      this.canvas.removeEventListener('click',      onTap);
      this.canvas.removeEventListener('touchstart', onTap);
    };
  }
}
