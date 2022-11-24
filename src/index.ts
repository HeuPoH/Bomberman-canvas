import './style.css';

import { Canvas } from './Canvas';
import { Field } from './Field';

const canvas = new Canvas();
const field = new Field(canvas);
const ctx = canvas.getContext();

(function loop() {
  canvas.clear();

  const { left, top } = field.getOffsets();
  ctx?.save();
  ctx?.translate(left, top);
  field.draw();
  ctx?.restore();

  requestAnimationFrame(loop);
})();
