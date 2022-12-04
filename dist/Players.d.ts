import { PlayerControl, Position } from './common/types';
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
        pos: Position;
        control: PlayerControl;
        image: string;
    };
    playerMoveTo(newPos: Position): boolean;
    playerPutBomb(player: Player): void;
    detonationBomb(playerId: number, bomb: Bomb, isDeleteBomb?: boolean): void;
    private deleteDiedPlayers;
    private deleteBomb;
}
