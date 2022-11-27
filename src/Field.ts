import { Position } from './common/types';
import { isEqualPos } from './common/common';

import { imageGrass, imageStone, imageWood } from './images/images';
import { Canvas } from './Canvas';
import { Players } from './Players';

interface FieldCellStatus {
  type: CellType;
  subType?: CellSubType;
}

enum CellType {
  Empty = 0,
  FullStatic = 1,
  FullDynamic = 2
}

enum CellSubType {
  Bomb = 2
}

export class Field {
  private canvas: Canvas;
  private countRows = 11;
  private countColumns = 15;
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

    this.drawFieldLayout();
    
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

  getOffsets(cellSize: number = this.getCellSize()) {
    const { width, height } = this.canvas.getSize();
    const offsetLeft = (width - cellSize * this.countColumns) / 2;
    const offsetTop = (height - cellSize * this.countRows) / 2;

    return {
      left: offsetLeft,
      top: offsetTop
    };
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

  getCellSize() {
    const { width, height } = this.canvas.getSize();
    const size = Math.min(width, height);
    return size / Math.max(this.countRows, this.countColumns);
  }

  private getCellType(column: number, row: number): CellType {
    const emptyPos: Position[] = [
      [0, 0],
      [0, 1],
      [1, 0],
      [this.countColumns - 1, 0],
      [this.countColumns - 2, 0],
      [this.countColumns - 1, 1],
      [this.countColumns - 1, this.countRows - 1],
      [this.countColumns - 1, this.countRows - 2],
      [this.countColumns - 2, this.countRows - 1],
      [0, this.countRows - 1],
      [0, this.countRows - 2],
      [1, this.countRows - 1]
    ];

    if (emptyPos.find(pos => isEqualPos(pos, [column, row]))) {
      return CellType.Empty;
    }

    return Math.round(column % 2) === 0 || Math.round(row % 2) === 0
      ? CellType.FullDynamic
      : CellType.FullStatic;
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
    const cell = this.positions[column]?.[row];
    if (!cell) {
      return false;
    }

    return this.positions[column][row].type !== CellType.FullStatic;
  }

  private getCellFillImage(type: CellType) {
    switch (type) {
      case CellType.FullStatic:
        return imageStone;
      case CellType.FullDynamic:
        return imageWood;
      default:
        return imageGrass;
    }
  }

  private drawFieldLayout() {
    const ctx = this.canvas.getContext();
    const cellSize = this.getCellSize();

    ctx?.save();
    const fieldWidth = cellSize * this.countColumns;
    const fieldHeight = cellSize * this.countRows;

    ctx?.drawImage(imageGrass, 0, 0, fieldWidth, fieldHeight);
    ctx?.restore();
  }

  private prepareField() {
    for (let i = 0; i < this.countColumns; i++) {
      this.positions[i] ??= [];

      for (let j = 0; j < this.countRows; j++) {
        const cellType = this.getCellType(i, j);
        this.positions[i][j] = { type: cellType };
      }
    }
  }
}