import { Bullet } from './bullet';

export class Player {
  readonly speed = 5;
  shootCooldown  = 0;
  targetX: number | null = null; // set by touch controls; null = keyboard mode

  constructor(public x: number, public y: number) {}

  update(keys: Record<string, boolean>, W: number) {
    if (this.targetX !== null) {
      const dx = this.targetX - this.x;
      if (Math.abs(dx) > 1) this.x += Math.sign(dx) * Math.min(Math.abs(dx) * 0.15, this.speed * 1.5);
      this.x = Math.max(22, Math.min(W - 22, this.x));
    } else {
      if ((keys['ArrowLeft']  || keys['KeyA']) && this.x > 22)      this.x -= this.speed;
      if ((keys['ArrowRight'] || keys['KeyD']) && this.x < W - 22)  this.x += this.speed;
    }
    if (this.shootCooldown > 0) this.shootCooldown--;
  }

  tryShoot(keys: Record<string, boolean>, blastLines: number, spread: number): Bullet[] {
    if (this.shootCooldown > 0) return [];
    if (!(keys['Space'] || keys['KeyW'] || keys['ArrowUp'])) return [];
    this.shootCooldown = 9;

    const offsets = Array.from({ length: blastLines }, (_, i) => {
      if (i === 0) return 0;
      const pair = Math.ceil(i / 2);
      return (i % 2 === 1 ? -1 : 1) * pair * spread;
    });

    return offsets.map(off => new Bullet(this.x + off, this.y - 22));
  }

  draw(ctx: CanvasRenderingContext2D) {
    const { x, y } = this;

    ctx.fillStyle = '#f0f0f0';
    ctx.beginPath();
    ctx.moveTo(x, y - 18); ctx.lineTo(x + 10, y + 6); ctx.lineTo(x - 10, y + 6);
    ctx.closePath(); ctx.fill();

    ctx.fillStyle = '#aaaaaa';
    ctx.beginPath();
    ctx.moveTo(x + 8, y + 2); ctx.lineTo(x + 20, y + 13); ctx.lineTo(x + 10, y + 6);
    ctx.closePath(); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x - 8, y + 2); ctx.lineTo(x - 20, y + 13); ctx.lineTo(x - 10, y + 6);
    ctx.closePath(); ctx.fill();

    const fl = Math.random() * 5 + 5;
    const g  = ctx.createRadialGradient(x, y + 10, 0, x, y + 10, fl);
    g.addColorStop(0, 'rgba(57,211,83,0.95)');
    g.addColorStop(1, 'rgba(0,200,50,0)');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(x, y + 10, fl, 0, Math.PI * 2); ctx.fill();
  }
}
