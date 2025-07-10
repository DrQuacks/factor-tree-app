import React, { useState, useEffect, useRef } from 'react';
import FactorNode from './FactorNode';
import { isPrime, getFactorPair } from '../lib/factorUtils';
import { generateTreeModel } from '../lib/generateTreeModel';

// Define the TreeNode type with ONLY row/column positioning
type TreeNode = {
  id: string;
  value: number;
  isPrime: boolean;
  children: TreeNode[];
  row: number; // Tree level (0 = root)
  column: number; // Position within the level (0-based)
};

// Tree position model type
type TreePositionModel = {
  positions: { x: number, y: number }[][];
  boxHeights: number[];
  boxWidths: number[];
};

// Ensure generateFactorTree returns TreeNode
const generateFactorTree = (number: number): TreeNode => {
  return {
    id: 'root',
    value: number,
    isPrime: isPrime(number),
    children: [],
    row: 0,
    column: 0,
  };
};

interface Props {
  initialNumber: number;
  onIncorrectMove: () => void;
  onCorrectMove: () => void;
  showSolution: boolean;
}

export default function FactorTree({ initialNumber, onIncorrectMove, onCorrectMove, showSolution }: Props) {
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const [feedbackStates, setFeedbackStates] = useState<Record<string, { show: boolean; type: 'correct' | 'incorrect' | null }>>({});
  const [treePositionModel, setTreePositionModel] = useState<TreePositionModel | null>(null);
  const [maxLevel, setMaxLevel] = useState(0);
  const [newNodes, setNewNodes] = useState<Set<string>>(new Set());
  const [showLines, setShowLines] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize tree with the starting number
  useEffect(() => {
    const rootNode: TreeNode = generateFactorTree(initialNumber);
    setTreeData([rootNode]);
    setMaxLevel(0);
  }, [initialNumber]);

  // Generate tree position model when max level changes
  useEffect(() => {
    if (containerRef.current && maxLevel >= 0) {
      const rect = containerRef.current.getBoundingClientRect();
      
      if (rect.width > 0 && rect.height > 0) {
        const newModel = generateTreeModel({
          viewHeight: rect.height,
          viewWidth: rect.width,
          totalLevels: maxLevel + 1
        });
        setTreePositionModel(newModel);
      }
    }
  }, [maxLevel]);

  // Clear new nodes and show lines after animation completes
  useEffect(() => {
    if (treePositionModel && newNodes.size > 0) {
      setTimeout(() => {
        setNewNodes(new Set());
        setShowLines(true);
      }, 600);
    }
  }, [treePositionModel, newNodes.size]);

  const handleFactor = (nodeId: string, factor1: number, factor2: number) => {
    setTreeData(prevData => {
      if (!prevData) return [];

      const updateNode = (nodes: TreeNode[]): TreeNode[] => {
        return nodes.map(node => {
          if (node.id === nodeId) {
            const childRow = node.row + 1;
            const leftChildColumn = node.column * 2;
            const rightChildColumn = node.column * 2 + 1;



            // Create child nodes
            const child1: TreeNode = {
              id: `${nodeId}-left`,
              value: factor1,
              isPrime: isPrime(factor1),
              children: [],
              row: childRow,
              column: leftChildColumn,
            };
            const child2: TreeNode = {
              id: `${nodeId}-right`,
              value: factor2,
              isPrime: isPrime(factor2),
              children: [],
              row: childRow,
              column: rightChildColumn,
            };

            // Update max level if needed
            if (childRow > maxLevel) {
              setMaxLevel(childRow);
            }

            // Track new nodes for animation
            setNewNodes(prev => new Set(Array.from(prev).concat([child1.id, child2.id])));

            return {
              ...node,
              children: [child1, child2],
            };
          }

          return {
            ...node,
            children: updateNode(node.children),
          };
        });
      };

      return updateNode(prevData);
    });
  };

  const handleNodeClick = (nodeId: string, isFullyFactored: boolean) => {
    if (!treeData) return;

    const findNode = (nodes: TreeNode[], nodeId: string): TreeNode | null => {
      for (const node of nodes) {
        if (node.id === nodeId) return node;
        const found = findNode(node.children, nodeId);
        if (found) return found;
      }
      return null;
    };

    const node = findNode(treeData, nodeId);
    if (!node) return;

    if (isFullyFactored) {
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
      if (node.isPrime) {
        onIncorrectMove();
        setFeedbackStates(prev => ({
          ...prev,
          [nodeId]: { show: true, type: 'incorrect' }
        }));
      } else {
        // Automatically create the factor tree for this node
        const factors = getFactorPair(node.value);
        if (factors) {
          handleFactor(nodeId, factors[0], factors[1]);
        }
      }
    }

    setTimeout(() => {
      setFeedbackStates(prev => ({
        ...prev,
        [nodeId]: { show: false, type: null }
      }));
    }, 2000);
  };

  // Get box height from tree position model
  const getBoxHeight = (level: number) => {
    if (!treePositionModel) return 60;
    return treePositionModel.boxHeights[level] || 60;
  };

  // Get box width from tree position model
  const getBoxWidth = (level: number) => {
    if (!treePositionModel) return 90; // Default width (aspect ratio 3:2)
    return treePositionModel.boxWidths[level] || 90;
  };

  // Flatten tree to get all nodes for rendering
  const getAllNodes = (nodes: TreeNode[]): TreeNode[] => {
    const allNodes: TreeNode[] = [];
    const traverse = (node: TreeNode) => {
      allNodes.push(node);
      node.children.forEach(traverse);
    };
    nodes.forEach(traverse);
    return allNodes;
  };

  const renderNode = (node: TreeNode): React.ReactElement => {
    const feedback = feedbackStates[node.id] || { show: false, type: null };
    const isNewNode = newNodes.has(node.id);
    
    // Get position from treePositionModel
    const x = treePositionModel?.positions[node.row]?.[node.column]?.x || 0;
    const y = treePositionModel?.positions[node.row]?.[node.column]?.y || 0;

    return (
      <div key={node.id} className="absolute">
        <div
          className="relative"
          style={{
            transform: `translate(${x}px, ${y}px)`,
            transition: `transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s ease-in-out`,
            opacity: isNewNode ? 0 : 1,
            animation: isNewNode ? 'fadeIn 0.6s ease-in-out 0.6s forwards' : 'none',
          }}
        >
          <FactorNode
            value={node.value}
            onIncorrectMove={() => handleNodeClick(node.id, false)}
            onCorrectMove={() => handleNodeClick(node.id, true)}
            onFactor={(f1, f2) => handleFactor(node.id, f1, f2)}
            onNodeClick={handleNodeClick}
            nodeId={node.id}
            isFullyFactored={node.isPrime}
            showFeedback={feedback.show}
            feedbackType={feedback.type}
            boxHeight={getBoxHeight(node.row)}
            boxWidth={getBoxWidth(node.row)}
          />
        </div>
      </div>
    );
  };
  
  const renderTree = (nodes: TreeNode[]): React.ReactElement => {
    const allNodes = getAllNodes(nodes);
    
    return (
      <div 
        ref={containerRef}
        className="w-full h-full flex items-center justify-center" 
        style={{ height: '100%' }}
      >
        <div className="relative w-full h-full">
          {/* Vertical center line for debugging */}
          <div 
            className="absolute top-0 bottom-0 w-px bg-red-500 z-10"
            style={{ left: '50%', transform: 'translateX(-50%)' }}
          />
          
          {/* Render all connecting lines */}
          {treePositionModel && showLines && (
            <svg
              className="absolute pointer-events-none"
              style={{
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 0,
              }}
            >
              {allNodes.map((node) => 
                node.children.map((child) => {
                  const nodeX = treePositionModel.positions[node.row]?.[node.column]?.x || 0;
                  const nodeY = treePositionModel.positions[node.row]?.[node.column]?.y || 0;
                  const childX = treePositionModel.positions[child.row]?.[child.column]?.x || 0;
                  const childY = treePositionModel.positions[child.row]?.[child.column]?.y || 0;
                  
                  // Calculate line start and end points
                  const parentCenterX = nodeX + getBoxWidth(node.row) / 2;
                  const parentCenterY = nodeY + getBoxHeight(node.row); // Bottom of parent
                  const childCenterX = childX + getBoxWidth(child.row) / 2;
                  const childCenterY = childY; // Top of child
                  
                  return (
                    <line
                      key={`${node.id}-${child.id}`}
                      x1={parentCenterX}
                      y1={parentCenterY}
                      x2={childCenterX}
                      y2={childCenterY}
                      stroke="black"
                      strokeWidth="1"
                      style={{
                        transition: `x1 0.6s cubic-bezier(0.4, 0, 0.2, 1), y1 0.6s cubic-bezier(0.4, 0, 0.2, 1), x2 0.6s cubic-bezier(0.4, 0, 0.2, 1), y2 0.6s cubic-bezier(0.4, 0, 0.2, 1)`,
                        animation: 'fadeIn 0.3s ease-in-out forwards',
                      }}
                    />
                  );
                })
              )}
            </svg>
          )}
          
          {allNodes.map((node) => renderNode(node))}
        </div>
      </div>
    );
  };
  
  return treeData ? renderTree(treeData) : null;
}