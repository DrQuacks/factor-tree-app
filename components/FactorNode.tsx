import { useState } from 'react';
import { isPrime, validateFactorPair, FactorTreeNode } from '../lib/factorUtils';

interface Props {
  value: number;
  onIncorrectMove: () => void;
  onCorrectMove: () => void;
  onFactor: (factor1: number, factor2: number) => void;
  isFullyFactored: boolean;
  showFeedback?: boolean;
  feedbackType?: 'correct' | 'incorrect' | null;
  isLarge?: boolean;
}

export default function FactorNode({ 
  value, 
  onIncorrectMove, 
  onCorrectMove, 
  onFactor, 
  isFullyFactored,
  showFeedback = false,
  feedbackType = null,
  isLarge = false
}: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [factor1, setFactor1] = useState('');
  const [factor2, setFactor2] = useState('');
  const [showInputs, setShowInputs] = useState(false);
  const [inputFeedback, setInputFeedback] = useState<'correct' | 'incorrect' | null>(null);

  const handleClick = () => {
    if (isFullyFactored) {
      // User thinks it's fully factored
      if (isPrime(value)) {
        onCorrectMove();
      } else {
        onIncorrectMove();
      }
    } else {
      // User thinks it's not fully factored
      if (isPrime(value)) {
        onIncorrectMove();
      } else {
        setShowInputs(true);
      }
    }
  };

  const handleFactorSubmit = () => {
    const f1 = parseInt(factor1);
    const f2 = parseInt(factor2);
    
    if (validateFactorPair(value, f1, f2)) {
      setInputFeedback('correct');
      onCorrectMove();
      setTimeout(() => {
        onFactor(f1, f2);
        setShowInputs(false);
        setFactor1('');
        setFactor2('');
        setInputFeedback(null);
      }, 1000);
    } else {
      setInputFeedback('incorrect');
      onIncorrectMove();
    }
  };

  const getFeedbackIcon = () => {
    if (!showFeedback) return null;
    
    if (feedbackType === 'correct') {
      return <span className="text-green-500 text-4xl ml-4">✓</span>;
    } else if (feedbackType === 'incorrect') {
      return <span className="text-red-500 text-4xl ml-4">✗</span>;
    }
    return null;
  };

  const getInputFeedbackIcon = () => {
    if (inputFeedback === 'correct') {
      return <span className="text-green-500 text-xl">✓</span>;
    } else if (inputFeedback === 'incorrect') {
      return <span className="text-red-500 text-xl">✗</span>;
    }
    return null;
  };

  return (
    <div className="flex flex-col items-center">
      <div 
        className={`bg-white border-2 border-gray-300 rounded shadow cursor-pointer transition-all duration-300 hover:border-blue-400 hover:shadow-lg hover:scale-105 ${
          isLarge ? 'text-8xl font-bold leading-none' : 'text-xl font-semibold'
        } ${
          showFeedback && feedbackType === 'correct' ? 'border-green-500 bg-green-50' : ''
        } ${
          showFeedback && feedbackType === 'incorrect' ? 'border-red-500 bg-red-50' : ''
        }`}
        style={{
          padding: isLarge ? '5px 10px' : '8px 16px',
          cursor: 'pointer'
        }}
        onClick={handleClick}
        onMouseEnter={(e) => {
          e.currentTarget.style.cursor = 'pointer';
        }}
      >
        {value}
        {getFeedbackIcon()}
      </div>
      
      {showInputs && (
        <div className="mt-4 p-4 bg-gray-50 rounded border">
          <div className="text-sm text-gray-600 mb-2">Enter factor pair:</div>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              value={factor1}
              onChange={(e) => setFactor1(e.target.value)}
              className="w-16 p-2 border rounded text-center"
              placeholder="?"
              min="2"
            />
            <span className="text-gray-500">×</span>
            <input
              type="number"
              value={factor2}
              onChange={(e) => setFactor2(e.target.value)}
              className="w-16 p-2 border rounded text-center"
              placeholder="?"
              min="2"
            />
            <button
              onClick={handleFactorSubmit}
              className="bg-blue-600 text-white px-3 py-2 rounded text-sm"
            >
              Submit
            </button>
            {getInputFeedbackIcon()}
          </div>
        </div>
      )}
    </div>
  );
}
