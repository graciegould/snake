import { useEffect, useState } from 'react'
import './scss/app.scss'

const GRID_ROW_AMOUNT = 20;
const GRID_COL_AMOUNT = 20;
const LOCAL_STORAGE_KEY = 'snake-game-high-score';

function getRandomRowAndColumn(excludedCoordinates: { row: number; col: number }[] = []): { row: number; col: number } {
  let row : number, col: number;
  let isExcluded;
  do {
    row = Math.floor(Math.random() * GRID_ROW_AMOUNT);
    col = Math.floor(Math.random() * GRID_COL_AMOUNT);

    isExcluded = excludedCoordinates.some(
      (coord) => coord.row === row && coord.col === col,
    );
  } while (isExcluded);
  return { row, col };
}

interface GameData {
  snake: { row: number; col: number }[];
  target: { row: number; col: number };
  direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
  score: number;
  started: boolean;
  highScore: number;
  speed: number;
}
function App() {
  const [w, setW] = useState<number>(0);
  const [h, setH] = useState<number>(0);
  const _snake: { row: number; col: number }[] = [getRandomRowAndColumn()];
  const [gameData, setGameData] = useState<GameData>({
    snake: _snake,
    target: getRandomRowAndColumn(_snake),
    direction: 'RIGHT',
    score: 0,
    started: false,
    highScore: typeof window !== 'undefined' && localStorage.getItem(LOCAL_STORAGE_KEY)
      ? parseInt(localStorage.getItem(LOCAL_STORAGE_KEY) as string, 10)
      : 0,
    speed: 100,
  });

  useEffect(() => {
    const handleArrowKeys = (e: KeyboardEvent) => {
      let dir = gameData.direction;
      switch (e.key) {
      case 'ArrowUp':
        dir = 'UP';
        break;
      case 'ArrowRight':
        dir = 'RIGHT';
        break;
      case 'ArrowDown':
        dir = 'DOWN';
        break;
      case 'ArrowLeft':
        dir = 'LEFT';
        break;
      default:
        break;
      }
      setGameData((prev) => ({ ...prev, direction: dir }));
    };
    document.addEventListener('keydown', handleArrowKeys);
    return () => document.removeEventListener('keydown', handleArrowKeys);
  }, []);

  useEffect(() => {
    const updateDimensions = () => {
      const windowWidth = window.innerWidth - 20;
      const windowHeight = window.innerHeight - 20;
      const size = Math.min(windowWidth, windowHeight);
      setW(size);
      setH(size);
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [])
  return (
    <div className='app'>
      <ScoreBoard gameData={gameData} setGameData={setGameData} />
      <div className='game-container'>
        <div className='game-area' style={{ width: w + "px", height: h + "px" }}>
          <Grid gameData={gameData} setGameData={setGameData} />
        </div>
      </div>
      <GameSettings gameData={gameData} setGameData={setGameData} />
    </div>
  )
}

function ScoreBoard({ gameData, setGameData }: { gameData: GameData; setGameData: React.Dispatch<React.SetStateAction<GameData>> }) {
  
  return (
    <div className='score-board-container'>
      <div className='score-board-area'>
        <div className='score'>Score: {gameData.score}</div>
        <div className='high-score'>High Score: {gameData.highScore}</div>
      </div>
    </div>
  )
}

function GameSettings({ gameData, setGameData }: { gameData: GameData; setGameData: React.Dispatch<React.SetStateAction<GameData>> }) {
  return (
    <div className="game-settings-container">
      <div className='game-settings-area'>
        <div className='game-settings-item'>
          <button onClick={() => setGameData((prev) => ({ ...prev, started: !prev.started }))
          }>
            {gameData.started ? 'Restart' : 'Start'} Game
          </button>
        </div>
      </div>
    </div>
  )
}

function Grid({ gameData, setGameData }: { gameData: GameData; setGameData: React.Dispatch<React.SetStateAction<GameData>> }) {
  const [grid, setGrid] = useState<{ row: number; col: number; target: boolean }[][]>(
    Array.from({ length: GRID_ROW_AMOUNT }, (_, row) => {
      return Array.from({ length: GRID_COL_AMOUNT }, (_, col) => ({
        row,
        col,
        target: false,
      }));
    }),
  );

  useEffect(() => {
    let interval: any = null;
   function moveSnake() : void {
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
            head.row >= GRID_ROW_AMOUNT ||
            head.col < 0 ||
            head.col >= GRID_COL_AMOUNT
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
          let newSnake = [getRandomRowAndColumn()];
            if (score > highScore) {
              highScore = score;
              localStorage.setItem(LOCAL_STORAGE_KEY, highScore.toString());
            }
            return {
            ...gameData,
            snake: [getRandomRowAndColumn()],
            target: getRandomRowAndColumn(newSnake),
            score: 0,
            started: false,
            highScore: highScore,
            };
        }
        if (targetCollision()) {
          score = score + 1;
          newSnake.unshift({ ...target });
          target = getRandomRowAndColumn(newSnake);
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
    if (gameData.started) {
      interval = setInterval(() => {
        moveSnake();
      }, gameData.speed);
    }
    return () => clearInterval(interval);
  }, [gameData]);
  return (
    <div className='game-grid'>
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className='game-row'>
          {row.map((cell, cellIndex) => <Cell key={cellIndex} cell={cell} target={gameData.target} snake={gameData.snake} />)}
        </div>
      ))}
    </div>
  )
}


