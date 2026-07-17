type Mode = 'single' | 'multi';
type Screen = 'menu' | 'playing' | 'gameover';

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  life: number; maxLife: number;
  color: string;
}

const PADDLE_W      = 12;
const PADDLE_H      = 88;
const PADDLE_SPEED  = 5;
const PADDLE_MARGIN = 52;
const BALL_R        = 8;
const BASE_SPEED    = 5;
const WIN_SCORE     = 7;
const AI_LERP       = 0.06;  // reaction-lag factor — lower = slower AI
const AI_MAX_SPEED  = 4.1;   // px/frame cap — slightly less than player

export class PingPongGame {
  private W: number;
  private H: number;
  private running = false;
  private raf = 0;

  private screen: Screen = 'menu';
  private mode: Mode = 'single';
  private score = [0, 0];

  private p1Y: number;
  private p2Y: number;
  private aiTargetY: number;

  private ballX: number;
  private ballY: number;
  private ballVX = 0;
  private ballVY = 0;
  private ballSpeed = BASE_SPEED;

  private keys: Record<string, boolean> = {};
  private particles: Particle[] = [];

  // Hover state for menu buttons
  private hoverBtn: 0 | 1 | null = null;

  constructor(
    private canvas: HTMLCanvasElement,
    private ctx: CanvasRenderingContext2D,
  ) {
    this.W = canvas.width  = window.innerWidth;
    this.H = canvas.height = window.innerHeight;
    this.p1Y        = this.H / 2;
    this.p2Y        = this.H / 2;
    this.aiTargetY  = this.H / 2;
    this.ballX      = this.W / 2;
    this.ballY      = this.H / 2;
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  private clamp(y: number) {
    return Math.max(PADDLE_H / 2, Math.min(this.H - PADDLE_H / 2, y));
  }

  private rect(x: number, y: number, w: number, h: number, r = 4) {
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

  // ── Setup ─────────────────────────────────────────────────────────────────

  private resetBall(serveRight: boolean) {
    this.ballX     = this.W / 2;
    this.ballY     = this.H / 2 + (Math.random() - 0.5) * this.H * 0.3;
    this.ballSpeed = BASE_SPEED;
    const angle    = (Math.random() * 0.5 - 0.25); // ±14°
    const dir      = serveRight ? 1 : -1;
    this.ballVX    = dir  * this.ballSpeed * Math.cos(angle);
    this.ballVY    = this.ballSpeed * Math.sin(angle);
  }

  private startGame(mode: Mode) {
    this.mode      = mode;
    this.screen    = 'playing';
    this.score     = [0, 0];
    this.p1Y       = this.H / 2;
    this.p2Y       = this.H / 2;
    this.aiTargetY = this.H / 2;
    this.particles = [];
    this.resetBall(Math.random() > 0.5);
  }

  // ── AI ────────────────────────────────────────────────────────────────────

  private updateAI() {
    if (this.ballVX > 0) {
      // Ball heading toward AI — predict landing Y
      const targetX = this.W - PADDLE_MARGIN;
      const dx       = targetX - this.ballX;
      const t        = dx / this.ballVX;
      let predY      = this.ballY + this.ballVY * t;

      // Resolve reflections off top/bottom walls
      const lo = BALL_R;
      const hi = this.H - BALL_R;
      const span = hi - lo;
      if (span > 0) {
        predY -= lo;
        predY  = Math.abs(predY % (2 * span));
        if (predY > span) predY = 2 * span - predY;
        predY += lo;
      }

      // Lerp toward prediction with lag (beatable gap)
      this.aiTargetY += (predY - this.aiTargetY) * AI_LERP;
    } else {
      // Ball moving away — drift back to center
      this.aiTargetY += (this.H / 2 - this.aiTargetY) * 0.025;
    }

    const diff = this.aiTargetY - this.p2Y;
    this.p2Y = this.clamp(this.p2Y + Math.sign(diff) * Math.min(Math.abs(diff), AI_MAX_SPEED));
  }

  // ── Particles ─────────────────────────────────────────────────────────────

  private spawnHit(x: number, y: number, color: string) {
    for (let i = 0; i < 10; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 3.5 + 1;
      const life  = 18 + Math.floor(Math.random() * 16);
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life, maxLife: life, color,
      });
    }
  }

  // ── Update ────────────────────────────────────────────────────────────────

