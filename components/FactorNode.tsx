import React, { useState, useEffect } from 'react';
import { FACTOR_TREE_CONSTANTS } from '../lib/constants';
import { TreeNode } from './FactorTree';

interface Props {
  node: TreeNode;
  handleFactorInput: (nodeId: string, factor: string) => void;
  onNodeClick: (nodeId: string, isFullyFactored: boolean) => void;
  showFeedback: boolean;
  feedbackType: 'correct' | 'incorrect' | null;
  boxHeight: number;
  boxWidth: number;
}

export default function FactorNode({
  node,
  handleFactorInput,
  onNodeClick,
  showFeedback,
  feedbackType,
  boxHeight,
  boxWidth
}: Props) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [inputValue, setInputValue] = useState(node.value.toString());

  const { value, isPrime, id:nodeId, nodeState } = node;

  // Sync input value with node value when node changes
  useEffect(() => {
    setInputValue(node.value.toString());
  }, [node.value]);

  const handleClick = () => {
    // Call the parent's click handler instead of handling it internally
    onNodeClick(nodeId, isPrime);
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
  
  // Calculate child box dimensions and spacing
  const childBoxHeight = boxHeight * FACTOR_TREE_CONSTANTS.CHILD_BOX_RATIO;
  const childBoxWidth = boxWidth * FACTOR_TREE_CONSTANTS.CHILD_BOX_RATIO;
  const verticalGap = boxHeight * FACTOR_TREE_CONSTANTS.VERTICAL_GAP_RATIO;
  const horizontalGap = boxWidth * FACTOR_TREE_CONSTANTS.HORIZONTAL_GAP_RATIO;
  
  // Calculate SVG dimensions and line positions
  const svgWidth = horizontalGap + childBoxWidth; // Full width: gap + child box width
  const svgHeight = verticalGap; // Just the spacing between parent and children
  const parentCenterX = svgWidth / 2;
  const leftChildCenterX = childBoxWidth / 2; // Center of left child (half box width from left)
  const rightChildCenterX = horizontalGap + childBoxWidth / 2; // Center of right child


  const StaticNumber = () => {
    return (
      <div
        className={`relative rounded-lg bg-white shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center ${nodeState === 'button' ? 'cursor-pointer' : 'cursor-default'}`}
        style={{
          width: `${boxWidth}px`,
          height: `${boxHeight}px`,
          fontSize: `${fontSize}px`,
          padding: `${padding}px`,
          border: '1px solid black',
          transform: isAnimating ? 'translateY(-20px)' : 'translateY(0)'
        }}
        onClick={nodeState === 'button' ? handleClick : undefined}
      >
        <span className="font-bold text-gray-800">{value}</span>
      </div>
    );
  };

  const InputNumber = () => {
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      // Only call handleFactorInput if the value actually changed
      if (newValue !== node.value.toString()) {
        handleFactorInput(nodeId, newValue);
      }
    };

    return (
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onBlur={handleBlur}
        className="relative cursor-text rounded-lg bg-white shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center text-center"
        style={{
          width: `${boxWidth}px`,
          height: `${boxHeight}px`,
          fontSize: `${fontSize}px`,
          padding: `${padding}px`,
          border: '1px solid black',
          transform: isAnimating ? 'translateY(-20px)' : 'translateY(0)'
        }}
        placeholder="?"
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
    )
  }
  console.log('node is: ',node)
  return (
      <NumberDiv/>
  );
}
