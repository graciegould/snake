import { GameData } from './types/types';
import { useEffect } from 'react';
function GameSettings({ gameData, setGameData }: { gameData: GameData; setGameData: React.Dispatch<React.SetStateAction<GameData>> }) {

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space' && !gameData.started) {
        setGameData((prev) => ({ ...prev, started: !prev.started }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [setGameData]);
  return (
    <div className="game-settings-container">
      <div className='game-settings-area'>
        <div className='start-game-container'>
          <button onClick={() => setGameData((prev) => ({ ...prev, started: !prev.started }))
          }>
            {gameData.started ? 'Restart' : 'Start'} Game
          </button>
        </div>
        <div className='difficulty-settings-container'>
          <div className='grid-size-settings'>
            <div className='grid-size-setting'>
              <div className='settings-input-container'>
                <label>Rows</label>
                <input
                  type='number'
                  min={5}
                  max={50}
                  step={1}
                  value={gameData.rows}
                  onChange={(e) => setGameData((prev) => ({ ...prev, rows: parseInt(e.target.value) }))
                  }
                />
              </div>
            </div>
            <div className='grid-size-setting'>
              <div className='settings-input-container'>
                <label>Columns</label>
                <input
                  min={5}
                  max={50}
                  type='number'
                  value={gameData.cols}
                  onChange={(e) => setGameData((prev) => ({ ...prev, cols: parseInt(e.target.value) }))
                  }
                />
              </div>
            </div>
          </div>
          <div className='speed-settings'>
            <div className='speed-setting'>
              <div className='settings-input-container'>
                <label>Speed</label>
                <input type="number"
                  min={1}
                  max={100}
                  step={1}
                  value={gameData.speed}
                  onChange={(e) => setGameData((prev) => ({ ...prev, speed: parseInt(e.target.value) }))}
                />
              </div>
            </div>
          </div>
        </div>
        <div className='snake-skin-settings-container'>
        </div>
      </div>
    </div>
  )
}


export default GameSettings;