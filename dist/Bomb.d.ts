export declare class Bomb {
    private pos;
    private size;
    private flamePos;
    private startTime;
    private detonationBomb;
    private duration;
    constructor(pos: [number, number], flamePos: [number, number][], size: number, detonationBomb: (bomb: Bomb) => void);
    getPosition(): [number, number];
    getFlamePos(): [number, number][];
    draw(ctx: CanvasRenderingContext2D): void;
    private drawBomb;
    private drawFlamePos;
    private getBombStatus;
    private getImage;
}
