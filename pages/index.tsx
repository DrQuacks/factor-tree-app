import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';
import FactorTree from '../components/FactorTree';
import NavBar from '../components/Navbar';
import { generateFactorTree, isPrime } from '../lib/factorUtils';
import { GAME_DIFFICULTY, DifficultyLevel } from '../lib/constants';

export default function Home() {
  const [incorrectMoves, setIncorrectMoves] = useState(0);
  const [currentDifficulty, setCurrentDifficulty] = useState<DifficultyLevel>('MEDIUM');
  const [currentNumber, setCurrentNumber] = useState(84);
  const [showHint, setShowHint] = useState(false);
  const [hintText, setHintText] = useState('');
  const [showSolution, setShowSolution] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [showValidationFailed, setShowValidationFailed] = useState(false);
  const factorTreeRef = useRef<{ handleFullyFactored: () => void; getHint: () => string | null } | null>(null);

  const handleIncorrectMove = () => {
    setIncorrectMoves(prev => prev + 1);
  };

  const handleCorrectMove = () => {
    // Check if the entire tree is complete
    const solutionTree = generateFactorTree(currentNumber);
    // For now, just show success message
    setGameComplete(true);
  };

  const handleFullyFactored = () => {
    // Call FactorTree's validation function
    if (factorTreeRef.current) {
      factorTreeRef.current.handleFullyFactored();
    }
  };

  const handleHint = () => {
    const hint = factorTreeRef.current?.getHint();
    if (hint) {
      setHintText(hint);
      setShowHint(true);
      
      // Hide hint after 5 seconds
      setTimeout(() => {
        setShowHint(false);
      }, 5000);
    } else {
      // No hint available - show a different message
      setHintText("No hint available - the tree is fully factored!");
      setShowHint(true);
      
      // Hide hint after 3 seconds
      setTimeout(() => {
        setShowHint(false);
      }, 3000);
    }
  };

  const handleSolution = () => {
    setShowSolution(true);
    
    // Hide solution after 10 seconds
    setTimeout(() => {
      setShowSolution(false);
    }, 10000);
  };

  const handleValidationFailed = () => {
    setShowValidationFailed(true);
  };

  const handleNewGame = () => {
    // Generate a new composite number for the current difficulty
    const numbers = GAME_DIFFICULTY[currentDifficulty];
    const randomIndex = Math.floor(Math.random() * numbers.length);
    setCurrentNumber(numbers[randomIndex]);
    setIncorrectMoves(0);
    setShowHint(false);
    setShowSolution(false);
    setGameComplete(false);
    setShowValidationFailed(false);
  };

  const handleDifficultyChange = (difficulty: DifficultyLevel) => {
    setCurrentDifficulty(difficulty);
    // Generate a new number for the selected difficulty
    const numbers = GAME_DIFFICULTY[difficulty];
    const randomIndex = Math.floor(Math.random() * numbers.length);
    setCurrentNumber(numbers[randomIndex]);
    setIncorrectMoves(0);
    setShowHint(false);
    setShowSolution(false);
    setGameComplete(false);
    setShowValidationFailed(false);
  };



  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: '#FCF9F2' }}>
      <Head>
        <title>Prime Factor Tree</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>
      <NavBar
        onNewNumber={handleNewGame}
        onHint={handleHint}
        onSolution={handleSolution}
        onFullyFactored={handleFullyFactored}
        onDifficultyChange={handleDifficultyChange}
        currentDifficulty={currentDifficulty}
        incorrectMoves={incorrectMoves}
      />
      {gameComplete && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 sm:p-8 text-center max-w-sm w-full">
            <p className="text-lg sm:text-xl font-semibold mb-4">🎉 Congratulations!</p>
            <button 
              onClick={handleNewGame}
              className="bg-blue-600 text-white px-4 sm:px-6 py-2 rounded hover:bg-blue-700 transition-colors text-sm sm:text-base"
            >
              New Game
            </button>
          </div>
        </div>
      )}
      {showValidationFailed && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 sm:p-8 text-center max-w-sm w-full">
            <p className="text-lg sm:text-xl font-semibold mb-4 text-red-600">❌ Keep Trying</p>
            <button 
              onClick={() => setShowValidationFailed(false)}
              className="bg-blue-600 text-white px-4 sm:px-6 py-2 rounded hover:bg-blue-700 transition-colors text-sm sm:text-base"
            >
              Continue
            </button>
          </div>
        </div>
      )}
      {showHint && (
        <div className="absolute top-16 sm:top-20 left-1/2 transform -translate-x-1/2 bg-blue-100 border border-blue-300 rounded-lg p-3 sm:p-4 shadow-lg z-40 max-w-xs sm:max-w-md mx-4">
          <div className="flex items-center gap-2">
            <span className="text-blue-600 text-base sm:text-lg">💡</span>
            <p className="text-blue-800 font-medium text-sm sm:text-base">{hintText}</p>
          </div>
        </div>
      )}
      {/* Game Area - Takes up most of the screen */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <FactorTree
          initialNumber={currentNumber}
          onIncorrectMove={handleIncorrectMove}
          onCorrectMove={handleCorrectMove}
          showSolution={showSolution}
          onFullyFactored={handleFullyFactored}
          onValidationFailed={handleValidationFailed}
          ref={factorTreeRef}
        />
      </div>

    </div>
  );
}
