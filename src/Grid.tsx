import { GameData, LOCAL_STORAGE_KEY } from "./types/types";
import { useState, useEffect } from "react";
import Cell from "./Cell";
import { getRandomRowAndColumn, map } from "./utils";

function Grid({
  gameData,
  setGameData,
}: {
  gameData: GameData;
  setGameData: React.Dispatch<React.SetStateAction<GameData>>;
}) {
  const [grid, setGrid] = useState<
    { row: number; col: number; target: boolean }[][]
  >(() => generateGrid(gameData.rows, gameData.cols));
  function generateGrid(rows: number, cols: number) {
    return Array.from({ length: rows }, (_, row) => {
      return Array.from({ length: cols }, (_, col) => ({
        row,
        col,
        target: false,
      }));
    });
  }
  useEffect(() => {
    setGrid(generateGrid(gameData.rows, gameData.cols));
  }, [gameData.rows, gameData.cols]);
  useEffect(() => {
    const handleArrowKeys = (e: KeyboardEvent) => {
      let dir = gameData.direction;
      switch (e.key) {
        case "ArrowUp":
        case "w":
          dir = "LEFT";
          break;
        case "ArrowRight":
        case "d":
          dir = "DOWN";
          break;
        case "ArrowDown":
        case "s":
          dir = "RIGHT";
          break;
        case "ArrowLeft":
        case "a":
          dir = "UP";
          break;
        default:
          break;
      }
      setGameData((prev) => ({ ...prev, direction: dir }));
    };
    document.addEventListener("keydown", handleArrowKeys);
    return () => document.removeEventListener("keydown", handleArrowKeys);
  }, []);

  useEffect(() => {
    let interval: any = null;
    function moveSnake(): void {
      setGameData((prev) => {
        const moveDirection = {
          RIGHT: { row: 1, col: 0 },
          LEFT: { row: -1, col: 0 },
          DOWN: { row: 0, col: 1 },
          UP: { row: 0, col: -1 },
        };
        const directionDelta = moveDirection[prev.direction];
        let snake = prev.snake;
        let head = snake[prev.snake.length - 1];
        const newHead = {
          row: head.row + directionDelta.row,
          col: head.col + directionDelta.col,
        };
        let newSnake = [...prev.snake];
        let highScore = prev.highScore;
        let score = prev.score;
        let target = prev.target;

        function wallCollision() {
          if (
            head.row < 0 ||
            head.row >= gameData.rows ||
            head.col < 0 ||
            head.col >= gameData.cols
          ) {
            return true;
          }
        }

        function selfCollision() {
          if (
            prev.snake.some(
              (cell) => cell.row === newHead.row && cell.col === newHead.col,
            )
          ) {
            return true;
          }
        }

        function targetCollision() {
          if (head.row == prev.target.row && head.col == prev.target.col) {
            return true;
          }
        }

        if (wallCollision() || selfCollision()) {
          clearInterval(interval);
          let newSnake = [
            getRandomRowAndColumn([], gameData.rows, gameData.cols),
          ];
          if (score > highScore) {
            highScore = score;
            localStorage.setItem(LOCAL_STORAGE_KEY, highScore.toString());
          }
          return {
            ...gameData,
            snake: [getRandomRowAndColumn([], gameData.rows, gameData.cols)],
            target: getRandomRowAndColumn(
              newSnake,
              gameData.rows,
              gameData.cols,
            ),
            score: 0,
            started: false,
            highScore: highScore,
          };
        }
        if (targetCollision()) {
          score = score + 1;
          newSnake.unshift({ ...target });
          target = getRandomRowAndColumn(
            newSnake,
            gameData.rows,
            gameData.cols,
          );
        }
        newSnake.push(newHead);
        newSnake.shift();
        return {
          ...prev,
          score: score,
          target: target,
          highScore: highScore,
          snake: newSnake,
        };
      });
    }
    let millis = map(gameData.speed, 1, 100, 300, 10);
    if (gameData.started) {
      interval = setInterval(() => {
        moveSnake();
      }, millis);
    }
    return () => clearInterval(interval);
  }, [gameData]);

  return (
    <div className="game-grid-container">
      <div className="game-grid">
        {grid.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="game-row"
            style={{
              height: `${100 / gameData.rows}%`,
            }}
          >
            {row.map((cell, cellIndex) => (
              <Cell
                key={cellIndex}
                cell={cell}
                target={gameData.target}
                snake={gameData.snake}
                rows={gameData.rows}
                cols={gameData.cols}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Grid;
