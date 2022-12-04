import { Position } from './common/types';
export declare class Bomb {
    private pos;
    private size;
    private flamePos;
    private startTime;
    private detonationBomb;
    private duration;
    constructor(pos: Position, flamePos: Position[], size: number, detonationBomb: (bomb: Bomb, deleteBomb?: boolean) => void);
    getPosition(): Position;
    getFlamePos(): Position[];
    draw(ctx: CanvasRenderingContext2D): void;
    private drawBomb;
    private drawFlamePos;
    private getBombStatus;
    private getImage;
}
