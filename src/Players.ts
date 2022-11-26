import { Bomb } from './Bomb';
import { isEqualPos } from './common/common';
import { Field } from './Field';
import { Player } from './Player';

export class Players {
  private field: Field;
  private players: Player[] = [];
  private bombs: { [playerId: number]: Bomb[] } = {};

  constructor(field: Field) {
    this.field = field;
    this.players = [new Player(this)];
  }

  draw() {
    const ctx = this.field.getCanvas().getContext()!;
    const bombs = Object.values(this.bombs).flat();

    bombs.forEach(bomb => bomb.draw(ctx))
    this.players.forEach(player => player.draw(ctx));
  }

  getCellSize(): number {
    return this.field.getCellSize();
  }

  addPlayer(): { id: number; pos: [number, number] } {
    const id = this.players.length;
    return { pos: [0, 0], id };
  }

  playerMoveTo(newPos: [number, number]) {
    return this.field.isCellEmpty(newPos);
  }

  playerPutBomb(player: Player) {
    const playerId = player.getId();
    this.bombs[playerId] ??= [];

    if (this.bombs[playerId].length > 0) {
      return;
    }

    const pos = player.getPlayerPos();
    const flamePos = player.getFlamePos().filter(pos => this.field.isCellDestroy(pos));
    const bomb = new Bomb(pos, flamePos, this.getCellSize(), bomb => this.detonationBomb(playerId, bomb));

    this.bombs[playerId].push(bomb);

    this.field.putBomb(pos);
  }

  detonationBomb(playerId: number, bomb: Bomb) {
    const flamePos = bomb.getFlamePos();

    this.deleteBomb(playerId, bomb);
    this.deleteDiedPlayers(flamePos);
    this.field.firedBomb(flamePos);
  }

  private deleteDiedPlayers(flamePos: [number, number][]) {
    for (let i = 0; i < this.players.length; i++) {
      const player = this.players[i];
      const isDie = flamePos.find(pos => isEqualPos(player.getPlayerPos(), pos));

      if (!isDie) {
        continue;
      }

      this.players.splice(player.getId(), 1);
    }
  }

  private deleteBomb(playerId: number, bomb: Bomb) {
    this.bombs[playerId] = this.bombs[playerId].filter(b => !isEqualPos(b.getPosition(), bomb.getPosition()));
  }
}
