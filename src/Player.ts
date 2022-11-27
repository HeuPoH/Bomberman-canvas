import { KeyCode, PlayerControl, Position } from './common/types';
import { Players } from './Players';

export class Player {
  private id: number;
  private pos: Position;
  private players: Players;
  private control: PlayerControl;
  private image: string;

  constructor(players: Players) {
    const { id, pos, control, image } = players.addPlayer();
    this.id = id;
    this.pos = pos;
    this.players = players;
    this.control = control;
    this.image = image;

    // to do - вынести в players
    window.addEventListener('keydown', this.onKeyDown);
  }

  draw(ctx: CanvasRenderingContext2D) {
    const cellSize = this.players.getCellSize();
    const x = cellSize * this.pos[0] + cellSize / 2;
    const y = cellSize * this.pos[1] + cellSize / 2;

    ctx.fillStyle = this.image;
    ctx.arc(x, y, cellSize / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
  }

  getId() {
    return this.id;
  }

  getPlayerPos() {
    return this.pos;
  }

  getFlamePos(): Position[] {
    const [column, row] = this.pos;
    const hor: Position[] = [
      [column + 1, row],
      [column - 1, row]
    ];
    const vert: Position[] = [
      [column, row + 1],
      [column, row - 1]
    ];

    return [...hor, ...vert];
  }

  private onKeyDown = (e: KeyboardEvent) => {
    const { up, right, down, left, putBomb } = this.control;
    switch (e.code) {
      case putBomb:
        this.players.playerPutBomb(this);
        break;
      case up:
      case right:
      case down:
      case left:
        this.moveTo(e.code);
        break;
    }
  };

  private moveTo(code: KeyCode) {
    const newPos: Position = this.pos.slice() as Position;
    const { up, right, down, left } = this.control;

    switch (code) {
      case right:
        newPos[0] += 1;
        break;
      case left:
        newPos[0] -= 1;
        break;
      case down:
        newPos[1] += 1;
        break;
      case up:
        newPos[1] -= 1;
        break;
    }

    if (!this.players.playerMoveTo(newPos)) {
      return;
    }

    this.pos = newPos;
  }
}
