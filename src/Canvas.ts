type Rect = {
  width: number;
  height: number;
};

export class Canvas {
  private canvas = document.getElementById('canvas') as HTMLCanvasElement;
  private width = 0;
  private height = 0;

  constructor() {
    this.updateSize();
    window.addEventListener('resize', this.updateSize);
  }

  getContext() {
    return this.canvas.getContext('2d');
  }

  getSize(): Rect {
    return {
      width: this.width,
      height: this.height
    };
  }

  clear() {
    this.canvas.getContext('2d')?.clearRect(0, 0, this.width, this.height);
  }

  private updateSize = () => {
    this.width = document.body.clientWidth;
    this.height = document.body.clientHeight;

    this.canvas.width = this.width;
    this.canvas.height = this.height;
  };
}