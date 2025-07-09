import Head from 'next/head';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import FactorTree from '../components/FactorTree';
import ControlButtons from '../components/ControlButtons';
import IncorrectMoves from '../components/IncorrectMoves';
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
      {/* NavBar */}
      <div className="relative w-full flex items-center justify-between px-6 py-3" style={{ backgroundColor: '#FCF9F2' }}>
        <div className="absolute top-3 left-3">
          <Image 
            src="/images/main.png" 
            alt="Logo" 
            width={300} 
            height={300} 
            className="object-contain"
          />
        </div>
        <div className="flex gap-4 ml-auto">
          <button className="px-4 py-2 rounded text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">Login</button>
          <button 
            className="px-4 py-2 rounded text-sm font-medium text-white"
            style={{ backgroundColor: '#2B6C8D' }}
          >
            Sign Up
          </button>
        </div>
      </div>
      {/* End NavBar */}
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
      {/* Bottom Controls */}
      <div className="p-4 bg-white border-t border-gray-200" style={{ backgroundColor: '#FCF9F2' }}>
        <div 
          className="flex mb-3"
          style={{
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%'
          }}
        >
          {/* Left */}
          <div className="flex gap-4">
            <button 
              className="text-white px-4 py-2 rounded "
              onClick={handleHint}
              style={{ backgroundColor: '#008379' }}
            >
              Hint
            </button>
            <button 
              className="px-4 py-2 rounded transition-colors"
              style={{
                backgroundColor: '#DB8C9B',
                color: '#000000'
              }}
              onClick={handleSolution}
            >
              Solution
            </button>
          </div>
          {/* Center */}
          <button 
            className="text-white px-4 py-2 rounded"
            onClick={handleFullyFactored}
            style={{ backgroundColor: '#376783' }}
          >
            Fully Factored
          </button>
          {/* Right */}
          <div className="flex items-center gap-4">
            <IncorrectMoves count={incorrectMoves} />
            <button 
              className="px-4 py-2 rounded transition-colors"
              style={{
                backgroundColor: '#008379',
                color: '#ffffff'
              }}
              onClick={handleNewGame}
            >
              New Game
            </button>
          </div>
        </div>
        <div className="text-center text-gray-500 text-sm mt-3">
          Click on numbers to factor them, or click "Fully Factored" when you think a number is prime.
        </div>
      </div>
    </div>
  );
}
