import Head from 'next/head';
import { useState, useEffect } from 'react';
import FactorTree from '../components/FactorTree';
import NavBar from '../components/Navbar';
import Footer from '../components/Footer';
import { generateFactorTree, getNextHint, isPrime } from '../lib/factorUtils';

export default function Home() {
  const [incorrectMoves, setIncorrectMoves] = useState(0);
  const [currentNumber, setCurrentNumber] = useState(84);
  const [showHint, setShowHint] = useState(false);
  const [hintText, setHintText] = useState('');
  const [showSolution, setShowSolution] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);

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
    // Check if the current state represents a fully factored tree
    // This is a simplified check - in a real implementation, you'd check the entire tree state
    if (isPrime(currentNumber)) {
      handleCorrectMove();
    } else {
      handleIncorrectMove();
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

  const handleNewGame = () => {
    // Generate a new composite number for the game
    const compositeNumbers = [84, 100, 120, 150, 180, 200, 225, 250, 300];
    const randomIndex = Math.floor(Math.random() * compositeNumbers.length);
    setCurrentNumber(compositeNumbers[randomIndex]);
    setIncorrectMoves(0);
    setShowHint(false);
    setShowSolution(false);
    setGameComplete(false);
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <Head>
        <title>Prime Factor Tree</title>
      </Head>
      <NavBar/>
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
      {/* Game Area - Takes up most of the screen */}
      <div className="flex-1 flex items-center justify-center p-8">
        <FactorTree
          initialNumber={currentNumber}
          onIncorrectMove={handleIncorrectMove}
          onCorrectMove={handleCorrectMove}
          showSolution={showSolution}
        />
      </div>
      <Footer 
        handleHint={handleHint} 
        handleSolution={handleSolution} 
        handleFullyFactored={handleFullyFactored} 
        incorrectMoves={incorrectMoves} 
        handleNewGame={handleNewGame}
      />
    </div>
  );
}
