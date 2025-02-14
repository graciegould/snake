import { GameData } from './types/types';

function ScoreBoard({ gameData }: { gameData: GameData; setGameData: React.Dispatch<React.SetStateAction<GameData>> }) {
    return (
        <div className='score-board-container'>
            <div className='score-board-area'>
                <div className='score-item'>
                    <div className='score'>
                        <div className='score-label'>SCORE </div>
                        <div className='score-value'>{gameData.score}</div>
                    </div>
                </div>
                <div className='score-item'>
                    <div className='score'>
                        <div className='score-label'>HIGH SCORE</div>
                        <div className='score-value'>{gameData.highScore}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ScoreBoard;