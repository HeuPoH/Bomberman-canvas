declare type Rect = {
    width: number;
    height: number;
};
export declare class Canvas {
    private canvas;
    private width;
    private height;
    constructor();
    getContext(): CanvasRenderingContext2D | null;
    getSize(): Rect;
    clear(): void;
    private updateSize;
}
export {};
