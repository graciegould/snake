import {
  DEFAULT_GRID_ROW_AMOUNT,
  DEFAULT_GRID_COL_AMOUNT,
} from "./types/types";
function getRandomRowAndColumn(
  excludedCoordinates: { row: number; col: number }[] = [],
  rows: number = DEFAULT_GRID_ROW_AMOUNT,
  cols: number = DEFAULT_GRID_COL_AMOUNT,
): { row: number; col: number } {
  let row: number, col: number;
  let isExcluded;
  do {
    row = Math.floor(Math.random() * rows);
    col = Math.floor(Math.random() * cols);

    isExcluded = excludedCoordinates.some(
      (coord) => coord.row === row && coord.col === col,
    );
  } while (isExcluded);
  return { row, col };
}

function map(
  value: number,
  start1: number,
  stop1: number,
  start2: number,
  stop2: number,
): number {
  return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
}

export { getRandomRowAndColumn, map };
