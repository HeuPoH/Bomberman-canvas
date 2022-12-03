import { isEqualPos } from './common/common';
import { PlayerControl, Position } from './common/types';

import { Bomb } from './Bomb';
import { Field } from './Field';
import { Player } from './Player';
import { playersInit } from './settings';

export class Players {
  private field: Field;
  private players: Player[] = [];
  private bombs: { [playerId: number]: Bomb[] } = {};

  constructor(field: Field) {
    this.field = field;

    for (let i = 0; i < playersInit.length; i++) {
      const player = new Player(this);
      this.players.push(player);
    }
  }

  draw() {
    const ctx = this.field.getCanvas().getContext()!;
    const bombs = Object.values(this.bombs).flat();

    bombs.forEach(bomb => bomb.draw(ctx));
    this.players.forEach(player => player.draw(ctx));
  }

  getCellSize(): number {
    return this.field.getCellSize();
  }

  addPlayer(): { id: number; pos: Position; control: PlayerControl; image: string } {
    const id = this.players.length;
    const { pos, control, image } = playersInit[id];
    return { pos, id, control, image };
  }

  playerMoveTo(newPos: Position) {
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
    const bomb = new Bomb(pos, flamePos, this.getCellSize(), (bomb, isDelete) => this.detonationBomb(playerId, bomb, isDelete));

    this.bombs[playerId].push(bomb);

    this.field.putBomb(pos);
  }

  detonationBomb(playerId: number, bomb: Bomb, isDeleteBomb?: boolean) {
    const flamePos = bomb.getFlamePos();

    isDeleteBomb && this.deleteBomb(playerId, bomb);
    this.deleteDiedPlayers(flamePos);
    this.field.detonationBomb(flamePos);
  }

  private deleteDiedPlayers(flamePos: Position[]) {
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
