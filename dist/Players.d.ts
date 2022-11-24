import { Bomb } from './Bomb';
import { Field } from './Field';
import { Player } from './Player';
export declare class Players {
    private field;
    private players;
    private bombs;
    constructor(field: Field);
    draw(): void;
    getCellSize(): number;
    addPlayer(): {
        id: number;
        pos: [number, number];
    };
    playerMoveTo(newPos: [number, number]): boolean;
    playerPutBomb(player: Player): void;
    detonationBomb(playerId: number, bomb: Bomb): void;
    private deleteDiedPlayers;
    private deleteBomb;
}
