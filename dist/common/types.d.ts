export declare type Position = [number, number];
export interface PlayerInit {
    control: PlayerControl;
    pos: Position;
    image: string;
}
export declare type KeyCode = KeyboardEvent['code'];
export interface PlayerControl {
    up: KeyCode;
    right: KeyCode;
    down: KeyCode;
    left: KeyCode;
    putBomb: KeyCode;
}
