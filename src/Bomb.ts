import { Position } from './common/types';
import { flame, imageBomb1, imageBomb2 } from './images/images';

enum BombStatus {
  Installed = 'Installed',
  Countdown = 'Countdown',
  Fired = 'Fired'
}
  
export class Bomb {
  private pos: Position;
  private size: number;
  private flamePos: Position[];
  private startTime: number;
  private detonationBomb: (bomb: Bomb, deleteBomb?: boolean) => void;
  private duration = 3000;

  constructor(
    pos: Position,
    flamePos: Position[],
    size: number,
    detonationBomb: (bomb: Bomb, deleteBomb?: boolean) => void
  ) {
    this.pos = pos;
    this.size = size;
    this.flamePos = [...flamePos, pos];
    this.startTime = performance.now();
    this.detonationBomb = detonationBomb;
  }

  getPosition() {
    return this.pos;
  }

  getFlamePos() {
    return this.flamePos;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const timeFraction = (performance.now() - this.startTime) / this.duration;
    const bombStatus = this.getBombStatus(timeFraction);

    this.drawBomb(ctx, this.size, bombStatus);
    this.drawFlamePos(ctx, this.size, bombStatus);

    if (bombStatus === BombStatus.Fired) {
      const isDeleteBomb = timeFraction >= 1;
      this.detonationBomb(this, isDeleteBomb);
    }
  }

  private drawBomb(
    ctx: CanvasRenderingContext2D,
    size: number,
    status: BombStatus
  ) {
    if (status === BombStatus.Fired) {
      return;
    }

    const [column, row] = this.pos;
    const image = this.getImage(status);
    const sizeBomb = size * 0.8;
    const offset = (size - sizeBomb) / 2;
    ctx.drawImage(image, column * size + offset, row * size + offset, sizeBomb, sizeBomb);
  }

  private drawFlamePos(
    ctx: CanvasRenderingContext2D,
    size: number,
    status: BombStatus
  ) {
    if (status !== BombStatus.Fired) {
      return;
    }

    this.flamePos.forEach(pos => {
      const [x, y] = pos;
      ctx.drawImage(flame, x * size, y * size, size, size);
    });
  }

  private getBombStatus(timeFraction: number): BombStatus {
    if (timeFraction >= 0 && timeFraction < 0.5) {
      return BombStatus.Installed;
    } else if (timeFraction >= 0.5 && timeFraction < 0.9) {
      return BombStatus.Countdown;
    } else {
      return BombStatus.Fired;
    }
  }

  private getImage(bombStatus: BombStatus) {
    switch (bombStatus) {
      case BombStatus.Installed:
        return imageBomb1;
      case BombStatus.Countdown:
        return imageBomb2;
      default:
        return flame;
    }
  }
}
