import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';
import FactorTree from '../components/FactorTree';
import NavBar from '../components/Navbar';
import { generateFactorTree, getNextHint, isPrime } from '../lib/factorUtils';

export default function Home() {
  const [incorrectMoves, setIncorrectMoves] = useState(0);
  const [currentNumber, setCurrentNumber] = useState(84);
  const [showHint, setShowHint] = useState(false);
  const [hintText, setHintText] = useState('');
  const [showSolution, setShowSolution] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [showValidationFailed, setShowValidationFailed] = useState(false);
  const factorTreeRef = useRef<{ handleFullyFactored: () => void } | null>(null);

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
    const hint = getNextHint({ value: currentNumber, isPrime: isPrime(currentNumber), children: [] });
    setHintText(hint);
    setShowHint(true);
    
    // Hide hint after 5 seconds
    setTimeout(() => {
      setShowHint(false);
    }, 5000);
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
    // Generate a new composite number for the game
    const compositeNumbers = [84, 100, 120, 150, 180, 200, 225, 250, 300];
    const randomIndex = Math.floor(Math.random() * compositeNumbers.length);
    setCurrentNumber(compositeNumbers[randomIndex]);
    setIncorrectMoves(0);
    setShowHint(false);
    setShowSolution(false);
    setGameComplete(false);
    setShowValidationFailed(false);
  };

  const handleLoginSignUp = () => {
    // Placeholder for login/signup functionality
    console.log('Login/Sign Up clicked');
  };

  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: '#FCF9F2' }}>
      <Head>
        <title>Prime Factor Tree</title>
      </Head>
      <NavBar
        onNewNumber={handleNewGame}
        onHint={handleHint}
        onSolution={handleSolution}
        onLoginSignUp={handleLoginSignUp}
        onFullyFactored={handleFullyFactored}
        incorrectMoves={incorrectMoves}
      />
      {gameComplete && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 text-center">
            <p className="text-xl font-semibold mb-4">🎉 Congratulations!</p>
            <button 
              onClick={handleNewGame}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              New Game
            </button>
          </div>
        </div>
      )}
      {showValidationFailed && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 text-center">
            <p className="text-xl font-semibold mb-4 text-red-600">❌ Keep Trying</p>
            <button 
              onClick={() => setShowValidationFailed(false)}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      )}
      {/* Game Area - Takes up most of the screen */}
      <div className="flex-1 flex items-center justify-center p-8">
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
