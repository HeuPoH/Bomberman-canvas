import { Players } from './Players';

export class Player {
  private id: number;
  private pos: [number, number];
  private players: Players;

  constructor(players: Players) {
    const { id, pos } = players.addPlayer();
    this.id = id;
    this.pos = pos;
    this.players = players;

    // to do - вынести в players
    window.addEventListener('keydown', this.onKeyDown);
  }

  draw(ctx: CanvasRenderingContext2D) {
    const cellSize = this.players.getCellSize();
    const x = cellSize * this.pos[0] + cellSize / 2;
    const y = cellSize * this.pos[1] + cellSize / 2;

    ctx.fillStyle = 'green';
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

  getFlamePos(): [number, number][] {
    const [column, row] = this.pos;
    const hor: [number, number][] = [
      [column + 1, row],
      [column - 1, row]
    ];
    const vert: [number, number][] = [
      [column, row + 1],
      [column, row - 1]
    ];

    return [...hor, ...vert];
  }

  private onKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case ' ':
        this.players.playerPutBomb(this);
        break;
      case 'ArrowRight':
      case 'ArrowLeft':
      case 'ArrowDown':
      case 'ArrowUp':
        this.moveTo(e.key);
        break;
    }
  };

  private moveTo(key: string) {
    const newPos: [number, number] = this.pos.slice() as [number, number];

    switch (key) {
      case 'ArrowRight':
        newPos[0] += 1;
        break;
      case 'ArrowLeft':
        newPos[0] -= 1;
        break;
      case 'ArrowDown':
        newPos[1] += 1;
        break;
      case 'ArrowUp':
        newPos[1] -= 1;
        break;
    }

    if (!this.players.playerMoveTo(newPos)) {
      return;
    }

    this.pos = newPos;
  }
}