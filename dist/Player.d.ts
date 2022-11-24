import { Players } from './Players';
export declare class Player {
    private id;
    private pos;
    private players;
    constructor(players: Players);
    draw(ctx: CanvasRenderingContext2D): void;
    getId(): number;
    getPlayerPos(): [number, number];
    getFlamePos(): [number, number][];
    private onKeyDown;
    private moveTo;
}
