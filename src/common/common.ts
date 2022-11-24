export function isEqualPos(pos: [number, number], pos2: [number, number]) {
  const [column, row] = pos;
  const [column2, row2] = pos2;

  return column === column2 && row === row2;
}