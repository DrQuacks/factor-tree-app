
import {FACTOR_TREE_CONSTANTS} from './constants'

const {CHILD_BOX_RATIO,GAP_PERCENT,ASPECT_RATIO,MIN_ASPECT_RATIO} = FACTOR_TREE_CONSTANTS

const generateTreeModel = (
    {
        viewHeight,
        viewWidth,
        totalLevels
    }: {
        viewHeight: number;
        viewWidth: number;
        totalLevels: number;
    }
): {
    positions: { x: number, y: number }[][];
    boxHeights: number[];
    boxWidths: number[];
} => {
    const availableHeight = Math.floor(Math.tanh(totalLevels / 2) * viewHeight);
    const topPadding = Math.floor((viewHeight - availableHeight) / 2);

    const rootHeight = availableHeight * (1 - CHILD_BOX_RATIO) / (1 - (CHILD_BOX_RATIO ** totalLevels));

    let heights: number[] = [];
    for (let i = 0; i < totalLevels; i++) {
        heights = [...heights, (rootHeight * (CHILD_BOX_RATIO ** i))];
    }

    let boxHeights = heights.map(h => h * (1 - 2 * GAP_PERCENT));
    let boxWidths = boxHeights.map(h => h * ASPECT_RATIO);

    // Calculate the space the last row of the tree would take up if all leaf slots are filled
    const totalBottomWidth = (boxWidths[totalLevels - 1] * (1 + 2 * GAP_PERCENT)) * (2 ** (totalLevels - 1));

    if (totalBottomWidth > (viewWidth * 0.95)) {
        console.log('total bottom width: ',totalBottomWidth,'. viewWidth: ',viewWidth)
        const scale = viewWidth / totalBottomWidth
        boxWidths = boxWidths.map(w => w * scale * 0.95)
        if (scale < (MIN_ASPECT_RATIO/ASPECT_RATIO)) {
            // boxHeights = boxHeights.map(h => h * scale * 0.95)
            boxHeights = boxWidths.map(w => w / MIN_ASPECT_RATIO)
        }
    }

    const positions: { x: number, y: number }[][] = [];

    // Start placing nodes from the bottom row up
    for (let level = totalLevels - 1; level >= 0; level--) {
        const row: { x: number, y: number }[] = [];
        const numNodes = 2 ** level; // Number of nodes at this level

        // Calculate the vertical position for the row
        const rowHeight = heights[level];
        const y = topPadding + heights.slice(0, level).reduce((sum, h) => sum + h, 0) + (rowHeight * GAP_PERCENT);

        // Calculate the horizontal starting position for the row
        const rowWidth = (boxWidths[level] * (1 + 2 * GAP_PERCENT)) * numNodes;
        const xStart = (viewWidth - rowWidth) / 2;

        for (let i = 0; i < numNodes; i++) {
            console.log('level', level, 'i', i, 'positions', positions,);

            if (level === totalLevels - 1) {
                // Bottom row: evenly space nodes horizontally
                const x = xStart + i * (boxWidths[level] + 2 * boxWidths[level] * GAP_PERCENT) + boxWidths[level] * GAP_PERCENT;
                row.push({ x, y });
            } else {
                if (level + 1 < totalLevels && positions[0]) {
                    const leftChild = positions[0][i * 2];
                    const rightChild = positions[0][i * 2 + 1];
                    if (leftChild && rightChild) {
                        // Calculate the center of each child's box
                        const leftChildCenterX = leftChild.x + boxWidths[level + 1] / 2;
                        const rightChildCenterX = rightChild.x + boxWidths[level + 1] / 2;
                        
                        // Center the parent over the space occupied by its children
                        const x = (leftChildCenterX + rightChildCenterX) / 2 - boxWidths[level] / 2;
                        console.log(`Level ${level}, node ${i}: leftChildCenterX=${leftChildCenterX}, rightChildCenterX=${rightChildCenterX}, parent.x=${x}`);
                        row.push({ x, y });
                    } else {
                        // If we don't have children, position based on the row structure
                        const rowWidth = (boxWidths[level] * (1 + 2 * GAP_PERCENT)) * numNodes;
                        const xStart = (viewWidth - rowWidth) / 2;
                        const x = xStart + i * (boxWidths[level] + 2 * boxWidths[level] * GAP_PERCENT) + boxWidths[level] * GAP_PERCENT;
                        row.push({ x, y });
                    }
                } else {
                    console.log('DEV WARNING: Non botom row should always have children')
                    // If we don't have children, position based on the row structure
                    const rowWidth = (boxWidths[level] * (1 + 2 * GAP_PERCENT)) * numNodes;
                    const xStart = (viewWidth - rowWidth) / 2;
                    const x = xStart + i * (boxWidths[level] + 2 * boxWidths[level] * GAP_PERCENT) + boxWidths[level] * GAP_PERCENT;
                    row.push({ x, y });
                }
            }
        }

        positions.unshift(row); // Add the row to the beginning of the array
    }

    console.log(`After adding level, level 1 positions:`, positions[totalLevels - 1 - 1]);

    return { positions, boxHeights, boxWidths };
};

export { generateTreeModel };