const fruitIcons = [
  'banana',
  'coconut',
  'dragon-fruit',
  'kiwi',
  'peach',
  'pineapple',
  'strawberry',
  'watermelon',
];
interface CellProps {
  cell: { row: number; col: number };
  target: { row: number; col: number };
  snake: { row: number; col: number }[];
}

const snakeSkin = [
  '#F8C8DC',
  '#F4A2BB',
  '#F07A9B',
  '#EB537B',
  '#E62C5A',
  '#E01542',
  '#D8102E',
  '#D00A1A',
  '#C60508',
  '#BD0000',
  '#BD0000',
  '#C62A00',
  '#CF5500',
  '#D87F00',
  '#E2AA00',
  '#EBCE00',
  '#F3F100',
  '#F5D171',
  '#F8B282',
  '#FAB494',
  '#FAB494',
  '#F9C18A',
  '#F9CE7F',
  '#F8DB75',
  '#F8E76A',
  '#F7F35F',
  '#F1EF53',
  '#EBEC48',
  '#E5E83C',
  '#DDE433',
  '#DDE433',
  '#D5DF29',
  '#CCE81F',
  '#C3D415',
  '#BACC0B',
  '#A3C400',
  '#8EBB00',
  '#7AB200',
  '#64A900',
  '#4FA100',
  '#4FA100',
  '#529CAD',
  '#5587BA',
  '#5A72C8',
  '#5F5DD6',
  '#6448E4',
  '#6A33F2',
  '#7330FF',
  '#7C4DFF',
  '#856AFF',
  '#856AFF',
  '#8C7EFF',
  '#9382FF',
  '#9A86FF',
  '#A08AFF',
  '#A78EFF',
  '#AE91FF',
  '#B594FF',
  '#BC97FF',
  '#C39AFF',
  '#C39AFF',
  '#C69ADD',
  '#CA96BB',
  '#CE928A',
  '#D18E69',
  '#D58A48',
  '#D98627',
  '#DC8410',
  '#E18100',
  '#E48000',
];

function Cell({ cell, target, snake }: CellProps) {
  const [checked, setChecked] = useState(false);
  const [fruit, setFruit] = useState<string | null>(null);
  const [skinColor, setSkinColor] = useState<string | null>(null);

  const getRandomFruit = (): string => {
    const randomIndex = Math.floor(Math.random() * fruitIcons.length);
    return fruitIcons[randomIndex];
  };

  const cellType = (): 'snake' | 'target' | 'ground' => {
    const isSnake = snake.some(
      (snakeCell) => snakeCell.row === cell.row && snakeCell.col === cell.col,
    );
    const isTarget = target.row === cell.row && target.col === cell.col;
    return isSnake ? 'snake' : isTarget ? 'target' : 'ground';
  };

  useEffect(() => {
    const _cellType = cellType();
    if (_cellType === 'snake') {
      setChecked(true);
      const snakeIndex = snake.findIndex(
        (snakeCell) => snakeCell.row === cell.row && snakeCell.col === cell.col,
      );
      setSkinColor(snakeSkin[snakeIndex % snakeSkin.length]);
      return;
    }
    if (_cellType === 'ground') {
      setSkinColor(null);
      setChecked(false);
      setFruit(null);
      return;
    }
  }, [snake, target]);

  useEffect(() => {
    if (cellType() === 'target' && !fruit) {
      setFruit(getRandomFruit());
      setSkinColor(snakeSkin[snake.length % snakeSkin.length]);
      return;
    } else {
      setFruit(null);
    }
  }, [target]);

  return (
    <div className='game-cell' >
      {fruit ? (
        <img src={`./fruit-icons/${fruit}.png`} alt={fruit} className='game-cell-fruit-img' />
      ) : (
        <div  className='game-cell-snake'     style={{
          backgroundColor: skinColor ? skinColor : 'white',
        }}>
        </div>
        // <input type="checkbox" checked={checked} readOnly className="game-cell-checkbox" />
      )}
    </div>
  );
}

export default App
