export class Star {
  constructor(
    public x: number,
    public y: number,
    public size: number,
    public speed: number,
  ) {}

  static spawn(W: number, H: number) {
    return new Star(
      Math.random() * W,
      Math.random() * H,
      Math.random() * 1.4 + 0.3,
      Math.random() * 0.35 + 0.08,
    );
  }

  update(W: number, H: number) {
    this.y += this.speed;
    if (this.y > H) { this.y = 0; this.x = Math.random() * W; }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.globalAlpha = 0.2 + this.size * 0.25;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}
