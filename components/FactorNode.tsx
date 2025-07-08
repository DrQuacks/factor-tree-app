import React, { useState } from 'react';

interface Props {
  value: number;
  onIncorrectMove: () => void;
  onCorrectMove: () => void;
  onFactor: (factor1: number, factor2: number) => void;
  isFullyFactored: boolean;
  showFeedback: boolean;
  feedbackType: 'correct' | 'incorrect' | null;
  scaleFactor: number;
}

export default function FactorNode({
  value,
  onIncorrectMove,
  onCorrectMove,
  onFactor,
  isFullyFactored,
  showFeedback,
  feedbackType,
  scaleFactor
}: Props) {
  const [showFactorInputs, setShowFactorInputs] = useState(false);
  const [factor1, setFactor1] = useState('');
  const [factor2, setFactor2] = useState('');

  const handleClick = () => {
    if (isFullyFactored) {
      onCorrectMove();
    } else {
      setShowFactorInputs(true);
    }
  };

  const handleFactorSubmit = () => {
    const f1 = parseInt(factor1);
    const f2 = parseInt(factor2);
    
    if (f1 && f2 && f1 * f2 === value) {
      onFactor(f1, f2);
      setShowFactorInputs(false);
      setFactor1('');
      setFactor2('');
    } else {
      onIncorrectMove();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleFactorSubmit();
    }
  };

  // Calculate dynamic sizes based on scale factor
  const boxSize = Math.max(40, 80 * scaleFactor);
  const fontSize = Math.max(12, 24 * scaleFactor);
  const padding = Math.max(4, 8 * scaleFactor);

  return (
    <div className="flex flex-col items-center">
      {/* Main number box */}
      <div
        className="relative cursor-pointer rounded-lg bg-white shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center justify-center"
        style={{
          width: `${boxSize}px`,
          height: `${boxSize}px`,
          fontSize: `${fontSize}px`,
          padding: `${padding}px`,
          border: '1px solid black'
        }}
        onClick={handleClick}
        onMouseEnter={(e) => {
          e.currentTarget.style.cursor = 'pointer';
        }}
      >
        <span className="font-bold text-gray-800">{value}</span>
        
        {/* Feedback icons */}
        {showFeedback && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 rounded-lg">
            {feedbackType === 'correct' && (
              <span className="text-green-500 text-2xl">✓</span>
            )}
            {feedbackType === 'incorrect' && (
              <span className="text-red-500 text-2xl">✗</span>
            )}
          </div>
        )}
      </div>

      {/* Factor input boxes - only show after animation */}
      {showFactorInputs && (
        <div className="mt-4 flex gap-4 items-center">
          <input
            type="number"
            value={factor1}
            onChange={(e) => setFactor1(e.target.value)}
            onKeyPress={handleKeyPress}
            className="rounded-lg text-center font-bold bg-white shadow-md hover:shadow-lg transition-all duration-200"
            style={{
              width: `${boxSize * 0.8}px`,
              height: `${boxSize * 0.8}px`,
              fontSize: `${fontSize * 0.8}px`,
              padding: `${padding * 0.8}px`,
              border: '1px solid black',
              WebkitAppearance: 'none',
              MozAppearance: 'textfield',
              appearance: 'none'
            }}
            placeholder="?"
            autoFocus
          />
          <input
            type="number"
            value={factor2}
            onChange={(e) => setFactor2(e.target.value)}
            onKeyPress={handleKeyPress}
            className="rounded-lg text-center font-bold bg-white shadow-md hover:shadow-lg transition-all duration-200"
            style={{
              width: `${boxSize * 0.8}px`,
              height: `${boxSize * 0.8}px`,
              fontSize: `${fontSize * 0.8}px`,
              padding: `${padding * 0.8}px`,
              border: '1px solid black',
              WebkitAppearance: 'none',
              MozAppearance: 'textfield',
              appearance: 'none'
            }}
            placeholder="?"
          />
        </div>
      )}
    </div>
  );
}