  private update() {
    if (this.screen !== 'playing') return;

    // Player 1 — W/S always; arrow keys also available in single player
    const p1Up   = this.keys['KeyW'] || (this.mode === 'single' && this.keys['ArrowUp']);
    const p1Down = this.keys['KeyS'] || (this.mode === 'single' && this.keys['ArrowDown']);
    if (p1Up)   this.p1Y = this.clamp(this.p1Y - PADDLE_SPEED);
    if (p1Down) this.p1Y = this.clamp(this.p1Y + PADDLE_SPEED);

    // Player 2 — arrows in multi, AI in single
    if (this.mode === 'multi') {
      if (this.keys['ArrowUp'])   this.p2Y = this.clamp(this.p2Y - PADDLE_SPEED);
      if (this.keys['ArrowDown']) this.p2Y = this.clamp(this.p2Y + PADDLE_SPEED);
    } else {
      this.updateAI();
    }

    // Move ball
    this.ballX += this.ballVX;
    this.ballY += this.ballVY;

    // Top / bottom walls
    if (this.ballY - BALL_R <= 0) {
      this.ballY  = BALL_R;
      this.ballVY = Math.abs(this.ballVY);
    }
    if (this.ballY + BALL_R >= this.H) {
      this.ballY  = this.H - BALL_R;
      this.ballVY = -Math.abs(this.ballVY);
    }

    // Left paddle hit
    const p1X = PADDLE_MARGIN;
    if (
      this.ballVX < 0 &&
      this.ballX - BALL_R <= p1X + PADDLE_W / 2 &&
      this.ballX          >= p1X - PADDLE_W / 2 &&
      Math.abs(this.ballY - this.p1Y) < PADDLE_H / 2 + BALL_R * 0.6
    ) {
      this.ballX     = p1X + PADDLE_W / 2 + BALL_R;
      this.ballSpeed = Math.min(this.ballSpeed + 0.3, 16);
      const frac     = (this.ballY - this.p1Y) / (PADDLE_H / 2);
      const angle    = frac * (Math.PI / 3.5);
      this.ballVX    =  this.ballSpeed * Math.cos(angle);
      this.ballVY    =  this.ballSpeed * Math.sin(angle);
      this.spawnHit(this.ballX, this.ballY, '#39d353');
    }

    // Right paddle hit
    const p2X = this.W - PADDLE_MARGIN;
    if (
      this.ballVX > 0 &&
      this.ballX + BALL_R >= p2X - PADDLE_W / 2 &&
      this.ballX          <= p2X + PADDLE_W / 2 &&
      Math.abs(this.ballY - this.p2Y) < PADDLE_H / 2 + BALL_R * 0.6
    ) {
      this.ballX     = p2X - PADDLE_W / 2 - BALL_R;
      this.ballSpeed = Math.min(this.ballSpeed + 0.3, 16);
      const frac     = (this.ballY - this.p2Y) / (PADDLE_H / 2);
      const angle    = frac * (Math.PI / 3.5);
      this.ballVX    = -this.ballSpeed * Math.cos(angle);
      this.ballVY    =  this.ballSpeed * Math.sin(angle);
      this.spawnHit(this.ballX, this.ballY, this.mode === 'multi' ? '#58a6ff' : '#ff7c7c');
    }

    // Scoring — ball exits left (p2 scores) or right (p1 scores)
    if (this.ballX < -BALL_R) {
      this.score[1]++;
      if (this.score[1] >= WIN_SCORE) { this.screen = 'gameover'; return; }
      this.resetBall(true);
    }
    if (this.ballX > this.W + BALL_R) {
      this.score[0]++;
      if (this.score[0] >= WIN_SCORE) { this.screen = 'gameover'; return; }
      this.resetBall(false);
    }

    // Particles
    for (const p of this.particles) {
      p.x  += p.vx;
      p.y  += p.vy;
      p.vy += 0.06;
      p.life--;
    }
    this.particles = this.particles.filter(p => p.life > 0);
  }

  // ── Render ────────────────────────────────────────────────────────────────

  private render() {
    const { ctx, W, H } = this;
    ctx.fillStyle = '#060a0f';
    ctx.fillRect(0, 0, W, H);

    if (this.screen === 'menu')     { this.drawMenu();                    return; }
    if (this.screen === 'playing')  { this.drawGame();                    return; }
    if (this.screen === 'gameover') { this.drawGame(); this.drawGameOver(); return; }
  }

