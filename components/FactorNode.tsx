import React, { useState, useEffect, memo } from 'react';
import { FACTOR_TREE_CONSTANTS } from '../lib/constants';

interface Props {
  nodeId:string;
  nodeState:"number" | "input" | "button";
  initialValue:number;
  handleFactorInput: (nodeId: string, factor: string) => void;
  onNodeClick: (nodeId: string) => void;
  showFeedback: boolean;
  feedbackType: 'correct' | 'incorrect' | null;
  boxHeight: number;
  boxWidth: number;
  onTabNext: (currentNodeId: string) => void;
  onTabPrevious: (currentNodeId: string) => void;
  registerInputRef: (nodeId: string, inputElement: HTMLInputElement | null) => void;
}

function FactorNode({
  nodeId,
  nodeState,
  initialValue,
  handleFactorInput,
  onNodeClick,
  showFeedback,
  feedbackType,
  boxHeight,
  boxWidth,
  onTabNext,
  onTabPrevious,
  registerInputRef
}: Props) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [inputValue, setInputValue] = useState(initialValue === 0 ? '' : initialValue.toString());  
  const [animationPhase, setAnimationPhase] = useState<'none' | 'fadeOut' | 'showX' | 'fadeIn'>('none');

  // Sync inputValue with initialValue when it changes (e.g., new game)
  useEffect(() => {
    setInputValue(initialValue === 0 ? '' : initialValue.toString());
  }, [initialValue]);

  // useEffect(() => {
  //   console.log('FactorNode re-rendered:', {
  //     nodeId,
  //     nodeState,
  //     initialValue,
  //     showFeedback,
  //     feedbackType,
  //     boxHeight,
  //     boxWidth,
  //   });
  // }, [nodeId, nodeState, initialValue, showFeedback, feedbackType, boxHeight, boxWidth]);

  // Handle animation sequence for incorrect feedback
  useEffect(() => {
    if (showFeedback && feedbackType === 'incorrect') {
      // Start animation sequence - fade out and draw X simultaneously
      setAnimationPhase('fadeOut');
      
      // After fade out and X drawing, show X
      setTimeout(() => {
        setAnimationPhase('showX');
      }, 300);
      
      // After showing X, fade back in and remove X simultaneously
      setTimeout(() => {
        setAnimationPhase('fadeIn');
      }, 800);
      
      // Reset animation
      setTimeout(() => {
        setAnimationPhase('none');
      }, 1100);
    }
  }, [showFeedback, feedbackType]);

  const handleClick = () => {
    // Call the parent's click handler instead of handling it internally
    onNodeClick(nodeId);
  };


  // Use the provided box dimensions directly
  const fontSize = Math.max(
    FACTOR_TREE_CONSTANTS.MIN_FONT_SIZE, 
    boxHeight * 0.3 // Font size as 30% of box height
  );
  const padding = Math.max(
    FACTOR_TREE_CONSTANTS.MIN_PADDING, 
    boxHeight * 0.1 // Padding as 10% of box height
  );
  


  const StaticNumber = () => {
    const getOpacity = () => {
      switch (animationPhase) {
        case 'fadeOut':
          return 0.5;
        case 'showX':
        case 'fadeIn':
          return 0.5;
        default:
          return 1;
      }
    };

    return (
      <div
        className={`relative rounded-lg bg-white shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center ${nodeState === 'button' ? 'cursor-pointer' : 'cursor-default'}`}
        style={{
          width: `${boxWidth}px`,
          height: `${boxHeight}px`,
          fontSize: `${fontSize}px`,
          padding: `${padding}px`,
          border: '1px solid black',
          transform: isAnimating ? 'translateY(-20px)' : 'translateY(0)',
          opacity: getOpacity(),
          transition: 'opacity 0.3s ease-in-out'
        }}
        onClick={nodeState === 'button' ? handleClick : undefined}
      >
        {/* <span className="font-bold text-gray-800">{value === 0 ? '' : value}</span> */}
        <span className="font-bold text-gray-800">{inputValue}</span>

      </div>
    );
  };

  const InputNumber = () => {
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      // // Normalize values for comparison: blank input = 0
      // const normalizedNewValue = newValue.trim() === '' ? '0' : newValue;
      // const normalizedNodeValue = node.value.toString();
      // // Only call handleFactorInput if the value actually changed
      // if (normalizedNewValue !== normalizedNodeValue) {
      //   handleFactorInput(nodeId, newValue);
      // }
      if (newValue.trim() !== '') {
        handleFactorInput(nodeId, newValue);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        if (e.shiftKey) {
          onTabPrevious(nodeId);
        } else {
          onTabNext(nodeId);
        }
      }
    };

    return (
      <input
        ref={(el) => registerInputRef(nodeId, el)}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        data-node-id={nodeId}
        className="relative cursor-text rounded-lg bg-white shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center text-center"
        style={{
          width: `${boxWidth}px`,
          height: `${boxHeight}px`,
          fontSize: `${fontSize}px`,
          padding: `${padding}px`,
          border: '1px solid black',
          transform: isAnimating ? 'translateY(-20px)' : 'translateY(0)'
        }}
        autoFocus
      />
    );
  };

  const NumberDiv = () => { 
    return (
      <div className="flex flex-col items-center relative">
        {/* Main number box */}
          {nodeState === 'input' ? (
            <InputNumber />
          ) : (
            <StaticNumber />
          )}

          {/* Feedback icons */}
          {showFeedback && feedbackType === 'correct' && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 rounded-lg">
              <span className="text-green-500 text-2xl">✓</span>
            </div>
          )}
          {animationPhase === 'fadeOut' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                width={boxWidth - padding * 2}
                height={boxHeight - padding * 2}
                style={{ animation: 'drawX 0.3s ease-in-out forwards' }}
              >
                <line
                  x1="0"
                  y1="0"
                  x2={boxWidth - padding * 2}
                  y2={boxHeight - padding * 2}
                  stroke="red"
                  strokeWidth="3"
                  style={{ animation: 'drawLine 0.3s ease-in-out forwards' }}
                />
                <line
                  x1={boxWidth - padding * 2}
                  y1="0"
                  x2="0"
                  y2={boxHeight - padding * 2}
                  stroke="red"
                  strokeWidth="3"
                  style={{ animation: 'drawLine 0.3s ease-in-out forwards' }}
                />
              </svg>
            </div>
          )}
          {animationPhase === 'showX' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                width={boxWidth - padding * 2}
                height={boxHeight - padding * 2}
              >
                <line
                  x1="0"
                  y1="0"
                  x2={boxWidth - padding * 2}
                  y2={boxHeight - padding * 2}
                  stroke="red"
                  strokeWidth="3"
                />
                <line
                  x1={boxWidth - padding * 2}
                  y1="0"
                  x2="0"
                  y2={boxHeight - padding * 2}
                  stroke="red"
                  strokeWidth="3"
                />
              </svg>
            </div>
          )}
          {animationPhase === 'fadeIn' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                width={boxWidth - padding * 2}
                height={boxHeight - padding * 2}
                style={{ animation: 'removeX 0.3s ease-in-out forwards' }}
              >
                <line
                  x1="0"
                  y1="0"
                  x2={boxWidth - padding * 2}
                  y2={boxHeight - padding * 2}
                  stroke="red"
                  strokeWidth="3"
                  style={{ animation: 'removeLine 0.3s ease-in-out forwards' }}
                />
                <line
                  x1={boxWidth - padding * 2}
                  y1="0"
                  x2="0"
                  y2={boxHeight - padding * 2}
                  stroke="red"
                  strokeWidth="3"
                  style={{ animation: 'removeLine 0.3s ease-in-out forwards' }}
                />
              </svg>
            </div>
          )}
      </div>
    )
  }
  console.log('nodeId is: ',nodeId)
  return (
      <NumberDiv/>
  );
}

export default memo(FactorNode, (prevProps, nextProps) => {
  return (
    prevProps.nodeId === nextProps.nodeId &&
    prevProps.nodeState === nextProps.nodeState &&
    prevProps.initialValue === nextProps.initialValue &&
    prevProps.boxHeight === nextProps.boxHeight &&
    prevProps.boxWidth === nextProps.boxWidth
  );
});