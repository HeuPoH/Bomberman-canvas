import { Position } from './common/types';
import { isEqualPos } from './common/common';

import { explodableBlock, grassBlock, solidBlock } from './images/images';
import { Canvas } from './Canvas';
import { Players } from './Players';
import { countColumns, countRows } from './settings';

interface FieldCellStatus {
  type: CellType;
  subType?: CellSubType;
}

enum CellType {
  Empty = 0,
  SolidBlock = 1,
  ExplodableBlock = 2
}

enum CellSubType {
  Bomb = 2
}

export class Field {
  private canvas: Canvas;
  private positions: FieldCellStatus[][] = [];
  private players: Players;

  constructor(canvas: Canvas) {
    this.canvas = canvas;
    this.prepareField();

    this.players = new Players(this);
  }

  draw() {
    const ctx = this.canvas.getContext();
    if (!ctx) {
      return;
    }

    const cellSize = this.getCellSize();
    this.positions.forEach((row, i) => {
      row.forEach((cell, j) => {
        const image = this.getCellFillImage(cell.type);
        const x = i * cellSize;
        const y = j * cellSize;

        ctx.drawImage(image, x, y, cellSize, cellSize);
      });
    });

    this.players.draw();
  }

  getCanvas() {
    return this.canvas;
  }

  isCellEmpty(pos: Position) {
    const [column, row] = pos;
    const position = this.positions[column]?.[row];
    if (position?.type !== CellType.Empty || position.subType) {
      return false;
    }

    return true;
  }

  isCellDestroy(pos: Position) {
    const [column, row] = pos;
    return this.positions[column][row].type !== CellType.SolidBlock;
  }

  getOffsets() {
    const cellSize = this.getCellSize();
    const { width, height } = this.canvas.getSize();
    const offsetLeft = (width - cellSize * countColumns) / 2;
    const offsetTop = (height - cellSize * countRows) / 2;

    return {
      left: offsetLeft,
      top: offsetTop
    };
  }

  getCellSize() {
    const { width, height } = this.canvas.getSize();
    const size = Math.min(width, height);
    return size / Math.max(countRows, countColumns);
  }

  putBomb(pos: Position) {
    const [column, row] = pos;
    this.positions[column][row].subType = CellSubType.Bomb;
  }

  detonationBomb(positions: Position[]) {
    positions.forEach(pos => {
      this.clearCell(pos);
      this.deleteBomb(pos);
    });
  }

  private clearCell(pos: Position) {
    const [column, row] = pos;
    this.positions[column][row].type = CellType.Empty;
  }

  private deleteBomb(pos: Position) {
    const [column, row] = pos;
    this.positions[column][row].subType = undefined;
  }

  private getCellType(column: number, row: number): CellType {
    const emptyPos: Position[] = [
      [1, 1],
      [1, 2],
      [2, 1],
      [countColumns - 2, 1],
      [countColumns - 3, 1],
      [countColumns - 2, 2],
      [countColumns - 2, countRows - 2],
      [countColumns - 2, countRows - 3],
      [countColumns - 3, countRows - 2],
      [1, countRows - 2],
      [1, countRows - 3],
      [2, countRows - 2]
    ];

    if (emptyPos.find(pos => isEqualPos(pos, [column, row]))) {
      return CellType.Empty;
    }

    return Math.round((column - 1) % 2) === 0 || Math.round((row - 1) % 2) === 0
      ? CellType.ExplodableBlock
      : CellType.SolidBlock;
  }

  private getCellFillImage(type: CellType) {
    switch (type) {
      case CellType.SolidBlock:
        return solidBlock;
      case CellType.ExplodableBlock:
        return explodableBlock;
      default:
        return grassBlock;
    }
  }

  private prepareField() {
    for (let i = 0; i < countColumns; i++) {
      this.positions[i] ??= [];

      for (let j = 0; j < countRows; j++) {
        if (i === 0 || i === countColumns - 1 || j === 0 || j === countRows - 1) {
          this.positions[i][j] = { type: CellType.SolidBlock };
          continue;
        }

        const cellType = this.getCellType(i, j);
        this.positions[i][j] = { type: cellType };
      }
    }
  }
}