  private drawMenu() {
    const { ctx, W, H } = this;
    const btnW = Math.min(260, W * 0.7);
    const btnH = 52;
    const cx   = W / 2;

    // Title
    ctx.textAlign  = 'center';
    ctx.fillStyle  = '#ffffff';
    ctx.font       = `bold ${W < 600 ? 30 : 42}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillText('PING PONG', cx, H / 2 - 110);

    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.font      = `${W < 600 ? 12 : 14}px monospace`;
    ctx.fillText('First to 7 wins', cx, H / 2 - 76);

    // Buttons
    const btns = [
      { label: 'SINGLE PLAYER  [1]', sub: 'W/S / ↑/↓  vs  PC', color: '#39d353', y: H / 2 - 30 },
      { label: 'LOCAL 2-PLAYER  [2]', sub: 'W/S  vs  ↑/↓', color: '#58a6ff', y: H / 2 + 42 },
    ] as const;

    btns.forEach((b, i) => {
      const hover = this.hoverBtn === i;
      ctx.globalAlpha = hover ? 1 : 0.85;
      ctx.fillStyle   = hover ? b.color + '22' : 'transparent';
      this.rect(cx - btnW / 2, b.y, btnW, btnH, 6);
      ctx.fill();
      ctx.strokeStyle = b.color;
      ctx.lineWidth   = hover ? 2 : 1.5;
      this.rect(cx - btnW / 2, b.y, btnW, btnH, 6);
      ctx.stroke();

      ctx.fillStyle  = b.color;
      ctx.font       = `bold ${W < 600 ? 13 : 15}px monospace`;
      ctx.textAlign  = 'center';
      ctx.fillText(b.label, cx, b.y + 22);

      ctx.fillStyle = 'rgba(255,255,255,0.35)';
      ctx.font      = `${W < 600 ? 10 : 11}px monospace`;
      ctx.fillText(b.sub, cx, b.y + 39);

      ctx.globalAlpha = 1;
    });

    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    ctx.font      = '11px monospace';
    ctx.fillText('ESC  CLOSE', cx, H - 16);
  }

  private drawGame() {
    const { ctx, W, H } = this;
    const p1X = PADDLE_MARGIN;
    const p2X = W - PADDLE_MARGIN;

    // Dashed center line
    ctx.setLineDash([8, 10]);
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth   = 2;
    ctx.beginPath();
    ctx.moveTo(W / 2, 0);
    ctx.lineTo(W / 2, H);
    ctx.stroke();
    ctx.setLineDash([]);

    // Score
    const fontSize = W < 600 ? 40 : 52;
    ctx.fillStyle  = 'rgba(255,255,255,0.45)';
    ctx.font       = `bold ${fontSize}px monospace`;
    ctx.textAlign  = 'right';
    ctx.fillText(String(this.score[0]), W / 2 - 28, 72);
    ctx.textAlign  = 'left';
    ctx.fillText(String(this.score[1]), W / 2 + 28, 72);

    // Paddles with glow
    const drawPaddle = (x: number, cy: number, color: string) => {
      ctx.shadowBlur  = 14;
      ctx.shadowColor = color;
      ctx.fillStyle   = color;
      this.rect(x - PADDLE_W / 2, cy - PADDLE_H / 2, PADDLE_W, PADDLE_H, 4);
      ctx.fill();
      ctx.shadowBlur = 0;
    };

    drawPaddle(p1X, this.p1Y, '#39d353');
    drawPaddle(p2X, this.p2Y, this.mode === 'multi' ? '#58a6ff' : '#ff7c7c');

    // Ball with glow
    ctx.shadowBlur  = 18;
    ctx.shadowColor = '#ffffff';
    ctx.fillStyle   = '#ffffff';
    ctx.beginPath();
    ctx.arc(this.ballX, this.ballY, BALL_R, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Particles
    for (const p of this.particles) {
      ctx.globalAlpha = p.life / p.maxLife;
      ctx.fillStyle   = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Labels
    ctx.font      = '11px monospace';
    ctx.fillStyle = 'rgba(255,255,255,0.22)';
    ctx.textAlign = 'left';
    ctx.fillText(this.mode === 'single' ? 'P1  W/S  ↑/↓' : 'P1  W/S', p1X - PADDLE_W / 2, H - 16);
    ctx.textAlign = 'right';
    ctx.fillText(this.mode === 'multi' ? 'P2  ↑/↓' : 'PC', p2X + PADDLE_W / 2, H - 16);
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255,255,255,0.13)';
    ctx.fillText('ESC  CLOSE', W / 2, H - 16);
  }

  private drawGameOver() {
    const { ctx, W, H } = this;

    ctx.fillStyle = 'rgba(6,10,15,0.88)';
    ctx.fillRect(0, 0, W, H);

    const p1Won     = this.score[0] >= WIN_SCORE;
    const winLabel  = this.mode === 'multi'
      ? (p1Won ? 'PLAYER 1 WINS' : 'PLAYER 2 WINS')
      : (p1Won ? 'YOU WIN' : 'PC WINS');
    const color     = p1Won ? '#39d353' : (this.mode === 'multi' ? '#58a6ff' : '#ff7c7c');

    ctx.fillStyle  = color;
    ctx.font       = `bold ${W < 600 ? 28 : 40}px "Plus Jakarta Sans", sans-serif`;
    ctx.textAlign  = 'center';
    ctx.fillText(winLabel, W / 2, H / 2 - 40);

    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.font      = `${W < 600 ? 28 : 38}px monospace`;
    ctx.fillText(`${this.score[0]}  :  ${this.score[1]}`, W / 2, H / 2 + 18);

    ctx.fillStyle = 'rgba(255,255,255,0.32)';
    ctx.font      = '13px monospace';
    ctx.fillText('[R]  PLAY AGAIN   ·   ESC  CLOSE', W / 2, H / 2 + 58);
  }

  // ── Lifecycle ─────────────────────────────────────────────────────────────

  start(onClose: () => void): () => void {
    this.running = true;

    const menuBtnY = [this.H / 2 - 30, this.H / 2 + 42];
    const menuBtnH = 52;
    const btnW     = Math.min(260, this.W * 0.7);
    const cx       = this.W / 2;

    const onKey = (e: KeyboardEvent) => {
      this.keys[e.code] = e.type === 'keydown';
      if (e.code === 'ArrowUp' || e.code === 'ArrowDown' || e.code === 'Space') e.preventDefault();

      if (e.type !== 'keydown') return;
      if (e.code === 'Escape')  { onClose(); return; }

      if (this.screen === 'menu') {
        if (e.code === 'Digit1' || e.code === 'Numpad1') this.startGame('single');
        if (e.code === 'Digit2' || e.code === 'Numpad2') this.startGame('multi');
      }
      if (this.screen === 'gameover') {
        if (e.code === 'KeyR') this.startGame(this.mode);
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      if (this.screen !== 'menu') { this.hoverBtn = null; return; }
      const x = e.clientX, y = e.clientY;
      if (x >= cx - btnW / 2 && x <= cx + btnW / 2) {
        if (y >= menuBtnY[0] && y <= menuBtnY[0] + menuBtnH) { this.hoverBtn = 0; return; }
        if (y >= menuBtnY[1] && y <= menuBtnY[1] + menuBtnH) { this.hoverBtn = 1; return; }
      }
      this.hoverBtn = null;
    };

    const onMouseUp = (e: MouseEvent) => {
      if (this.screen === 'menu') {
        const x = e.clientX, y = e.clientY;
        if (x >= cx - btnW / 2 && x <= cx + btnW / 2) {
          if (y >= menuBtnY[0] && y <= menuBtnY[0] + menuBtnH) { this.startGame('single'); return; }
          if (y >= menuBtnY[1] && y <= menuBtnY[1] + menuBtnH) { this.startGame('multi');  return; }
        }
      } else if (this.screen === 'gameover') {
        this.startGame(this.mode);
      }
    };

    window.addEventListener('keydown',    onKey);
    window.addEventListener('keyup',      onKey);
    window.addEventListener('mousemove',  onMouseMove);
    this.canvas.addEventListener('mouseup', onMouseUp);

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
      window.removeEventListener('keydown',   onKey);
      window.removeEventListener('keyup',     onKey);
      window.removeEventListener('mousemove', onMouseMove);
      this.canvas.removeEventListener('mouseup', onMouseUp);
    };
  }
}
