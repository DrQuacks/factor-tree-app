import { useState } from 'react';
import { DifficultyLevel } from '../lib/constants';

interface NavBarProps {
  onNewNumber: () => void;
  onHint: () => void;
  onSolution: () => void;
  onLoginSignUp: () => void;
  onFullyFactored: () => void;
  onDifficultyChange: (difficulty: DifficultyLevel) => void;
  currentDifficulty: DifficultyLevel;
  incorrectMoves: number;
}

const NavBar = ({ onNewNumber, onHint, onSolution, onLoginSignUp, onFullyFactored, onDifficultyChange, currentDifficulty, incorrectMoves }: NavBarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDifficultySubmenu, setShowDifficultySubmenu] = useState(false);

  return (
    <div className="relative w-full flex items-center justify-between px-6 py-2 border-b border-gray-200" style={{ backgroundColor: '#FCF9F2' }}>
      {/* Left side - Accordion Menu */}
      <div className="relative">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="px-4 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors border border-slate-200 bg-white shadow-sm"
        >
          ☰
        </button>
        
        {isMenuOpen && (
          <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-md shadow-lg z-50 min-w-48">
            <button
              onClick={() => { onNewNumber(); setIsMenuOpen(false); }}
              className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors border-b border-slate-100"
            >
              New Number
            </button>
            
            {/* Difficulty Selection */}
            <div className="relative border-b border-slate-100">
              <button
                onClick={() => setShowDifficultySubmenu(!showDifficultySubmenu)}
                className="flex items-center justify-between w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <span>Difficulty</span>
                <span className="text-xs">▶</span>
              </button>
              
              {showDifficultySubmenu && (
                <div className="absolute left-full top-0 ml-1 bg-white border border-slate-200 rounded-md shadow-lg z-50 min-w-32">
                  <button
                    onClick={() => { onDifficultyChange('EASY'); setIsMenuOpen(false); setShowDifficultySubmenu(false); }}
                    className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                      currentDifficulty === 'EASY' 
                        ? 'text-indigo-700 bg-indigo-50' 
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    Easy
                  </button>
                  <button
                    onClick={() => { onDifficultyChange('MEDIUM'); setIsMenuOpen(false); setShowDifficultySubmenu(false); }}
                    className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                      currentDifficulty === 'MEDIUM' 
                        ? 'text-indigo-700 bg-indigo-50' 
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    Medium
                  </button>
                  <button
                    onClick={() => { onDifficultyChange('HARD'); setIsMenuOpen(false); setShowDifficultySubmenu(false); }}
                    className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                      currentDifficulty === 'HARD' 
                        ? 'text-indigo-700 bg-indigo-50' 
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    Hard
                  </button>
                </div>
              )}
            </div>
            
            <button
              onClick={() => { onHint(); setIsMenuOpen(false); }}
              className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors border-b border-slate-100"
            >
              Hint
            </button>
            <button
              onClick={() => { onSolution(); setIsMenuOpen(false); }}
              className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors border-b border-slate-100"
            >
              Solution
            </button>
            <button
              onClick={() => { onLoginSignUp(); setIsMenuOpen(false); }}
              className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Login/Sign Up
            </button>
          </div>
        )}
      </div>

      {/* Center - Title */}
      <div className="absolute left-1/2 transform -translate-x-1/2 h-full flex items-center">
        <div className="text-3xl font-light tracking-wider" style={{ color: '#4A6FA5', fontFamily: 'Georgia, serif' }}>
          Prime Factor Trees
        </div>
      </div>

      {/* Right side - Fully Factored button and Incorrect indicator */}
      <div className="flex items-center gap-4">
        <div className="text-sm text-slate-600 font-medium bg-slate-100 px-3 py-1 rounded-md">
          Incorrect: {incorrectMoves}
        </div>
        <button
          onClick={onFullyFactored}
          className="px-4 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm"
        >
          Fully Factored
        </button>
      </div>
    </div>
  );
};

export default NavBar;