import { Enemy } from './enemy';

export class Bullet {
  static readonly SPEED = 9;
  private prevY: number;

  constructor(public x: number, public y: number) {
    this.prevY = y;
  }

  update() {
    this.prevY = this.y;
    this.y -= Bullet.SPEED;
  }

  get isDead() { return this.y < -20; }

  hits(e: Enemy, xHalf: number, yHalf: number) {
    if (Math.abs(this.x - e.x) >= xHalf) return false;
    // Swept check: did bullet cross the enemy's Y band this frame?
    const lo = Math.min(this.y, this.prevY);
    const hi = Math.max(this.y, this.prevY);
    return lo <= e.y + yHalf && hi >= e.y - yHalf;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const g = ctx.createLinearGradient(this.x, this.y - 14, this.x, this.y + 2);
    g.addColorStop(0, 'rgba(57,211,83,0)');
    g.addColorStop(0.4, '#39d353');
    g.addColorStop(1, '#00ff88');
    ctx.fillStyle = g;
    ctx.fillRect(this.x - 2, this.y - 14, 4, 16);
  }
}
