import { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { DifficultyLevel } from '../lib/constants';
import UserProfile from './UserProfile';
import Image from 'next/image';

interface NavBarProps {
  onNewNumber: () => void;
  onHint: () => void;
  onFullyFactored: () => void;
  onDifficultyChange: (difficulty: DifficultyLevel) => void;
  currentDifficulty: DifficultyLevel;
  incorrectMoves: number;
  showGameControls?: boolean; // New prop to control game-specific elements
  isOnDashboard?: boolean; // New prop to detect if on dashboard
}

const NavBar = ({ onNewNumber, onHint, onFullyFactored, onDifficultyChange, currentDifficulty, incorrectMoves, showGameControls = true, isOnDashboard = false }: NavBarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDifficultySubmenu, setShowDifficultySubmenu] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showMobileUserProfile, setShowMobileUserProfile] = useState(false);
  const { data: session } = useSession();

  return (
    <div className="relative w-full border-b border-gray-200" style={{ backgroundColor: '#FCF9F2' }}>
      {/* Desktop Layout - Single Line */}
      <div className="hidden sm:flex items-center justify-between px-6 py-2">
        {/* Left side - Accordion Menu */}
        <div className="relative flex-shrink-0">
          <button
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
              if (isMenuOpen) {
                setShowDifficultySubmenu(false);
                setShowUserProfile(false);
                setShowMobileUserProfile(false);
              }
            }}
            className="px-4 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors border border-slate-200 bg-white shadow-sm"
          >
            ☰
          </button>
          
          {isMenuOpen && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-md shadow-lg z-50 min-w-48">
              {showGameControls && (
                <>
                  <button
                    onClick={() => { onNewNumber(); setIsMenuOpen(false); }}
                    className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors border-b border-slate-100"
                  >
                    New Number
                  </button>
                  
                  {/* Difficulty Selection */}
                  <div className="relative border-b border-slate-100">
                    <button
                      onClick={() => {
                        setShowDifficultySubmenu(!showDifficultySubmenu);
                        if (!showDifficultySubmenu) {
                          setShowUserProfile(false);
                          setShowMobileUserProfile(false);
                        }
                      }}
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
                </>
              )}
              {isOnDashboard ? (
                <button
                  onClick={() => { 
                    window.location.href = '/';
                    setIsMenuOpen(false); 
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors border-b border-slate-100"
                >
                  Back to Game
                </button>
              ) : session ? (
                <button
                  onClick={() => { 
                    window.location.href = '/dashboard';
                    setIsMenuOpen(false); 
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors border-b border-slate-100"
                >
                  Dashboard
                </button>
              ) : (
                <button
                  onClick={() => { signIn(); setIsMenuOpen(false); }}
                  className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Login/Sign Up
                </button>
              )}
            </div>
          )}
        </div>

        {/* Center - Title */}
        <div className="flex-1 flex justify-center items-center min-w-0">
          <button
            onClick={() => window.location.href = '/'}
            className="text-3xl font-light tracking-wider hover:opacity-80 transition-opacity cursor-pointer truncate"
            style={{ color: '#4A6FA5', fontFamily: 'Georgia, serif' }}
          >
            Prime Factor Trees
          </button>
        </div>

        {/* Right side - Fully Factored button and Incorrect indicator */}
        <div className="flex items-center gap-2 lg:gap-4 flex-shrink-0">
          {showGameControls && (
            <>
              <div className="text-xs lg:text-sm text-slate-600 font-medium bg-slate-100 px-2 lg:px-3 py-1 rounded-md whitespace-nowrap">
                Incorrect: {incorrectMoves}
              </div>
              <button
                onClick={onFullyFactored}
                className="px-2 lg:px-4 py-2 rounded-md text-xs lg:text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm whitespace-nowrap"
              >
                Factored
              </button>
            </>
          )}
          
          {/* User Profile Button */}
          {session?.user && (
            <div className="relative">
              <button
                onClick={() => setShowUserProfile(!showUserProfile)}
                className="flex items-center space-x-2 p-2 rounded-md hover:bg-slate-50 transition-colors"
              >
                {session.user.image ? (
                  <div className="relative w-8 h-8 rounded-full overflow-hidden">
                    <Image
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {session.user.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                )}
              </button>
              {showUserProfile && (
                <UserProfile onClose={() => setShowUserProfile(false)} />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Layout - 3 Columns */}
      <div className="sm:hidden flex items-center justify-between px-4 py-1">
        {/* First Column - Hamburger Menu */}
        <div className="relative flex items-center">
          <button
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
              if (isMenuOpen) {
                setShowDifficultySubmenu(false);
                setShowUserProfile(false);
                setShowMobileUserProfile(false);
              }
            }}
            className="px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors border border-slate-200 bg-white shadow-sm"
          >
            ☰
          </button>
          
          {isMenuOpen && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-md shadow-lg z-50 min-w-40 w-48">
              {isOnDashboard ? (
                <button
                  onClick={() => { 
                    window.location.href = '/';
                    setIsMenuOpen(false); 
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors border-b border-slate-100"
                >
                  Back to Game
                </button>
              ) : showGameControls ? (
                <>
                  <button
                    onClick={() => { onNewNumber(); setIsMenuOpen(false); }}
                    className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors border-b border-slate-100"
                  >
                    New Number
                  </button>
                  
                  {/* Difficulty Selection */}
                  <div className="relative border-b border-slate-100">
                    <button
                      onClick={() => {
                        setShowDifficultySubmenu(!showDifficultySubmenu);
                        if (!showDifficultySubmenu) {
                          setShowUserProfile(false);
                          setShowMobileUserProfile(false);
                        }
                      }}
                      className="flex items-center justify-between w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <span>Difficulty</span>
                      <span className="text-xs">▶</span>
                    </button>
                    
                    {showDifficultySubmenu && (
                      <div className="absolute left-full top-0 ml-1 bg-white border border-slate-200 rounded-md shadow-lg z-50 min-w-28 w-32">
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
                </>
              ) : null}
              
              {session ? (
                <>
                  {!isOnDashboard && (
                    <button
                      onClick={() => { 
                        window.location.href = '/dashboard';
                        setIsMenuOpen(false); 
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors border-b border-slate-100"
                    >
                      Dashboard
                    </button>
                  )}
                  <div className="relative">
                    <button
                      onClick={() => { 
                        setShowMobileUserProfile(!showMobileUserProfile); 
                        if (!showMobileUserProfile) {
                          setShowDifficultySubmenu(false);
                          setShowUserProfile(false);
                        }
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      Profile
                    </button>
                    {showMobileUserProfile && (
                      <div className="absolute left-full top-0 ml-1 bg-white border border-slate-200 rounded-md shadow-lg z-50 w-40">
                        <div className="p-2 border-b border-slate-100">
                          <div className="flex items-center space-x-2">
                            {session.user.image && (
                              <div className="relative w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                                <Image
                                  src={session.user.image}
                                  alt={session.user.name || 'User'}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-slate-900 truncate">
                                {session.user.name}
                              </p>
                              <p className="text-xs text-slate-500 truncate">
                                {session.user.email}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="p-1">
                          <button
                            onClick={() => { 
                              signOut({ callbackUrl: '/' }); 
                              setShowMobileUserProfile(false);
                              setIsMenuOpen(false);
                            }}
                            className="w-full text-left px-2 py-1 text-xs text-slate-700 hover:bg-slate-50 rounded transition-colors"
                          >
                            Sign out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <button
                  onClick={() => { signIn(); setIsMenuOpen(false); }}
                  className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Login/Sign Up
                </button>
              )}
            </div>
          )}
        </div>
        
        {/* Second Column - Title */}
        <div className="flex-1 flex justify-center">
          <button
            onClick={() => window.location.href = '/'}
            className="text-2xl font-light tracking-wider text-center hover:opacity-80 transition-opacity cursor-pointer"
            style={{ color: '#4A6FA5', fontFamily: 'Georgia, serif' }}
          >
            Prime Factor Trees
          </button>
        </div>
        
        {/* Third Column - Profile Avatar (only on dashboard) */}
        {isOnDashboard && session?.user && (
          <div className="flex items-center ml-2">
            <button
              onClick={() => setShowUserProfile(!showUserProfile)}
              className="flex items-center space-x-2 p-1 rounded-full hover:bg-slate-100 transition-colors"
            >
              {session.user.image ? (
                <div className="relative w-8 h-8 rounded-full overflow-hidden">
                  <Image
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {session.user.name?.charAt(0) || 'U'}
                  </span>
                </div>
              )}
            </button>
            {showUserProfile && (
              <UserProfile onClose={() => setShowUserProfile(false)} />
            )}
          </div>
        )}
        
        {/* Third Column - Counter and Button (2 rows) */}
        {showGameControls && (
          <div className="flex flex-col space-y-1">
            {/* Top Row - Incorrect Counter */}
            <div className="flex items-center justify-end space-x-2 px-2 py-2 rounded-md bg-slate-100">
              <span className="text-xs font-medium text-slate-600">Incorrect:</span>
              <span className="text-xs font-bold text-slate-600">{incorrectMoves}</span>
            </div>
            {/* Bottom Row - Factored Button */}
            <button
              onClick={onFullyFactored}
              className="px-2 py-2 rounded-md text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm"
            >
              Factored
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;