import React, { useState, useEffect } from 'react';
import FactorNode from './FactorNode';
import { isPrime, generateFactorTree, getNextHint, FactorTreeNode } from '../lib/factorUtils';

interface Props {
  initialNumber: number;
  onIncorrectMove: () => void;
  onCorrectMove: () => void;
  showSolution: boolean;
}

interface TreeNode {
  value: number;
  isPrime: boolean;
  children: TreeNode[];
  x: number;
  y: number;
  id: string;
  level: number;
}

export default function FactorTree({ initialNumber, onIncorrectMove, onCorrectMove, showSolution }: Props) {
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const [feedbackStates, setFeedbackStates] = useState<Record<string, { show: boolean; type: 'correct' | 'incorrect' | null }>>({});

  // Initialize tree with the starting number
  useEffect(() => {
    const rootNode: TreeNode = {
      value: initialNumber,
      isPrime: isPrime(initialNumber),
      children: [],
      x: 0,
      y: 0,
      id: 'root',
      level: 0
    };
    setTreeData([rootNode]);
  }, [initialNumber]);

  const handleFactor = (nodeId: string, factor1: number, factor2: number) => {
    setTreeData(prevData => {
      const newData = [...prevData];
      const nodeIndex = newData.findIndex(node => node.id === nodeId);
      
      if (nodeIndex !== -1) {
        const node = newData[nodeIndex];
        const childLevel = node.level + 1;
        
        // Calculate spacing based on level - start with larger spacing
        const baseSpacing = 300;
        const spacing = baseSpacing / Math.pow(1.4, childLevel);
        
        const child1: TreeNode = {
          value: factor1,
          isPrime: isPrime(factor1),
          children: [],
          x: node.x - spacing,
          y: node.y + 150,
          id: `${nodeId}-left`,
          level: childLevel
        };
        const child2: TreeNode = {
          value: factor2,
          isPrime: isPrime(factor2),
          children: [],
          x: node.x + spacing,
          y: node.y + 150,
          id: `${nodeId}-right`,
          level: childLevel
        };
        
        newData[nodeIndex] = { ...node, children: [child1, child2] };
        newData.push(child1, child2);
      }
      
      return newData;
    });
  };

  const handleNodeClick = (nodeId: string, isFullyFactored: boolean) => {
    const node = treeData.find(n => n.id === nodeId);
    if (!node) return;

    if (isFullyFactored) {
      // User thinks it's fully factored
      if (node.isPrime) {
        onCorrectMove();
        setFeedbackStates(prev => ({
          ...prev,
          [nodeId]: { show: true, type: 'correct' }
        }));
      } else {
        onIncorrectMove();
        setFeedbackStates(prev => ({
          ...prev,
          [nodeId]: { show: true, type: 'incorrect' }
        }));
      }
    } else {
      // User thinks it's not fully factored
      if (node.isPrime) {
        onIncorrectMove();
        setFeedbackStates(prev => ({
          ...prev,
          [nodeId]: { show: true, type: 'incorrect' }
        }));
      }
    }

    // Clear feedback after 2 seconds
    setTimeout(() => {
      setFeedbackStates(prev => ({
        ...prev,
        [nodeId]: { show: false, type: null }
      }));
    }, 2000);
  };

  // Calculate the maximum depth of the tree
  const getMaxDepth = () => {
    if (treeData.length === 0) return 0;
    return Math.max(...treeData.map(node => node.level));
  };

  // Calculate scale factor based on tree depth
  const getScaleFactor = (level: number) => {
    const maxDepth = getMaxDepth();
    const baseScale = level === 0 ? 2.0 : 1.0; // Larger scale for root, normal for others
    const scaleDecay = 0.75; // More gradual decay
    
    // Scale based on both the node's level and the overall tree depth
    const levelScale = level === 0 ? 1.0 : Math.pow(scaleDecay, level - 1); // Don't decay the root
    const depthScale = Math.pow(0.9, maxDepth); // Less aggressive depth scaling
    
    return baseScale * levelScale * depthScale;
  };

  const renderNode = (node: TreeNode): React.ReactElement => {
    const feedback = feedbackStates[node.id] || { show: false, type: null };
    const scaleFactor = getScaleFactor(node.level);
    
    return (
      <div key={node.id} className="flex flex-col items-center">
        <div 
          className="relative"
          style={{ 
            transform: `translate(${node.x}px, ${node.y}px) scale(${scaleFactor})`,
            transition: 'all 0.5s ease-in-out'
          }}
        >
          <FactorNode
            value={node.value}
            onIncorrectMove={() => handleNodeClick(node.id, false)}
            onCorrectMove={() => handleNodeClick(node.id, true)}
            onFactor={(f1, f2) => handleFactor(node.id, f1, f2)}
            isFullyFactored={node.isPrime}
            showFeedback={feedback.show}
            feedbackType={feedback.type}
            scaleFactor={scaleFactor}
          />
        </div>
        
        {node.children.length > 0 && (
          <div className="flex justify-center mt-6">
            <div className="flex space-x-40">
              {node.children.map((child, index) => (
                <div key={child.id} className="flex flex-col items-center">
                  <div className="w-px h-10 bg-gray-300"></div>
                  {renderNode(child)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    if (showSolution) {
      const solutionTree = generateFactorTree(initialNumber);
      // Convert solution tree to display format
      // This would show the complete factor tree
    }
  }, [showSolution, initialNumber]);

  return (
    <div className="w-full h-full flex items-center justify-center" style={{ minHeight: '70vh' }}>
      {treeData.length > 0 && renderNode(treeData[0])}
    </div>
  );
} 