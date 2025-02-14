import { CellProps } from "./types/types";
import { useState, useEffect } from "react";
const fruitIcons = [
  "banana",
  "coconut",
  "dragon-fruit",
  "kiwi",
  "peach",
  "pineapple",
  "strawberry",
  "watermelon",
];

const snakeSkin = [
  "#F8C8DC",
  "#F4A2BB",
  "#F07A9B",
  "#EB537B",
  "#E62C5A",
  "#E01542",
  "#D8102E",
  "#D00A1A",
  "#C60508",
  "#BD0000",
  "#BD0000",
  "#C62A00",
  "#CF5500",
  "#D87F00",
  "#E2AA00",
  "#EBCE00",
  "#F3F100",
  "#F5D171",
  "#F8B282",
  "#FAB494",
  "#FAB494",
  "#F9C18A",
  "#F9CE7F",
  "#F8DB75",
  "#F8E76A",
  "#F7F35F",
  "#F1EF53",
  "#EBEC48",
  "#E5E83C",
  "#DDE433",
  "#DDE433",
  "#D5DF29",
  "#CCE81F",
  "#C3D415",
  "#BACC0B",
  "#A3C400",
  "#8EBB00",
  "#7AB200",
  "#64A900",
  "#4FA100",
  "#4FA100",
  "#529CAD",
  "#5587BA",
  "#5A72C8",
  "#5F5DD6",
  "#6448E4",
  "#6A33F2",
  "#7330FF",
  "#7C4DFF",
  "#856AFF",
  "#856AFF",
  "#8C7EFF",
  "#9382FF",
  "#9A86FF",
  "#A08AFF",
  "#A78EFF",
  "#AE91FF",
  "#B594FF",
  "#BC97FF",
  "#C39AFF",
  "#C39AFF",
  "#C69ADD",
  "#CA96BB",
  "#CE928A",
  "#D18E69",
  "#D58A48",
  "#D98627",
  "#DC8410",
  "#E18100",
  "#E48000",
];

function Cell({ cell, target, snake, cols }: CellProps) {
  const [fruit, setFruit] = useState<string | null>(null);
  const [skinColor, setSkinColor] = useState<string | null>(null);

  const getRandomFruit = (): string => {
    const randomIndex = Math.floor(Math.random() * fruitIcons.length);
    return fruitIcons[randomIndex];
  };

  const cellType = (): "snake" | "target" | "ground" => {
    const isSnake = snake.some(
      (snakeCell) => snakeCell.row === cell.row && snakeCell.col === cell.col,
    );
    const isTarget = target.row === cell.row && target.col === cell.col;
    return isSnake ? "snake" : isTarget ? "target" : "ground";
  };

  useEffect(() => {
    const _cellType = cellType();
    if (_cellType === "snake") {
      const snakeIndex = snake.findIndex(
        (snakeCell) => snakeCell.row === cell.row && snakeCell.col === cell.col,
      );
      setSkinColor(snakeSkin[snakeIndex % snakeSkin.length]);
      return;
    }
    if (_cellType === "ground") {
      setSkinColor(null);
      setFruit(null);
      return;
    }
  }, [snake, target]);

  useEffect(() => {
    if (cellType() === "target" && !fruit) {
      setFruit(getRandomFruit());
      setSkinColor(snakeSkin[snake.length % snakeSkin.length]);
      return;
    } else {
      setFruit(null);
    }
  }, [target]);

  return (
    <div
      className="game-cell"
      style={{
        width: `${100 / cols}%`,
      }}
    >
      <div
        className={`game-cell-bg ${cellType() === "target" ? "target-cell" : ""}`}
        style={{
          backgroundColor: cellType() === "ground" ? "white" : "transparent",
          border: cellType() === "target" ? "none" : "1px solid white",
        }}
      >
        {fruit ? (
          <img
            src={`./fruit-icons/${fruit}.png`}
            alt={fruit}
            className="game-cell-fruit-img target-cell"
          />
        ) : (
          <div
            className="game-cell-snake"
            style={{
              backgroundColor: skinColor ? skinColor : "black",
            }}
          ></div>
        )}
      </div>
    </div>
  );
}

export default Cell;
