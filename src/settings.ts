import { PlayerInit } from './common/types';

export const countRows = 11;
export const countColumns = 15;

export const playersInit: PlayerInit[] = [
  {
    control: {
      up: 'ArrowUp',
      right: 'ArrowRight',
      down: 'ArrowDown',
      left: 'ArrowLeft',
      putBomb: 'Space'
    },
    image: 'green',
    pos: [0, 0]
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
    pos: [countColumns - 1, countRows - 1]
  }
];
