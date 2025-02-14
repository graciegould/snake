export interface GameData {
  snake: { row: number; col: number }[];
  target: { row: number; col: number };
  direction: "UP" | "DOWN" | "LEFT" | "RIGHT";
  score: number;
  started: boolean;
  highScore: number;
  speed: number;
  rows: number;
  cols: number;
}

export interface CellProps {
  cell: { row: number; col: number };
  target: { row: number; col: number };
  snake: { row: number; col: number }[];
  cols: number;
  rows: number;
}
export const DEFAULT_GRID_ROW_AMOUNT: number = 20;
export const DEFAULT_GRID_COL_AMOUNT: number = 20;
export const LOCAL_STORAGE_KEY: string = "snake-game-high-score";
export const DEFAULT_SPEED: number = 70;
