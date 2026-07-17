import { LEVELS } from './constants';

export class Enemy {
  alive = true;
  flash = 0;

  constructor(
    public x: number,
    public y: number,
    public col: number,
    public row: number,
    public count: number,
    public level: number,
    public hp: number,
    public maxHp: number,
    public date: string,
  ) {}

  /** Returns true when destroyed */
  hit(): boolean {
    this.hp--;
    this.flash = 7;
    if (this.hp <= 0) { this.alive = false; return true; }
    return false;
  }

  draw(ctx: CanvasRenderingContext2D, cellSize: number) {
    if (!this.alive) return;
    ctx.globalAlpha = 0.4 + (this.hp / this.maxHp) * 0.6;
    ctx.fillStyle   = this.flash > 0 ? '#ffffff' : LEVELS.fill[this.level];
    ctx.strokeStyle = LEVELS.border[this.level];
    ctx.lineWidth   = 0.8;
    if (this.flash > 0) this.flash--;
    ctx.fillRect(  this.x - cellSize / 2, this.y - cellSize / 2, cellSize, cellSize);
    ctx.strokeRect(this.x - cellSize / 2, this.y - cellSize / 2, cellSize, cellSize);
    ctx.globalAlpha = 1;
  }
}
