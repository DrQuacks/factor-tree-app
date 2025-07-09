import React, { useState } from 'react';
import { FACTOR_TREE_CONSTANTS } from '../lib/constants';

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
  const [isAnimating, setIsAnimating] = useState(false);
  const [showLines, setShowLines] = useState(false);

  const handleClick = () => {
    if (isFullyFactored) {
      onCorrectMove();
    } else {
      // Phase 1: Start moving up
      setIsAnimating(true);
      
      // Phase 2: Show factor inputs after move starts
      setTimeout(() => {
        setShowFactorInputs(true);
      }, 400);
      
      // Phase 3: Show connecting lines after boxes appear
      setTimeout(() => {
        setShowLines(true);
      }, 800);
      
      // Reset animation state
      setTimeout(() => {
        setIsAnimating(false);
      }, 1200);
    }
  };

  const handleFactorSubmit = () => {
    const f1 = parseInt(factor1);
    const f2 = parseInt(factor2);
    
    if (f1 && f2 && f1 * f2 === value) {
      onFactor(f1, f2);
      setShowFactorInputs(false);
      setShowLines(false);
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

  // Calculate dynamic sizes based on scale factor and constants
  const boxSize = Math.max(
    FACTOR_TREE_CONSTANTS.MIN_BOX_SIZE, 
    FACTOR_TREE_CONSTANTS.BASE_BOX_SIZE * scaleFactor
  );
  const fontSize = Math.max(
    FACTOR_TREE_CONSTANTS.MIN_FONT_SIZE, 
    FACTOR_TREE_CONSTANTS.BASE_FONT_SIZE * scaleFactor
  );
  const padding = Math.max(
    FACTOR_TREE_CONSTANTS.MIN_PADDING, 
    FACTOR_TREE_CONSTANTS.BASE_PADDING * scaleFactor
  );
  
  // Calculate child box dimensions and spacing
  const childBoxSize = boxSize * FACTOR_TREE_CONSTANTS.CHILD_BOX_RATIO;
  const verticalGap = boxSize * FACTOR_TREE_CONSTANTS.VERTICAL_GAP_RATIO;
  const horizontalGap = boxSize * FACTOR_TREE_CONSTANTS.HORIZONTAL_GAP_RATIO;
  
  // Calculate SVG dimensions and line positions
  const svgWidth = horizontalGap + childBoxSize; // Full width: gap + child box width
  const svgHeight = verticalGap; // Just the spacing between parent and children
  const parentCenterX = svgWidth / 2;
  const leftChildCenterX = childBoxSize / 2; // Center of left child (half box width from left)
  const rightChildCenterX = horizontalGap + childBoxSize / 2; // Center of right child

  return (
    <div className="flex flex-col items-center relative">
      {/* Main number box */}
      <div
        className="relative cursor-pointer rounded-lg bg-white shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center"
        style={{
          width: `${boxSize}px`,
          height: `${boxSize}px`,
          fontSize: `${fontSize}px`,
          padding: `${padding}px`,
          border: '1px solid black',
          transform: isAnimating ? 'translateY(-20px)' : 'translateY(0)'
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

      {/* Diagonal connecting lines */}
      {showLines && showFactorInputs && (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {/* Line to left factor box */}
          <svg
            className="absolute"
            style={{
              top: `${boxSize}px`, // Start from bottom of parent box
              left: '50%',
              width: `${svgWidth}px`, // Width to cover both child boxes + gap
              height: `${svgHeight}px`, // Height to reach child boxes
              transform: 'translateX(-50%)'
            }}
          >
            <line
              x1={`${parentCenterX}px`} // Start from center of parent
              y1="0" // Start from bottom of parent (top of SVG)
              x2={`${leftChildCenterX}px`} // End at center of left child
              y2={`${svgHeight}px`} // End at bottom of SVG (top of children)
              stroke="black"
              strokeWidth={FACTOR_TREE_CONSTANTS.LINE_STROKE_WIDTH}
              style={{
                animation: `drawLine ${FACTOR_TREE_CONSTANTS.LINE_ANIMATION_DURATION}s ease-out forwards`
              }}
            />
          </svg>
          
          {/* Line to right factor box */}
          <svg
            className="absolute"
            style={{
              top: `${boxSize}px`, // Start from bottom of parent box
              left: '50%',
              width: `${svgWidth}px`, // Width to cover both child boxes + gap
              height: `${svgHeight}px`, // Height to reach child boxes
              transform: 'translateX(-50%)'
            }}
          >
            <line
              x1={`${parentCenterX}px`} // Start from center of parent
              y1="0" // Start from bottom of parent (top of SVG)
              x2={`${rightChildCenterX}px`} // End at center of right child
              y2={`${svgHeight}px`} // End at bottom of SVG (top of children)
              stroke="black"
              strokeWidth={FACTOR_TREE_CONSTANTS.LINE_STROKE_WIDTH}
              style={{
                animation: `drawLine ${FACTOR_TREE_CONSTANTS.LINE_ANIMATION_DURATION}s ease-out forwards`
              }}
            />
          </svg>
        </div>
      )}

      {/* Factor input boxes */}
      {showFactorInputs && (
        <div 
          className="mt-4 flex items-center"
          style={{
            gap: `${horizontalGap}px`,
            marginTop: `${verticalGap}px`
          }}
        >
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={factor1}
            onChange={(e) => setFactor1(e.target.value)}
            onKeyPress={handleKeyPress}
            className="rounded-lg text-center font-bold bg-white shadow-md hover:shadow-lg transition-all duration-300"
            style={{
              width: `${childBoxSize}px`,
              height: `${childBoxSize}px`,
              fontSize: `${fontSize * FACTOR_TREE_CONSTANTS.CHILD_FONT_RATIO}px`,
              padding: `${padding * FACTOR_TREE_CONSTANTS.CHILD_PADDING_RATIO}px`,
              border: '1px solid black',
              WebkitAppearance: 'none',
              MozAppearance: 'textfield',
              appearance: 'none'
            }}
            placeholder="?"
            autoFocus
          />
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={factor2}
            onChange={(e) => setFactor2(e.target.value)}
            onKeyPress={handleKeyPress}
            className="rounded-lg text-center font-bold bg-white shadow-md hover:shadow-lg transition-all duration-300"
            style={{
              width: `${childBoxSize}px`,
              height: `${childBoxSize}px`,
              fontSize: `${fontSize * FACTOR_TREE_CONSTANTS.CHILD_FONT_RATIO}px`,
              padding: `${padding * FACTOR_TREE_CONSTANTS.CHILD_PADDING_RATIO}px`,
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
