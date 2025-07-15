import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import FactorNode from './FactorNode';
import { isPrime, getFactorPair } from '../lib/factorUtils';
import { generateTreeModel } from '../lib/generateTreeModel';

// Define the TreeNode type with ONLY row/column positioning
export type TreeNode = {
  id: string;
  value: number;
  initialValue: number;
  isPrime: boolean;
  children: TreeNode[];
  row: number; // Tree level (0 = root)
  column: number; // Position within the level (0-based)
  nodeState: 'input' | 'button' | 'number';
  parentId: string; // ID of the parent node, 'none' for root
  childValues: [number, number]; // Values of left and right children, [0,0] initially
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
    initialValue: number,
    isPrime: isPrime(number),
    children: [],
    row: 0,
    column: 0,
    nodeState: 'button',
    parentId: 'none',
    childValues: [0, 0]
  };
};

interface Props {
  initialNumber: number;
  onIncorrectMove: () => void;
  onCorrectMove: () => void;
  showSolution: boolean;
  onFullyFactored: () => void;
  onValidationFailed: () => void;
}

export default forwardRef<{ handleFullyFactored: () => void }, Props>(function FactorTree({ initialNumber, onIncorrectMove, onCorrectMove, showSolution, onFullyFactored, onValidationFailed }, ref) {
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const [feedbackStates, setFeedbackStates] = useState<Record<string, { show: boolean; type: 'correct' | 'incorrect' | null }>>({});
  const [treePositionModel, setTreePositionModel] = useState<TreePositionModel | null>(null);
  const [maxLevel, setMaxLevel] = useState(0);
  const [newNodes, setNewNodes] = useState<Set<string>>(new Set());
  const [newLines, setNewLines] = useState<Set<string>>(new Set());
  const [leafNodes, setLeafNodes] = useState<string[]>([]);
  const [inputNodeIds, setInputNodeIds] = useState<string[]>([]);
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const inputNodeIdsRef = useRef<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Expose handleFullyFactored to parent component
  useImperativeHandle(ref, () => ({
    handleFullyFactored
  }));

  // Initialize tree with the starting number
  useEffect(() => {
    const rootNode: TreeNode = generateFactorTree(initialNumber);
    setTreeData([rootNode]);
    setMaxLevel(0);
    setLeafNodes(['root']); // Root starts as a leaf node
  }, [initialNumber]);

  // Generate tree position model when max level changes or container resizes
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

  // Add resize observer to detect container size changes
  useEffect(() => {
    if (!containerRef.current) return;

    let resizeTimeout: NodeJS.Timeout;

    const resizeObserver = new ResizeObserver(() => {
      // Clear any pending resize updates
      clearTimeout(resizeTimeout);
      
      // Debounce the resize update to prevent multiple rapid recalculations
      resizeTimeout = setTimeout(() => {
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
      }, 100); // 100ms debounce
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      clearTimeout(resizeTimeout);
      resizeObserver.disconnect();
    };
  }, [maxLevel]);

  // Update input node IDs when tree data changes
  useEffect(() => {
    const getInputNodes = (nodes: TreeNode[]): string[] => {
      const inputNodes: { id: string; row: number; column: number }[] = [];
      
      const traverse = (node: TreeNode) => {
        if (node.nodeState === 'input') {
          inputNodes.push({
            id: node.id,
            row: node.row,
            column: node.column
          });
        }
        node.children.forEach(traverse);
      };
      nodes.forEach(traverse);
      
      // Sort input nodes by row (top to bottom) and then by column (left to right)
      // This creates a predictable tab order: top-left → top-right → bottom-left → bottom-right
      inputNodes.sort((a, b) => {
        if (a.row !== b.row) {
          return a.row - b.row; // Top to bottom
        }
        return a.column - b.column; // Left to right within each row
      });
      
      const result = inputNodes.map(node => node.id);
      return result;
    };
    
    const newInputNodeIds = getInputNodes(treeData);
    setInputNodeIds(newInputNodeIds);
    inputNodeIdsRef.current = newInputNodeIds;
  }, [treeData]);

  // Clear new nodes and show lines after animation completes
  useEffect(() => {
    if (treePositionModel && newNodes.size > 0) {
      // First: Let existing objects move (600ms)
      // Then: Show new boxes (600ms delay)
      // Finally: Show new lines (1200ms total)
      setTimeout(() => {
        setNewNodes(new Set());
      }, 600);
      
      setTimeout(() => {
        setNewLines(new Set());
      }, 1200);
    }
  }, [treePositionModel, newNodes.size]);

  const handleFactorInput = (nodeId: string, factor: string) => {
    // Handle blank input as 0, otherwise validate and parse
    let parsedFactor: number;
    if (factor.trim() === '') {
      parsedFactor = 0;
    } else {
      parsedFactor = parseInt(factor, 10);
      if (isNaN(parsedFactor) || parsedFactor <= 0) {
        console.error('Invalid factor input');
        return;
      }
    }

    // Find the node and update its value only if it has changed
    setTreeData(prevData => {
      const updateNode = (nodes: TreeNode[]): TreeNode[] => {
        return nodes.map(node => {
          if (node.id === nodeId) {
            // Only update if the value has actually changed
            if (node.value !== parsedFactor) {
              console.log(`Updating child node ${nodeId} value from ${node.value} to ${parsedFactor}`);
              return {
                ...node,
                value: parsedFactor,
                isPrime: isPrime(parsedFactor),
              };
            }
            return node; // Return unchanged node if value is the same
          }
          
          // Check if this node is the parent of the updated node
          if (node.children.some(child => child.id === nodeId)) {
            const updatedChildValues = [...node.childValues] as [number, number];
            
            // Debug: Log current state before update
            console.log(`Before update - Parent ${node.id} childValues: [${node.childValues[0]}, ${node.childValues[1]}]`);
            console.log(`Before update - Child nodes: left=${node.children[0]?.value}, right=${node.children[1]?.value}`);
            
            // Update the childValues based on the actual child node values
            // First, update the child node that was just changed
            const updatedChildren = node.children.map(child => {
              if (child.id === nodeId) {
                return {
                  ...child,
                  value: parsedFactor,
                  isPrime: isPrime(parsedFactor),
                };
              }
              return child;
            });
            
            // Now update the childValues array based on the updated children
            updatedChildValues[0] = updatedChildren[0]?.value || 0;
            updatedChildValues[1] = updatedChildren[1]?.value || 0;
            
            console.log(`After updating children - Parent ${node.id} childValues: [${updatedChildValues[0]}, ${updatedChildValues[1]}]`);
            
            // Check if both child values are non-zero
            if (updatedChildValues[0] !== 0 && updatedChildValues[1] !== 0) {
              // Check if the two numbers multiply to the parent's value
              if (updatedChildValues[0] * updatedChildValues[1] === node.value) {
                console.log(`Valid factor pair found for ${node.id}: ${updatedChildValues[0]} × ${updatedChildValues[1]} = ${node.value}`);
                
                // Update parent node state to 'number'
                // Update both children node states to 'button'
                console.log(`Changing node states: parent ${node.id} → 'number', children → 'button'`);
                
                // Remove parent from leafNodes since it now has children
                setLeafNodes(prev => prev.filter(id => id !== node.id));
                
                return {
                  ...node,
                  childValues: updatedChildValues,
                  nodeState: 'number',
                  children: updatedChildren.map(child => ({
                    ...child,
                    nodeState: 'button'
                  }))
                };
              } else {
                console.log(`Invalid factor pair for ${node.id}: ${updatedChildValues[0]} × ${updatedChildValues[1]} ≠ ${node.value}`);
              }
            } else {
              console.log(`Child values not complete for ${node.id}: [${updatedChildValues[0]}, ${updatedChildValues[1]}]`);
            }
            
            return {
              ...node,
              childValues: updatedChildValues,
              children: updatedChildren,
            };
          }
          
          return {
            ...node,
            children: updateNode(node.children),
          };
        });
      };
      
      // Debug: Log the final state after the update
      const finalResult = updateNode(prevData);
      console.log('=== Final tree state after update ===');
      const logTreeState = (nodes: TreeNode[], level = 0) => {
        nodes.forEach(node => {
          const indent = '  '.repeat(level);
          console.log(`${indent}${node.id}: value=${node.value}, childValues=[${node.childValues[0]}, ${node.childValues[1]}], nodeState=${node.nodeState}`);
          if (node.children.length > 0) {
            logTreeState(node.children, level + 1);
          }
        });
      };
      logTreeState(finalResult);
      console.log('=== End tree state ===');
      
      return finalResult;
    });
  }

  const handleFactor = (nodeId: string) => {
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
              value: 0,
              initialValue: 0,
              isPrime: false,
              children: [],
              row: childRow,
              column: leftChildColumn,
              nodeState: 'input',
              parentId: nodeId,
              childValues: [0, 0]
            };
            const child2: TreeNode = {
              id: `${nodeId}-right`,
              value: 0,
              initialValue: 0,
              isPrime: false,
              children: [],
              row: childRow,
              column: rightChildColumn,
              nodeState: 'input',
              parentId: nodeId,
              childValues: [0, 0]
            };

            // Update max level if needed
            if (childRow > maxLevel) {
              setMaxLevel(childRow);
            }

            // Track new nodes and lines for animation
            setNewNodes(prev => new Set(Array.from(prev).concat([child1.id, child2.id])));
            setNewLines(prev => new Set(Array.from(prev).concat([`${nodeId}-${child1.id}`, `${nodeId}-${child2.id}`])));

            console.log(`Created children for ${nodeId}: left=${child1.id}, right=${child2.id}`);
            console.log(`Parent ${nodeId} childValues initialized to [0, 0]`);

            // Update leafNodes: remove parent, add children
            setLeafNodes(prev => {
              const withoutParent = prev.filter(id => id !== nodeId);
              return [...withoutParent, child1.id, child2.id];
            });

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

  const handleNodeClick = (nodeId: string) => {
    if (!treeData) return;

    const node = findNodeById(treeData, nodeId);
    if (!node) return;

    // Immediately change nodeState to 'number' to make it unclickable
    setTreeData(prevData => {
      const updateNode = (nodes: TreeNode[]): TreeNode[] => {
        return nodes.map(node => {
          if (node.id === nodeId) {
            return {
              ...node,
              nodeState: 'number'
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

    if (node.isPrime) {
      // Clicking a prime node is always incorrect - user thinks it can be factored
      onIncorrectMove();
      
      // Set up the animation sequence
      setFeedbackStates(prev => ({
        ...prev,
        [nodeId]: { show: true, type: 'incorrect' }
      }));

      setTimeout(() => {
        setFeedbackStates(prev => ({
          ...prev,
          [nodeId]: { show: false, type: null }
        }));
      }, 2000);
    } else {
      // Normal factoring
      handleFactor(nodeId);
      setTimeout(() => {
        setFeedbackStates(prev => ({
          ...prev,
          [nodeId]: { show: false, type: null }
        }));
      }, 2000);
    }
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

  // Helper function to find a node by ID
  const findNodeById = (nodes: TreeNode[], nodeId: string): TreeNode | null => {
    for (const node of nodes) {
      if (node.id === nodeId) return node;
      const found = findNodeById(node.children, nodeId);
      if (found) return found;
    }
    return null;
  };

  // Focus management functions for tab navigation
  const focusNextInput = (currentNodeId: string) => {
    const currentIndex = inputNodeIdsRef.current.indexOf(currentNodeId);
    if (currentIndex === -1 || inputNodeIdsRef.current.length === 0) {
      return;
    }
    
    const nextIndex = (currentIndex + 1) % inputNodeIdsRef.current.length;
    const nextNodeId = inputNodeIdsRef.current[nextIndex];
    
    // Focus the next input element using ref
    const nextInput = inputRefs.current[nextNodeId];
    if (nextInput) {
      nextInput.focus();
    }
  };

  const focusPreviousInput = (currentNodeId: string) => {
    const currentIndex = inputNodeIdsRef.current.indexOf(currentNodeId);
    if (currentIndex === -1 || inputNodeIdsRef.current.length === 0) {
      return;
    }
    
    const prevIndex = currentIndex === 0 ? inputNodeIdsRef.current.length - 1 : currentIndex - 1;
    const prevNodeId = inputNodeIdsRef.current[prevIndex];
    
    // Focus the previous input element using ref
    const prevInput = inputRefs.current[prevNodeId];
    if (prevInput) {
      prevInput.focus();
    }
  };

  // Function to register input refs
  const registerInputRef = (nodeId: string, inputElement: HTMLInputElement | null) => {
    inputRefs.current[nodeId] = inputElement;
  };

  // Helper function to log node's childValues for debugging
  const logNodeChildValues = (nodeId: string) => {
    const node = findNodeById(treeData, nodeId);
    if (node) {
      console.log(`Node ${nodeId} childValues: [${node.childValues[0]}, ${node.childValues[1]}]`);
    }
  };

  // Handle Fully Factored button click
  const handleFullyFactored = () => {
    console.log('Checking leaf nodes for prime validation:', leafNodes);
    
    // Check if all leaf nodes are prime
    const allLeafNodesPrime = leafNodes.every(leafId => {
      const node = findNodeById(treeData, leafId);
      if (!node) {
        console.log(`Warning: Leaf node ${leafId} not found in tree`);
        return false;
      }
      console.log(`Leaf node ${leafId}: value=${node.value}, isPrime=${node.isPrime}`);
      return node.isPrime;
    });

    if (allLeafNodesPrime) {
      console.log('All leaf nodes are prime! Correct factorization.');
      onCorrectMove();
    } else {
      console.log('Not all leaf nodes are prime. Incorrect factorization.');
      onIncorrectMove();
      onValidationFailed();
    }
  };

  // Flatten tree to get all nodes for rendering
  const getAllNodes = (nodes: TreeNode[]): TreeNode[] => {
    const allNodes: TreeNode[] = [];
    const traverse = (node: TreeNode) => {
      allNodes.push(node);
      // Reverse the children order so left child is rendered last and gets autoFocus
      [...node.children].reverse().forEach(traverse);
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
            nodeId={node.id}
            nodeState={node.nodeState}
            initialValue={node.initialValue}
            handleFactorInput={handleFactorInput}
            onNodeClick={handleNodeClick}
            showFeedback={feedback.show}
            feedbackType={feedback.type}
            boxHeight={getBoxHeight(node.row)}
            boxWidth={getBoxWidth(node.row)}
            onTabNext={focusNextInput}
            onTabPrevious={focusPreviousInput}
            registerInputRef={registerInputRef}
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
          {/* <div 
            className="absolute top-0 bottom-0 w-px bg-red-500 z-10"
            style={{ left: '50%', transform: 'translateX(-50%)' }}
          /> */}
          
          {/* Render all connecting lines */}
          {treePositionModel && (
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
                  
                  const lineKey = `${node.id}-${child.id}`;
                  const isNewLine = newLines.has(lineKey);
                  
                  // Calculate line length for draw animation
                  const dx = childCenterX - parentCenterX;
                  const dy = childCenterY - parentCenterY;
                  const lineLength = Math.sqrt(dx * dx + dy * dy);

                  return (
                    <g
                      key={lineKey}
                      style={{
                        transform: `translate(${parentCenterX}px, ${parentCenterY}px)`,
                        transition: `transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)`,
                      }}
                    >
                      <line
                        x1={0}
                        y1={0}
                        x2={dx}
                        y2={dy}
                        stroke="black"
                        strokeWidth="1"
                        style={{
                          opacity: 1,
                          ...(isNewLine
                            ? {
                                strokeDasharray: lineLength,
                                strokeDashoffset: lineLength,
                                animation: `drawLine 0.4s cubic-bezier(0.4,0,0.2,1) 0.6s forwards`,
                              }
                            : {}),
                        }}
                      />
                    </g>
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
})