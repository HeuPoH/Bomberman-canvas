import { Position } from './common/types';
import { Canvas } from './Canvas';
export declare class Field {
    private canvas;
    private positions;
    private players;
    constructor(canvas: Canvas);
    draw(): void;
    getCanvas(): Canvas;
    isCellEmpty(pos: Position): boolean;
    isCellDestroy(pos: Position): boolean;
    getOffsets(): {
        left: number;
        top: number;
    };
    getCellSize(): number;
    putBomb(pos: Position): void;
    detonationBomb(positions: Position[]): void;
    private clearCell;
    private deleteBomb;
    private getCellType;
    private getCellFillImage;
    private prepareField;
}
