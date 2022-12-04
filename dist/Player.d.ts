import { Position } from './common/types';
import { Players } from './Players';
export declare class Player {
    private id;
    private pos;
    private players;
    private control;
    private image;
    constructor(players: Players);
    draw(ctx: CanvasRenderingContext2D): void;
    getId(): number;
    getPlayerPos(): Position;
    getFlamePos(): Position[];
    removeListener(): void;
    private onKeyDown;
    private moveTo;
}
