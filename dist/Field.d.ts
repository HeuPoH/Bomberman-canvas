import { Canvas } from './Canvas';
export declare class Field {
    private canvas;
    private countRows;
    private countColumns;
    private positions;
    private players;
    constructor(canvas: Canvas);
    draw(): void;
    getCanvas(): Canvas;
    getOffsets(cellSize?: number): {
        left: number;
        top: number;
    };
    putBomb(pos: [number, number]): void;
    firedBomb(positions: [number, number][]): void;
    private clearCell;
    private deleteBomb;
    getCellSize(): number;
    private getCellType;
    isCellEmpty(pos: [number, number]): boolean;
    isCellDestroy(pos: [number, number]): boolean;
    private getCellFillImage;
    private drawFieldLayout;
    private prepareField;
}
