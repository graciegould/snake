import { useState } from "react";
import "./scss/app.scss";
import ScoreBoard from "./ScoreBoard";
import Grid from "./Grid";
import GameSettings from "./GameSettings";
import {
  GameData,
  DEFAULT_GRID_COL_AMOUNT,
  DEFAULT_GRID_ROW_AMOUNT,
  DEFAULT_SPEED,
  LOCAL_STORAGE_KEY,
} from "./types/types";
import { getRandomRowAndColumn } from "./utils";

function Game() {
  const _snake: { row: number; col: number }[] = [getRandomRowAndColumn()];
  const [gameData, setGameData] = useState<GameData>({
    snake: _snake,
    target: getRandomRowAndColumn(
      _snake,
      DEFAULT_GRID_ROW_AMOUNT,
      DEFAULT_GRID_COL_AMOUNT,
    ),
    direction: "RIGHT",
    score: 0,
    started: false,
    highScore:
      typeof window !== "undefined" && localStorage.getItem(LOCAL_STORAGE_KEY)
        ? parseInt(localStorage.getItem(LOCAL_STORAGE_KEY) as string, 10)
        : 0,
    speed: DEFAULT_SPEED,
    rows: DEFAULT_GRID_ROW_AMOUNT,
    cols: DEFAULT_GRID_COL_AMOUNT,
  });

  return (
    <div className="app">
      <div className="game-container">
        <Grid gameData={gameData} setGameData={setGameData} />
      </div>
      <div className="game-info-container">
        <ScoreBoard gameData={gameData} setGameData={setGameData} />
        <GameSettings gameData={gameData} setGameData={setGameData} />
      </div>
    </div>
  );
}

export default Game;
