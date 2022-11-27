import { PlayerInit } from './common/types';

export const countRows = 15;
export const countColumns = 19;

export const playersInit: PlayerInit[] = [
  {
    control: {
      up: 'ArrowUp',
      right: 'ArrowRight',
      down: 'ArrowDown',
      left: 'ArrowLeft',
      putBomb: 'Space'
    },
    image: 'yellow',
    pos: [1, 1]
  },
  {
    control: {
      up: 'KeyW',
      right: 'KeyD',
      down: 'KeyS',
      left: 'KeyA',
      putBomb: 'KeyE'
    },
    image: 'red',
    pos: [countColumns - 2, countRows - 2]
  }
];
